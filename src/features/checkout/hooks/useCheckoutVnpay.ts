// src/hooks/useCheckoutVnpay.ts
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { isAxiosError } from 'axios';
import { paymentApi } from '../api/checkout-api';

export const useCheckoutVnpay = () => {
  return useMutation({
    mutationFn: paymentApi.checkoutVnpay,
    onSuccess: (data) => {
      const url = typeof data === 'string' ? data : data?.result || data?.paymentUrl || data?.url;

      if (url) {
        toast.success('Đang chuyển hướng đến VNPay...');
        window.location.href = url;
      } else {
        toast.error('Không tìm thấy link thanh toán từ hệ thống!');
      }
    },
    onError: (error: unknown) => {
      if (isAxiosError(error)) {
        toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi tạo link thanh toán');
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Lỗi không xác định khi gọi VNPay');
      }
    },
  });
};
