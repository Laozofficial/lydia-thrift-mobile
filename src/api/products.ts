import { apiRequest } from './client';
import type { PaginatedData, Product, SingleData } from './types';

export async function listProducts(): Promise<Product[]> {
  const result = await apiRequest<PaginatedData<Product>>('/products');
  return result.data;
}

export async function getProduct(id: number): Promise<Product> {
  const result = await apiRequest<SingleData<Product>>(`/products/${id}`);
  return result.data;
}
