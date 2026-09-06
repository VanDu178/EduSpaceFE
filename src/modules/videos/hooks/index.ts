import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
  fetchVideosApi,
  fetchVideoTypesApi,
  createVideoApi,
  updateVideoApi,
  updateVideoStatusApi,
  updateVideoAccessApi,
  deleteVideoApi,
} from '../api';
import type { Video, VideoType, VideoPayload, VideoQueryParams } from '../types';
import type { PaginatedData } from '../../../types/api';

export const QUERY_KEY = ['videos'];
export const VIDEO_TYPES_QUERY_KEY = ['videoTypes'];

// Hook lấy danh sách loại video cố định
export const useVideoTypesQuery = () => {
  return useQuery<{ videoTypes: VideoType[] }>({
    queryKey: VIDEO_TYPES_QUERY_KEY,
    queryFn: fetchVideoTypesApi,
    staleTime: 5 * 60 * 1000, // Cache 5 phút
  });
};

// Hook lấy danh sách video có phân trang & bộ lọc
export const useVideosQuery = (params?: VideoQueryParams) => {
  return useQuery<PaginatedData<{ videos: Video[] }>>({
    queryKey: [...QUERY_KEY, params],
    queryFn: () => fetchVideosApi(params),
  });
};

// Hook mutation tạo video mới
export const useCreateVideoMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: VideoPayload) => createVideoApi(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      toast.success('Thêm mới thành công!');
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || err?.message || 'Thao tác thất bại!');
    },
  });
};

// Hook mutation cập nhật thông tin video
export const useUpdateVideoMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: VideoPayload }) => updateVideoApi(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      toast.success('Cập nhật thông tin thành công!');
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || err?.message || 'Thao tác thất bại!');
    },
  });
};

// Hook mutation cập nhật nhanh trạng thái video
export const useUpdateVideoStatusMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => updateVideoStatusApi(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      toast.success('Cập nhật trạng thái thành công!');
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || err?.message || 'Không thể cập nhật trạng thái');
    },
  });
};

// Hook mutation cập nhật nhanh quyền truy cập video (isPremium) và thời lượng xem thử
export const useUpdateVideoAccessMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isPremium, teaserDuration }: { id: string; isPremium: boolean; teaserDuration?: number }) =>
      updateVideoAccessApi(id, isPremium, teaserDuration),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      toast.success('Cập nhật quyền truy cập thành công!');
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || err?.message || 'Không thể cập nhật quyền truy cập');
    },
  });
};

// Hook mutation xóa video
export const useDeleteVideoMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteVideoApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      toast.success('Xóa bản ghi thành công!');
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || err?.message || 'Xóa bản ghi thất bại!');
    },
  });
};
