import api from '../../../services/api';
import type { PaymentMethod, CreatePaymentMethodDto, UpdatePaymentMethodDto, PaymentMethodFilterParams } from '../types';
import type { ApiResponse } from '../../../types/api';


const BASE_PATH = '/payment-methods';

// API Lấy danh sách phương thức thanh toán cho Admin
export const fetchPaymentMethodsApi = async (params?: PaymentMethodFilterParams): Promise<PaymentMethod[]> => {
  const response = await api.get(`${BASE_PATH}`, { params });
  if (response?.data?.success) {
    return response.data.data.paymentMethods;
  }
  throw new Error(response?.data?.message || 'Không thể lấy danh sách phương thức thanh toán');
};

// API Lấy danh sách phương thức thanh toán kích hoạt cho Client Checkout
export const fetchActivePaymentMethodsApi = async (): Promise<PaymentMethod[]> => {
  const response = await api.get(`${BASE_PATH}/active`);
  if (response?.data?.success) {
    return response.data.data.paymentMethods;
  }
  throw new Error(response?.data?.message || 'Không thể lấy danh sách phương thức thanh toán khả dụng');
};

// API Lấy chi tiết
export const fetchPaymentMethodByIdApi = async (id: number): Promise<PaymentMethod> => {
  const response = await api.get(`${BASE_PATH}/${id}`);
  if (response?.data?.success) {
    return response.data.data.paymentMethod;
  }
  throw new Error(response?.data?.message || 'Không thể lấy chi tiết phương thức thanh toán');
};

// API Tạo mới
export const createPaymentMethodApi = async (payload: CreatePaymentMethodDto): Promise<ApiResponse<PaymentMethod>> => {
  console.log('Tạo phương thức thanh toán:', payload);
  const response = await api.post(`${BASE_PATH}`, payload);
  return response?.data;
};

// API Cập nhật
export const updatePaymentMethodApi = async (id: number, payload: UpdatePaymentMethodDto): Promise<ApiResponse<PaymentMethod>> => {
  const response = await api.put(`${BASE_PATH}/${id}`, payload);
  return response?.data;
};

// API Bật/tắt trạng thái
export const togglePaymentMethodStatusApi = async (id: number): Promise<ApiResponse<PaymentMethod>> => {
  const response = await api.patch(`${BASE_PATH}/${id}/status`);
  return response?.data;
};

// API Xóa
export const deletePaymentMethodApi = async (id: number): Promise<ApiResponse<null>> => {
  const response = await api.delete(`${BASE_PATH}/${id}`);
  return response?.data;
};

// API Cập nhật thứ tự sắp xếp
export const updatePaymentMethodSortOrderApi = async (id: number, sortOrder: number): Promise<ApiResponse<PaymentMethod>> => {
  const response = await api.patch(`${BASE_PATH}/${id}/sort-order`, { sortOrder });
  return response?.data;
};
