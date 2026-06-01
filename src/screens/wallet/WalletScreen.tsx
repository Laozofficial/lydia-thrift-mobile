import { useCallback, useEffect, useState } from 'react';
import {
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ApiError } from '../../api/errors';
import { getBankAccount, getWallet, listWalletTransactions, transferToBank } from '../../api/wallet';
import type { BankAccount, Wallet, WalletTransaction } from '../../api/types';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { LoadingView } from '../../components/LoadingView';
import { PageHeader } from '../../components/PageHeader';
import { KeyboardAvoidingContainer } from '../../components/KeyboardAwareScrollView';
import { TextField } from '../../components/TextField';
import type { WalletStackParamList } from '../../navigation/types';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { fonts, typography } from '../../theme/typography';
import { formatDate, formatNaira, transactionLabel } from '../../utils/format';

type Props = NativeStackScreenProps<WalletStackParamList, 'WalletHome'>;

export function WalletScreen({ navigation }: Props) {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [bankAccount, setBankAccount] = useState<BankAccount | null>(null);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [transferAmount, setTransferAmount] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isTransferring, setIsTransferring] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (refresh = false) => {
    if (refresh) setIsRefreshing(true);
    else setIsLoading(true);
    setError(null);
    try {
      const [w, tx, bank] = await Promise.all([
        getWallet(),
        listWalletTransactions(),
        getBankAccount(),
      ]);
      setWallet(w);
      setTransactions(tx);
      setBankAccount(bank);
    } catch {
      setError('Could not load wallet.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => load(true));
    return unsubscribe;
  }, [navigation, load]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleTransfer() {
    const amount = parseFloat(transferAmount);
    if (!amount || amount <= 0) {
      setError('Enter a valid amount.');
      return;
    }
    setIsTransferring(true);
    setError(null);
    setMessage(null);
    try {
      await transferToBank(amount);
      setTransferAmount('');
      setMessage('Transfer recorded to your bank account.');
      await load(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Transfer failed.');
    } finally {
      setIsTransferring(false);
    }
  }

  if (isLoading && !wallet) return <LoadingView message="Loading wallet…" />;

  return (
    <SafeAreaView style={styles.list} edges={['top']}>
      <KeyboardAvoidingContainer style={styles.list}>
      <FlatList
      style={styles.list}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
      automaticallyAdjustKeyboardInsets
      data={transactions}
      keyExtractor={(item) => String(item.id)}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={() => load(true)}
          tintColor={colors.onBackground}
        />
      }
      ListHeaderComponent={
        <View>
          <PageHeader title="Wallet" subtitle="Fund, pay installments, and track payouts" />

          <Card style={styles.balanceCard}>
            <Text style={styles.balanceLabel}>Available balance</Text>
            <Text style={styles.balance}>{formatNaira(wallet?.balance_naira ?? 0)}</Text>
            <Text style={styles.policy}>{wallet?.transfer_policy}</Text>
          </Card>

          <View style={styles.actions}>
            <Button
              title="Fund wallet"
              onPress={() => navigation.navigate('FundWallet')}
              style={styles.actionBtn}
            />
            <Button
              title="Bank account"
              variant="outline"
              tone="onBackground"
              onPress={() => navigation.navigate('BankAccount')}
              style={styles.actionBtn}
            />
          </View>

          {bankAccount ? (
            <Card style={styles.bankPreview}>
              <Text style={styles.bankLabel}>Payout account</Text>
              <Text style={styles.bankText}>
                {bankAccount.bank_name} · {bankAccount.account_number}
              </Text>
              <Text style={styles.bankName}>{bankAccount.account_name}</Text>
            </Card>
          ) : (
            <Pressable onPress={() => navigation.navigate('BankAccount')}>
              <Card style={styles.bankMissing}>
                <Text style={styles.bankMissingText}>
                  Add a bank account to receive payouts and refunds
                </Text>
              </Card>
            </Pressable>
          )}

          {bankAccount && (wallet?.balance_naira ?? 0) > 0 ? (
            <Card style={styles.transferCard}>
              <Text style={styles.sectionTitle}>Transfer to bank</Text>
              <TextField
                label="Amount (₦)"
                keyboardType="decimal-pad"
                placeholder="1000"
                value={transferAmount}
                onChangeText={setTransferAmount}
              />
              <Button
                title="Transfer"
                variant="outline"
                tone="onSurface"
                loading={isTransferring}
                onPress={handleTransfer}
              />
            </Card>
          ) : null}

          {message ? <Text style={styles.success}>{message}</Text> : null}
          {error ? <Text style={styles.error}>{error}</Text> : null}

          <Text style={styles.sectionTitle}>Transactions</Text>
        </View>
      }
      ListEmptyComponent={
        <Text style={styles.empty}>No transactions yet. Fund your wallet to get started.</Text>
      }
      renderItem={({ item }) => (
        <Card style={styles.txCard}>
          <View style={styles.txHeader}>
            <Text style={styles.txType}>{transactionLabel(item.type)}</Text>
            <Text
              style={[
                styles.txAmount,
                item.type.includes('credit') ? styles.credit : styles.debit,
              ]}
            >
              {item.type.includes('credit') ? '+' : '-'}
              {formatNaira(item.amount_naira)}
            </Text>
          </View>
          <Text style={styles.txMeta}>
            {formatDate(item.created_at)} · Balance {formatNaira(item.balance_after_naira)}
          </Text>
        </Card>
      )}
      />
      </KeyboardAvoidingContainer>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  list: { flex: 1, backgroundColor: colors.background },
  content: {
    paddingHorizontal: spacing.screenX,
    paddingTop: spacing.sm,
    paddingBottom: spacing.screenBottom,
  },
  balanceCard: {
    backgroundColor: colors.surface,
    borderColor: colors.borderOnSurface,
    marginBottom: spacing.md,
    borderRadius: colors.radius.xl,
  },
  balanceLabel: { ...typography.label, color: colors.textMuted },
  balance: { fontFamily: fonts.display, fontSize: 36, color: colors.primary, marginTop: 8, letterSpacing: -0.8 },
  policy: { ...typography.caption, color: colors.textSecondary, marginTop: 12, lineHeight: 18 },
  actions: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  actionBtn: { flex: 1 },
  bankPreview: { marginBottom: spacing.md },
  bankLabel: { ...typography.label, color: colors.textMuted },
  bankText: { ...typography.subtitle, color: colors.text, marginTop: 4 },
  bankName: { ...typography.body, fontSize: 13, color: colors.textSecondary, marginTop: 2 },
  bankMissing: { marginBottom: 12, backgroundColor: colors.warningBg, borderColor: colors.warning },
  bankMissingText: { fontFamily: fonts.semibold, color: colors.warning },
  transferCard: { marginBottom: 12 },
  sectionTitle: { ...typography.subtitle, color: colors.onBackground, marginBottom: spacing.sm, marginTop: spacing.xs },
  success: { fontFamily: fonts.semibold, color: '#6EE7B7', marginBottom: 8 },
  error: { fontFamily: fonts.medium, color: '#FECACA', marginBottom: 8 },
  empty: { ...typography.body, color: colors.onBackgroundMuted, textAlign: 'center', marginTop: 16 },
  txCard: { marginBottom: 8 },
  txHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  txType: { fontFamily: fonts.semibold, color: colors.text, flex: 1 },
  txAmount: { fontFamily: fonts.bold, fontSize: 15 },
  credit: { color: colors.success },
  debit: { color: colors.error },
  txMeta: { ...typography.caption, color: colors.textMuted, marginTop: 4 },
});
