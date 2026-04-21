import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { variantApi } from '../api/variant-api';
import type { VariantQueryParams } from '../types/types';

// Quản lý Key linh hoạt: theo productId và theo params filter
const QUERY_KEYS = {
  all: ['variants'] as const,
  byProduct: (productId: string) => [...QUERY_KEYS.all, productId] as const,
  list: (productId: string, params: VariantQueryParams) =>
    [...QUERY_KEYS.byProduct(productId), 'filter', params] as const,
};

// --- Hook 1: Lấy danh sách Variant có Filter & Phân trang ---
export const useFilteredVariants = (productId: string, params: VariantQueryParams) => {
  return useQuery({
    queryKey: QUERY_KEYS.list(productId, params),
    queryFn: () => variantApi.getFiltered(productId, params),
    enabled: !!productId, // Chỉ chạy khi có productId
    placeholderData: (previousData) => previousData, // Giữ data cũ khi chuyển trang
    staleTime: 1000 * 60 * 5,
  });
};

// --- Hook 2: Lấy toàn bộ Variant (dùng hàm getAll cũ của bạn) ---
export const useVariants = (productId: string) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.byProduct(productId), 'all'],
    queryFn: async () => {
      // Vì variantApi.getAll bạn đã xử lý bóc tách .items bên trong rồi
      const data = await variantApi.getAll(productId);
      return data || [];
    },
    enabled: !!productId,
    staleTime: 1000 * 60 * 5,
  });
};
// --- Hook 2: Lấy toàn bộ Variant (dùng hàm getAll cũ của bạn) ---
export const useVariants = (productId: string) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.byProduct(productId), 'all'],
    queryFn: async () => {
      // Vì variantApi.getAll bạn đã xử lý bóc tách .items bên trong rồi
      const data = await variantApi.getAll(productId);
      return data || [];
    },
    enabled: !!productId,
    staleTime: 1000 * 60 * 5,
  });
};// --- Hook 2: Lấy toàn bộ Variant (dùng hàm getAll cũ của bạn) ---
export const useVariants = (productId: string) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.byProduct(productId), 'all'],
    queryFn: async () => {
      // Vì variantApi.getAll bạn đã xử lý bóc tách .items bên trong rồi
      const data = await variantApi.getAll(productId);
      return data || [];
    },
    enabled: !!productId,
    staleTime: 1000 * 60 * 5,
  });
};
// --- Hook 3: Tạo Variant ---
export const useCreateVariant = (productId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: any) => variantApi.create(productId, payload),
    onSuccess: () => {
      // Invalidate tất cả query liên quan đến variants của product này
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.byProduct(productId) });
    },
    onError: (error) => console.error('Failed to create variant:', error),
  });
};

// --- Hook 4: Cập nhật Variant ---
export const useUpdateVariant = (productId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ variantId, payload }: { variantId: string; payload: any }) =>
      variantApi.update(productId, variantId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.byProduct(productId) });
    },
    onError: (error) => console.error('Failed to update variant:', error),
  });
};

// --- Hook 5: Xóa Variant ---
export const useDeleteVariant = (productId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (variantId: string) => variantApi.delete(productId, variantId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.byProduct(productId) });
    },
    onError: (error) => console.error('Failed to delete variant:', error),
  });
};
