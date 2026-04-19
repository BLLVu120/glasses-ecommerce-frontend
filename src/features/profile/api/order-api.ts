import { api } from '@/lib/axios';
import type { ApiResponse } from '../types';
import type { Order, PaginatedResponse, UseMyOrdersProps } from '../types/order';

export const orderApi = {
  getMyOrders: async (params: UseMyOrdersProps = {}) => {
    const { page = 0, size = 10, sortBy = 'createdAt', sortDir = 'desc' } = params;

    const response = await api.get<ApiResponse<PaginatedResponse<Order>>>('/orders/me', {
      params: { page, size, sortBy, sortDir },
    });

    return response.data.result;
  },
  checkoutRemaining: async (orderId: string) => {
    // Truyền orderId vào params để axios tự build thành ?orderId=xxx
    const response = await api.post<ApiResponse<string>>('/payment/checkout', undefined, {
      params: { orderId },
    });
    // Trả về thẳng chuỗi URL (nằm trong .result)
    return response.data.result;
  },
};


