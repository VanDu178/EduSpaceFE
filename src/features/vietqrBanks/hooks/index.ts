import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '../../../utils/toastHelper';
import {
  fetchVietqrBanksApi,
  fetchVietqrBankByIdApi,
  syncVietqrBanksApi,
  toggleVietqrBankStatusApi,
} from '../api';
import type { VietqrBank, VietqrBankQueryParams } from '../types';

// Query danh sách ngân hàng VietQR theo bộ lọc
export const useVietqrBanksQuery = (params?: VietqrBankQueryParams) => {
  return useQuery<VietqrBank[]>({
    queryKey: ['vietqrBanks', params],
    queryFn: () => fetchVietqrBanksApi(params),
  });
};

// Query danh sách ngân hàng VietQR đang hoạt động
export const useActiveVietqrBanksQuery = () => {
  return useQuery<VietqrBank[]>({
    queryKey: ['vietqrBanks', { status: 'active' }],
    queryFn: () => fetchVietqrBanksApi({ status: 'active' }),
  });
};

// Query chi tiết ngân hàng theo ID
export const useVietqrBankDetailQuery = (id?: number) => {
  return useQuery<VietqrBank>({
    queryKey: ['vietqrBank', id],
    queryFn: () => fetchVietqrBankByIdApi(id!),
    enabled: !!id,
  });
};

// Mutation đồng bộ danh sách ngân hàng từ VietQR API
export const useSyncVietqrBanksMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => syncVietqrBanksApi(),
    onSuccess: (res) => {
      if (res?.success) {
        toast.success(res.message || 'Đồng bộ danh sách ngân hàng VietQR thành công');
        queryClient.invalidateQueries({ queryKey: ['vietqrBanks'] });
      } else {
        toast.error(res?.message || 'Đồng bộ thất bại');
      }
    },
    onError: (err: any) => {
      toast.apiError(err);
    },
  });
};

// Mutation bật/tắt trạng thái kích hoạt của ngân hàng
export const useToggleVietqrBankStatusMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => toggleVietqrBankStatusApi(id),
    onSuccess: (res) => {
      if (res?.success) {
        toast.success(res.message || 'Thay đổi trạng thái ngân hàng thành công');
        queryClient.invalidateQueries({ queryKey: ['vietqrBanks'] });
      } else {
        toast.error(res?.message || 'Không thể đổi trạng thái');
      }
    },
    onError: (err: any) => {
      toast.apiError(err);
    },
  });
};
