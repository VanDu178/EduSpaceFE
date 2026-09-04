import { Input, Select } from 'antd';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import type { ChatFilterParams } from '../types';
import { CHAT_STATUS_OPTIONS } from '../constants';

export interface FilterBarProps {
  filterParams: ChatFilterParams;
  onFilterChange: (newParams: ChatFilterParams) => void;
}

export const FilterBar = ({ filterParams, onFilterChange }: FilterBarProps) => {
  const handleSearchChange = (val: string) => {
    onFilterChange({ ...filterParams, search: val });
  };

  const handleStatusChange = (val: string) => {
    onFilterChange({ ...filterParams, status: val });
  };

  return (
    <div className="p-3 sm:p-3.5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 flex-shrink-0">
      <Input
        placeholder="Tìm kiếm theo tên, email, mã..."
        prefix={<MagnifyingGlassIcon className="h-4 w-4 text-slate-400 mr-1" />}
        allowClear
        value={filterParams.search || ''}
        onChange={(e) => handleSearchChange(e.target.value)}
        className="w-full sm:w-72 md:w-80 rounded-xl py-1.5 px-3 text-sm border-slate-200 hover:border-sky-400 focus:border-sky-500"
      />
      <Select
        value={filterParams.status || ''}
        onChange={handleStatusChange}
        options={CHAT_STATUS_OPTIONS}
        className="w-full text-sm"
      />
    </div>
  );
};

export default FilterBar;
