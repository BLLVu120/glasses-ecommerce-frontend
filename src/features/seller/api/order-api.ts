import { api } from '@/lib/axios';

/* ====== TYPE ====== */
export interface Order {
  orderId: string;
  customerId: string;
  phoneNumber: string;
  recipientName?: string | null;
  deliveryAddress: string;
  orderStatus:
    | 'PENDING'
    | 'AWAITING_VERIFICATION'
    | 'ON_HOLD'
    | 'CONFIRMED'
    | 'PROCESSING'
    | 'PRODUCED'
    | 'SHIPPED'
    | 'COMPLETED'
    | 'CANCELLED'
    | string;
  totalAmount: number;
  depositAmount: number;
  items: OrderItem[];
}
dress: string;
  orderStatus:
    | 'PENDING'
    | 'AWAITING_VERIFICATION'
    | 'ON_HOLD'
    | 'CONFIRMED'
    | 'PROCESSING'
    | 'PRODUCED'
    | 'SHIPPED'
    | 'COMPLETED'
    | 'CANCELLED'
    | string;
  totalAmount: number;
  depositAmount: number;
  items: OrderItem[];
}
export interface Prescription {
  id: string;
  imageUrl: string | null;
  odSphere: number;
  odCylinder: number;
  odAxis: number;
  odAdd: number;
  odPd: number;
  osSphere: number;
  osCylinder: number;
  osAxis: number;
  osAdd: number;
  osPd: number;
  note: string;
}
export interface OrderItem {
  orderItemId: string;
  productVariantId: string;
  orderItemType: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  prescription?: Prescription;
}
export interface PaginatedResponse<T> {
  items: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export const orderApi = {
  getOrders: async (params?: GetOrdersParams): Promise<PaginatedResponse<Order>> => {
    const response = await api.get('/management/orders', { params });
    return response.data.result;
  },

  getAwaitingVerificationOrders: async (
    page: number = 0,
    size: number = 10,
  ): Promise<PaginatedResponse<Order>> => {
    return orderApi.getOrders({
      status: 'AWAITING_VERIFICATION',
      page,
      size,
      sortBy: 'createdAt',
      sortDir: 'desc',
    });
  },
  getOrderDetail: async (orderId: string): Promise<Order> => {
    const res = await api.get(`/management/orders/${orderId}`);
    return res.data.result;
  },
  verifyOrder: async (orderId: string, isApproved: boolean): Promise<void> => {
    await api.put(`/sales/orders/${orderId}/verify?isApproved=${isApproved}`);
  },
};getAwaitingVerificationOrders: async (
    page: number = 0,
    size: number = 10,
  ): Promise<PaginatedResponse<Order>> => {
    return orderApi.getOrders({
      status: 'AWAITING_VERIFICATION',
      page,
      size,
      sortBy: 'createdAt',
      sortDir: 'desc',
    });
  },
  getOrderDetail: async (orderId: string): Promise<Order> => {
    const res = await api.get(`/management/orders/${orderId}`);
    return res.data.result;
  },
  verifyOrder: async (orderId: string, isApproved: boolean): Promise<void> => {
    await api.put(`/sales/orders/${orderId}/verify?isApproved=${isApproved}`);
  },
};
getAwaitingVerificationOrders: async (
    page: number = 0,
    size: number = 10,
  ): Promise<PaginatedResponse<Order>> => {
    return orderApi.getOrders({
      status: 'AWAITING_VERIFICATION',
      page,
      size,
      sortBy: 'createdAt',
      sortDir: 'desc',
    });
  },
  getOrderDetail: async (orderId: string): Promise<Order> => {
    const res = await api.get(`/management/orders/${orderId}`);
    return res.data.result;
  },
  verifyOrder: async (orderId: string, isApproved: boolean): Promise<void> => {
    await api.put(`/sales/orders/${orderId}/verify?isApproved=${isApproved}`);
  },
};

