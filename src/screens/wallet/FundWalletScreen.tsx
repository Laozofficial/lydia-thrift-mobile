import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Feather } from '@expo/vector-icons';

import {
  fundWalletErrorMessage,
  fundWalletWithPaystack,
  pollWalletFundStatus,
  showFundPending,
  showFundSuccess,
} from '../../api/fundWalletFlow';
import { getPaystackConfig } from '../../api/paystack';
import { BackButton } from '../../components/BackButton';
import { Button } from '../../components/Button';
import { ChoiceChip } from '../../components/ChoiceChip';
import { Card } from '../../components/Card';
import { TextField } from '../../components/TextField';
import { Screen } from '../../components/Screen';
import type { WalletStackParamList } from '../../navigation/types';
import { colors } from '../../theme/colors';
import { fonts, typography } from '../../theme/typography';
import { formatNaira } from '../../utils/format';

type Props = NativeStackScreenProps<WalletStackParamList, 'FundWallet'>;

const QUICK_AMOUNTS = [5000, 10000, 20000, 50000];

type Phase = 'form' | 'checkout' | 'waiting';

export function FundWalletScreen({ navigation }: Props) {
  const [amount, setAmount] = useState('');
  const [paystackReady, setPaystackReady] = useState(true);
  const [phase, setPhase] = useState<Phase>('form');
  const [pendingReference, setPendingReference] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getPaystackConfig()
      .then((config) => {
        setPaystackReady(config.enabled);
        if (!config.enabled) {
          setError('Paystack payments are not available yet. Please try again later.');
        }
      })
      .catch(() => {
        setPaystackReady(false);
        setError('Could not reach the payment service. Check your connection.');
      });
  }, []);

  async function handleFund() {
    const value = parseFloat(amount);
    if (!value || value < 100) {
      setError('Minimum top-up is ₦100.');
      return;
    }
    setError(null);
    setPhase('checkout');
    try {
      const result = await fundWalletWithPaystack(value);

      if (result.outcome === 'success') {
        showFundSuccess(result.status.wallet_balance_naira, () => navigation.goBack());
        return;
      }

      if (result.outcome === 'failed') {
        setPhase('form');
        setError('Payment failed. Try again or use a different card.');
        return;
      }

      if (result.outcome === 'cancelled') {
        setPhase('form');
        setError('Checkout closed before payment completed.');
        return;
      }

      setPendingReference(result.status.reference);
      setPhase('waiting');
    } catch (err) {
      setPhase('form');
      setError(fundWalletErrorMessage(err));
    }
  }

  async function handleRetryPoll() {
    if (!pendingReference) return;
    setPhase('waiting');
    setError(null);
    const result = await pollWalletFundStatus(pendingReference);

    if (result.outcome === 'success') {
      showFundSuccess(result.status.wallet_balance_naira, () => navigation.goBack());
      return;
    }

    if (result.outcome === 'failed') {
      setPhase('form');
      setError('Payment failed.');
      return;
    }

    showFundPending(() => navigation.goBack());
  }

  if (phase === 'waiting') {
    return (
      <Screen scroll padded>
        <View style={styles.waitingWrap}>
          <View style={styles.waitingIcon}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
          <Text style={styles.waitingTitle}>Confirming payment</Text>
          <Text style={styles.waitingLead}>
            Paystack is notifying our server. Your wallet updates automatically via webhook — usually within a few seconds.
          </Text>
          <Button title="Check again" tone="onBackground" onPress={handleRetryPoll} />
          <Button
            title="Back to wallet"
            variant="outline"
            tone="onBackground"
            onPress={() => navigation.goBack()}
          />
        </View>
      </Screen>
    );
  }

  return (
    <Screen scroll padded>
      <BackButton onPress={() => navigation.goBack()} />

      <Text style={styles.title}>Fund wallet</Text>
      <Text style={styles.lead}>
        Pay securely with Paystack. After payment, your wallet updates automatically when our server
        receives the confirmation.
      </Text>

      <Card style={styles.amountCard}>
        <Text style={styles.amountLabel}>Top-up amount</Text>
        <TextField
          label="Amount (₦)"
          keyboardType="decimal-pad"
          placeholder="10000"
          value={amount}
          onChangeText={setAmount}
          hint="Minimum ₦100"
        />

        <Text style={styles.quickLabel}>Quick select</Text>
        <View style={styles.quickRow}>
          {QUICK_AMOUNTS.map((q) => (
            <ChoiceChip
              key={q}
              label={formatNaira(q)}
              selected={amount === String(q)}
              onPress={() => setAmount(String(q))}
            />
          ))}
        </View>
      </Card>

      <View style={styles.trustRow}>
        <Feather name="shield" size={16} color={colors.cream} />
        <Text style={styles.trustText}>Secured by Paystack · Bank transfer & cards</Text>
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Button
        title={phase === 'checkout' ? 'Opening Paystack…' : 'Pay with Paystack'}
        loading={phase === 'checkout'}
        disabled={!paystackReady}
        onPress={handleFund}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { ...typography.display, color: colors.onBackground, marginBottom: 10 },
  lead: { ...typography.body, color: colors.onBackgroundMuted, marginBottom: 24, lineHeight: 22 },
  amountCard: { marginBottom: 20 },
  amountLabel: { ...typography.label, color: colors.textMuted, marginBottom: 8 },
  quickLabel: { ...typography.caption, color: colors.textSecondary, marginBottom: 10, marginTop: 4 },
  quickRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  trustRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 20 },
  trustText: { ...typography.caption, color: colors.onBackgroundMuted, flex: 1 },
  error: { fontFamily: fonts.medium, color: '#FECACA', marginBottom: 12 },
  waitingWrap: { flex: 1, justifyContent: 'center', paddingVertical: 48, gap: 16 },
  waitingIcon: {
    alignSelf: 'center',
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  waitingTitle: { ...typography.title, color: colors.onBackground, textAlign: 'center' },
  waitingLead: {
    ...typography.body,
    color: colors.onBackgroundMuted,
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 22,
  },
});
