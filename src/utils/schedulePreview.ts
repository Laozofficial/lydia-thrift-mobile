import type { PlanFrequency, Product } from '../api/types';

export interface SchedulePreviewRow {
  sequence: number;
  due_at: string;
  amount_naira: number;
  label: string;
}

export function buildSchedulePreview(
  product: Product,
  durationType: PlanFrequency,
): SchedulePreviewRow[] {
  const count =
    durationType === 'daily'
      ? product.installment_count_daily
      : durationType === 'weekly'
        ? product.installment_count_weekly
        : product.installment_count_monthly;

  const total = product.price_naira + product.delivery_fee_naira;
  const base = Math.floor((total * 100) / count) / 100;
  const rows: SchedulePreviewRow[] = [];
  let due = new Date();
  due.setHours(0, 0, 0, 0);

  for (let sequence = 1; sequence <= count; sequence += 1) {
    if (sequence > 1) {
      due = advanceDate(due, durationType);
    }
    const amount =
      sequence === count ? Math.round((total - base * (count - 1)) * 100) / 100 : base;

    rows.push({
      sequence,
      due_at: due.toISOString(),
      amount_naira: amount,
      label: periodLabel(durationType, sequence),
    });
  }

  return rows;
}

export function buildCustomSchedulePreview(
  totalNaira: number,
  frequency: PlanFrequency,
  installmentAmountNaira: number,
): SchedulePreviewRow[] {
  if (!installmentAmountNaira || installmentAmountNaira <= 0) {
    return [];
  }
  const installmentCount = Math.ceil(totalNaira / installmentAmountNaira);

  const rows: SchedulePreviewRow[] = [];
  let due = new Date();
  due.setHours(0, 0, 0, 0);
  let remaining = totalNaira;

  for (let sequence = 1; sequence <= installmentCount; sequence += 1) {
    if (sequence > 1) {
      due = advanceDate(due, frequency);
    }
    rows.push({
      sequence,
      due_at: due.toISOString(),
      amount_naira: Math.min(installmentAmountNaira, remaining),
      label: periodLabel(frequency, sequence),
    });
    remaining -= Math.min(installmentAmountNaira, remaining);
  }

  return rows;
}

function advanceDate(date: Date, durationType: PlanFrequency): Date {
  const next = new Date(date);
  if (durationType === 'daily') next.setDate(next.getDate() + 1);
  else if (durationType === 'weekly') next.setDate(next.getDate() + 7);
  else next.setMonth(next.getMonth() + 1);
  return next;
}

function periodLabel(durationType: PlanFrequency, sequence: number): string {
  if (durationType === 'daily') return `Day ${sequence}`;
  if (durationType === 'weekly') return `Week ${sequence}`;
  return `Month ${sequence}`;
}
