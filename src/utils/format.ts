export function formatNaira(amount: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-NG', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function durationLabel(type: string): string {
  switch (type) {
    case 'daily':
      return 'Daily';
    case 'weekly':
      return 'Weekly';
    case 'monthly':
      return 'Monthly';
    case 'custom':
      return 'Custom';
    default:
      return type;
  }
}

export function transactionLabel(type: string): string {
  switch (type) {
    case 'topup_credit':
      return 'Wallet top-up';
    case 'refund_credit':
      return 'Refund';
    case 'installment_debit':
      return 'Installment payment';
    case 'transfer_debit':
      return 'Bank transfer';
    default:
      return type.replace(/_/g, ' ');
  }
}

export function scheduleStatusColor(status: string): string {
  switch (status) {
    case 'paid':
      return '#2E7D5A';
    case 'overdue':
      return '#B3261E';
    default:
      return '#B86E00';
  }
}
