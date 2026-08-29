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
import type { ApiResponse, PaginatedData } from '../../../types/api';
import { handleApiError } from '../../../utils/errorHandler';
import { toast } from '../../../utils/toastHelper';

export const QUERY_KEY = ['blogs'];

// Custom hook truy vấn danh sách bài blog
export const useBlogsQuery = (params?: Params) => {
  return useQuery<PaginatedData<{ blogs: Blog[] }>>({
    queryKey: [...QUERY_KEY, params],
    queryFn: () => fetchBlogsApi(params),
  });
};

// Custom hook truy vấn chi tiết bài blog theo ID (Admin)
export const useBlogQuery = (id: number | string | undefined) => {
  return useQuery<{ blog: Blog }>({
    queryKey: [...QUERY_KEY, id],
    queryFn: () => fetchBlogByIdApi(id!),
    enabled: Boolean(id),
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
        queryClient.invalidateQueries({ queryKey: QUERY_KEY });
        if (onSuccessCallback) onSuccessCallback();
      } else {
        toast.error(res?.message || 'Tạo bài blog thất bại!');
      }
    },
    onError: (err: AxiosError<ApiResponse>) => {
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
        queryClient.invalidateQueries({ queryKey: QUERY_KEY });
        if (onSuccessCallback) onSuccessCallback();
      } else {
        toast.error(res?.message || 'Xóa bài blog thất bại!');
      }
    },
    onError: (err: AxiosError<ApiResponse>) => {
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
  onSuccessCallback?: () => void,
  onErrorCallback?: (error: AxiosError<ApiResponse>) => void
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: { id: number; data: BlogPayload }) => updateBlogApi(variables?.id, variables?.data),
    onSuccess: (res) => {
      if (res?.success) {
        toast.success('Cập nhật bài blog thành công!');
        queryClient.invalidateQueries({ queryKey: QUERY_KEY });
        if (onSuccessCallback) onSuccessCallback();
      } else {
        toast.error(res?.message || 'Cập nhật bài blog thất bại!');
      }
    },
    onError: (err: AxiosError<ApiResponse>) => {
      if (onErrorCallback) {
        onErrorCallback(err);
      } else {
        handleApiError(err);
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
        queryClient.invalidateQueries({ queryKey: QUERY_KEY });
        if (onSuccessCallback) onSuccessCallback();
      } else {
        toast.error(res?.message || 'Cập nhật trạng thái bài blog thất bại!');
      }
    },
    onError: (err: AxiosError<ApiResponse>) => {
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
        queryClient.invalidateQueries({ queryKey: QUERY_KEY });
        if (onSuccessCallback) onSuccessCallback();
      } else {
        toast.error(res?.message || 'Cập nhật quyền truy cập thất bại!');
      }
    },
    onError: (err: AxiosError<ApiResponse>) => {
      if (onErrorCallback) {
        onErrorCallback(err);
      } else {
        handleApiError(err);
      }
    },
  });
};

