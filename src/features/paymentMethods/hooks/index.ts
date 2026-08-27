import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import {
  fetchPaymentMethodsApi,
  fetchActivePaymentMethodsApi,
  createPaymentMethodApi,
  updatePaymentMethodApi,
  togglePaymentMethodStatusApi,
  deletePaymentMethodApi,
  updatePaymentMethodSortOrderApi,
} from '../api';
import type { PaymentMethodFilterParams, CreatePaymentMethodDto, UpdatePaymentMethodDto } from '../types';

export const PAYMENT_METHODS_QUERY_KEY = ['paymentMethods'];

// Hook lấy danh sách cho Admin
export const usePaymentMethodsQuery = (params?: PaymentMethodFilterParams) => {
  return useQuery({
    queryKey: [...PAYMENT_METHODS_QUERY_KEY, params],
    queryFn: () => fetchPaymentMethodsApi(params),
  });
};

// Hook lấy danh sách kích hoạt cho Client Checkout
export const useActivePaymentMethodsQuery = () => {
  return useQuery({
    queryKey: [...PAYMENT_METHODS_QUERY_KEY, 'active'],
    queryFn: fetchActivePaymentMethodsApi,
  });
};

// Hook tạo mới
export const useCreatePaymentMethodMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreatePaymentMethodDto) => createPaymentMethodApi(payload),
    onSuccess: (res) => {
      if (res.success) {
        message.success(res.message || 'Thêm mới thành công!');
        queryClient.invalidateQueries({ queryKey: PAYMENT_METHODS_QUERY_KEY });
      } else {
        message.error(res.message || 'Có lỗi xảy ra');
      }
    },
    onError: (err: any) => {
      message.error(err.response?.data?.message || err.message || 'Có lỗi xảy ra');
    },
  });
};

// Hook cập nhật
export const useUpdatePaymentMethodMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdatePaymentMethodDto }) =>
      updatePaymentMethodApi(id, payload),
    onSuccess: (res) => {
      if (res.success) {
        message.success(res.message || 'Cập nhật thành công!');
        queryClient.invalidateQueries({ queryKey: PAYMENT_METHODS_QUERY_KEY });
      } else {
        message.error(res.message || 'Có lỗi xảy ra');
      }
    },
    onError: (err: any) => {
      message.error(err.response?.data?.message || err.message || 'Có lỗi xảy ra');
    },
  });
};

// Hook cập nhật thứ tự sắp xếp
export const useUpdatePaymentMethodSortOrderMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, sortOrder }: { id: number; sortOrder: number }) =>
      updatePaymentMethodSortOrderApi(id, sortOrder),
    onSuccess: (res) => {
      if (res.success) {
        message.success(res.message || 'Cập nhật thứ tự thành công!');
        queryClient.invalidateQueries({ queryKey: PAYMENT_METHODS_QUERY_KEY });
      } else {
        message.error(res.message || 'Có lỗi xảy ra');
      }
    },
    onError: (err: any) => {
      message.error(err.response?.data?.message || err.message || 'Có lỗi xảy ra');
    },
  });
};

// Hook bật/tắt nhanh
export const useTogglePaymentMethodStatusMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => togglePaymentMethodStatusApi(id),
    onSuccess: (res) => {
      if (res.success) {
        message.success(res.message || 'Cập nhật trạng thái thành công!');
        queryClient.invalidateQueries({ queryKey: PAYMENT_METHODS_QUERY_KEY });
      } else {
        message.error(res.message || 'Có lỗi xảy ra');
      }
    },
    onError: (err: any) => {
      message.error(err.response?.data?.message || err.message || 'Có lỗi xảy ra');
    },
  });
};

// Hook xóa
export const useDeletePaymentMethodMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deletePaymentMethodApi(id),
    onSuccess: (res) => {
      if (res.success) {
        message.success(res.message || 'Xóa thành công!');
        queryClient.invalidateQueries({ queryKey: PAYMENT_METHODS_QUERY_KEY });
      } else {
        message.error(res.message || 'Có lỗi xảy ra');
      }
    },
    onError: (err: any) => {
      message.error(err.response?.data?.message || err.message || 'Có lỗi xảy ra');
    },
  });
};
