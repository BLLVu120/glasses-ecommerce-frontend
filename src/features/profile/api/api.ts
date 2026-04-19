import { api } from '@/lib/axios';
import type { ApiResponse, UserProfile } from '../types';

export const profileApi = {
  // 1. Lấy thông tin cá nhân
  getProfile: async (): Promise<UserProfile> => {
    // Gọi API (endpoint này tuỳ backend bạn, thường là /users/my-info hoặc /users/profile)
    const response = await api.get<ApiResponse<UserProfile>>('/users/me');

    // 🔥 QUAN TRỌNG: Trả về .result để Hook nhận đúng data UserProfile
    // Nếu không có .result, UI sẽ nhận cả cục { code: 0, result: ... } và bị lỗi
    return response.data.result;
  },

  // 2. Cập nhật thông tin cá nhân
  updateProfile: (data: FormData) => {
    return api.put('/profile', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  

  // 3. Thay đổi mật khẩu
  changePassword: (data: { currentPassword: string; newPassword: string }) => {
    return api.post('/profile/change-password', data);
  },

  // 4. Lấy đơn hàng của người dùng
  getOrders: async (page = 0, size = 10) => {
    const response = await api.get(
      `/orders/me?page=${page}&size=${size}&sortBy=createdAt&sortDir=desc`,
    );
    // Giả sử API trả về { result: { content: Order[] } } dựa trên curl của bạn
    return response.data.result;
  },

  // 5. Hủy đơn hàng (chỉ áp dụng cho PRE_ORDER chưa xử lý)
  cancelOrder: (orderId: string) => {
    return api.put(`/orders/${orderId}/cancel`);
  },

  // 6. Lấy địa chỉ của người dùng
  getAddresses: () => {
    return api.get('/profile/addresses');
  },

  // 6. Feedback APIs
  getFeedbackByOrder: (orderId: string) => {
    return api.get(`/feedbacks/order/${orderId}`);
  },

  getFeedbackDetail: (feedbackId: string) => {
    return api.get(`/feedbacks/${feedbackId}`);
  },

  getMyFeedbacks: () => {
    return api.get('/feedbacks/me');
  },

  createFeedback: (data: FormData) => {
    return api.post('/feedbacks', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  updateFeedback: (feedbackId: string, data: FormData) => {
    return api.put(`/feedbacks/${feedbackId}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  deleteFeedback: (feedbackId: string) => {
    return api.delete(`/feedbacks/${feedbackId}`);
  },
};
