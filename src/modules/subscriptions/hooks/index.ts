import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
  fetchSubscriptionsApi,
  fetchSubscriptionByIdApi,
  createSubscriptionApi,
  updateSubscriptionStatusApi,
  deleteSubscriptionApi,
} from '../api';
import type {
  UserSubscription,
  UserSubscriptionParams,
  CreateSubscriptionPayload,
  UpdateSubscriptionStatusPayload,
  FetchSubscriptionsResponse,
} from '../types';

export const QUERY_KEY = ['subscriptions'];

// Custom hook truy vấn danh sách đơn đăng ký gói dịch vụ
export const useSubscriptionsQuery = (params?: UserSubscriptionParams) => {
  return useQuery<FetchSubscriptionsResponse>({
    queryKey: [...QUERY_KEY, params],
    queryFn: () => fetchSubscriptionsApi(params),
  });
};

// Hook wrapper cho danh sách (backward-compatible)
export const useSubscriptions = (initialParams?: UserSubscriptionParams) => {
  const query = useSubscriptionsQuery(initialParams);
  return {
    items: query.data?.items || [],
    pagination: query.data?.pagination || {
      currentPage: 1,
      totalPages: 1,
      totalItems: 0,
      itemsPerPage: 10,
    },
    loading: query.isLoading || query.isFetching,
    refetch: query.refetch,
    data: query.data,
  };
};

// Custom hook truy vấn chi tiết 1 đơn đăng ký
export const useSubscriptionDetailQuery = (id?: number | null) => {
  return useQuery<UserSubscription>({
    queryKey: [...QUERY_KEY, id],
    queryFn: () => fetchSubscriptionByIdApi(id!),
    enabled: Boolean(id),
  });
};

// Hook wrapper cho chi tiết (backward-compatible)
export const useSubscriptionDetail = (id?: number | null) => {
  const query = useSubscriptionDetailQuery(id);
  return {
    data: query.data || null,
    loading: query.isLoading,
    refetch: query.refetch,
  };
};

// Custom hook mutation tạo mới đơn đăng ký gói dịch vụ
export const useCreateSubscriptionMutation = (
  onSuccessCallback?: () => void,
  onErrorCallback?: (err: any) => void
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateSubscriptionPayload) => createSubscriptionApi(payload),
    onSuccess: (res) => {
      if (res?.success) {
        toast.success(res.message || 'Cấp mới đơn đăng ký gói dịch vụ thành công');
        queryClient.invalidateQueries({ queryKey: QUERY_KEY });
        if (onSuccessCallback) onSuccessCallback();
      } else {
        toast.error(res?.message || 'Không thể đăng ký gói dịch vụ');
      }
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || err.message || 'Đã có lỗi xảy ra';
      toast.error(msg);
      if (onErrorCallback) onErrorCallback(err);
    },
  });
};

// Hook wrapper cho tạo mới (backward-compatible)
export const useCreateSubscription = (onSuccess?: () => void) => {
  const mutation = useCreateSubscriptionMutation(onSuccess);
  const createItem = async (payload: CreateSubscriptionPayload) => {
    try {
      const res = await mutation.mutateAsync(payload);
      return res?.success ?? false;
    } catch {
      return false;
    }
  };
  return { createItem, submitting: mutation.isPending };
};

// Custom hook mutation cập nhật trạng thái đơn đăng ký
export const useUpdateSubscriptionStatusMutation = (
  onSuccessCallback?: () => void,
  onErrorCallback?: (err: any) => void
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateSubscriptionStatusPayload }) =>
      updateSubscriptionStatusApi(id, payload),
    onSuccess: (res) => {
      if (res?.success) {
        toast.success(res.message || 'Cập nhật trạng thái thành công');
        queryClient.invalidateQueries({ queryKey: QUERY_KEY });
        if (onSuccessCallback) onSuccessCallback();
      } else {
        toast.error(res?.message || 'Không thể cập nhật trạng thái đơn đăng ký gói');
      }
    },
    onError: (err: any) => {
      console.error('Update subscription status error:', err);
      const msg = err.response?.data?.message || err.message || 'Đã có lỗi xảy ra';
      toast.error(msg);
      if (onErrorCallback) onErrorCallback(err);
    },
  });
};

// Hook wrapper cho cập nhật (backward-compatible)
export const useUpdateSubscriptionStatus = (onSuccess?: () => void) => {
  const mutation = useUpdateSubscriptionStatusMutation(onSuccess);
  const updateStatus = async (id: number, payload: UpdateSubscriptionStatusPayload) => {
    try {
      const res = await mutation.mutateAsync({ id, payload });
      return res?.success ?? false;
    } catch {
      return false;
    }
  };
  return { updateStatus, submitting: mutation.isPending };
};

// Custom hook mutation xóa gói hội viên thủ công
export const useDeleteSubscriptionMutation = (
  onSuccessCallback?: () => void,
  onErrorCallback?: (err: any) => void
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteSubscriptionApi(id),
    onSuccess: (res) => {
      if (res?.success) {
        toast.success(res.message || 'Xóa gói hội viên cấp thủ công thành công');
        queryClient.invalidateQueries({ queryKey: QUERY_KEY });
        if (onSuccessCallback) onSuccessCallback();
      } else {
        toast.error(res?.message || 'Không thể xóa gói hội viên');
      }
    },
    onError: (err: any) => {
      console.error('Delete subscription error:', err);
      const msg = err.response?.data?.message || err.message || 'Đã có lỗi xảy ra';
      toast.error(msg);
      if (onErrorCallback) onErrorCallback(err);
    },
  });
};

// Hook wrapper cho xóa (backward-compatible)
export const useDeleteSubscription = (onSuccess?: () => void) => {
  const mutation = useDeleteSubscriptionMutation(onSuccess);
  const deleteItem = async (id: number) => {
    try {
      const res = await mutation.mutateAsync(id);
      return res?.success ?? false;
    } catch {
      return false;
    }
  };
  return { deleteItem, submitting: mutation.isPending };
};
