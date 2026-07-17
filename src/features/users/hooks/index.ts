import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchUsersApi, createUserApi, updateUserApi, resetPasswordApi } from '../api';
import type { User, UserParams } from '../types';
import type { PaginatedData } from '../../../types/api';


export const useUsersQuery = (params?: UserParams) => {
  return useQuery<PaginatedData<{ users: User[] }>>({
    queryKey: ['users', params],
    queryFn: () => fetchUsersApi(params),
  });
};

// Hook mutation tạo người dùng mới
export const useCreateUserMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createUserApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    }
  });
};

// Hook mutation cập nhật người dùng
export const useUpdateUserMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<User> }) => updateUserApi(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    }
  });
};

// Hook mutation đặt lại mật khẩu
export const useResetPasswordMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => resetPasswordApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    }
  });
};
