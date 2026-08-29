import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '../../../utils/toastHelper';
import {
  fetchPaymentAccountsApi,
  createPaymentAccountApi,
  updatePaymentAccountApi,
  togglePaymentAccountStatusApi,
  setDefaultPaymentAccountApi,
  deletePaymentAccountApi,
} from '../api';
import { useActiveVietqrBanksQuery } from '../../vietqrBanks/hooks';
import type {
  PaymentAccount,
  CreatePaymentAccountDto,
  UpdatePaymentAccountDto,
  PaymentAccountQueryParams,
} from '../types';

export { useActiveVietqrBanksQuery };

export const QUERY_KEY = ['paymentAccounts'];

// Query danh sách tài khoản thanh toán
export const usePaymentAccountsQuery = (params?: PaymentAccountQueryParams) => {
  return useQuery<PaymentAccount[]>({
    queryKey: [...QUERY_KEY, params],
    queryFn: () => fetchPaymentAccountsApi(params),
  });
};

// Mutation tạo mới tài khoản thanh toán
export const useCreatePaymentAccountMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (values: CreatePaymentAccountDto) => createPaymentAccountApi(values),
    onSuccess: (res) => {
      if (res?.success) {
        toast.success('Thêm mới thành công');
        queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      } else {
        toast.error(res?.message || 'Thêm mới thất bại');
      }
    },
    onError: (err: any) => {
      toast.error(err?.message || 'Đã xảy ra lỗi khi thêm mới');
    },
  });
};

// Mutation cập nhật tài khoản thanh toán
export const useUpdatePaymentAccountMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, values }: { id: number; values: UpdatePaymentAccountDto }) =>
      updatePaymentAccountApi(id, values),
    onSuccess: (res) => {
      if (res?.success) {
        toast.success('Cập nhật thành công');
        queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      } else {
        toast.error(res?.message || 'Cập nhật thất bại');
      }
    },
    onError: (err: any) => {
      toast.error(err?.message || 'Đã xảy ra lỗi khi cập nhật');
    },
  });
};

// Mutation đổi trạng thái kích hoạt/khóa tài khoản thanh toán
export const useTogglePaymentAccountStatusMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => togglePaymentAccountStatusApi(id),
    onSuccess: (res) => {
      if (res?.success) {
        toast.success(res.message || 'Đã cập nhật trạng thái');
        queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      } else {
        toast.error(res?.message || 'Cập nhật trạng thái thất bại');
      }
    },
    onError: (err: any) => {
      toast.error(err?.message || 'Lỗi khi cập nhật trạng thái');
    },
  });
};

// Mutation thiết lập tài khoản làm mặc định
export const useSetDefaultPaymentAccountMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => setDefaultPaymentAccountApi(id),
    onSuccess: (res) => {
      if (res?.success) {
        toast.success(res?.message || 'Đã cập nhật trạng thái mặc định');
        queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      } else {
        toast.error(res?.message || 'Không thể cập nhật trạng thái mặc định');
      }
    },
    onError: (err: any) => {
      toast.error(err?.message || 'Đã xảy ra lỗi');
    },
  });
};

// Mutation xóa tài khoản thanh toán
export const useDeletePaymentAccountMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deletePaymentAccountApi(id),
    onSuccess: (res) => {
      if (res?.success) {
        toast.success('Xóa bản ghi thành công');
        queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      } else {
        toast.error(res?.message || 'Xóa bản ghi thất bại');
      }
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || err?.message || 'Đã xảy ra lỗi khi xóa');
    },
  });
};
