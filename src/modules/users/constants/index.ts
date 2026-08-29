import { USER_ROLE } from '../../../constants/roles';
import type { UserParams } from '../types';

export const ROLE_OPTIONS = [
  { value: 'ALL', label: 'Tất cả vai trò' },
  { value: USER_ROLE.ADMIN, label: 'Quản trị viên' },
  { value: USER_ROLE.CLIENT, label: 'Khách hàng' },
];

export const STATUS_OPTIONS = [
  { value: 'ALL', label: 'Tất cả trạng thái' },
  { value: 'active', label: 'Hoạt động' },
  { value: 'locked', label: 'Đã khóa' },
];

export const DEFAULT_USER_PARAMS: UserParams = {
  page: 1,
  limit: 10,
  keyword: '',
  role: 'ALL',
  status: 'ALL',
};
