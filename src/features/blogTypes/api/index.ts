import api from '../../../services/api';
import type { BlogType, BlogTypePayload } from '../types';
import type { ApiResponse } from '../../../types/api';

// API lấy danh sách thể loại bài blog (Endpoint: GET /blog-types)
export const fetchBlogTypesApi = async (): Promise<BlogType[]> => {
  const response = await api.get('/blog-types');
  if (response?.data?.success) {
    return response?.data?.data;
  }
  throw new Error(response?.data?.message || 'Không thể lấy danh sách thể loại bài blog');
};

// API tạo mới thể loại bài blog (Endpoint: POST /blog-types)
export const createBlogTypeApi = async (payload: BlogTypePayload): Promise<ApiResponse<BlogType>> => {
  const response = await api.post('/blog-types', payload);
  return response.data;
};

// API cập nhật thể loại bài blog (Endpoint: PUT /blog-types/:id)
export const updateBlogTypeApi = async (id: number, payload: BlogTypePayload): Promise<ApiResponse<BlogType>> => {
  const response = await api.put(`/blog-types/${id}`, payload);
  return response.data;
};

// API xóa thể loại bài blog (Endpoint: DELETE /blog-types/:id)
export const deleteBlogTypeApi = async (id: number): Promise<ApiResponse<null>> => {
  const response = await api.delete(`/blog-types/${id}`);
  return response.data;
};
