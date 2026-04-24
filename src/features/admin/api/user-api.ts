import { api } from '@/lib/axios';

export type UserRole = 'SALE' | 'OPERATION' | 'SHIPPER' | 'CUSTOMER' | 'MANAGER' | 'ADMIN';

export const userApi = {
  getUsersByRole: async (role: UserRole) => {
    const response = await api.get(`/users`, { params: { role } });
    return response.data.result || [];
  },

  deleteUser: async (id: string) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },

  assignRole: async ({ userId, role }: { userId: string; role: string }) => {
    const response = await api.put(`/users/${userId}/role`, null, {
      params: { role },
    });
    return response.data;
  },
};
