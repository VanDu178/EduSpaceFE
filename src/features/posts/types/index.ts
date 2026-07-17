import type { PostType } from '../../postTypes';
export type { PostType };

// Interface bài viết đầy đủ
export interface Post {
  id: number;
  title: string;
  content: string | null;     // Nội dung bài viết chi tiết
  summary?: string | null;    // Mô tả ngắn (Frontend bổ trợ)
  thumbnail?: string | null;  // Đường dẫn ảnh đại diện hoặc mã hóa Base64
  published: boolean;         // Trạng thái xuất bản
  postTypeId: number;         // ID thể loại liên kết
  postType?: PostType;        // Đối tượng thể loại liên kết
  createdAt: string;          // Ngày đăng bài
  updatedAt: string;          // Ngày cập nhật
}

// Interface dữ liệu khi tạo/cập nhật bài viết
export interface PostPayload {
  title: string;
  content: string;
  published: boolean;
  postTypeId: number;
  summary?: string | null;
  thumbnail?: string | null;
}

// Interface tham số truy vấn bài viết phục vụ phân trang & bộ lọc
export interface Params {
  page?: number;
  limit?: number;
  keyword?: string;
  postType?: string;
}

