import { apiRequest } from './client';
import type {
  DurationType,
  PaginatedData,
  PlanFrequency,
  SingleData,
  ThriftEnrollment,
} from './types';

export async function listEnrollments(): Promise<ThriftEnrollment[]> {
  const result = await apiRequest<PaginatedData<ThriftEnrollment>>('/enrollments', {
    auth: true,
  });
  return result.data;
}

export async function getEnrollment(id: number): Promise<ThriftEnrollment> {
  const result = await apiRequest<SingleData<ThriftEnrollment>>(`/enrollments/${id}`, {
    auth: true,
  });
  return result.data;
}

export async function createEnrollment(payload: {
  product_id: number;
  duration_type: DurationType;
  custom_frequency?: PlanFrequency;
  custom_installment_count?: number;
  custom_installment_amount_naira?: number;
}): Promise<ThriftEnrollment> {
  const result = await apiRequest<SingleData<ThriftEnrollment>>('/enrollments', {
    method: 'POST',
    auth: true,
    body: JSON.stringify(payload),
  });
  return result.data;
}
