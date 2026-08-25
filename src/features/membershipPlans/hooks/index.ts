import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import {
  fetchMembershipPlansApi,
  fetchMembershipPlanByIdApi,
  createMembershipPlanApi,
  updateMembershipPlanApi,
  toggleMembershipPlanStatusApi,
  deleteMembershipPlanApi,
} from '../api';
import type { MembershipPlan, MembershipPlanPayload, MembershipPlanParams } from '../types';
import type { ApiResponse } from '../../../types/api';
import { handleApiError } from '../../../utils/errorHandler';
import { toast } from '../../../utils/toastHelper';

// Custom hook truy vấn danh sách gói hội viên
export const useMembershipPlansQuery = (params?: MembershipPlanParams) => {
  return useQuery<MembershipPlan[]>({
    queryKey: ['membershipPlans', params],
    queryFn: () => fetchMembershipPlansApi(params),
  });
};

// Custom hook truy vấn chi tiết 1 gói hội viên
export const useMembershipPlanQuery = (idOrCode?: string | number) => {
  return useQuery<MembershipPlan>({
    queryKey: ['membershipPlan', idOrCode],
    queryFn: () => fetchMembershipPlanByIdApi(idOrCode!),
    enabled: Boolean(idOrCode),
  });
};

// Custom hook mutation tạo mới gói hội viên
export const useCreateMembershipPlanMutation = (
  onSuccessCallback?: () => void,
  onErrorCallback?: (error: AxiosError<ApiResponse>) => void
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createMembershipPlanApi,
    onSuccess: (res) => {
      if (res?.success) {
        toast.success(res.message || 'Tạo mới gói hội viên thành công!');
        queryClient.invalidateQueries({ queryKey: ['membershipPlans'] });
        if (onSuccessCallback) onSuccessCallback();
      } else {
        toast.error(res?.message || 'Tạo mới gói hội viên thất bại!');
      }
    },
    onError: (err: AxiosError<ApiResponse>) => {
      console.error('Create membership plan error:', err);
      if (onErrorCallback) {
        onErrorCallback(err);
      } else {
        handleApiError(err);
      }
    },
  });
};

// Custom hook mutation cập nhật gói hội viên
export const useUpdateMembershipPlanMutation = (
  onSuccessCallback?: () => void,
  onErrorCallback?: (error: AxiosError<ApiResponse>) => void
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: { id: number; data: MembershipPlanPayload }) =>
      updateMembershipPlanApi(variables.id, variables.data),
    onSuccess: (res) => {
      if (res?.success) {
        toast.success(res.message || 'Cập nhật gói hội viên thành công!');
        queryClient.invalidateQueries({ queryKey: ['membershipPlans'] });
        if (onSuccessCallback) onSuccessCallback();
      } else {
        toast.error(res?.message || 'Cập nhật gói hội viên thất bại!');
      }
    },
    onError: (err: AxiosError<ApiResponse>) => {
      console.error('Update membership plan error:', err);
      if (onErrorCallback) {
        onErrorCallback(err);
      } else {
        handleApiError(err);
      }
    },
  });
};


// Custom hook mutation kích hoạt / ẩn gói hội viên
export const useToggleMembershipPlanStatusMutation = (
  onSuccessCallback?: () => void,
  onErrorCallback?: (error: AxiosError<ApiResponse>) => void
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => toggleMembershipPlanStatusApi(id),
    onSuccess: (res) => {
      if (res?.success) {
        toast.success(res.message || 'Cập nhật trạng thái thành công!');
        queryClient.invalidateQueries({ queryKey: ['membershipPlans'] });
        if (onSuccessCallback) onSuccessCallback();
      } else {
        toast.error(res?.message || 'Cập nhật trạng thái thất bại!');
      }
    },
    onError: (err: AxiosError<ApiResponse>) => {
      console.error('Toggle status error:', err);
      if (onErrorCallback) {
        onErrorCallback(err);
      } else {
        handleApiError(err);
      }
    },
  });
};

// Custom hook mutation xóa gói hội viên
export const useDeleteMembershipPlanMutation = (
  onSuccessCallback?: () => void,
  onErrorCallback?: (error: AxiosError<ApiResponse>) => void
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteMembershipPlanApi(id),
    onSuccess: (res) => {
      if (res?.success) {
        toast.success(res.message || 'Xóa gói hội viên thành công!');
        queryClient.invalidateQueries({ queryKey: ['membershipPlans'] });
        if (onSuccessCallback) onSuccessCallback();
      } else {
        toast.error(res?.message || 'Xóa gói hội viên thất bại!');
      }
    },
    onError: (err: AxiosError<ApiResponse>) => {
      console.error('Delete membership plan error:', err);
      if (onErrorCallback) {
        onErrorCallback(err);
      } else {
        handleApiError(err);
      }
    },
  });
};
