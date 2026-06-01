import { useCallback, useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ApiError, formatFieldErrors } from '../../api/errors';
import { getProfile, updateProfile } from '../../api/profile';
import type { BankAccount, User } from '../../api/types';
import {
  createBankAccount,
  getBankAccount,
  updateBankAccount,
} from '../../api/wallet';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { KeyboardAwareScrollView } from '../../components/KeyboardAwareScrollView';
import { LoadingView } from '../../components/LoadingView';
import { PageHeader } from '../../components/PageHeader';
import { TextField } from '../../components/TextField';
import { useAuth } from '../../context/AuthContext';
import type { ProfileStackParamList } from '../../navigation/types';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { fonts, typography } from '../../theme/typography';

type Props = NativeStackScreenProps<ProfileStackParamList, 'ProfileHome'>;

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'LT';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

export function ProfileScreen({}: Props) {
  const { user, logout, refreshUser } = useAuth();
  const [profile, setProfile] = useState<User | null>(null);
  const [bank, setBank] = useState<BankAccount | null>(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [bankName, setBankName] = useState('');
  const [bankCode, setBankCode] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingBank, setIsSavingBank] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [p, b] = await Promise.all([getProfile(), getBankAccount()]);
      setProfile(p);
      setBank(b);
      setName(p.name ?? '');
      setPhone(p.phone ?? '');
      setDeliveryAddress(p.delivery_address ?? '');
      if (b) {
        setBankName(b.bank_name);
        setBankCode(b.bank_code);
        setAccountNumber(b.account_number);
        setAccountName(b.account_name);
      } else {
        setBankName('');
        setBankCode('');
        setAccountNumber('');
        setAccountName('');
      }
    } catch {
      setError('Could not load profile.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function saveProfile() {
    setIsSavingProfile(true);
    setError(null);
    setMessage(null);
    try {
      await updateProfile({
        name: name.trim(),
        phone: phone.trim(),
        delivery_address: deliveryAddress.trim(),
      });
      await refreshUser();
      await load();
      setMessage('Profile updated.');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not save profile.');
    } finally {
      setIsSavingProfile(false);
    }
  }

  async function saveBank() {
    if (!bankName.trim() || !bankCode.trim() || !accountNumber.trim() || !accountName.trim()) {
      setError('Fill in all bank account fields.');
      return;
    }
    setIsSavingBank(true);
    setError(null);
    setMessage(null);
    try {
      const payload = {
        bank_name: bankName.trim(),
        bank_code: bankCode.trim(),
        account_number: accountNumber.trim(),
        account_name: accountName.trim(),
      };
      if (bank) {
        await updateBankAccount(payload);
      } else {
        await createBankAccount(payload);
      }
      await load();
      setMessage('Bank account saved.');
    } catch (err) {
      if (err instanceof ApiError) {
        setError(formatFieldErrors(err.errors) || err.message);
      } else {
        setError('Could not save bank account.');
      }
    } finally {
      setIsSavingBank(false);
    }
  }

  function confirmLogout() {
    Alert.alert('Log out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log out',
        style: 'destructive',
        onPress: () => {
          logout().catch(() => undefined);
        },
      },
    ]);
  }

  if (isLoading || !profile) return <LoadingView message="Loading profile…" />;

  const displayName = name.trim() || profile.name;
  const displayEmail = profile.email;

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <KeyboardAwareScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <PageHeader title="Profile" subtitle="Manage your account and delivery details" />

        <Card style={styles.heroCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials(displayName)}</Text>
          </View>
          <View style={styles.heroText}>
            <Text style={styles.heroName}>{displayName}</Text>
            <Text style={styles.heroEmail}>{displayEmail}</Text>
            {user?.role ? (
              <View style={styles.rolePill}>
                <Text style={styles.roleText}>{user.role}</Text>
              </View>
            ) : null}
          </View>
        </Card>

        {message ? <Text style={styles.success}>{message}</Text> : null}
        {error ? <Text style={styles.error}>{error}</Text> : null}

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Personal</Text>
          <Card style={styles.sectionCard}>
            <TextField label="Full name" value={name} onChangeText={setName} />
            <TextField label="Email" value={displayEmail} editable={false} />
            <TextField
              label="Phone number"
              value={phone}
              onChangeText={setPhone}
              placeholder="08012345678"
              keyboardType="phone-pad"
            />
            <Button
              title="Save personal info"
              tone="onSurface"
              loading={isSavingProfile}
              onPress={saveProfile}
              style={styles.sectionBtn}
            />
          </Card>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Delivery</Text>
          <Card style={styles.sectionCard}>
            <Text style={styles.sectionHint}>
              Used when your cleared orders are shipped to you.
            </Text>
            <TextField
              label="Delivery address"
              value={deliveryAddress}
              onChangeText={setDeliveryAddress}
              placeholder="Street, area, city, state"
              multiline
            />
            <Button
              title="Save delivery details"
              variant="outline"
              tone="onSurface"
              loading={isSavingProfile}
              onPress={saveProfile}
              style={styles.sectionBtn}
            />
          </Card>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Bank account</Text>
          <Card style={styles.sectionCard}>
            <Text style={styles.sectionHint}>
              Payouts and refunds go to this account only.
            </Text>
            <TextField label="Bank name" value={bankName} onChangeText={setBankName} placeholder="GTBank" />
            <TextField
              label="Bank code"
              value={bankCode}
              onChangeText={setBankCode}
              placeholder="058"
              keyboardType="number-pad"
            />
            <TextField
              label="Account number"
              value={accountNumber}
              onChangeText={setAccountNumber}
              placeholder="0123456789"
              keyboardType="number-pad"
            />
            <TextField
              label="Account name"
              value={accountName}
              onChangeText={setAccountName}
              placeholder="Jane Doe"
              autoCapitalize="words"
            />
            <Button
              title={bank ? 'Update bank account' : 'Save bank account'}
              variant="outline"
              tone="onSurface"
              loading={isSavingBank}
              onPress={saveBank}
              style={styles.sectionBtn}
            />
          </Card>
        </View>

        <View style={styles.logoutWrap}>
          <Button
            title="Log out"
            variant="outline"
            tone="onBackground"
            danger
            onPress={confirmLogout}
            style={styles.logoutBtn}
          />
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: {
    paddingHorizontal: spacing.screenX,
    paddingBottom: spacing.screenBottom,
  },
  heroCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.lg,
    backgroundColor: colors.surface,
    borderColor: colors.borderOnSurface,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontFamily: fonts.display, color: '#fff', fontSize: 22 },
  heroText: { flex: 1, gap: 4 },
  heroName: { ...typography.title, fontSize: colors.font.lg, color: colors.text },
  heroEmail: { ...typography.body, fontSize: colors.font.sm, color: colors.textSecondary },
  rolePill: {
    alignSelf: 'flex-start',
    marginTop: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: colors.radius.full,
    backgroundColor: colors.surfaceVariant,
  },
  roleText: { ...typography.caption, fontFamily: fonts.bold, color: colors.primary, textTransform: 'capitalize' },
  section: { marginBottom: spacing.lg },
  sectionLabel: { ...typography.label, color: colors.onBackgroundMuted, marginBottom: 10, marginLeft: 4 },
  sectionCard: {
    backgroundColor: colors.surface,
    borderColor: colors.borderOnSurface,
    paddingTop: 14,
    paddingBottom: 8,
  },
  sectionHint: { ...typography.body, fontSize: 13, color: colors.textSecondary, marginBottom: 4 },
  sectionBtn: { marginTop: 4, marginBottom: 8 },
  success: { fontFamily: fonts.semibold, color: colors.success, marginBottom: 12, textAlign: 'center' },
  error: { fontFamily: fonts.semibold, color: colors.error, marginBottom: 12, textAlign: 'center' },
  logoutWrap: { marginTop: 8, marginBottom: 16 },
  logoutBtn: {},
});
