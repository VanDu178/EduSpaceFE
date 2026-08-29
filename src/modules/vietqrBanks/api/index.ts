import api from '../../../services/api';
import type { VietqrBank, VietqrBankQueryParams, SyncBankResultDto } from '../types';
import type { ApiResponse } from '../../../types/api';

const BASE_PATH = '/vietqr-banks';

// Lấy danh sách ngân hàng VietQR
export const fetchVietqrBanksApi = async (
  params?: VietqrBankQueryParams
): Promise<VietqrBank[]> => {
  const response = await api.get(`${BASE_PATH}`, { params });
  if (response?.data?.success) {
    return response.data.data.banks;
  }
  throw new Error(response?.data?.message || 'Không thể lấy danh sách ngân hàng VietQR');
};

// Lấy chi tiết thông tin ngân hàng theo ID
export const fetchVietqrBankByIdApi = async (
  id: number
): Promise<VietqrBank> => {
  const response = await api.get(`${BASE_PATH}/${id}`);
  if (response?.data?.success) {
    return response.data.data.bank;
  }
  throw new Error(response?.data?.message || 'Không thể lấy chi tiết thông tin ngân hàng');
};

// Đồng bộ danh sách ngân hàng từ VietQR API
export const syncVietqrBanksApi = async (): Promise<ApiResponse<SyncBankResultDto>> => {
  const response = await api.post(`${BASE_PATH}/sync`);
  return response?.data;
};

// Bật/tắt trạng thái kích hoạt của ngân hàng
export const toggleVietqrBankStatusApi = async (
  id: number
): Promise<ApiResponse<{ bank: VietqrBank }>> => {
  const response = await api.patch(`${BASE_PATH}/${id}/status`);
  return response?.data;
};
