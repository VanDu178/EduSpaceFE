// Định nghĩa vai trò của người dùng
export type UserRole = 'admin' | 'client';

export type UserStatus = 'active' | 'locked';

// Interface thông tin người dùng / quản trị viên
export interface User {
  id: number;
  code?: string;
  email: string;
  name: string | null;
  role?: UserRole;
  status?: UserStatus;
  createdAt: string;
  updatedAt?: string;
}

// Interface tham số truy vấn phục vụ phân trang & bộ lọc
export interface UserParams {
  page?: number;
  limit?: number;
  keyword?: string;
  role?: string;
  status?: string;
}

