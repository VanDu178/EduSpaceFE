export interface PostType {
  id: number;
  name: string;      // Tên hiển thị (Kiến thức, Bài tập, Project Log)
  code: string;      // Mã định danh dạng UPPERCASE (KIENTHUC, BAITAP, PROJECT_LOG, GENERAL...)
  description?: string | null;
}

export interface PostTypePayload {
  name: string;
  code: string;
  description?: string | null;
}
