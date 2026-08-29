import api from '../../../services/api';
import type {
  PaymentAccount,
  CreatePaymentAccountDto,
  UpdatePaymentAccountDto,
  PaymentAccountQueryParams
} from '../types';
import type { ApiResponse } from '../../../types/api';

const BASE_PATH = '/payment-accounts';

// API Lấy danh sách tài khoản thanh toán
export const fetchPaymentAccountsApi = async (
  params?: PaymentAccountQueryParams
): Promise<PaymentAccount[]> => {
  const response = await api.get(`${BASE_PATH}`, { params });
  if (response?.data?.success) {
    return response.data.data.paymentAccounts;
  }
  throw new Error(response?.data?.message || 'Không thể lấy danh sách tài khoản thanh toán');
};

// API Lấy chi tiết tài khoản thanh toán theo ID
export const fetchPaymentAccountByIdApi = async (
  id: number
): Promise<PaymentAccount> => {
  const response = await api.get(`${BASE_PATH}/${id}`);
  if (response?.data?.success) {
    return response.data.data.paymentAccount;
  }
  throw new Error(response?.data?.message || 'Không thể lấy chi tiết tài khoản thanh toán');
};

// API Tạo mới tài khoản thanh toán
export const createPaymentAccountApi = async (
  payload: CreatePaymentAccountDto
): Promise<ApiResponse<PaymentAccount>> => {
  const response = await api.post(`${BASE_PATH}`, payload);
  return response?.data;
};

// API Cập nhật tài khoản thanh toán
export const updatePaymentAccountApi = async (
  id: number,
  payload: UpdatePaymentAccountDto
): Promise<ApiResponse<PaymentAccount>> => {
  const response = await api.put(`${BASE_PATH}/${id}`, payload);
  return response?.data;
};

// API Bật/tắt trạng thái kích hoạt tài khoản thanh toán
export const togglePaymentAccountStatusApi = async (
  id: number
): Promise<ApiResponse<PaymentAccount>> => {
  const response = await api.patch(`${BASE_PATH}/${id}/status`);
  return response?.data;
};

// API Đặt làm tài khoản thanh toán mặc định
export const setDefaultPaymentAccountApi = async (
  id: number
): Promise<ApiResponse<PaymentAccount>> => {
  const response = await api.patch(`${BASE_PATH}/${id}/set-default`);
  return response?.data;
};

// API Xóa tài khoản thanh toán
export const deletePaymentAccountApi = async (
  id: number
): Promise<ApiResponse<null>> => {
  const response = await api.delete(`${BASE_PATH}/${id}`);
  return response?.data;
};
