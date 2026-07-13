// Định nghĩa kiểu dữ liệu phản hồi (Response) đồng bộ giữa Backend và Frontend.
export interface ApiResponse<T = any> {
  success: boolean;  // Trạng thái thành công hay thất bại của API
  data: T;           // Dữ liệu chính nhận được từ Backend (thể hiện bằng Generic Type T)
  message?: string;  // Thông báo kèm theo (đặc biệt hữu ích khi hiển thị thông báo thành công hoặc cảnh báo)
  errors?: any;      // Chứa thông tin lỗi chi tiết (ví dụ: các lỗi validation của từng trường input)
}
