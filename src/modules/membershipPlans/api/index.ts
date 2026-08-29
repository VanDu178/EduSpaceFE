import api from '../../../services/api';
import { FILTER_STATUS } from '../constants';
import type { MembershipPlan, MembershipPlanPayload, MembershipPlanParams } from '../types';
import type { ApiResponse } from '../../../types/api';

const BASE_PATH = '/membership-plans';

// API Lấy danh sách gói hội viên
export const fetchMembershipPlansApi = async (
  params?: MembershipPlanParams
): Promise<MembershipPlan[]> => {
  const queryParams: Record<string, string> = {};
  if (params?.isActive && params.isActive !== FILTER_STATUS.ALL) {
    queryParams.isActive = params.isActive;
  }

  const response = await api.get(`${BASE_PATH}`, { params: queryParams });
  if (response?.data?.success) {
    return response.data.data;
  }
  throw new Error(response?.data?.message || 'Không thể lấy danh sách gói hội viên');
};

// API Lấy chi tiết gói hội viên theo ID hoặc Mã Code
export const fetchMembershipPlanByIdApi = async (
  idOrCode: string | number
): Promise<MembershipPlan> => {
  const response = await api.get(`${BASE_PATH}/${idOrCode}`);
  if (response?.data?.success) {
    return response.data.data;
  }
  throw new Error(response?.data?.message || 'Không thể lấy thông tin chi tiết gói hội viên');
};

// API Tạo mới gói hội viên
export const createMembershipPlanApi = async (
  payload: MembershipPlanPayload
): Promise<ApiResponse<MembershipPlan>> => {
  const response = await api.post(`${BASE_PATH}`, payload);
  return response?.data;
};

// API Cập nhật thông tin gói hội viên
export const updateMembershipPlanApi = async (
  id: number,
  payload: MembershipPlanPayload
): Promise<ApiResponse<MembershipPlan>> => {
  const response = await api.put(`${BASE_PATH}/${id}`, payload);
  return response?.data;
};

// API Đổi trạng thái kích hoạt/ẩn gói (isActive)
export const toggleMembershipPlanStatusApi = async (
  id: number
): Promise<ApiResponse<MembershipPlan>> => {
  const response = await api.patch(`${BASE_PATH}/${id}/status`);
  return response?.data;
};

// API Xóa gói hội viên
export const deleteMembershipPlanApi = async (
  id: number
): Promise<ApiResponse<null>> => {
  const response = await api.delete(`${BASE_PATH}/${id}`);
  return response?.data;
};
