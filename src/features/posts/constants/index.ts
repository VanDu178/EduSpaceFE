import type { Params } from '../types';

export const FILTER_OPTIONS = [
  { value: 'ALL', label: 'Tất cả thể loại' },
  { value: 'KIENTHUC', label: 'Kiến thức' },
  { value: 'BAITAP', label: 'Bài tập' },
  { value: 'PROJECT_LOG', label: 'Project Log' },
  { value: 'GENERAL', label: 'Chung' }
];

export const DEFAULT_PARAMS: Params = {
  page: 1,
  limit: 5,
  keyword: '',
  postType: 'ALL'
};
