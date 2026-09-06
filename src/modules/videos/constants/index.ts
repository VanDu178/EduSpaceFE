import type { VideoQueryParams } from '../types';

// --- Single Source of Truth Configuration Objects ---

export const SOURCE_TYPES = {
  DIRECT_UPLOAD: "direct_upload",
  YOUTUBE: "youtube",
};

export const VIDEO_STATUS = {
  DRAFT: "draft",
  PUBLISHED: "published",
  ARCHIVED: "archived",
} as const;


export const VIDEO_TYPE = {
  ACADEMY: "ACADEMY",
  MARKET_ANALYSIS: "MARKET_ANALYSIS",
}


export const SOURCE_TYPE_CONFIG = {
  direct_upload: {
    value: SOURCE_TYPES.DIRECT_UPLOAD,
    label: 'Tải lên trực tiếp',
    tagColor: 'purple',
    textColor: 'text-purple-600',
  },
  youtube: {
    value: SOURCE_TYPES.YOUTUBE,
    label: 'YouTube Video',
    tagColor: 'volcano',
    textColor: 'text-rose-600',
  },
} as const;

export const VIDEO_STATUS_CONFIG = {
  draft: {
    value: VIDEO_STATUS.DRAFT,
    label: 'Bản nháp',
    optionLabel: 'Bản nháp',
    tagColor: 'gold',
    textColor: 'text-amber-600',
  },
  published: {
    value: VIDEO_STATUS.PUBLISHED,
    label: 'Đã xuất bản',
    optionLabel: 'Xuất bản',
    tagColor: 'green',
    textColor: 'text-emerald-600',
  },
  archived: {
    value: VIDEO_STATUS.ARCHIVED,
    label: 'Đã lưu trữ',
    optionLabel: 'Lưu trữ',
    tagColor: 'red',
    textColor: 'text-rose-600',
  },
} as const;

export const VIDEO_TYPE_CONFIG = [
  {
    code: VIDEO_TYPE.ACADEMY,
    name: 'Học thuật',
    tagColor: 'blue',
    textColor: 'text-sky-600',
  },
  {
    code: VIDEO_TYPE.MARKET_ANALYSIS,
    name: 'Nhận định thị trường',
    tagColor: 'cyan',
    textColor: 'text-cyan-600',
  },
] as const;

// --- Helpers for Map Derivations ---

const toLabelMap = (config: Record<string, { value: string; label: string }>): Record<string, string> =>
  Object.fromEntries(Object.values(config).map((item) => [item.value, item.label]));

const toColorMap = (
  config: Record<string, { value?: string; code?: string; tagColor: string; textColor: string }> | readonly any[]
): Record<string, { tagColor: string; textColor: string }> =>
  Object.fromEntries(
    (Array.isArray(config) ? config : Object.values(config)).map((item) => [
      item.value ?? item.code,
      { tagColor: item.tagColor, textColor: item.textColor },
    ])
  );

// --- Derived Constants & Mappings ---

export const SOURCE_TYPE_LABELS = toLabelMap(SOURCE_TYPE_CONFIG);
export const SOURCE_TYPE_COLOR_MAP = toColorMap(SOURCE_TYPE_CONFIG);
export const SOURCE_TYPE_OPTIONS = Object.values(SOURCE_TYPE_CONFIG).map(({ value, label }) => ({ value, label }));

export const VIDEO_STATUS_LABELS = toLabelMap(VIDEO_STATUS_CONFIG);
export const VIDEO_STATUS_COLOR_MAP = toColorMap(VIDEO_STATUS_CONFIG);
export const VIDEO_STATUS_COLORS: Record<string, string> = Object.fromEntries(
  Object.values(VIDEO_STATUS_CONFIG).map((item) => [item.value, item.tagColor])
);

export const STATUS_OPTIONS = Object.values(VIDEO_STATUS_CONFIG).map((item) => ({
  value: item.value,
  label: item.optionLabel,
  color: item.tagColor,
  textColor: item.textColor,
}));

export const FIXED_VIDEO_TYPES = VIDEO_TYPE_CONFIG.map(({ code, name }) => ({ code, name }));
export const VIDEO_TYPE_COLOR_MAP = toColorMap(VIDEO_TYPE_CONFIG);

export const DEFAULT_VIDEO_TYPE_COLOR = {
  tagColor: 'default',
  textColor: 'text-slate-600',
};

export const getVideoTypeColors = (code?: string) =>
  (code && VIDEO_TYPE_COLOR_MAP[code]) || DEFAULT_VIDEO_TYPE_COLOR;

export const DEFAULT_SOURCE_TYPE = SOURCE_TYPES.YOUTUBE;
export const DEFAULT_STATUS = VIDEO_STATUS.DRAFT;

export const DEFAULT_PARAMS: VideoQueryParams = {
  page: 1,
  limit: 10,
  search: '',
  videoTypeId: undefined,
  sourceType: undefined,
  status: undefined,
};

export const DEFAULT_VIDEO_FORM_VALUES = {
  sourceType: DEFAULT_SOURCE_TYPE,
  status: DEFAULT_STATUS,
  isPremium: false,
  durationTime: null,
  teaserDurationTime: null,
};

export const THUMBNAIL_UPLOAD_CONFIG = {
  MAX_SIZE_MB: 5,
  MAX_COUNT: 1,
  ACCEPTED_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  ACCEPT_STRING: 'image/jpeg,image/jpg,image/png,image/webp',
  FORMATS_TEXT: 'JPG, PNG, WEBP',
  HINT_TEXT: 'Tối đa 1 ảnh (JPG, PNG, WEBP), dung lượng tối đa 5MB.',
};

export const VIDEO_UPLOAD_CONFIG = {
  MAX_SIZE_MB: 1024,
  DISPLAY_SIZE_TEXT: '1GB',
  MAX_COUNT: 1,
  ACCEPTED_TYPES: ['video/mp4', 'video/webm', 'video/quicktime'],
  ACCEPT_STRING: 'video/mp4,video/webm,video/quicktime',
  FORMATS_TEXT: 'MP4, WEBM, MOV',
  HINT_TEXT: 'Tối đa 1 video (MP4, WEBM, MOV), dung lượng tối đa 1GB.',
};

export const YOUTUBE_ID_REGEX = /^[a-zA-Z0-9_-]{11}$/;


