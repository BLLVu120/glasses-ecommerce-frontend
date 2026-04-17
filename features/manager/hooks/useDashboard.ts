import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '../api/dashboard-api';

export const useDashboardRevenue = () => {
  return useQuery({
    queryKey: ['dashboard', 'revenue'], // Key để phân biệt dữ liệu trong cache
    queryFn: () => dashboardApi.getRevenue(),

    // Một số cấu hình hữu ích cho Dashboard
    staleTime: 1000 * 60 * 5, // Dữ liệu coi là "mới" trong 5 phút
    refetchInterval: 1000 * 60 * 10, // Tự động cập nhật lại mỗi 10 phút (Polling)
    retry: 2, // Thử lại 2 lần nếu gọi API lỗi
  });
};
