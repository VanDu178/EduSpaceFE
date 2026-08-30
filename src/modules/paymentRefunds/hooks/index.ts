import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { fetchPaymentRefundsApi, createPaymentRefundApi, updatePaymentRefundApi } from '../api';
import { PAYMENT_TRANSACTIONS_QUERY_KEY } from '../../paymentTransactions/hooks';
import type {
  PaymentRefundParams,
  ConfirmRefundParams,
  UpdateRefundParams,
  FetchPaymentRefundsResponse,
} from '../types';

export const PAYMENT_REFUNDS_QUERY_KEY = ['paymentRefunds'];
export const QUERY_KEY = PAYMENT_REFUNDS_QUERY_KEY;

// Query danh sách phiếu hoàn tiền CSKH (Admin)
export const usePaymentRefundsQuery = (params?: PaymentRefundParams) => {
  return useQuery<FetchPaymentRefundsResponse>({
    queryKey: [...PAYMENT_REFUNDS_QUERY_KEY, params],
    queryFn: () => fetchPaymentRefundsApi(params),
  });
};

// Mutation tạo mới phiếu hoàn tiền CSKH
export const useCreatePaymentRefundMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (confirmParams: ConfirmRefundParams) => createPaymentRefundApi(confirmParams),
    onSuccess: (res) => {
      if (res?.success) {
        toast.success('Tạo phiếu hoàn tiền CSKH thành công!');
        queryClient.invalidateQueries({ queryKey: PAYMENT_REFUNDS_QUERY_KEY });
        queryClient.invalidateQueries({ queryKey: PAYMENT_TRANSACTIONS_QUERY_KEY });
      } else {
        toast.error(res?.message || 'Tạo phiếu hoàn tiền thất bại');
      }
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || err?.message || 'Lỗi khi tạo phiếu hoàn tiền');
    },
  });
};

// Mutation cập nhật phiếu hoàn tiền CSKH
export const useUpdatePaymentRefundMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, params }: { id: number; params: UpdateRefundParams }) =>
      updatePaymentRefundApi(id, params),
    onSuccess: (res) => {
      if (res?.success) {
        toast.success('Cập nhật phiếu hoàn tiền CSKH thành công!');
        queryClient.invalidateQueries({ queryKey: PAYMENT_REFUNDS_QUERY_KEY });
        queryClient.invalidateQueries({ queryKey: PAYMENT_TRANSACTIONS_QUERY_KEY });
      } else {
        toast.error(res?.message || 'Cập nhật phiếu hoàn tiền thất bại');
      }
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || err?.message || 'Lỗi khi cập nhật phiếu hoàn tiền');
    },
  });
};

