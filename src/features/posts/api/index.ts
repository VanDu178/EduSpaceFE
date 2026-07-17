import api from '../../../services/api';
import type { Post, PostPayload, Params } from '../types';
import type { ApiResponse, PaginatedData } from '../../../types/api';

// Hàm gọi API lấy danh sách bài viết
export const fetchPostsApi = async (params?: Params): Promise<PaginatedData<{ posts: Post[] }>> => {
  const response = await api.get('/posts', { params });
  if (response.data.success) {
    return response.data.data;
  }
  throw new Error(response.data.message || 'Không thể lấy danh sách bài viết');
};

// Hàm gọi API tạo bài viết mới
export const createPostApi = async (newPost: PostPayload): Promise<ApiResponse<{ post: Post }>> => {
  const response = await api.post('/posts', newPost);
  return response.data;
};

// Hàm gọi API xóa bài viết
export const deletePostApi = async (id: number): Promise<ApiResponse<null>> => {
  const response = await api.delete(`/posts/${id}`);
  return response.data;
};

// Hàm gọi API cập nhật bài viết (RESTful PUT)
export const updatePostApi = async (
  id: number,
  updatedPost: PostPayload
): Promise<ApiResponse<{ post: Post }>> => {
  const response = await api.put(`/posts/${id}`, updatedPost);
  return response.data;
};
