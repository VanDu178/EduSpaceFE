import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
  fetchFeaturesApi,
  createFeatureApi,
  updateFeatureApi,
  updateFeatureSortOrderApi,
  toggleFeatureStatusApi,
  deleteFeatureApi,
} from '../api';
import type { Feature, FeaturePayload, FeatureQueryParams } from '../types';

export const QUERY_KEY = ['features'];

// Hook lấy danh sách tính năng
export const useFeaturesQuery = (params?: FeatureQueryParams) => {
  return useQuery<Feature[]>({
    queryKey: [...QUERY_KEY, params],
    queryFn: () => fetchFeaturesApi(params),
  });
};

// Hook tạo mới tính năng
export const useCreateFeatureMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: FeaturePayload) => createFeatureApi(payload),
    onSuccess: (res) => {
      if (res?.success) {
        toast.success(res.message || 'Tạo tính năng mới thành công!');
        queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      } else {
        toast.error(res?.message || 'Không thể tạo tính năng mới');
      }
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || err?.message || 'Đã xảy ra lỗi khi tạo tính năng');
    },
  });
};

// Hook cập nhật tính năng
export const useUpdateFeatureMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: FeaturePayload }) =>
      updateFeatureApi(id, payload),
    onSuccess: (res) => {
      if (res?.success) {
        toast.success(res.message || 'Cập nhật tính năng thành công!');
        queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      } else {
        toast.error(res?.message || 'Không thể cập nhật tính năng');
      }
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || err?.message || 'Đã xảy ra lỗi khi cập nhật tính năng');
    },
  });
};

// Hook cập nhật thứ tự tính năng
export const useUpdateFeatureSortOrderMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, sortOrder }: { id: number; sortOrder: number }) =>
      updateFeatureSortOrderApi(id, sortOrder),
    onSuccess: (res) => {
      if (res?.success) {
        toast.success(res.message || 'Cập nhật thứ tự thành công!');
        queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      } else {
        toast.error(res?.message || 'Không thể cập nhật thứ tự');
      }
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || err?.message || 'Lỗi khi cập nhật thứ tự');
    },
  });
};

// Hook bật/tắt trạng thái tính năng
export const useToggleFeatureStatusMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => toggleFeatureStatusApi(id),
    onSuccess: (res) => {
      if (res?.success) {
        toast.success(res.message || 'Cập nhật trạng thái thành công');
        queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      } else {
        toast.error(res?.message || 'Không thể cập nhật trạng thái');
      }
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || err?.message || 'Lỗi khi cập nhật trạng thái');
    },
  });
};

// Hook xóa tính năng
export const useDeleteFeatureMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteFeatureApi(id),
    onSuccess: (res) => {
      if (res?.success) {
        toast.success(res.message || 'Xóa tính năng thành công!');
        queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      } else {
        toast.error(res?.message || 'Không thể xóa tính năng');
      }
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || err?.message || 'Lỗi khi xóa tính năng');
    },
  });
};
