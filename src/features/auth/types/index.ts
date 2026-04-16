import { z } from 'zod';

// ==========================================
// 1. ZOD SCHEMAS (Dùng để Validate dữ liệu)
// ==========================================

// --- Schema cho Login Form ---
export const LoginSchema = z.object({
  username: z.string().min(1, 'Vui lòng nhập tên đăng nhập'), // Backend check lỏng thì FE cũng check lỏng
  password: z.string().min(1, 'Vui lòng nhập mật khẩu'),
});

// Type suy luận từ Schema (Dùng cho React Hook Form)
export type LoginInput = z.infer<typeof LoginSchema>;

// --- Schema cho JWT Payload ---
// Dùng để kiểm tra dữ liệu bên trong Token sau khi decode
export const JwtPayloadSchema = z.object({
  sub: z.string(), // Username
  scope: z.string(), // Chuỗi chứa Roles
  userId: z.string().optional(), // Các trường này optional vì backend có thể chưa trả về
  fullName: z.string().optional(),
  exp: z.number(),
  iat: z.number(),
  jti: z.string(),
});

export type JwtPayload = z.infer<typeof JwtPayloadSchema>;

// ==========================================
// 2. INTERFACES (Dùng cho TypeScript)
// ==========================================

// --- API Response ---
export interface AuthResponse {
  token: string;
  authenticated: boolean;
}

// --- User Entity ---
export interface UserState {
  id: string;
  name: string;
  email: string;
  role: AllowedRoles;
  avatar?: string;
}
export type AllowedRoles = 'admin' | 'manager' | 'operation' | 'sale' | 'shipper' | 'customer';

// --- Store State ---
// Định nghĩa toàn bộ State và Action của Store
export interface AuthStore {
  user: UserState | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  refreshAction: () => Promise<void>;

  // Actions
  login: (username: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
  registerUser: (data: RegisterInput) => Promise<void>;
  redirectByRole: () => string;
}
export interface ApiResponse<T> {
  code: number;
  result: T;
}
export const RegisterSchema = z.object({
  username: z.string().min(4, 'Username phải có ít nhất 4 ký tự'),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
  firstName: z.string().min(1, 'Vui lòng nhập Họ'),
  lastName: z.string().min(1, 'Vui lòng nhập Tên'),
  // Thêm validate cho ngày sinh
  dob: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Ngày sinh không hợp lệ',
  }),
  // 👇 Thêm trường Email & Phone theo yêu cầu Backend
  email: z.email('Email không hợp lệ'),
  phone: z.string().min(9, 'Số điện thoại không hợp lệ'),

  // Ảnh đại diện — không bắt buộc
  imageFile: z.any().optional(),
});

// Tự động tạo type từ Schema
export type RegisterInput = z.infer<typeof RegisterSchema>;

export interface UserRegistrationResult {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  dob: string;
}