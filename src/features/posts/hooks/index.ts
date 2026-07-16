import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { fetchPostsApi, createPostApi, deletePostApi, updatePostApi } from '../api';
import type { Post, PostPayload, PostType } from '../types';
import type { ApiResponse } from '../../../types/api';
import { handleApiError } from '../../../utils/errorHandler';
import { toast } from '../../../utils/toastHelper';

// Custom hook truy vấn danh sách bài viết
export const usePostsQuery = () => {
  return useQuery<Post[]>({
    queryKey: ['posts'],
    queryFn: fetchPostsApi,
  });
};

// Custom hook mutation tạo bài viết mới
export const useCreatePostMutation = (
  onSuccessCallback?: () => void,
  onErrorCallback?: (error: AxiosError<ApiResponse>) => void
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPostApi,
    onSuccess: (res) => {
      if (res.success) {
        toast.success('Tạo bài viết mới thành công!');
        queryClient.invalidateQueries({ queryKey: ['posts'] });
        if (onSuccessCallback) onSuccessCallback();
      } else {
        toast.error(res.message || 'Tạo bài viết thất bại!');
      }
    },
    onError: (err: AxiosError<ApiResponse>) => {
      console.error('Create post error:', err);
      if (onErrorCallback) {
        onErrorCallback(err);
      } else {
        handleApiError(err);
      }
    },
  });
};

// Custom hook mutation xóa bài viết
export const useDeletePostMutation = (
  onSuccessCallback?: () => void,
  onErrorCallback?: (error: AxiosError<ApiResponse>) => void
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePostApi,
    onSuccess: (res) => {
      if (res.success) {
        toast.success('Xóa bài viết thành công!');
        queryClient.invalidateQueries({ queryKey: ['posts'] });
        if (onSuccessCallback) onSuccessCallback();
      } else {
        toast.error(res.message || 'Xóa bài viết thất bại!');
      }
    },
    onError: (err: AxiosError<ApiResponse>) => {
      console.error('Delete post error:', err);
      if (onErrorCallback) {
        onErrorCallback(err);
      } else {
        handleApiError(err);
      }
    },
  });
};

// Custom hook mutation chỉnh sửa bài viết (có fallback mô phỏng nếu API PUT backend chưa viết)
export const useUpdatePostMutation = (
  selectedPostId: number | undefined,
  staticPostTypes: PostType[],
  onSuccessCallback?: () => void,
  onErrorCallback?: (error: AxiosError<ApiResponse>) => void
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: { id: number; data: PostPayload }) => updatePostApi(variables.id, variables.data),
    onSuccess: (res) => {
      if (res.success) {
        toast.success('Cập nhật bài viết thành công!');
        queryClient.invalidateQueries({ queryKey: ['posts'] });
        if (onSuccessCallback) onSuccessCallback();
      } else {
        toast.error(res.message || 'Cập nhật bài viết thất bại!');
      }
    },
    onError: (err: AxiosError<ApiResponse>, variables) => {
      // Phân biệt API chưa được viết (404, 501, 405) hoặc lỗi kết nối, và lỗi validation thực tế (400/422).
      const isNotImplemented = !err.response || [404, 405, 501].includes(err.response.status);

      if (isNotImplemented) {
        console.warn('PUT /posts/:id failed or not implemented yet. Using simulated success on frontend.', err);
        
        setTimeout(() => {
          toast.success('Cập nhật thành công (Giả lập phía giao diện, đang chờ API cập nhật của Backend)!');
          
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
      } else {
        if (onErrorCallback) {
          onErrorCallback(err);
        } else {
          handleApiError(err);
        }
      }
    }
  });
};
