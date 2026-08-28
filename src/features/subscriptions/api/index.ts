import api from '../../../services/api';
import type {
  UserSubscription,
  UserSubscriptionParams,
  CreateSubscriptionPayload,
  UpdateSubscriptionStatusPayload,
  FetchSubscriptionsResponse,
} from '../types';
import type { ApiResponse } from '../../../types/api';

// API Lấy danh sách đăng ký & thanh toán (Admin)
export const fetchSubscriptionsApi = async (
  params?: UserSubscriptionParams
): Promise<FetchSubscriptionsResponse> => {
  const queryParams: Record<string, unknown> = {};
  if (params?.page) queryParams.page = params.page;
  if (params?.limit) queryParams.limit = params.limit;
  if (params?.userId) queryParams.userId = params.userId;
  if (params?.status && params.status !== 'all') queryParams.status = params.status;
  if (params?.search && params.search.trim() !== '') queryParams.search = params.search.trim();

  const response = await api.get('/subscriptions', { params: queryParams });
  if (response?.data?.success) {
    return response.data.data;
  }
  throw new Error(response?.data?.message || 'Không thể lấy danh sách đăng ký gói dịch vụ');
};

// API Lấy chi tiết đơn đăng ký theo ID
export const fetchSubscriptionByIdApi = async (
  id: number
): Promise<UserSubscription> => {
  const response = await api.get(`/subscriptions/${id}`);
  if (response?.data?.success) {
    return response.data.data;
  }
  throw new Error(response?.data?.message || 'Không thể lấy thông tin chi tiết đơn đăng ký gói dịch vụ');
};

// API Tạo mới đơn đăng ký / Cấp gói hội viên (Admin/User)
export const createSubscriptionApi = async (
  payload: CreateSubscriptionPayload
): Promise<ApiResponse<UserSubscription>> => {
  const response = await api.post('/subscriptions', payload);
  return response?.data;
};

// API Cập nhật trạng thái đơn đăng ký (Admin)
export const updateSubscriptionStatusApi = async (
  id: number,
  payload: UpdateSubscriptionStatusPayload
): Promise<ApiResponse<UserSubscription>> => {
  const response = await api.patch(`/subscriptions/${id}/status`, payload);
  return response?.data;
};
