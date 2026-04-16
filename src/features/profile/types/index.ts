// src/features/profile/types.ts

// 1. Định nghĩa Role & Permission
export interface Permission {
  name: string;
  description: string;
}

export interface Role {
  name: string;
  description: string;
  permissions: Permission[];
}

// 2. Định nghĩa UserProfile (Khớp với JSON result)
export interface UserProfile {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  dob: string;
  imageUrl: string | null; // Có thể null
  email: string;
  phone: string;
  roles: Role[];
}

// 3. Định nghĩa cấu trúc phản hồi chung từ Server
export interface ApiResponse<T> {
  code: number;
  result: T; // Dữ liệu thật nằm ở đây
}

export interface BEFeedback {
  feedbackId: string;
  orderId: string;
  productId: string;
  productName: string;
  customerId: string;
  customerName: string;
  rating: number;
  comment: string;
  imageUrls: string[];
  createdAt: string;
  updatedAt: string;
}