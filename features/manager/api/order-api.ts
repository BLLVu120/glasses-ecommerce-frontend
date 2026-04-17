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
};
