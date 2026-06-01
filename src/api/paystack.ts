import { apiRequest } from './client';
import type { SingleData } from './types';

export interface PaystackConfig {
  public_key: string | null;
  enabled: boolean;
  base_url: string;
}

export async function getPaystackConfig(): Promise<PaystackConfig> {
  const result = await apiRequest<SingleData<PaystackConfig>>('/paystack/config');
  return result.data;
}
