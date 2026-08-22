import {
  BLOG_STATUS_CONFIG,
  BLOG_ACCESS_CONFIG,
  BLOG_TYPE_COLOR_MAP,
  type BlogBadgeConfig,
} from '../constants';

export const getStatusTagConfig = (status?: string): BlogBadgeConfig => {
  if (!status) return BLOG_STATUS_CONFIG.draft;
  return BLOG_STATUS_CONFIG[status.toLowerCase()] || BLOG_STATUS_CONFIG.draft;
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



