import api from '../../../services/api';
import type {
  PaymentTransaction,
  PaymentTransactionParams,
  FetchPaymentTransactionsResponse,
} from '../types';
import type { ApiResponse } from '../../../types/api';

// API Lấy danh sách giao dịch VietQR (Admin)
export const fetchPaymentTransactionsApi = async (
  params?: PaymentTransactionParams
): Promise<FetchPaymentTransactionsResponse> => {
  const queryParams: Record<string, unknown> = {};
  if (params?.page) queryParams.page = params.page;
  if (params?.limit) queryParams.limit = params.limit;
  if (params?.status && params.status !== 'all') queryParams.status = params.status;
  if (params?.search && params.search.trim() !== '') queryParams.search = params.search.trim();

  const response = await api.get('/payment-transactions', { params: queryParams });
  if (response?.data?.success) {
    return response.data.data;
  }
  throw new Error(response?.data?.message || 'Không thể lấy danh sách giao dịch thanh toán');
};

// API Duyệt thanh toán thủ công (Admin)
export const approvePaymentTransactionApi = async (
  id: number,
  paymentRef?: string
): Promise<ApiResponse<PaymentTransaction>> => {
  const response = await api.post(`/payment-transactions/${id}/approve`, { paymentRef });
  return response?.data;
};

// API Hủy giao dịch (Admin)
export const cancelPaymentTransactionApi = async (
  code: string
): Promise<ApiResponse<PaymentTransaction>> => {
  const response = await api.post(`/payment-transactions/cancel/${code}`);
  return response?.data;
};
