import api from '../../../services/api';
import type { User } from '../types';

// Hàm gọi API lấy danh sách người dùng
export const fetchUsersApi = async (): Promise<User[]> => {
  const response = await api.get('/users');
  if (response.data.success) {
    return response.data.data.users;
  }
  throw new Error(response.data.message || 'Không thể tải danh sách người dùng');
};
