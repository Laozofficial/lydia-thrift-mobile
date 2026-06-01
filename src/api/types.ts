export type UserRole = 'customer' | 'admin' | 'user';

export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  delivery_address?: string | null;
  role: UserRole;
  created_at: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  price_naira: number;
  installment_count_daily: number;
  installment_count_weekly: number;
  installment_count_monthly: number;
  delivery_fee_naira: number;
  is_favorite?: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type PlanFrequency = 'daily' | 'weekly' | 'monthly';
export type DurationType = PlanFrequency | 'custom';

export interface PaymentSchedule {
  id: number;
  sequence: number;
  due_at: string;
  amount_naira: number;
  status: 'pending' | 'paid' | 'overdue';
  paid_at: string | null;
}

export interface ThriftEnrollment {
  id: number;
  product: Product;
  duration_type: DurationType;
  custom_frequency: PlanFrequency | null;
  custom_installment_amount_naira: number | null;
  status: 'active' | 'completed' | 'cancelled';
  delivery_status?: 'pending' | 'processing' | 'in_transit' | 'delivered' | string;
  total_naira: number;
  delivery_fee_naira: number;
  installment_count: number;
  amount_per_installment_naira: number;
  start_date: string;
  completed_at: string | null;
  delivered_at?: string | null;
  payment_schedules: PaymentSchedule[];
  created_at: string;
}

export interface DashboardNextPayment {
  enrollment_id: number;
  product_name: string;
  next_payment: {
    schedule_id: number;
    sequence: number;
    due_at: string;
    amount_naira: number;
    status: string;
  } | null;
}

export interface Dashboard {
  wallet_balance_naira: number;
  active_enrollments_count: number;
  completed_enrollments_count?: number;
  overdue_payments_count: number;
  next_payments: DashboardNextPayment[];
  enrollments: ThriftEnrollment[];
}

export interface Wallet {
  id: number;
  balance_naira: number;
  transfer_policy: string;
  allow_instant_fund?: boolean;
}

export type WalletTransactionType =
  | 'topup_credit'
  | 'refund_credit'
  | 'installment_debit'
  | 'transfer_debit';

export interface WalletTransaction {
  id: number;
  type: WalletTransactionType;
  amount_naira: number;
  balance_after_naira: number;
  reference: string;
  meta: Record<string, unknown>;
  created_at: string;
}

export interface BankAccount {
  id: number;
  bank_name: string;
  bank_code: string;
  account_number: string;
  account_name: string;
  policy: string;
  updated_at: string;
}

export interface WalletFundInitResult {
  reference: string;
  authorization_url: string | null;
  access_code: string | null;
  mock: boolean;
  message?: string;
}

export interface WalletFundStatus {
  reference: string;
  status: 'pending' | 'success' | 'failed';
  amount_naira: number;
  paid_at: string | null;
  wallet_balance_naira: number;
}

export interface ApiValidationError {
  message: string;
  errors?: Record<string, string[]>;
}

export interface PaginatedData<T> {
  data: T[];
  meta?: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export interface SingleData<T> {
  data: T;
}

export interface MessageResponse {
  message: string;
}
