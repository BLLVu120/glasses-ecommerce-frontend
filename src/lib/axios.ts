// src/lib/axios.ts
import { useAuthStore } from '@/features/auth/stores/useAuthStore';
import { USE_MOCK } from '@/services/api';
import { mockApi } from '@/services/mockApi';
import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const realAdapter = api.defaults.adapter;
if (USE_MOCK) {
  api.defaults.adapter = async (config) => {
    return (await mockApi.handle(config as any)) as any;
  };
} else if (realAdapter) {
  api.defaults.adapter = realAdapter;
}

// 1. Request Interceptor: Gắn Token
api.interceptors.request.use(
  (config) => {
    // Gọi .getState() để lấy dữ liệu store bên ngoài React Component
    const token = useAuthStore.getState().token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// 2. Response Interceptor: Xử lý data và lỗi 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Nếu lỗi 401 (Unauthorized) -> Token hết hạn hoặc không hợp lệ
    if (error.response?.status === 401) {
      // Thực hiện logout để xóa token cũ và redirect về login
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  },
);
