import * as WebBrowser from 'expo-web-browser';

import type { WalletFundStatus } from './types';
import { getWalletFundStatus, initiateWalletFund } from './wallet';

const REDIRECT_SCHEME = 'lydiathrift://wallet/fund';
const POLL_INTERVAL_MS = 2000;
const MAX_POLL_ATTEMPTS = 45;

export type WalletFundResult =
  | { outcome: 'success'; status: WalletFundStatus }
  | { outcome: 'failed'; status: WalletFundStatus }
  | { outcome: 'pending'; status: WalletFundStatus }
  | { outcome: 'cancelled' };

export async function fundWalletViaPaystack(amountNaira: number): Promise<WalletFundResult> {
  const { fund } = await initiateWalletFund(amountNaira);

  if (fund.mock) {
    throw new Error(
      fund.message ?? 'Paystack is not configured on the server. Contact support.',
    );
  }

  if (!fund.authorization_url) {
    throw new Error(fund.message ?? 'Could not start Paystack checkout.');
  }

  const browserResult = await WebBrowser.openAuthSessionAsync(
    fund.authorization_url,
    REDIRECT_SCHEME,
    { showInRecents: true },
  );

  if (browserResult.type === 'cancel' || browserResult.type === 'dismiss') {
    const status = await getWalletFundStatus(fund.reference);
    if (status.status === 'success') {
      return { outcome: 'success', status };
    }
    if (status.status === 'failed') {
      return { outcome: 'failed', status };
    }
    return { outcome: 'cancelled' };
  }

  // type === 'success' — user returned from Paystack via deep link
  return pollWalletFundStatus(fund.reference);
}

/** Poll until Paystack webhook confirms the payment on the server. */
export async function pollWalletFundStatus(reference: string): Promise<WalletFundResult> {
  for (let attempt = 0; attempt < MAX_POLL_ATTEMPTS; attempt += 1) {
    const status = await getWalletFundStatus(reference);

    if (status.status === 'success') {
      return { outcome: 'success', status };
    }

    if (status.status === 'failed') {
      return { outcome: 'failed', status };
    }

    await delay(POLL_INTERVAL_MS);
  }

  const status = await getWalletFundStatus(reference);
  if (status.status === 'success') {
    return { outcome: 'success', status };
  }
  if (status.status === 'failed') {
    return { outcome: 'failed', status };
  }

  return { outcome: 'pending', status };
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
