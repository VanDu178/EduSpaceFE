import { useState, useEffect } from 'react';
import { Input, Select } from 'antd';
import { FunnelIcon, MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import type { ChatFilterParams } from '../types';
import { CHAT_STATUS_OPTIONS } from '../constants';

export interface FilterBarProps {
  filterParams: ChatFilterParams;
  onFilterChange: (newParams: ChatFilterParams) => void;
}

export const FilterBar = ({ filterParams, onFilterChange }: FilterBarProps) => {
  const [searchValue, setSearchValue] = useState(filterParams.search || '');

  useEffect(() => {
    setSearchValue(filterParams.search || '');
  }, [filterParams.search]);

  const handleStatusChange = (val?: string) => {
    onFilterChange({ ...filterParams, status: val || null });
  };

  const handleSearch = () => {
    onFilterChange({ ...filterParams, search: searchValue.trim() || null });
  };

  const handleClearFilters = () => {
    setSearchValue('');
    onFilterChange({ status: null, search: null });
  };

  const isAnyFilterActive = Boolean(filterParams.status || filterParams.search);

  return (
    <div className="p-3 sm:p-3.5 border-b border-slate-100 flex flex-col gap-2.5 flex-shrink-0 bg-white">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Select
          placeholder="Tất cả trạng thái"
          allowClear
          value={filterParams.status || undefined}
          onChange={handleStatusChange}
          options={CHAT_STATUS_OPTIONS}
          className="w-full text-sm"
        />
        <div className="flex items-center space-x-2 w-full">
          <Input
            placeholder="Tìm kiếm theo tên, email, mã..."
            prefix={<MagnifyingGlassIcon className="h-4 w-4 text-slate-400 mr-1" />}
            allowClear
            value={searchValue}
            onChange={(e) => {
              const val = e.target.value;
              setSearchValue(val);
              if (!val) {
                onFilterChange({ ...filterParams, search: null });
              }
            }}
            onPressEnter={handleSearch}
            className="flex-1 rounded-xl py-1.5 px-3 text-sm border-slate-200 hover:border-sky-400 focus:border-sky-500"
          />
          <button
            type="button"
            onClick={handleSearch}
            className="px-3.5 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold rounded-xl flex items-center space-x-1.5 cursor-pointer border border-sky-500 transition flex-shrink-0"
          >
            <FunnelIcon className="w-3.5 h-3.5" />
            <span>Tìm kiếm</span>
          </button>
        </div>
      </div>

      {isAnyFilterActive && (
        <div className="flex items-center justify-between pt-1 border-t border-slate-100">
          <span className="text-[11px] text-slate-500">Đang áp dụng bộ lọc</span>
          <button
            type="button"
            onClick={handleClearFilters}
            className="text-[11px] text-sky-600 hover:text-sky-700 font-medium cursor-pointer flex items-center space-x-1"
          >
            <XMarkIcon className="w-3 h-3" />
            <span>Xóa bộ lọc</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default FilterBar;

