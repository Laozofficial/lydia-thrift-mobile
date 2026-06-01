import * as SecureStore from 'expo-secure-store';

import { API_URL } from '../config/env';
import { ApiError, parseApiError } from './errors';

const TOKEN_KEY = 'lydia_thrift_api_token';

type RequestOptions = Omit<RequestInit, 'headers'> & {
  headers?: Record<string, string>;
  auth?: boolean;
};

let tokenCache: string | null = null;

export async function getStoredToken(): Promise<string | null> {
  if (tokenCache) {
    return tokenCache;
  }

  tokenCache = await SecureStore.getItemAsync(TOKEN_KEY);
  return tokenCache;
}

export async function setStoredToken(token: string | null): Promise<void> {
  tokenCache = token;

  if (token) {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
    return;
  }

  await SecureStore.deleteItemAsync(TOKEN_KEY);
}

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { auth = false, headers = {}, ...init } = options;

  const requestHeaders: Record<string, string> = {
    Accept: 'application/json',
    ...headers,
  };

  if (init.body && !requestHeaders['Content-Type']) {
    requestHeaders['Content-Type'] = 'application/json';
  }

  if (auth) {
    const token = await getStoredToken();
    if (!token) {
      throw new ApiError('Not signed in.', 401);
    }
    requestHeaders.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: requestHeaders,
  });

  if (!response.ok) {
    throw await parseApiError(response);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}
