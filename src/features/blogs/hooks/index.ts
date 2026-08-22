import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import {
  fetchBlogsApi,
  createBlogApi,
  deleteBlogApi,
  updateBlogApi,
  updateBlogStatusApi,
  updateBlogAccessApi,
  fetchBlogByIdApi,
} from '../api';
import type { Blog, BlogPayload, Params } from '../types';
import type { BlogType } from '../../blogTypes';
import type { ApiResponse, PaginatedData } from '../../../types/api';
import { handleApiError } from '../../../utils/errorHandler';
import { toast } from '../../../utils/toastHelper';

// Custom hook truy vấn danh sách bài blog
export const useBlogsQuery = (params?: Params) => {
  return useQuery<PaginatedData<{ blogs: Blog[] }>>({
    queryKey: ['blogs', params],
    queryFn: () => fetchBlogsApi(params),
  });
};

// Custom hook truy vấn chi tiết bài blog theo ID hoặc Slug
export const useBlogQuery = (idOrSlug: string | number | undefined) => {
  return useQuery<{ blog: Blog }>({
    queryKey: ['blog', idOrSlug],
    queryFn: () => fetchBlogByIdApi(idOrSlug!),
    enabled: Boolean(idOrSlug),
  });
};

// Custom hook mutation tạo bài blog mới
export const useCreateBlogMutation = (
  onSuccessCallback?: () => void,
  onErrorCallback?: (error: AxiosError<ApiResponse>) => void
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createBlogApi,
    onSuccess: (res) => {
      if (res?.success) {
        toast.success('Tạo bài blog mới thành công!');
        queryClient.invalidateQueries({ queryKey: ['blogs'] });
        if (onSuccessCallback) onSuccessCallback();
      } else {
        toast.error(res?.message || 'Tạo bài blog thất bại!');
      }
    },
    onError: (err: AxiosError<ApiResponse>) => {
      console.error('Create blog error:', err);
      if (onErrorCallback) {
        onErrorCallback(err);
      } else {
        handleApiError(err);
      }
    },
  });
};

// Custom hook mutation xóa bài blog
export const useDeleteBlogMutation = (
  onSuccessCallback?: () => void,
  onErrorCallback?: (error: AxiosError<ApiResponse>) => void
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteBlogApi,
    onSuccess: (res) => {
      if (res?.success) {
        toast.success('Xóa bài blog thành công!');
        queryClient.invalidateQueries({ queryKey: ['blogs'] });
        if (onSuccessCallback) onSuccessCallback();
      } else {
        toast.error(res?.message || 'Xóa bài blog thất bại!');
      }
    },
    onError: (err: AxiosError<ApiResponse>) => {
      console.error('Delete blog error:', err);
      if (onErrorCallback) {
        onErrorCallback(err);
      } else {
        handleApiError(err);
      }
    },
  });
};

// Custom hook mutation cập nhật bài blog
export const useUpdateBlogMutation = (
  selectedBlogId: number | undefined,
  onSuccessCallback?: () => void,
  onErrorCallback?: (error: AxiosError<ApiResponse>) => void
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: { id: number; data: BlogPayload }) => updateBlogApi(variables?.id, variables?.data),
    onSuccess: (res) => {
      if (res?.success) {
        toast.success('Cập nhật bài blog thành công!');
        queryClient.invalidateQueries({ queryKey: ['blogs'] });
        if (onSuccessCallback) onSuccessCallback();
      } else {
        toast.error(res?.message || 'Cập nhật bài blog thất bại!');
      }
    },
    onError: (err: AxiosError<ApiResponse>, variables) => {
      const isNotImplemented = !err?.response || [404, 405, 501].includes(err?.response?.status);

      if (isNotImplemented) {
        console.warn('PUT /blogs/:id failed or not implemented yet. Using simulated fallback on frontend.', err);

        const blogTypes = queryClient.getQueryData<BlogType[]>(['blogTypes']) || [];

        setTimeout(() => {
          toast.success('Cập nhật thành công (Giả lập phía giao diện)!');

          queryClient.setQueryData(['blogs'], (oldData: any) => {
            if (!oldData) return undefined;

            const updateBlogInList = (list: Blog[]) =>
              list.map((b) =>
                b.id === selectedBlogId
                  ? {
                    ...b,
                    title: variables?.data?.title,
                    content: variables?.data?.content,
                    status: variables?.data?.status || b.status,
                    bannerUrl: variables?.data?.bannerUrl || b.bannerUrl,
                    thumbnailUrl: variables?.data?.thumbnailUrl || b.thumbnailUrl,
                    blogTypeId: variables?.data?.blogTypeId,
                    blogType: blogTypes.find((t) => t.id === variables?.data?.blogTypeId) || b.blogType,
                    updatedAt: new Date().toISOString(),
                  }
                  : b
              );

            if (Array.isArray(oldData)) {
              return updateBlogInList(oldData);
            }

            if (oldData?.blogs && Array.isArray(oldData?.blogs)) {
              return {
                ...oldData,
                blogs: updateBlogInList(oldData?.blogs),
              };
            }

            return oldData;
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
    },
  });
};

// Custom hook mutation cập nhật trạng thái bài blog
export const useUpdateBlogStatusMutation = (
  onSuccessCallback?: () => void,
  onErrorCallback?: (error: AxiosError<ApiResponse>) => void
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: { id: number; status: string }) =>
      updateBlogStatusApi(variables?.id, variables?.status),
    onSuccess: (res) => {
      if (res?.success) {
        toast.success('Cập nhật trạng thái bài blog thành công!');
        queryClient.invalidateQueries({ queryKey: ['blogs'] });
        if (onSuccessCallback) onSuccessCallback();
      } else {
        toast.error(res?.message || 'Cập nhật trạng thái bài blog thất bại!');
      }
    },
    onError: (err: AxiosError<ApiResponse>) => {
      console.error('Update blog status error:', err);
      if (onErrorCallback) {
        onErrorCallback(err);
      } else {
        handleApiError(err);
      }
    },
  });
};

// Custom hook mutation cập nhật quyền truy cập bài blog (isPremium: boolean)
export const useUpdateBlogAccessMutation = (
  onSuccessCallback?: () => void,
  onErrorCallback?: (error: AxiosError<ApiResponse>) => void
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: { id: number; isPremium: boolean }) =>
      updateBlogAccessApi(variables?.id, variables?.isPremium),
    onSuccess: (res) => {
      if (res?.success) {
        toast.success('Cập nhật quyền truy cập bài viết thành công!');
        queryClient.invalidateQueries({ queryKey: ['blogs'] });
        if (onSuccessCallback) onSuccessCallback();
      } else {
        toast.error(res?.message || 'Cập nhật quyền truy cập thất bại!');
      }
    },
    onError: (err: AxiosError<ApiResponse>) => {
      console.error('Update blog access error:', err);
      if (onErrorCallback) {
        onErrorCallback(err);
      } else {
        handleApiError(err);
      }
    },
  });
};

