import { useMutation } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { loginApi, registerApi, logoutApi } from '../api';
import type { LoginPayload, RegisterPayload, AuthResponse } from '../types';
import type { ApiResponse } from '../../../types/api';
import { toast } from '../../../utils/toastHelper';

// Custom hook mutation Đăng nhập
export const useLoginMutation = (
  onSuccessCallback?: (data: AuthResponse) => void,
  onErrorCallback?: (error: AxiosError<ApiResponse>) => void
) => {
  return useMutation({
    mutationFn: (payload: LoginPayload) => loginApi(payload),
    onSuccess: (res) => {
      if (res.success && res.data) {
        toast.success('Đăng nhập hệ thống thành công!');
        // Lưu access token và thông tin user vào localStorage
        localStorage.setItem('accessToken', res?.data?.accessToken);
        localStorage.setItem('user', JSON.stringify(res?.data?.user));

        if (onSuccessCallback) onSuccessCallback(res?.data);
      } else {
        const errMsg = res?.message || 'Đăng nhập thất bại!';
        if (onErrorCallback) onErrorCallback({ response: { data: { message: errMsg } } } as AxiosError<ApiResponse>);
      }
    },
    onError: (err: AxiosError<ApiResponse>) => {
      if (onErrorCallback) {
        onErrorCallback(err);
      }
    },
  });
};

// Custom hook mutation Đăng ký
export const useRegisterMutation = (
  onSuccessCallback?: () => void,
  onErrorCallback?: (error: AxiosError<ApiResponse>) => void
) => {
  return useMutation({
    mutationFn: (payload: RegisterPayload) => registerApi(payload),
    onSuccess: (res) => {
      if (res.success) {
        toast.success('Đăng ký tài khoản quản trị thành công! Hãy đăng nhập.');
        if (onSuccessCallback) onSuccessCallback();
      } else {
        const errMsg = res.message || 'Đăng ký thất bại!';
        if (onErrorCallback) onErrorCallback({ response: { data: { message: errMsg } } } as AxiosError<ApiResponse>);
      }
    },
    onError: (err: AxiosError<ApiResponse>) => {
      console.error('Register hook error:', err);
      if (onErrorCallback) {
        onErrorCallback(err);
      }
    },
  });
};

// Custom hook mutation Đăng xuất
export const useLogoutMutation = (onSuccessCallback?: () => void) => {
  return useMutation({
    mutationFn: logoutApi,
    onSuccess: () => {
      toast.success('Đăng xuất hệ thống thành công!');
      cleanupSession(onSuccessCallback);
    },
    onError: (err: AxiosError<ApiResponse>) => {
      // Dù API lỗi vẫn xóa session để giải phóng giao diện
      cleanupSession(onSuccessCallback);
    },
  });
};

// Hàm phụ dọn dẹp localStorage và cookies
const cleanupSession = (callback?: () => void) => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('user');
  if (callback) callback();
};
