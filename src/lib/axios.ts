// src/lib/axios.ts
import { useAuthStore } from '@/features/auth/stores/useAuthStore';
import axios from 'axios';

const DEFAULT_API_URL = 'https://ge-optimis-production.up.railway.app/optics';

const rawBaseUrl = import.meta.env.VITE_API_URL || DEFAULT_API_URL;
const normalizedBaseUrl = rawBaseUrl.replace(/\/$/, '');

export const api = axios.create({
  baseURL: normalizedBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

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
