import { api } from '@/lib/axios';
import type { GetOrdersParams, Order, OrderPageResponse } from '../types/order-type';

export const orderApi = {
  getOrders: async (params?: GetOrdersParams): Promise<OrderPageResponse> => {
    // axios sẽ tự động chuyển object params thành query string (?page=0&size=10...)
    const response = await api.get('/management/orders', { params });
    return response.data.result;
  },

  getOrderById: async (orderId: string): Promise<Order> => {
    const response = await api.get(`/management/orders/${orderId}`);
    return response.data.result;
  },

  deleteOrder: async (orderId: string): Promise<void> => {
    await api.delete(`/management/orders/${orderId}`);
  },

  verifyOrder: async (orderId: string, isApproved: boolean): Promise<void> => {
    await api.put(`/sales/orders/${orderId}/verify?isApproved=${isApproved}`);
  },

  revertVerification: async (orderId: string): Promise<void> => {
    await api.put(`/sales/orders/${orderId}/revert-verify`);
  },

  rejectOrder: async (orderId: string, reason?: string): Promise<void> => {
    await api.put(`/sales/orders/${orderId}/reject${reason ? `?reason=${encodeURIComponent(reason)}` : ''}`);
  },
};
