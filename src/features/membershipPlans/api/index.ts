import api from '../../../services/api';
import type { MembershipPlan, MembershipPlanPayload, MembershipPlanParams } from '../types';
import type { ApiResponse } from '../../../types/api';

// API Lấy danh sách gói hội viên
export const fetchMembershipPlansApi = async (
  params?: MembershipPlanParams
): Promise<MembershipPlan[]> => {
  const queryParams: Record<string, string> = {};
  if (params?.isActive && params.isActive !== 'all') {
    queryParams.isActive = params.isActive;
  }

  const response = await api.get('/membership-plans', { params: queryParams });
  if (response?.data?.success) {
    return response.data.data;
  }
  throw new Error(response?.data?.message || 'Không thể lấy danh sách gói hội viên');
};

// API Lấy chi tiết gói hội viên theo ID hoặc Mã Code
export const fetchMembershipPlanByIdApi = async (
  idOrCode: string | number
): Promise<MembershipPlan> => {
  const response = await api.get(`/membership-plans/${idOrCode}`);
  if (response?.data?.success) {
    return response.data.data;
  }
  throw new Error(response?.data?.message || 'Không thể lấy thông tin chi tiết gói hội viên');
};

// API Tạo mới gói hội viên
export const createMembershipPlanApi = async (
  payload: MembershipPlanPayload
): Promise<ApiResponse<MembershipPlan>> => {
  const response = await api.post('/membership-plans', payload);
  return response?.data;
};

// API Cập nhật thông tin gói hội viên
export const updateMembershipPlanApi = async (
  id: number,
  payload: MembershipPlanPayload
): Promise<ApiResponse<MembershipPlan>> => {
  const response = await api.put(`/membership-plans/${id}`, payload);
  return response?.data;
};

// API Cập nhật thứ tự hiển thị (sortOrder)
export const updateMembershipPlanSortOrderApi = async (
  id: number,
  sortOrder: number
): Promise<ApiResponse<MembershipPlan>> => {
  const response = await api.patch(`/membership-plans/${id}/sort-order`, { sortOrder });
  return response?.data;
};

// API Đổi trạng thái kích hoạt/ẩn gói (isActive)
export const toggleMembershipPlanStatusApi = async (
  id: number
): Promise<ApiResponse<MembershipPlan>> => {
  const response = await api.patch(`/membership-plans/${id}/status`);
  return response?.data;
};

// API Xóa gói hội viên
export const deleteMembershipPlanApi = async (
  id: number
): Promise<ApiResponse<null>> => {
  const response = await api.delete(`/membership-plans/${id}`);
  return response?.data;
};
