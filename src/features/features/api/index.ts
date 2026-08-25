import api from '../../../services/api';
import type { Feature, FeaturePayload } from '../types';
import type { ApiResponse } from '../../../types/api';

// API Lấy danh sách tất cả các tính năng (Features)
export const fetchFeaturesApi = async (params?: { keyword?: string; status?: string }): Promise<Feature[]> => {
  const response = await api.get('/features', { params });
  if (response?.data?.success) {
    return response.data.data.features;
  }
  throw new Error(response?.data?.message || 'Không thể lấy danh sách tính năng');
};

// API Tạo mới tính năng
export const createFeatureApi = async (payload: FeaturePayload): Promise<ApiResponse<Feature>> => {
  const response = await api.post('/features', payload);
  return response?.data;
};

// API Cập nhật tính năng
export const updateFeatureApi = async (id: number, payload: FeaturePayload): Promise<ApiResponse<Feature>> => {
  const response = await api.put(`/features/${id}`, payload);
  return response?.data;
};

// API Bật/tắt trạng thái kích hoạt tính năng
export const toggleFeatureStatusApi = async (id: number): Promise<ApiResponse<Feature>> => {
  const response = await api.patch(`/features/${id}/status`);
  return response?.data;
};

// API Cập nhật thứ tự sắp xếp tính năng
export const updateFeatureSortOrderApi = async (id: number, sortOrder: number): Promise<ApiResponse<Feature>> => {
  const response = await api.patch(`/features/${id}/sort-order`, { sortOrder });
  return response?.data;
};

// API Xóa tính năng
export const deleteFeatureApi = async (id: number): Promise<ApiResponse<null>> => {
  const response = await api.delete(`/features/${id}`);
  return response?.data;
};

