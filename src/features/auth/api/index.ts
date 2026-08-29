import api from '../../../services/api';
import type { LoginPayload, RegisterPayload, AuthData } from '../types';
import type { ApiResponse } from '../../../types/api';
import type { User } from '../../users/types';

const BASE_PATH = '/auth';

// Gọi API đăng nhập
export const loginApi = async (payload: LoginPayload): Promise<ApiResponse<AuthData>> => {
  const response = await api.post(`${BASE_PATH}/login`, payload);
  return response?.data;
};

// Gọi API đăng ký
export const registerApi = async (payload: RegisterPayload): Promise<ApiResponse<User>> => {
  const response = await api.post(`${BASE_PATH}/register`, payload);
  return response?.data;
};

// Gọi API đăng xuất
export const logoutApi = async (): Promise<ApiResponse<null>> => {
  const response = await api.post(`${BASE_PATH}/logout`);
  return response?.data;
};
