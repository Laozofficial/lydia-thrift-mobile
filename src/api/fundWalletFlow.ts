import { Alert } from 'react-native';

import { ApiError } from './errors';
import { fundWalletViaPaystack, pollWalletFundStatus, type WalletFundResult } from './fundWallet';
import { formatNaira } from '../utils/format';

/** Start Paystack checkout and wait for webhook confirmation on the server. */
export async function fundWalletWithPaystack(amountNaira: number): Promise<WalletFundResult> {
  return fundWalletViaPaystack(amountNaira);
}

export { pollWalletFundStatus, type WalletFundResult };

export function fundWalletErrorMessage(err: unknown): string {
  if (err instanceof ApiError) return err.message;
  if (err instanceof Error && err.message) return err.message;
  return 'Could not start Paystack checkout. Check your connection and try again.';
}

export function showFundSuccess(balance: number, onOk: () => void): void {
  Alert.alert('Wallet funded', `Your new balance is ${formatNaira(balance)}.`, [
    { text: 'OK', onPress: onOk },
  ]);
}

export function showFundPending(onOk: () => void): void {
  Alert.alert(
    'Payment processing',
    'Paystack is confirming your payment. Your wallet will update shortly.',
    [{ text: 'OK', onPress: onOk }],
  );
}
