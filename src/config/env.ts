import { Platform } from 'react-native';

/**
 * Base URL for the Lydia Thrift Laravel API (includes `/api` prefix).
 * Override with EXPO_PUBLIC_API_URL in `.env` when needed.
 */
function defaultApiUrl(): string {
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:8080/api';
  }

  return 'http://localhost:8080/api';
}

export const API_URL =
  process.env.EXPO_PUBLIC_API_URL?.replace(/\/$/, '') ?? defaultApiUrl();
