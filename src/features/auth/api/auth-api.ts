// src/features/auth/api/auth-api.ts
import { api } from '@/lib/axios';
import type {
  LoginInput,
  RegisterInput,
  AuthResponse,
  ApiResponse,
  UserRegistrationResult,
} from '../types';

export interface LogoutRequest {
  token: string;
}

export const authApi = {
  // 1. Login
  login: async (data: LoginInput): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', data);
    return response.data.result;
  },

  // 2. Register (MỚI)
  // Gửi đúng cấu trúc: { username, password, firstName, lastName, dob }
  register: async (data: RegisterInput): Promise<UserRegistrationResult> => {
    const formData = new FormData();

    // 1. Tách file ảnh ra riêng
    const { imageFile, ...userData } = data;

    // Backend yêu cầu field tên 'UserInfor' kiểu JSON blob
    const jsonBlob = new Blob([JSON.stringify(userData)], {
      type: 'application/json',
    });
    formData.append('UserInfor', jsonBlob);

    // 3. Xử lý phần file 'imageUrl'
    // Lưu ý: key phải là "imageUrl" như trong lệnh curl (-F 'imageUrl=@cam.jpg')
    if (imageFile && imageFile instanceof FileList && imageFile.length > 0) {
      formData.append('imageUrl', imageFile[0]);
    }

    // 4. Gửi Request
    // Axios tự động set Content-Type là multipart/form-data khi thấy FormData
    const response = (await api.post('/users/registration', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })) as ApiResponse<UserRegistrationResult>;

    return response.result;
  },

  // 3. Logout
  logout: (data: LogoutRequest): Promise<void> => {
    return api.post('/auth/logout', data);
  },

  // 4. Refresh token

  refreshToken: async (token: string): Promise<ApiResponse<AuthResponse>> => {
    const response = await api.post('/auth/refresh', { token });
    return response.data; // Trả về toàn bộ ApiResponse để Store xử lý .result
  },
};