import api from '../../../services/api';
import type {
  PaymentTransaction,
  PaymentTransactionParams,
  FetchPaymentTransactionsResponse,
  ConfirmRefundParams,
} from '../types';
import type { ApiResponse } from '../../../types/api';
import { createPaymentRefundApi } from '../../paymentRefunds';

const BASE_PATH = '/payment-transactions';

// API Lấy danh sách giao dịch VietQR (Admin)
export const fetchPaymentTransactionsApi = async (
  params?: PaymentTransactionParams
): Promise<FetchPaymentTransactionsResponse> => {
  const queryParams: Record<string, unknown> = {};
  if (params?.page) queryParams.page = params.page;
  if (params?.limit) queryParams.limit = params.limit;
  if (params?.status && params.status !== 'all') queryParams.status = params.status;
  if (params?.refundStatus && params.refundStatus !== 'all') queryParams.refundStatus = params.refundStatus;
  if (params?.search && params.search.trim() !== '') queryParams.search = params.search.trim();

  const response = await api.get(`${BASE_PATH}`, { params: queryParams });
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
  const response = await api.post(`${BASE_PATH}/${id}/approve`, { paymentRef });
  return response?.data;
};

// API CSKH Xác nhận tạo phiếu hoàn tiền cho giao dịch nạp dư (gọi qua module paymentRefunds)
export const confirmPaymentRefundApi = async (
  txId: number,
  params: Omit<ConfirmRefundParams, 'paymentTxId'>
): Promise<ApiResponse<any>> => {
  return await createPaymentRefundApi({
    ...params,
    paymentTxId: txId,
  });
};

// API Hủy giao dịch (Admin)
export const cancelPaymentTransactionApi = async (
  code: string
): Promise<ApiResponse<PaymentTransaction>> => {
  const response = await api.post(`${BASE_PATH}/cancel/${code}`);
  return response?.data;
};

// API Tải file PDF Hóa đơn (Admin)
export const downloadInvoicePdfApi = async (code: string): Promise<void> => {
  const response = await api.get(`${BASE_PATH}/${code}/pdf`, {
    responseType: 'blob',
  });
  const blob = new Blob([response.data], { type: 'application/pdf' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `Invoice-TradeVerse-${code}.pdf`);
  document.body.appendChild(link);
  link.click();
  link.parentNode?.removeChild(link);
  window.URL.revokeObjectURL(url);
};
