import api from '../../../services/api';
import type { PostType, PostTypePayload } from '../types';
import type { ApiResponse } from '../../../types/api';

// API lấy danh sách thể loại bài viết
export const fetchPostTypesApi = async (): Promise<PostType[]> => {
  const response = await api.get('/post-types');
  if (response?.data?.success) {
    return response?.data?.data;
  }
  throw new Error(response?.data?.message || 'Không thể lấy danh sách thể loại');
};

// API tạo mới thể loại (gọi từ Postman/mô phỏng nếu cần)
export const createPostTypeApi = async (payload: PostTypePayload): Promise<ApiResponse<PostType>> => {
  const response = await api.post('/post-types', payload);
  return response.data;
};

// API cập nhật thể loại
export const updatePostTypeApi = async (id: number, payload: PostTypePayload): Promise<ApiResponse<PostType>> => {
  const response = await api.put(`/post-types/${id}`, payload);
  return response.data;
};

// API xóa thể loại
export const deletePostTypeApi = async (id: number): Promise<ApiResponse<null>> => {
  const response = await api.delete(`/post-types/${id}`);
  return response.data;
};
