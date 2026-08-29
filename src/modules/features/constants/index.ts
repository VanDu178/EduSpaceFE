export const FEATURE_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  ALL: 'ALL',
} as const;

export type FeatureStatus = typeof FEATURE_STATUS[keyof typeof FEATURE_STATUS];

export interface FeatureStatusOption {
  value: FeatureStatus;
  label: string;
}

export const FEATURE_STATUS_OPTIONS: FeatureStatusOption[] = [
  {
    value: FEATURE_STATUS.ALL,
    label: 'Tất cả trạng thái',
  },
  {
    value: FEATURE_STATUS.ACTIVE,
    label: 'Đang kích hoạt',
  },
  {
    value: FEATURE_STATUS.INACTIVE,
    label: 'Đang ẩn',
  },
];
