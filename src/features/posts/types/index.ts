// Interface loại bài viết (khớp với bảng post_types trong database)
export interface PostType {
  id: number;
  name: string;      // Tên hiển thị (Kiến thức, Bài tập, Project Log)
  code: string;      // Mã định danh dạng UPPERCASE (KIENTHUC, BAITAP, PROJECT_LOG, GENERAL...)
  description?: string | null;
}

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
