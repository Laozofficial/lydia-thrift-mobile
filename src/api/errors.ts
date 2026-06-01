import type { ApiValidationError } from './types';

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly errors?: Record<string, string[]>,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function parseApiError(response: Response): Promise<ApiError> {
  let body: ApiValidationError | null = null;

  try {
    body = (await response.json()) as ApiValidationError;
  } catch {
    body = null;
  }

  return new ApiError(
    body?.message ?? `Request failed (${response.status})`,
    response.status,
    body?.errors,
  );
}

export function formatFieldErrors(errors?: Record<string, string[]>): string {
  if (!errors) {
    return '';
  }

  return Object.values(errors).flat().join('\n');
}
