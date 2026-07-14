import api from '../../../services/api';
import type { LoginPayload, RegisterPayload, AuthResponse } from '../types';
import type { ApiResponse } from '../../../types/api';

// Gọi API đăng nhập
export const loginApi = async (payload: LoginPayload): Promise<ApiResponse<AuthResponse>> => {
  const response = await api.post('/auth/login', payload);
  return response.data;
};

// Gọi API đăng ký
export const registerApi = async (payload: RegisterPayload): Promise<ApiResponse<unknown>> => {
  const response = await api.post('/auth/register', payload);
  return response.data;
};

// Gọi API đăng xuất
export const logoutApi = async (): Promise<ApiResponse<unknown>> => {
  const response = await api.post('/auth/logout');
  return response.data;
};
