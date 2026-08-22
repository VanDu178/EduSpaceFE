import type { Params } from '../types';

export interface BlogBadgeConfig {
  label: string;
  color: string;
  textClass: string;
}


export const DEFAULT_PARAMS: Params = {
  page: 1,
  limit: 10,
  keyword: '',
  blogType: 'ALL',
  status: 'ALL',
  isPremium: 'ALL'
};

// Cấu hình màu cho Trạng thái bài viết
export const BLOG_STATUS_CONFIG: Record<string, BlogBadgeConfig> = {
  published: {
    label: 'Đã xuất bản',
    color: 'success',
    textClass: 'text-emerald-600',
  },
  draft: {
    label: 'Bản nháp',
    color: 'warning',
    textClass: 'text-amber-600',
  },
  archived: {
    label: 'Lưu trữ',
    color: 'default',
    textClass: 'text-slate-500',
  },
};

// Cấu hình màu cho Quyền truy cập bài viết
export const BLOG_ACCESS_CONFIG: Record<'premium' | 'free', BlogBadgeConfig> = {
  premium: {
    label: 'Trả phí',
    color: 'gold',
    textClass: 'text-amber-600',
  },
  free: {
    label: 'Miễn phí',
    color: 'blue',
    textClass: 'text-sky-600',
  },
};

// Cấu hình màu cho Thể loại bài viết theo mã (Code)
export const BLOG_TYPE_COLOR_MAP: Record<string, BlogBadgeConfig> = {
  MINDSET: {
    label: 'Mindset',
    color: 'purple',
    textClass: 'text-purple-600',
  },
  METHODOLOGY: {
    label: 'Methodology',
    color: 'cyan',
    textClass: 'text-cyan-600',
  },
  QUANT: {
    label: 'Quant',
    color: 'magenta',
    textClass: 'text-magenta-600',
  },
  DEFAULT: {
    label: 'Chung',
    color: 'blue',
    textClass: 'text-sky-600',
  },
};

