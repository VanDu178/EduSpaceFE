import {
  BLOG_STATUS,
  BLOG_STATUS_CONFIG,
  BLOG_ACCESS_CONFIG,
  BLOG_TYPE_COLOR_MAP,
  type BlogBadgeConfig,
} from '../constants';

export const getStatusTagConfig = (status?: string): BlogBadgeConfig => {
  if (!status) return BLOG_STATUS_CONFIG[BLOG_STATUS.DRAFT];
  return BLOG_STATUS_CONFIG[status.toLowerCase()] || BLOG_STATUS_CONFIG[BLOG_STATUS.DRAFT];
};

export const getAccessTagConfig = (isPremium?: boolean): BlogBadgeConfig => {
  return isPremium ? BLOG_ACCESS_CONFIG.premium : BLOG_ACCESS_CONFIG.free;
};

export const getBlogTypeTagConfig = (code?: string): BlogBadgeConfig => {
  const normCode = code?.toUpperCase() || '';
  return BLOG_TYPE_COLOR_MAP[normCode] || BLOG_TYPE_COLOR_MAP.DEFAULT;
};

export const getBlogTypeStyles = (code?: string): string => {
  return getBlogTypeTagConfig(code).color;
};

export const getBlogTypeTextClass = (code?: string): string => {
  return getBlogTypeTagConfig(code).textClass;
};

/**
 * Chuyển đổi chuỗi văn bản (tiêu đề, tên) thành URL slug không dấu
 * @param text Chuỗi văn bản cần chuyển đổi (string)
 * @returns Chuỗi slug tương ứng (Ví dụ: "Bai Viet Mới" -> "bai-viet-moi")
 */
export const generateSlug = (text: string): string => {
  if (!text) return '';
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'd')
    .replace(/([^0-9a-z-\s])/g, '')
    .replace(/(\s+)/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
};

