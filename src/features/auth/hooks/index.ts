import { useMutation } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { loginApi, registerApi, logoutApi } from '../api';
import type { LoginPayload, RegisterPayload, AuthResponse } from '../types';
import { toast } from '../../../utils/toastHelper';

// Custom hook mutation Đăng nhập
export const useLoginMutation = (
  onSuccessCallback?: (data: AuthResponse) => void,
  onErrorCallback?: (errMsg: string) => void
) => {
  return useMutation({
    mutationFn: (payload: LoginPayload) => loginApi(payload),
    onSuccess: (res) => {
      if (res.success && res.data) {
        toast.success('Đăng nhập hệ thống thành công!');
        // Lưu access token và thông tin user vào localStorage
        localStorage.setItem('accessToken', res.data.accessToken);
        localStorage.setItem('user', JSON.stringify(res.data.user));

        if (onSuccessCallback) onSuccessCallback(res.data);
      } else {
        const errMsg = res.message || 'Đăng nhập thất bại!';
        toast.error(errMsg);
        if (onErrorCallback) onErrorCallback(errMsg);
      }
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      if (onErrorCallback) {
        const errMsg = err.response?.data?.message || 'Đăng nhập thất bại!';
        onErrorCallback(errMsg);
      }
    },
  });
};

// Custom hook mutation Đăng ký
export const useRegisterMutation = (
  onSuccessCallback?: () => void,
  onErrorCallback?: (errMsg: string) => void
) => {
  return useMutation({
    mutationFn: (payload: RegisterPayload) => registerApi(payload),
    onSuccess: (res) => {
      if (res.success) {
        toast.success('Đăng ký tài khoản quản trị thành công! Hãy đăng nhập.');
        if (onSuccessCallback) onSuccessCallback();
      } else {
        const errMsg = res.message || 'Đăng ký thất bại!';
        toast.error(errMsg);
        if (onErrorCallback) onErrorCallback(errMsg);
      }
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      console.error('Register hook error:', err);
      // Lỗi đã được Axios Interceptor tự động hiển thị qua toast.apiError
      if (onErrorCallback) {
        const errMsg = err.response?.data?.message || 'Đăng ký thất bại!';
        onErrorCallback(errMsg);
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
    onError: (err) => {
      console.error('Logout hook error:', err);
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
