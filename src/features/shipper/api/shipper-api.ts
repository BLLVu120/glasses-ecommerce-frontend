import { api } from '@/lib/axios';
import type { BEOrder } from '@/features/operation-staff/types/types';

export const shipperApi = {
  getReadyToShipOrders: async (): Promise<BEOrder[]> => {
    const response = await api.get('/management/orders', {
      params: {
        status: 'PRODUCED',
        size: 10000,
      },
    });

    return response.data.result?.items || [];
  },

  acceptOrders: async (orderIds: string[]): Promise<void> => {
    const response = await api.patch('/ship/orders/accept', { orderIds });
    return response.data;
  },

  getMyAcceptedOrders: async (): Promise<BEOrder[]> => {
    const response = await api.get('/ship/orders/my-orders-accepted', {
      params: {
        size: 10000,
      },
    });

    return response.data.result?.items || [];
  },

  startDelivery: async (orderId: string): Promise<void> => {
    const response = await api.patch(`/ship/orders/${orderId}/start-delivery`);
    return response.data;
  },

  confirmDelivered: async (orderId: string): Promise<void> => {
    const response = await api.patch(`/ship/orders/${orderId}/confirm-delivered`);
    return response.data;
  },
};