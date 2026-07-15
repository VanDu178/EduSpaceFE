import api from '../../../services/api';
import type { LoginPayload, RegisterPayload, AuthResponse } from '../types';
import type { ApiResponse } from '../../../types/api';

const BASE_URL = "/auth";

// Gọi API đăng nhập
export const loginApi = async (payload: LoginPayload): Promise<ApiResponse<AuthResponse>> => {
  const response = await api.post(`${BASE_URL}/login`, payload);
  return response.data;
};

// Gọi API đăng ký
export const registerApi = async (payload: RegisterPayload): Promise<ApiResponse<unknown>> => {
  const response = await api.post(`${BASE_URL}/register`, payload);
  return response.data;
};

// Gọi API đăng xuất
export const logoutApi = async (): Promise<ApiResponse<unknown>> => {
  const response = await api.post(`${BASE_URL}/logout`);
  return response.data;
};
