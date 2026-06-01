import { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { ApiError, formatFieldErrors } from '../../api/errors';
import {
  createBankAccount,
  getBankAccount,
  updateBankAccount,
} from '../../api/wallet';
import type { BankAccount } from '../../api/types';
import { Button } from '../../components/Button';
import { LoadingView } from '../../components/LoadingView';
import { Screen } from '../../components/Screen';
import { TextField } from '../../components/TextField';
import type { WalletStackParamList } from '../../navigation/types';
import { colors } from '../../theme/colors';

type Props = NativeStackScreenProps<WalletStackParamList, 'BankAccount'>;

export function BankAccountScreen({ navigation }: Props) {
  const [existing, setExisting] = useState<BankAccount | null>(null);
  const [bankName, setBankName] = useState('');
  const [bankCode, setBankCode] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const account = await getBankAccount();
      setExisting(account);
      if (account) {
        setBankName(account.bank_name);
        setBankCode(account.bank_code);
        setAccountNumber(account.account_number);
        setAccountName(account.account_name);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleSubmit() {
    setError(null);
    setSuccess(null);
    setIsSubmitting(true);
    const payload = {
      bank_name: bankName.trim(),
      bank_code: bankCode.trim(),
      account_number: accountNumber.trim(),
      account_name: accountName.trim(),
    };
    try {
      if (existing) {
        await updateBankAccount(payload);
        setSuccess('Bank account updated.');
      } else {
        await createBankAccount(payload);
        setSuccess('Bank account saved.');
      }
      await load();
      setTimeout(() => navigation.goBack(), 800);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(formatFieldErrors(err.errors) || err.message);
      } else {
        setError('Could not save bank account.');
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) return <LoadingView />;

  return (
    <Screen scroll padded>
      <Text style={styles.lead}>
        {existing
          ? 'Update your payout account. All wallet transfers and refunds go to this account.'
          : 'Add the bank account where you want to receive payouts and refunds. Only one account is allowed.'}
      </Text>

      <TextField
        label="Bank name"
        placeholder="GTBank"
        value={bankName}
        onChangeText={setBankName}
      />
      <TextField
        label="Bank code"
        placeholder="058"
        keyboardType="number-pad"
        hint="Nigerian bank code (e.g. 058 for GTBank)"
        value={bankCode}
        onChangeText={setBankCode}
      />
      <TextField
        label="Account number"
        placeholder="0123456789"
        keyboardType="number-pad"
        value={accountNumber}
        onChangeText={setAccountNumber}
      />
      <TextField
        label="Account name"
        placeholder="Jane Doe"
        autoCapitalize="words"
        value={accountName}
        onChangeText={setAccountName}
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}
      {success ? <Text style={styles.success}>{success}</Text> : null}

      <Button
        title={existing ? 'Update account' : 'Save account'}
        loading={isSubmitting}
        onPress={handleSubmit}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  lead: {
    fontSize: 15,
    color: colors.textSecondary,
    lineHeight: 22,
    marginBottom: 20,
    marginTop: 8,
  },
  error: { color: colors.error, marginBottom: 12 },
  success: { color: colors.success, marginBottom: 12, fontWeight: '600' },
});
