// src/hooks/useProductVariants.ts
import { useQuery } from '@tanstack/react-query';
import { productApi } from '../api/product-api';

export const useProductVariants = (productId: string) => {
  return useQuery({
    // Đặt queryKey chuẩn để React Query biết đây là variants của 1 product cụ thể
    queryKey: ['product-variants', productId],

    // Gọi hàm API bạn vừa đưa
    queryFn: () => productApi.getVariants(productId),

    // Chỉ gọi API khi thực sự có productId
    enabled: !!productId,

    // Cache data lại để người dùng chuyển tab không bị load lại liên tục
    staleTime: 5 * 60 * 1000,
  });
};
