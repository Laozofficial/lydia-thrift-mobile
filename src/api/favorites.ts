import { apiRequest } from './client';
import type { PaginatedData, Product } from './types';

export async function listFavorites(): Promise<Product[]> {
  const result = await apiRequest<PaginatedData<Product>>('/favorites', { auth: true });
  return result.data;
}

export async function addFavorite(productId: number): Promise<void> {
  await apiRequest<{ message: string }>(`/favorites/${productId}`, {
    method: 'POST',
    auth: true,
  });
}

export async function removeFavorite(productId: number): Promise<void> {
  await apiRequest<{ message: string }>(`/favorites/${productId}`, {
    method: 'DELETE',
    auth: true,
  });
}
