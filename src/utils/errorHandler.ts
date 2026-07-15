import type { AxiosError } from 'axios';
import type { FormInstance } from 'antd';
import type { ApiResponse } from '../types/api';
import { toast } from './toastHelper';

interface HandleErrorOptions {
  form?: FormInstance;
  customHandler?: (errorPayload: ApiResponse) => void;
  skipToast?: boolean;
}

/**
 * Hàm xử lý lỗi API chung cho Frontend (EduSpaceFE).
 * 
 * Quy trình xử lý:
 * 1. Nếu có callback `customHandler`, ưu tiên chuyển giao xử lý cho callback đó và dừng lại.
 * 2. Dạng 1: Nếu lỗi do Backend trả về có chứa danh sách trường lỗi validation (`errors`) và phía gọi API truyền vào `form` instance (Ant Design),
 *    tự động map các lỗi này tương ứng vào các ô nhập liệu của form thông qua `form.setFields(...)`.
 * 3. Dạng 2: Nếu không rơi vào các trường hợp trên, tự động toast thông điệp lỗi (sử dụng hàm toast.apiError được cấu hình sẵn).
 * 
 * @param error Lỗi nhận được từ Axios (AxiosError) chứa payload ApiResponse
 * @param options Cấu hình bổ sung (Ant Design FormInstance, Custom callback, skipToast)
 */
export const handleApiError = (
  error: AxiosError<ApiResponse>,
  options?: HandleErrorOptions
): void => {
  const errorPayload = error.response?.data;

  // 1. Kiểm tra nếu có truyền customHandler xử lý lỗi riêng biệt
  if (options?.customHandler && errorPayload) {
    options.customHandler(errorPayload);
    return;
  }

  // 2. Dạng 1: Kiểm tra lỗi validation theo từng trường dữ liệu (thuộc về form)
  if (errorPayload?.errors && options?.form) {
    const fields = Object.entries(errorPayload.errors).map(([fieldName, messages]) => ({
      name: fieldName,
      errors: Array.isArray(messages) ? messages : [String(messages)],
    }));

    // Gán lỗi trực tiếp lên Form của Ant Design
    options.form.setFields(fields);
    
    // Toast một cảnh báo chung nhẹ nhàng
    if (!options.skipToast) {
      toast.error(errorPayload.message || 'Thông tin nhập liệu không hợp lệ, vui lòng kiểm tra lại!');
    }
    return;
  }

  // 3. Dạng 2: Toast thông báo lỗi chung
  if (!options?.skipToast) {
    toast.apiError(error);
  }
};
