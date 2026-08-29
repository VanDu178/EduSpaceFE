import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { fetchUsersApi, createUserApi, updateUserApi, resetPasswordApi, toggleUserStatusApi } from '../api';
import type { User, UserParams } from '../types';
import type { PaginatedData } from '../../../types/api';

export const QUERY_KEY = ['users'];

export const useUsersQuery = (params?: UserParams) => {
  return useQuery<PaginatedData<{ users: User[] }>>({
    queryKey: [...QUERY_KEY, params],
    queryFn: () => fetchUsersApi(params),
  });
};

// Hook mutation tạo người dùng mới
export const useCreateUserMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createUserApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      toast.success('Tạo tài khoản người dùng thành công!');
    },
    onError: (err: any) => {
      toast.error(err.message || 'Lỗi khi tạo tài khoản');
    }
  });
};

// Hook mutation cập nhật người dùng
export const useUpdateUserMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<User> }) => updateUserApi(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      toast.success('Cập nhật thông tin tài khoản thành công!');
    },
    onError: (err: any) => {
      toast.error(err.message || 'Lỗi khi cập nhật tài khoản');
    }
  });
};

// Hook mutation đặt lại mật khẩu
export const useResetPasswordMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => resetPasswordApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      toast.success('Đặt lại mật khẩu thành công!');
    },
    onError: (err: any) => {
      toast.error(err.message || 'Không thể đặt lại mật khẩu');
    }
  });
};

// Hook mutation cập nhật trạng thái hoạt động/khóa của user
export const useToggleUserStatusMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: 'active' | 'locked' }) => toggleUserStatusApi(id, status),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      toast.success(variables.status === 'locked' ? 'Khóa tài khoản thành công!' : 'Mở khóa tài khoản thành công!');
    },
    onError: (err: any) => {
      toast.error(err.message || 'Lỗi khi cập nhật trạng thái tài khoản');
    }
  });
};
