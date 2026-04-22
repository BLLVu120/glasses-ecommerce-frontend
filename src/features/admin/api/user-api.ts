import { api } from '@/lib/axios';

export type UserRole = 'SALE' | 'OPERATION' | 'CUSTOMER' | 'MANAGER' | 'ADMIN';

export type UserSummary = {
  id: string;
  username: string;
  email?: string | null;
  role: UserRole;
};

export const userApi = {
  getUsersByRole: async (role: UserRole) => {
    const response = await api.get(`/users`, { params: { role } });
    return (response.data.result || []) as UserSummary[];
  },

  deleteUser: async (id: string) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },

  assignRole: async ({ userId, role }: { userId: string; role: UserRole }) => {
    const response = await api.put(`/users/${userId}/role`, null, {
      params: { role },
    });
    return response.data;
  },
};
