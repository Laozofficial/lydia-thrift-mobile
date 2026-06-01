import type { PlanFrequency } from '../api/types';

const MAX_PLAN_MONTHS = 6;

function addMonths(date: Date, months: number): Date {
  const next = new Date(date);
  next.setMonth(next.getMonth() + months);
  return next;
}

function advanceDueDate(date: Date, frequency: PlanFrequency): Date {
  const next = new Date(date);
  if (frequency === 'daily') next.setDate(next.getDate() + 1);
  else if (frequency === 'weekly') next.setDate(next.getDate() + 7);
  else next.setMonth(next.getMonth() + 1);
  return next;
}

export function lastDueDateForCount(
  installmentCount: number,
  frequency: PlanFrequency,
  startDate = new Date(),
): Date {
  let due = new Date(startDate);
  due.setHours(0, 0, 0, 0);

  for (let sequence = 1; sequence < installmentCount; sequence += 1) {
    due = advanceDueDate(due, frequency);
  }

  return due;
}

export function customPlanExceedsMaxDuration(
  installmentCount: number,
  frequency: PlanFrequency,
  startDate = new Date(),
  maxMonths = MAX_PLAN_MONTHS,
): boolean {
  if (installmentCount <= 1) return false;

  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);
  const maxDue = addMonths(start, maxMonths);
  const lastDue = lastDueDateForCount(installmentCount, frequency, start);

  return lastDue.getTime() > maxDue.getTime();
}

export function maxCustomInstallmentCount(
  frequency: PlanFrequency,
  startDate = new Date(),
  maxMonths = MAX_PLAN_MONTHS,
): number {
  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);
  const maxDue = addMonths(start, maxMonths);

  let count = 1;
  while (true) {
    const nextCount = count + 1;
    const nextLastDue = lastDueDateForCount(nextCount, frequency, start);
    if (nextLastDue.getTime() > maxDue.getTime()) return count;
    count = nextCount;
    if (count > 120) return count;
  }
}

export const CUSTOM_PLAN_MAX_MONTHS = MAX_PLAN_MONTHS;
