import type { MembershipPlanParams } from '../types';

export const DEFAULT_MEMBERSHIP_PLAN_PARAMS: MembershipPlanParams = {
  isActive: 'all',
  keyword: '',
};

export const BADGE_OPTIONS = [
  { label: 'Không có nhãn', value: '' },
  { label: 'Phổ biến nhất', value: 'Phổ biến nhất' },
  { label: 'Khuyên dùng', value: 'Khuyên dùng' },
  { label: 'Hot', value: 'Hot' },
  { label: 'Tiết kiệm nhất', value: 'Tiết kiệm nhất' },
];
