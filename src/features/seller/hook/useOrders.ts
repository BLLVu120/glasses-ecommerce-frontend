import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { orderApi, type GetOrdersParams } from '../api/order-api';

export function useOrders(params?: GetOrdersParams) {
  return useQuery({
    // queryKey chứa params: khi params đổi, React Query tự fetch lại
    queryKey: ['seller-orders', params],
    queryFn: () =>
      orderApi.getOrders({
        page: params?.page ?? 0,
        size: params?.size ?? 10,
        sortBy: params?.sortBy ?? 'createdAt',
        sortDir: params?.sortDir ?? 'desc',
        status: params?.status === 'ALL' ? undefined : params?.status,
      }),
    // Giữ lại dữ liệu cũ trên màn hình trong lúc fetch trang mới (UX mượt mà)
    placeholderData: keepPreviousData,
    refetchInterval: 15000,
    refetchOnWindowFocus: true,
  });
}
