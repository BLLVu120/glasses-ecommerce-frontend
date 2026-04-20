import { api } from '@/lib/axios';
import type { ApiResponse } from '../types/types';
import type { Order, PaginatedResult, PaginationParams, RefundItem } from '../types/refund';

export const refundApi = {
  // Bước 1: Vô hiệu hóa variant (NSX hủy)
  inActivateVariant: async (variantId: string): Promise<void> => {
    await api.patch(`/refund/variant/${variantId}/in-activate`);
  },

  getAffectedOrders: async (variantId: string): Promise<RefundItem[]> => {
    const res = await api.get<ApiResponse<RefundItem[]>>(
      `/refund/affected-orders/${encodeURIComponent(variantId)}`,
    );
    return res.data?.result || [];
  },
inActivateVariant: async (variantId: string): Promise<void> => {
    await api.patch(`/refund/variant/${variantId}/in-activate`);
  },

  getAffectedOrders: async (variantId: string): Promise<RefundItem[]> => {
    const res = await api.get<ApiResponse<RefundItem[]>>(
      `/refund/affected-orders/${encodeURIComponent(variantId)}`,
    );
    return res.data?.result || [];
  },
  // [Khách hủy] Lấy đơn đã hủy có thanh toán thành công
  // Trong file refund-api.ts
  getCancelledPaidOrders: async (params?: PaginationParams): Promise<PaginatedResult<Order>> => {
    // Ép kiểu chuẩn theo type PaginatedResult đã tạo
    const res = await api.get<ApiResponse<PaginatedResult<Order>>>(
      `/management/orders/cancelled/paid`,
      { params }, // Gửi query params qua Axios
    );

    // Trả về TOÀN BỘ object phân trang (để có thể lấy .items, .totalPages, v.v. sau này)
    // Hoặc fallback an toàn nếu API lỗi
    return res.data?.result || { items: [], page: 0, size: 10, totalElements: 0, totalPages: 0 };
  },

  createBatch: async (orderIds: string[]): Promise<RefundItem[]> => {
    // Gửi array lên, nhận về ApiResponse chứa mảng RefundItem[]
    const res = await api.post<ApiResponse<RefundItem[]>>(`/refund/create-batch`, { orderIds });

    // Trả thẳng result
    return res.data?.result || [];
  },

  // Bước 4: Lấy danh sách refund sẵn sàng xử lý
  getReadyRefunds: async (): Promise<RefundItem[]> => {
    // Gọi GET, nhận về ApiResponse chứa mảng RefundItem[]
    const res = await api.get<ApiResponse<RefundItem[]>>(`/refund/ready`);

    // Trả thẳng result
    return res.data?.result || [];
  },
  // Bước 5: Xác nhận hoàn tiền → trả về paymentUrl VNPay
  checkoutRefund: async (refundId: string): Promise<string | null> => {
    const res = await api.post<ApiResponse<string>>(`/refund/${refundId}/refund-checkout`);
    return res.data?.result || null;
  },
};
