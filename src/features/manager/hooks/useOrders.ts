import { useQuery } from '@tanstack/react-query';
import { orderApi } from '@/features/manager/api/order-api';
import type { GetOrdersParams } from '../types/order-type';

export function useOrders(params?: GetOrdersParams) {
  const query = useQuery({
    // queryKey chứa params: Khi params (page, status...) thay đổi, React Query sẽ TỰ ĐỘNG gọi lại API
    queryKey: ['orders', params],
    queryFn: () => orderApi.getOrders(params),
    // Giữ lại dữ liệu cũ trên màn hình trong lúc fetch trang mới (giúp UI không bị nháy)
    placeholderData: (previousData) => previousData,
    // Tự động refetch mỗi 10 giây để load đơn mới
    refetchInterval: 10_000,
  });

  return {
    // Trích xuất mảng orders từ kết quả trả về (hỗ trợ cả dạng phân trang response.items)
    orders: query.data?.items || [],

    // Thêm các thông tin phân trang để UI có thể sử dụng
    totalPages: query.data?.totalPages || 0,
    totalElements: query.data?.totalElements || 0,

    // Map các trạng thái của React Query sang biến cũ của bạn để không làm gãy UI
    loading: query.isLoading || query.isFetching,
    error: query.error ? query.error.message : null,

    // Nút refetch thủ công (dù React Query đã tự động fetch rất thông minh rồi)
    refetch: query.refetch,
  };
}
