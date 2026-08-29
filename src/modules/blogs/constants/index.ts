export interface BlogBadgeConfig {
  label: string;
  color: string;
  textClass: string;
}

export interface StatusOption {
  value: string;
  label: string;
}

export const BLOG_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  ARCHIVED: 'archived',
  ALL: 'ALL',
} as const;

export type BlogStatus = typeof BLOG_STATUS[keyof typeof BLOG_STATUS];


export const BLOG_STATUS_OPTIONS: StatusOption[] = [
  {
    value: BLOG_STATUS.DRAFT,
    label: 'Bản nháp',
  },
  {
    value: BLOG_STATUS.PUBLISHED,
    label: 'Đã xuất bản',
  },
  {
    value: BLOG_STATUS.ARCHIVED,
    label: 'Lưu trữ',
  },
];

// Cấu hình màu cho Trạng thái bài viết
export const BLOG_STATUS_CONFIG: Record<string, BlogBadgeConfig> = {
  [BLOG_STATUS.PUBLISHED]: {
    label: 'Đã xuất bản',
    color: 'success',
    textClass: 'text-emerald-600',
  },
  [BLOG_STATUS.DRAFT]: {
    label: 'Bản nháp',
    color: 'warning',
    textClass: 'text-amber-600',
  },
  [BLOG_STATUS.ARCHIVED]: {
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

