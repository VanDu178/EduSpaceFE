import type { MembershipPlanParams } from '../types';

export const FILTER_STATUS = {
  ALL: 'all',
  ACTIVE: 'true',
  INACTIVE: 'false',
} as const;

export type FilterStatus = (typeof FILTER_STATUS)[keyof typeof FILTER_STATUS];

export const DEFAULT_MEMBERSHIP_PLAN_PARAMS: MembershipPlanParams = {
  isActive: FILTER_STATUS.ALL,
  keyword: '',
};

export const BADGE_OPTIONS = [
  { label: 'Không có nhãn', value: '' },
  { label: 'Phổ biến nhất', value: 'Phổ biến nhất' },
  { label: 'Khuyên dùng', value: 'Khuyên dùng' },
  { label: 'Hot', value: 'Hot' },
  { label: 'Tiết kiệm nhất', value: 'Tiết kiệm nhất' },
];
