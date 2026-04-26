import { api } from '@/lib/axios';
import type { BEOrder, BEOrderItem } from '@/features/operation-staff/types/types';

export const productionApi = {
  getProcessingOrders: async (): Promise<BEOrder[]> => {
    // 1. Gọi API với size siêu to khổng lồ (ví dụ: 10000)
    const response = await api.get('/management/orders', {
      params: {
        page: 0,
        size: 10000, // "Lùa" tối đa 10,000 đơn hàng về cùng lúc
        sortBy: 'createdAt',
        sortDir: 'desc', // Lấy đơn mới nhất lên đầu, đề phòng lố 10k đơn
      },
    });

    // 2. Bóc tách mảng đơn hàng từ response phân trang
    // Tùy theo cấu trúc backend, thường mảng data sẽ nằm trong .items hoặc .content
    const allOrders = response.data.result.items || response.data.result.content || [];

    // 3. Filter thủ công trên Frontend
    const filteredOrders = allOrders.filter(
      (order: BEOrder) =>
        order.orderStatus === 'PROCESSING' ||
        order.orderStatus === 'PRODUCED' ||
        order.orderStatus === 'PACKAGING' ||
        order.orderStatus === 'HANDED_TO_CARRIER',
    );

    return filteredOrders;
  },

  startOrder: async (orderId: string): Promise<BEOrder> => {
    const response = await api.put(`/production/orders/${orderId}/start`);
    return response.data.result;
  },

  finishOrder: async (orderId: string): Promise<BEOrder> => {
    const response = await api.put(`/production/orders/${orderId}/finish`);
    return response.data.result;
  },

  updateItemStatus: async (orderItemId: string, status: string): Promise<BEOrderItem> => {
    const response = await api.put(
      `/production/orders/items/${orderItemId}/status?status=${status}`,
    );
    return response.data.result;
  },

  getReadyToShipOrders: async (): Promise<BEOrder[]> => {
    const response = await api.get('/management/orders?status=PRODUCED');
    return response.data.result;
  },

  bulkReadyToShip: async (orderIds: string[]): Promise<void> => {
    const response = await api.put('/production/orders/ready-to-ship', {
      orderIds,
    });
    return response.data;
  },

  startPackaging: async (orderId: string): Promise<BEOrder> => {
    const response = await api.put(`/production/orders/${orderId}/packaging`);
    return response.data.result;
  },

  handoverToCarrier: async (orderId: string, trackingNumber: string): Promise<BEOrder> => {
    const response = await api.put(`/production/orders/${orderId}/handover`, {
      trackingNumber,
    });
    return response.data.result;
  },
};
