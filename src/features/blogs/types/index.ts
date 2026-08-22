import type { BlogType } from '../../blogTypes';
export type { BlogType };

// Interface bài blog đầy đủ đồng bộ với database backend
export interface Blog {
  id: number;
  code?: string;
  title: string;
  slug?: string;
  blogTypeId: number;
  bannerUrl?: string | null;
  thumbnailUrl?: string | null;
  isPremium?: boolean;
  summary?: string | null;
  content?: string | null;
  publishedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  createdBy?: number | null;
  status: string; // 'draft' | 'published' | 'archived'
  blogType?: BlogType;
  creator?: {
    id: number;
    code?: string;
    name: string;
    email?: string;
  } | null;
}

// Interface dữ liệu khi tạo/cập nhật bài blog
export interface BlogPayload {
  title: string;
  slug?: string;
  blogTypeId: number;
  bannerUrl?: string | null;
  thumbnailUrl?: string | null;
  isPremium?: boolean;
  summary?: string | null;
  content?: string | null;
  publishedAt?: string | null;
  status?: string;
}

// Interface tham số truy vấn danh sách bài blog
export interface Params {
  page?: number;
  limit?: number;
  keyword?: string;
  blogType?: string; // Mã thể loại UPPERCASE (code)
  status?: string;   // Trạng thái bài blog ('ALL' | 'draft' | 'published' | 'archived')
  isPremium?: string;
}
