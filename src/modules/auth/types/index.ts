import type { User } from '../../users/types';

// Payload yêu cầu Đăng nhập
export interface LoginPayload {
  email: string;
  password: string;
}

// Payload yêu cầu Đăng ký
export interface RegisterPayload {
  email: string;
  password: string;
  name: string;
}

// Kiểu dữ liệu phản hồi xác thực thành công từ backend
export interface AuthData {
  accessToken: string;
  user: User;
}
