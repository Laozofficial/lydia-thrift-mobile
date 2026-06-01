import { apiRequest } from './client';
import type { SingleData, User } from './types';

export async function getProfile(): Promise<User> {
  const result = await apiRequest<SingleData<User>>('/profile', { auth: true });
  return result.data;
}

export async function updateProfile(payload: {
  name: string;
  phone?: string;
  delivery_address?: string;
}): Promise<User> {
  const result = await apiRequest<SingleData<User>>('/profile', {
    method: 'PUT',
    auth: true,
    body: JSON.stringify(payload),
  });
  return result.data;
}
