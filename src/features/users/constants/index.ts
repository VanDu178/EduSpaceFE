import type { UserParams } from '../types';

export const ROLE_OPTIONS = [
  { value: 'ALL', label: 'Tất cả vai trò' },
  { value: 'admin', label: 'Quản trị viên' },
  { value: 'client', label: 'Khách hàng' },
];

export const DEFAULT_USER_PARAMS: UserParams = {
  page: 1,
  limit: 10,
  keyword: '',
  role: 'ALL',
};
