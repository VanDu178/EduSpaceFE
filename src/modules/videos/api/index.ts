import api from '../../../services/api';
import type { Video, VideoType, VideoPayload, VideoQueryParams } from '../types';
import type { ApiResponse, PaginatedData } from '../../../types/api';

const BASE_PATH = '/videos';

/**
 * API lấy danh sách 2 Loại Video cố định (Học thuật & Nhận định thị trường)
 */
export const fetchVideoTypesApi = async (): Promise<{ videoTypes: VideoType[] }> => {
  const response = await api.get(`${BASE_PATH}/types`);
  if (response?.data?.success) {
    return response.data.data;
  }
  throw new Error(response?.data?.message || 'Không thể lấy danh sách loại video');
};

/**
 * API lấy danh sách Video (Có phân trang, lọc, tìm kiếm)
 */
export const fetchVideosApi = async (
  params?: VideoQueryParams
): Promise<PaginatedData<{ videos: Video[] }>> => {
  const response = await api.get(`${BASE_PATH}`, { params });
  if (response?.data?.success) {
    return response.data.data;
  }
  throw new Error(response?.data?.message || 'Không thể lấy danh sách video');
};

/**
 * API lấy chi tiết 1 Video theo ID
 */
export const fetchVideoByIdApi = async (id: string): Promise<{ video: Video }> => {
  const response = await api.get(`${BASE_PATH}/${id}`);
  if (response?.data?.success) {
    return response.data.data;
  }
  throw new Error(response?.data?.message || 'Không thể lấy thông tin chi tiết video');
};

/**
 * API tạo mới Video
 */
export const createVideoApi = async (payload: VideoPayload): Promise<ApiResponse<{ video: Video }>> => {
  const response = await api.post(`${BASE_PATH}`, payload);
  return response?.data;
};

/**
 * API cập nhật thông tin Video
 */
export const updateVideoApi = async (
  id: string,
  payload: VideoPayload
): Promise<ApiResponse<{ video: Video }>> => {
  const response = await api.put(`${BASE_PATH}/${id}`, payload);
  return response?.data;
};

/**
 * API cập nhật nhanh trạng thái Video (draft / published / archived)
 */
export const updateVideoStatusApi = async (
  id: string,
  status: string
): Promise<ApiResponse<{ video: Video }>> => {
  const response = await api.patch(`${BASE_PATH}/${id}/status`, { status });
  return response?.data;
};

/**
 * API cập nhật nhanh quyền truy cập Video (isPremium: true/false)
 */
export const updateVideoAccessApi = async (
  id: string,
  isPremium: boolean,
  teaserDuration?: number
): Promise<ApiResponse<{ video: Video }>> => {
  const response = await api.patch(`${BASE_PATH}/${id}/access`, { isPremium, teaserDuration });
  return response?.data;
};

/**
 * API xóa Video theo ID
 */
export const deleteVideoApi = async (id: string): Promise<ApiResponse<{ id: string }>> => {
  const response = await api.delete(`${BASE_PATH}/${id}`);
  return response?.data;
};
