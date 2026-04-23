import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { orderApi } from '../api/order-api';

export function useAwaitingVerificationOrders(page: number, size: number = 10) {
  return useQuery({
    // queryKey chứa page và size để tự động fetch lại khi 2 biến này thay đổi
    queryKey: ['orders', 'awaiting_verification', page, size],
    queryFn: () => orderApi.getAwaitingVerificationOrders(page, size),
    // Giữ lại dữ liệu cũ trên màn hình trong lúc fetch trang mới (UX mượt mà)
    placeholderData: keepPreviousData,
    // Tự động refetch mỗi 10 giây để load đơn mới
    refetchInterval: 10_000,
  });
}
