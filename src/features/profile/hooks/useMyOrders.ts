// src/hooks/useMyOrders.ts
import { useMutation, useQuery } from '@tanstack/react-query';
import type { UseMyOrdersProps } from '../types/order';
import { orderApi } from '../api/order-api';
import { toast } from 'sonner';
import { isAxiosError } from 'axios';

export const useMyOrders = (params: UseMyOrdersProps = {}) => {
  return useQuery({
    queryKey: ['my-orders', params],
    queryFn: () => orderApi.getMyOrders(params),
    staleTime: 5 * 60 * 1000,
  });
};

export const useCheckoutRemaining = () => {
  return useMutation({
    mutationFn: (orderId: string) => orderApi.checkoutRemaining(orderId),
    onSuccess: (paymentUrl) => {
      // Nếu API trả về link thành công thì redirect luôn
      if (paymentUrl) {
        window.location.href = paymentUrl;
      } else {
        toast.error('Không tìm thấy đường dẫn thanh toán. Vui lòng thử lại!');
      }
    },
    onError: (error: unknown) => {
      if (isAxiosError(error)) {
        toast.error(error.response?.data?.message ?? 'Lỗi kết nối đến cổng thanh toán');
      } else {
        toast.error('Đã xảy ra lỗi không xác định.');
      }
    },
  });
};
