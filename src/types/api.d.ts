// Định nghĩa kiểu dữ liệu phản hồi (Response) đồng bộ giữa Backend và Frontend.
export interface ApiResponse<T = unknown> {
  success: boolean;  // Trạng thái thành công hay thất bại của API
  data: T | null;    // Dữ liệu chính nhận được từ Backend (thể hiện bằng Generic Type T, có thể null khi có lỗi)
  message?: string;  // Thông báo kèm theo (đặc biệt hữu ích khi hiển thị thông báo thành công hoặc cảnh báo)
  errorCode?: string | null; // Mã lỗi hệ thống tự định nghĩa cho Frontend xử lý logic
  errors?: Record<string, string[]> | null; // Chứa thông tin lỗi chi tiết của từng trường input (ví dụ: validation errors)
}
