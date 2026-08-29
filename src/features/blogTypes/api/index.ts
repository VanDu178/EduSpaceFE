import api from '../../../services/api';
import type { BlogType, BlogTypePayload } from '../types';
import type { ApiResponse } from '../../../types/api';

const BASE_PATH = '/blog-types';

// API lấy danh sách thể loại bài blog (Endpoint: GET /blog-types)
export const fetchBlogTypesApi = async (): Promise<BlogType[]> => {
  const response = await api.get(`${BASE_PATH}`);
  if (response?.data?.success) {
    return response?.data?.data;
  }
  throw new Error(response?.data?.message || 'Không thể lấy danh sách thể loại bài blog');
};

// API tạo mới thể loại bài blog (Endpoint: POST /blog-types)
export const createBlogTypeApi = async (payload: BlogTypePayload): Promise<ApiResponse<BlogType>> => {
  const response = await api.post(`${BASE_PATH}`, payload);
  return response.data;
};

// API cập nhật thể loại bài blog (Endpoint: PUT /blog-types/:id)
export const updateBlogTypeApi = async (id: number, payload: BlogTypePayload): Promise<ApiResponse<BlogType>> => {
  const response = await api.put(`${BASE_PATH}/${id}`, payload);
  return response.data;
};

// API xóa thể loại bài blog (Endpoint: DELETE /blog-types/:id)
export const deleteBlogTypeApi = async (id: number): Promise<ApiResponse<null>> => {
  const response = await api.delete(`${BASE_PATH}/${id}`);
  return response.data;
};
