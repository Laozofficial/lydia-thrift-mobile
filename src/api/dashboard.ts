import { apiRequest } from './client';
import type { Dashboard, SingleData } from './types';

export async function fetchDashboard(): Promise<Dashboard> {
  return apiRequest<Dashboard>('/dashboard', { auth: true });
}
