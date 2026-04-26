import { api } from '@/lib/axios';
import type { DashboardResponse } from '../types/types';

export const dashboardApi = {
  getRevenue: async () =>
    await api.get<DashboardResponse>('/dashboard/revenue').then((res) => res.data.result), // Trả về trực tiếp .result để dùng cho gọn
};
