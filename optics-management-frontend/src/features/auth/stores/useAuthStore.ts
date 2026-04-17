import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { jwtDecode } from 'jwt-decode';
import axios, { AxiosError } from 'axios';
import { authApi } from '../api/auth-api';

import {
  JwtPayloadSchema,
  type AuthStore,
  type UserState,
 
  type RegisterInput,
} from '../types';
import { queryClient } from '@/lib/react-query';

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      updateToken: (newToken: string) => set({ token: newToken }),

      // =====================
      // LOGIN
      // =====================
      // =====================
      // TRONG HÀM LOGIN
      // =====================
      login: async (username, password) => {
        set({ isLoading: true });
        try {
          const response = await authApi.login({ username, password });

          if (!response.authenticated || !response.token) {
            throw new Error('Xác thực thất bại');
          }

          const decodedRaw = jwtDecode(response.token);
          const decoded = JwtPayloadSchema.parse(decodedRaw);

          // BƯỚC SỬA: Mapping chuẩn theo type 'admin' | 'operations' | 'sales' | 'customer' | 'manager' | 'shipper'
          let userRole: UserState['role'] = 'customer'; // Mặc định là customer
          const scope = decoded.scope || '';

          if (scope.includes('ROLE_ADMIN')) {
            userRole = 'admin';
          } else if (scope.includes('ROLE_MANAGER')) {
            userRole = 'manager';
          } else if (scope.includes('ROLE_OPERATION')) {
            userRole = 'operation';
          } else if (scope.includes('ROLE_SALE')) {
            userRole = 'sale';
          } else if (scope.includes('ROLE_SHIPPER')) {
            userRole = 'shipper';
          } else {
            userRole = 'customer';
          }

          const userObj: UserState = {
            id: decoded.userId ?? decoded.sub,
            name: decoded.fullName ?? decoded.sub,
            email: decoded.sub,
            role: userRole, // Bây giờ đã khớp hoàn toàn với Type UserState
            avatar: `https://ui-avatars.com/api/?name=${decoded.fullName ?? decoded.sub}&background=random`,
          };

          set({
            user: userObj,
            token: response.token,
            isAuthenticated: true,
            isLoading: false,
          });

          // Refresh lại dữ liệu cache của React Query
          queryClient.invalidateQueries({
            queryKey: PROFILE_QUERY_KEY,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },
      redirectByRole: () => {
        const role = get().user?.role;
        if (!role) return '/';

        switch (role) {
          case 'admin':
            return '/admin';
          case 'manager':
            return '/manager';
          case 'operation':
            return '/ops-staff';
          case 'sale':
            return '/seller';
          case 'shipper':
            return '/shipper'; // nếu có
          default:
            return '/';
        }
      },

      // =====================
      // REGISTER
      // =====================
      registerUser: async (data: RegisterInput) => {
        set({ isLoading: true });
        try {
          await authApi.register(data);
          set({ isLoading: false });
        } catch (error: unknown) {
          set({ isLoading: false });

          if (error instanceof AxiosError) {
            const serverData = error.response?.data as { code: number; message?: string; result?: string };
            throw new Error(serverData?.message ?? serverData?.result ?? 'Đăng ký thất bại');
          }

          if (error instanceof Error) throw error;
          throw new Error('Có lỗi xảy ra khi tạo tài khoản');
        }
      },
      // Trong useAuthStore
      refreshAction: async () => {
        const currentToken = get().token;
        if (!currentToken || !get().isAuthenticated) return;

        const fetchWithRetry = async (retries = 3): Promise<string> => {
          try {
            const response = await authApi.refreshToken(currentToken); // gửi currentToken (Bearer hoặc body tùy backend)
            if (response.result?.token) {
              return response.result.token;
            }
            throw new Error('Không tìm thấy token mới');
          } catch (err) {
            if (
              axios.isAxiosError(err) &&
              (err.response?.status === 401 || err.response?.status === 403)
            ) {
              throw err; // token cũ chết thật → logout
            }
            if (retries > 0) {
              await new Promise((res) => setTimeout(res, 2000));
              return fetchWithRetry(retries - 1);
            }
            throw err;
          }
        };

        try {
          const newToken = await fetchWithRetry();
          set({ token: newToken });
          console.log('🔄 Token refreshed successfully');
        } catch (error) {
          console.error('🚨 Refresh failed, logging out...', error);
          get().logout();
        }
      },

      // =====================
      // LOGOUT
      // =====================
      logout: async () => {
        const currentToken = get().token;

        // 1. Logout server (best-effort)
        if (currentToken) {
          try {
            await authApi.logout({ token: currentToken });
          } catch (err) {
            console.warn('Lỗi logout server (bỏ qua):', err);
          }
        }

        // 2. 🔥 CLEAR TOÀN BỘ SERVER STATE
        queryClient.clear();

        // 3. Clear auth state
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },
    }),
    {
      name: 'optic-auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);