// src/features/products/hooks/useProducts.ts
import { useQuery, keepPreviousData } from '@tanstack/react-query'; // 👈 Import thêm keepPreviousData ở đây
import { productApi } from '../api/product-api';
import type { FilterParams } from '../types/product-type';

export const productKeys = {
  all: ['products'] as const,
  list: (filters: FilterParams) => ['products', 'list', filters] as const,
  detail: (id: string) => ['products', id] as const,
};

// --- HOOK 1: Lấy danh sách sản phẩm ---
export const useProducts = (filters: FilterParams = {}) => {
  return useQuery({
    queryKey: productKeys.list(filters),
    queryFn: async () => {
      const data = await productApi.getFilteredProducts(filters);
      return data.result; // trả full pagination
    },
    staleTime: 1000 * 60 * 5,
    placeholderData: keepPreviousData,
  });
};
// --- HOOK 2: Lấy chi tiết sản phẩm ---
export const useProduct = (id: string) => {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: async () => {
      const data = await productApi.getProductById(id);
      return data.result;
    },
    enabled: !!id,
  });
};
