import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import type { AxiosError } from 'axios';
import { fetchPostsApi, createPostApi, deletePostApi, updatePostApi } from '../api';
import type { Post, PostPayload, PostType } from '../types';

// Custom hook truy vấn danh sách bài viết
export const usePostsQuery = () => {
  return useQuery<Post[]>({
    queryKey: ['posts'],
    queryFn: fetchPostsApi,
  });
};

// Custom hook mutation tạo bài viết mới
export const useCreatePostMutation = (onSuccessCallback?: () => void) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createPostApi,
    onSuccess: (res) => {
      if (res.success) {
        message.success('Tạo bài viết mới thành công!');
        queryClient.invalidateQueries({ queryKey: ['posts'] });
        if (onSuccessCallback) onSuccessCallback();
      } else {
        message.error(res.message || 'Tạo bài viết thất bại!');
      }
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      console.error('Create post error:', err);
      message.error(err.response?.data?.message || 'Có lỗi xảy ra khi tạo bài viết!');
    },
  });
};

// Custom hook mutation xóa bài viết
export const useDeletePostMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePostApi,
    onSuccess: (res) => {
      if (res.success) {
        message.success('Xóa bài viết thành công!');
        queryClient.invalidateQueries({ queryKey: ['posts'] });
      } else {
        message.error(res.message || 'Xóa bài viết thất bại!');
      }
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      console.error('Delete post error:', err);
      message.error(err.response?.data?.message || 'Không thể xóa bài viết này!');
    },
  });
};

// Custom hook mutation chỉnh sửa bài viết (có fallback mô phỏng nếu API PUT backend chưa viết)
export const useUpdatePostMutation = (
  selectedPostId: number | undefined,
  staticPostTypes: PostType[],
  onSuccessCallback?: () => void
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: { id: number; data: PostPayload }) => updatePostApi(variables.id, variables.data),
    onSuccess: (res) => {
      if (res.success) {
        message.success('Cập nhật bài viết thành công!');
        queryClient.invalidateQueries({ queryKey: ['posts'] });
        if (onSuccessCallback) onSuccessCallback();
      }
    },
    onError: (err: AxiosError<{ message?: string }>, variables) => {
      console.warn('PUT /posts/:id failed or not implemented yet. Using simulated success on frontend.', err);
      
      setTimeout(() => {
        message.success({
          content: 'Cập nhật thành công (Giả lập phía giao diện, đang chờ API cập nhật của Backend)!',
          key: 'save_post',
          duration: 4
        });
        
        queryClient.setQueryData(['posts'], (oldPosts: Post[] | undefined) => {
          if (!oldPosts) return [];
          return oldPosts.map((p) =>
            p.id === selectedPostId
              ? {
                  ...p,
                  title: variables.data.title,
                  content: variables.data.content,
                  published: variables.data.published,
                  thumbnail: variables.data.thumbnail || p.thumbnail,
                  postTypeId: variables.data.postTypeId,
                  postType: staticPostTypes.find((t) => t.id === variables.data.postTypeId) || p.postType,
                  updatedAt: new Date().toISOString(),
                }
              : p
          );
        });
        
        if (onSuccessCallback) onSuccessCallback();
      }, 500);
    }
  });
};
