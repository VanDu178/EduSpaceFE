// Định nghĩa vai trò của người dùng
export type UserRole = 'ADMIN' | 'USER' | 'TEACHER';

// Interface thông tin người dùng / quản trị viên
export interface User {
  id: number;
  email: string;
  name: string | null;
  role?: UserRole;
  createdAt: string;
  updatedAt?: string;
}
