import { apiRequest, setStoredToken } from './client';
import type { AuthResponse, User } from './types';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  const result = await apiRequest<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  await setStoredToken(result.token);
  return result;
}

export async function register(payload: RegisterPayload): Promise<AuthResponse> {
  const result = await apiRequest<AuthResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  await setStoredToken(result.token);
  return result;
}

export async function logout(): Promise<void> {
  try {
    await apiRequest<{ message: string }>('/auth/logout', {
      method: 'POST',
      auth: true,
    });
  } finally {
    await setStoredToken(null);
  }
}

export async function fetchCurrentUser(): Promise<User> {
  const result = await apiRequest<{ user: User }>('/auth/me', { auth: true });
  return result.user;
}
