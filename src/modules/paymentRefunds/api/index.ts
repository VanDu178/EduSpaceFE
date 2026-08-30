import api from '../../../services/api';
import type {
  PaymentRefund,
  ConfirmRefundParams,
  UpdateRefundParams,
  PaymentRefundParams,
  FetchPaymentRefundsResponse,
} from '../types';
import type { ApiResponse } from '../../../types/api';

const BASE_PATH = '/payment-refunds';

// API Lấy danh sách phiếu hoàn tiền CSKH (Admin)
export const fetchPaymentRefundsApi = async (
  params?: PaymentRefundParams
): Promise<FetchPaymentRefundsResponse> => {
  const queryParams: Record<string, unknown> = {};
  if (params?.page) queryParams.page = params.page;
  if (params?.limit) queryParams.limit = params.limit;
  if (params?.search && params.search.trim() !== '') queryParams.search = params.search.trim();

  const response = await api.get(`${BASE_PATH}`, { params: queryParams });
  if (response?.data?.success) {
    return response.data.data;
  }
  throw new Error(response?.data?.message || 'Không thể lấy danh sách phiếu hoàn tiền');
};

// API CSKH Xác nhận tạo phiếu hoàn tiền cho giao dịch nạp dư (Admin)
export const createPaymentRefundApi = async (
  params: ConfirmRefundParams
): Promise<ApiResponse<PaymentRefund>> => {
  const response = await api.post(`${BASE_PATH}`, params);
  return response?.data;
};

// API CSKH Cập nhật thông tin phiếu hoàn tiền (Admin)
export const updatePaymentRefundApi = async (
  id: number,
  params: UpdateRefundParams
): Promise<ApiResponse<PaymentRefund>> => {
  const response = await api.put(`${BASE_PATH}/${id}`, params);
  return response?.data;
};

