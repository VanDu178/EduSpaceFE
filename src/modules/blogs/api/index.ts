import api from '../../../services/api';
import type { Blog, BlogPayload, Params } from '../types';
import type { ApiResponse, PaginatedData } from '../../../types/api';

const BASE_PATH = '/blogs';

// API lấy danh sách bài blog (Admin)
export const fetchBlogsApi = async (params?: Params): Promise<PaginatedData<{ blogs: Blog[] }>> => {
  const response = await api.get(`${BASE_PATH}/admin`, { params });
  if (response?.data?.success) {
    return response?.data?.data;
  }
  throw new Error(response?.data?.message || 'Không thể lấy danh sách bài blog');
};

// API tạo mới bài blog
export const createBlogApi = async (newBlog: BlogPayload): Promise<ApiResponse<{ blog: Blog }>> => {
  const response = await api.post(`${BASE_PATH}`, newBlog);
  return response?.data;
};

// API xóa bài blog
export const deleteBlogApi = async (id: number): Promise<ApiResponse<null>> => {
  const response = await api.delete(`${BASE_PATH}/${id}`);
  return response?.data;
};

// API cập nhật bài blog
export const updateBlogApi = async (
  id: number,
  updatedBlog: BlogPayload
): Promise<ApiResponse<{ blog: Blog }>> => {
  const response = await api.put(`${BASE_PATH}/${id}`, updatedBlog);
  return response?.data;
};

// API cập nhật trạng thái bài blog (status: 'draft' | 'published' | 'archived')
export const updateBlogStatusApi = async (
  id: number,
  status: string
): Promise<ApiResponse<{ blog: Blog }>> => {
  const response = await api.patch(`${BASE_PATH}/${id}/status`, { status });
  return response?.data;
};

// API cập nhật quyền truy cập bài blog (isPremium: true/false)
export const updateBlogAccessApi = async (
  id: number,
  isPremium: boolean
): Promise<ApiResponse<{ blog: Blog }>> => {
  const response = await api.patch(`${BASE_PATH}/${id}/access`, { isPremium });
  return response?.data;
};


// API lấy chi tiết bài blog theo ID
export const fetchBlogByIdApi = async (id: number | string): Promise<{ blog: Blog }> => {
  const response = await api.get(`${BASE_PATH}/id/${id}`);
  if (response?.data?.success) {
    return response?.data?.data;
  }
  throw new Error(response?.data?.message || 'Không thể lấy thông tin chi tiết bài blog');
};
