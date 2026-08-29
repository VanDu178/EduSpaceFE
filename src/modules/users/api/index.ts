import api from '../../../services/api';
import type { User, UserParams } from '../types';
import type { PaginatedData } from '../../../types/api';

const BASE_PATH = '/users';

// Hàm gọi API lấy danh sách người dùng
export const fetchUsersApi = async (params?: UserParams): Promise<PaginatedData<{ users: User[] }>> => {
  const response = await api.get(`${BASE_PATH}`, { params });
  if (response?.data?.success) {
    return response?.data?.data;
  }
  throw new Error(response?.data?.message || 'Không thể tải danh sách người dùng');
};

// Hàm gọi API tạo tài khoản mới
export const createUserApi = async (data: Partial<User> & { password?: string }): Promise<User> => {
  const response = await api.post(`${BASE_PATH}`, data);
  if (response?.data?.success) {
    return response?.data?.data?.user;
  }
  throw new Error(response?.data?.message || 'Không thể tạo tài khoản');
};

// Hàm gọi API cập nhật tài khoản
export const updateUserApi = async (id: number, data: Partial<User>): Promise<User> => {
  const response = await api.put(`${BASE_PATH}/${id}`, data);
  if (response?.data?.success) {
    return response?.data?.data?.user;
  }
  throw new Error(response?.data?.message || 'Không thể cập nhật tài khoản');
};

// Hàm gọi API cập nhật trạng thái tài khoản (khóa / mở khóa)
export const toggleUserStatusApi = async (id: number, status: 'active' | 'locked'): Promise<User> => {
  const response = await api.put(`${BASE_PATH}/${id}/status`, { status });
  if (response?.data?.success) {
    return response?.data?.data?.user;
  }
  throw new Error(response?.data?.message || 'Không thể cập nhật trạng thái tài khoản');
};

export interface ResetPasswordResponse {
  email: string;
  newPassword: string;
  loginUrl: string;
}

// Hàm gọi API đặt lại mật khẩu
export const resetPasswordApi = async (id: number): Promise<ResetPasswordResponse> => {
  const response = await api.post(`${BASE_PATH}/${id}/reset-password`);
  if (response?.data?.success) {
    return response?.data?.data;
  }
  throw new Error(response?.data?.message || 'Không thể đặt lại mật khẩu');
};
