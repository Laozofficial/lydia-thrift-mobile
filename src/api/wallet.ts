import { apiRequest } from './client';
import type {
  BankAccount,
  MessageResponse,
  PaginatedData,
  SingleData,
  Wallet,
  WalletFundInitResult,
  WalletFundStatus,
  WalletTransaction,
} from './types';

export async function getWallet(): Promise<Wallet> {
  const result = await apiRequest<SingleData<Wallet>>('/wallet', { auth: true });
  return result.data;
}

export async function listWalletTransactions(): Promise<WalletTransaction[]> {
  const result = await apiRequest<PaginatedData<WalletTransaction>>('/wallet/transactions', {
    auth: true,
  });
  return result.data;
}

export async function initiateWalletFund(amountNaira: number): Promise<{
  fund: WalletFundInitResult;
  amount_naira: number;
}> {
  const result = await apiRequest<{
    data: WalletFundInitResult;
    amount_naira: number;
  }>('/wallet/fund/initiate', {
    method: 'POST',
    auth: true,
    body: JSON.stringify({ amount_naira: amountNaira }),
  });

  return { fund: result.data, amount_naira: result.amount_naira };
}

export async function getWalletFundStatus(reference: string): Promise<WalletFundStatus> {
  const result = await apiRequest<SingleData<WalletFundStatus>>(`/wallet/fund/${reference}`, {
    auth: true,
  });
  return result.data;
}

export async function mockCompleteWalletFund(reference: string): Promise<WalletFundStatus> {
  const result = await apiRequest<SingleData<WalletFundStatus>>(
    `/wallet/fund/${reference}/mock-complete`,
    { method: 'POST', auth: true },
  );
  return result.data;
}

export async function transferToBank(amountNaira: number): Promise<WalletTransaction> {
  const result = await apiRequest<{ data: WalletTransaction; message: string }>('/wallet/transfer', {
    method: 'POST',
    auth: true,
    body: JSON.stringify({ amount_naira: amountNaira }),
  });
  return result.data;
}

export async function getBankAccount(): Promise<BankAccount | null> {
  const result = await apiRequest<{ data: BankAccount | null; message?: string }>('/bank-account', {
    auth: true,
  });
  return result.data;
}

export async function createBankAccount(payload: {
  bank_name: string;
  bank_code: string;
  account_number: string;
  account_name: string;
}): Promise<BankAccount> {
  const result = await apiRequest<SingleData<BankAccount>>('/bank-account', {
    method: 'POST',
    auth: true,
    body: JSON.stringify(payload),
  });
  return result.data;
}

export async function updateBankAccount(payload: {
  bank_name: string;
  bank_code: string;
  account_number: string;
  account_name: string;
}): Promise<BankAccount> {
  const result = await apiRequest<SingleData<BankAccount>>('/bank-account', {
    method: 'PUT',
    auth: true,
    body: JSON.stringify(payload),
  });
  return result.data;
}

export async function instantWalletFund(amountNaira: number): Promise<{
  wallet_balance_naira: number;
}> {
  const result = await apiRequest<{
    data: { wallet_balance_naira: number };
    message: string;
  }>('/wallet/fund/instant', {
    method: 'POST',
    auth: true,
    body: JSON.stringify({ amount_naira: amountNaira }),
  });
  return { wallet_balance_naira: result.data.wallet_balance_naira };
}

export async function payInstallmentFromWallet(
  paymentScheduleId: number,
): Promise<{ transaction: WalletTransaction; wallet_balance_naira: number; schedule_status: string }> {
  const result = await apiRequest<{
    data: WalletTransaction;
    wallet_balance_naira: number;
    schedule_status: string;
    message: string;
  }>('/payments/pay-from-wallet', {
    method: 'POST',
    auth: true,
    body: JSON.stringify({ payment_schedule_id: paymentScheduleId }),
  });
  return {
    transaction: result.data,
    wallet_balance_naira: result.wallet_balance_naira,
    schedule_status: result.schedule_status,
  };
}
