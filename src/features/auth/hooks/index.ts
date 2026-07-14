import { useMutation } from '@tanstack/react-query';
import { message } from 'antd';
import type { AxiosError } from 'axios';
import { loginApi, registerApi, logoutApi } from '../api';
import type { LoginPayload, RegisterPayload, AuthResponse } from '../types';

// Custom hook mutation Đăng nhập
export const useLoginMutation = (
  onSuccessCallback?: (data: AuthResponse) => void,
  onErrorCallback?: (errMsg: string) => void
) => {
  return useMutation({
    mutationFn: (payload: LoginPayload) => loginApi(payload),
    onSuccess: (res) => {
      if (res.success && res.data) {
        message.success('Đăng nhập hệ thống thành công!');
        // Lưu access token và thông tin user vào localStorage
        localStorage.setItem('accessToken', res.data.accessToken);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        
        if (onSuccessCallback) onSuccessCallback(res.data);
      } else {
        const errMsg = res.message || 'Đăng nhập thất bại!';
        message.error(errMsg);
        if (onErrorCallback) onErrorCallback(errMsg);
      }
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      console.error('Login hook error:', err);
      const errMsg = err.response?.data?.message || 'Đã xảy ra lỗi, vui lòng thử lại sau!';
      message.error(errMsg);
      if (onErrorCallback) onErrorCallback(errMsg);
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
        message.success('Đăng ký tài khoản quản trị thành công! Hãy đăng nhập.');
        if (onSuccessCallback) onSuccessCallback();
      } else {
        const errMsg = res.message || 'Đăng ký thất bại!';
        message.error(errMsg);
        if (onErrorCallback) onErrorCallback(errMsg);
      }
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      console.error('Register hook error:', err);
      const errMsg = err.response?.data?.message || 'Đã xảy ra lỗi khi đăng ký!';
      message.error(errMsg);
      if (onErrorCallback) onErrorCallback(errMsg);
    },
  });
};

// Custom hook mutation Đăng xuất
export const useLogoutMutation = (onSuccessCallback?: () => void) => {
  return useMutation({
    mutationFn: logoutApi,
    onSuccess: () => {
      message.success({ content: 'Đăng xuất hệ thống thành công!', key: 'logout_proc' });
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
