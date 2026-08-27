import api from '../../../services/api';
import type { PaymentMethod, CreatePaymentMethodDto, UpdatePaymentMethodDto, PaymentMethodFilterParams } from '../types';
import type { ApiResponse } from '../../../types/api';

// API Lấy danh sách phương thức thanh toán cho Admin
export const fetchPaymentMethodsApi = async (params?: PaymentMethodFilterParams): Promise<PaymentMethod[]> => {
  const response = await api.get('/payment-methods', { params });
  if (response?.data?.success) {
    return response.data.data.paymentMethods;
  }
  throw new Error(response?.data?.message || 'Không thể lấy danh sách phương thức thanh toán');
};

// API Lấy danh sách phương thức thanh toán kích hoạt cho Client Checkout
export const fetchActivePaymentMethodsApi = async (): Promise<PaymentMethod[]> => {
  const response = await api.get('/payment-methods/active');
  if (response?.data?.success) {
    return response.data.data.paymentMethods;
  }
  throw new Error(response?.data?.message || 'Không thể lấy danh sách phương thức thanh toán khả dụng');
};

// API Lấy chi tiết
export const fetchPaymentMethodByIdApi = async (id: number): Promise<PaymentMethod> => {
  const response = await api.get(`/payment-methods/${id}`);
  if (response?.data?.success) {
    return response.data.data.paymentMethod;
  }
  throw new Error(response?.data?.message || 'Không thể lấy chi tiết phương thức thanh toán');
};

// API Tạo mới
export const createPaymentMethodApi = async (payload: CreatePaymentMethodDto): Promise<ApiResponse<PaymentMethod>> => {
  const response = await api.post('/payment-methods', payload);
  return response?.data;
};

// API Cập nhật
export const updatePaymentMethodApi = async (id: number, payload: UpdatePaymentMethodDto): Promise<ApiResponse<PaymentMethod>> => {
  const response = await api.put(`/payment-methods/${id}`, payload);
  return response?.data;
};

// API Bật/tắt trạng thái
export const togglePaymentMethodStatusApi = async (id: number): Promise<ApiResponse<PaymentMethod>> => {
  const response = await api.patch(`/payment-methods/${id}/status`);
  return response?.data;
};

// API Xóa
export const deletePaymentMethodApi = async (id: number): Promise<ApiResponse<null>> => {
  const response = await api.delete(`/payment-methods/${id}`);
  return response?.data;
};

// API Cập nhật thứ tự sắp xếp
export const updatePaymentMethodSortOrderApi = async (id: number, sortOrder: number): Promise<ApiResponse<PaymentMethod>> => {
  const response = await api.patch(`/payment-methods/${id}/sort-order`, { sortOrder });
  return response?.data;
};
