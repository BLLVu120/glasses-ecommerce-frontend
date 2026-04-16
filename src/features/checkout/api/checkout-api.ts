import { api } from '@/lib/axios';
import type { CheckoutRequest, CheckoutResponse, OrderDetailsResponse } from '../type/type';

export const paymentApi = {
  getPaymentRequirement: async (payload: CheckoutRequest) =>
    await api
      .post<CheckoutResponse>('/payment/orders/requirement', payload)
      .then((res) => res.data),
  createOrder: async (formData: FormData, paymentMethod: string) =>
    await api
      .post('/orders/create', formData, {
        params: {
          PaymentMethod: paymentMethod,
        },
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((res) => res.data),

  // Lấy link thanh toán VNPay
  checkoutVnpay: async (orderId: string | number) =>
    await api
      .post('/payment/checkout', null, {
        params: { orderId: orderId },
      })
      .then((res) => res.data),
  getOrderDetails: async (orderId: string) =>
    await api.get<OrderDetailsResponse>(`/orders/${orderId}`).then((res) => res.data),
};
