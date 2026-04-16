import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { refundApi } from '../api/refund-api';
import type { PaginationParams } from '../types/refund';
// 1. Quản lý Query Keys tập trung (Best Practice)
// Giúp tránh gõ sai type và dễ dàng invalidate cache sau này
export const refundKeys = {
  all: ['refunds'] as const,
  affectedOrders: (variantId: string) => [...refundKeys.all, 'affected-orders', variantId] as const,
  // Cập nhật Key để chứa params
  cancelledPaidOrders: (params?: PaginationParams) =>
    [...refundKeys.all, 'cancelled-paid-orders', params] as const,
  readyRefunds: () => [...refundKeys.all, 'ready'] as const,
};

// ==========================================
// QUERIES (Dành cho các API GET - Lấy dữ liệu)
// ==========================================

// Lấy danh sách đơn bị ảnh hưởng (Bước 2)
export const useAffectedOrders = (variantId: string) => {
  return useQuery({
    queryKey: refundKeys.affectedOrders(variantId),
    queryFn: () => refundApi.getAffectedOrders(variantId),
    // Chỉ gọi API khi variantId có giá trị (tránh gọi dư thừa khi chưa có ID)
    enabled: !!variantId,
  });
};

// Lấy đơn đã hủy có thanh toán thành công
export const useCancelledPaidOrders = (params?: PaginationParams) => {
  return useQuery({
    queryKey: refundKeys.cancelledPaidOrders(params),
    queryFn: () => refundApi.getCancelledPaidOrders(params),
    // Tùy chọn: bạn có thể dùng select ở đây nếu CHỈ muốn lấy mảng,
    // nhưng khuyên nên lấy toàn bộ PaginatedResult để UI có thể làm phân trang.
  });
};

// Lấy danh sách refund sẵn sàng xử lý (Bước 4)
export const useReadyRefunds = () => {
  return useQuery({
    queryKey: refundKeys.readyRefunds(),
    queryFn: refundApi.getReadyRefunds,
  });
};

// ==========================================
// MUTATIONS (Dành cho API POST/PATCH - Sửa đổi dữ liệu)
// ==========================================

// Vô hiệu hóa variant (Bước 1)
export const useInActivateVariant = () => {
  return useMutation({
    mutationFn: (variantId: string) => refundApi.inActivateVariant(variantId),
  });
};

// Tạo batch hoàn tiền (Bước 3)
export const useCreateBatch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderIds: string[]) => refundApi.createBatch(orderIds),
    onSuccess: () => {
      // CỰC KỲ QUAN TRỌNG:
      // Sau khi tạo batch thành công, phải báo cho React Query biết để nó gọi lại
      // API lấy danh sách refund sẵn sàng (getReadyRefunds) và làm mới danh sách đơn đã hủy
      queryClient.invalidateQueries({ queryKey: refundKeys.readyRefunds() });
      queryClient.invalidateQueries({ queryKey: refundKeys.cancelledPaidOrders() });
    },
  });
};

// Xác nhận hoàn tiền (Bước 5)
export const useCheckoutRefund = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (refundId: string) => refundApi.checkoutRefund(refundId),
    onSuccess: () => {
      // Sau khi checkout thành công, cập nhật lại danh sách refund đang chờ
      queryClient.invalidateQueries({ queryKey: refundKeys.readyRefunds() });
    },
  });
};
