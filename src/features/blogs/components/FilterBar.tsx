import { Input, Select } from 'antd';
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';
import type React from 'react';
import type { Params } from '../types';
import type { BlogType } from '../../blogTypes';

interface FilterBarProps {
  params: Params;
  setParams: React.Dispatch<React.SetStateAction<Params>>;
  blogTypes: BlogType[];
}

const FilterBar = ({
  params,
  setParams,
  blogTypes
}: FilterBarProps) => {
  const filterOptions = [
    { value: 'ALL', label: 'Tất cả thể loại' },
    ...blogTypes.map((type) => ({
      value: type?.code,
      label: type?.name,
    }))
  ];

  const statusOptions = [
    { value: 'ALL', label: 'Tất cả trạng thái' },
    { value: 'published', label: 'Đã xuất bản' },
    { value: 'draft', label: 'Bản nháp' },
    { value: 'archived', label: 'Lưu trữ' },
  ];

  return (
    <div className="flex flex-wrap justify-between items-center gap-3">
      {/* Advanced Filter Label */}
      <span
        className="h-11 rounded-xl flex gap-2 items-center justify-center border-slate-200 text-slate-500"
        title="Bộ lọc nâng cao"
      >
        <FunnelIcon className="h-5 w-5" />
        <span>Bộ lọc</span>
      </span>
      <div className="flex items-center gap-2">
        {/* Select Category Filter */}
        <div className="w-full sm:w-[180px]">
          <Select
            value={params?.blogType || 'ALL'}
            onChange={(value) =>
              setParams((prev) => ({
                ...prev,
                blogType: value,
                page: 1,
              }))
            }
            options={filterOptions}
            className="w-full"
          />
        </div>
        {/* Select Status Filter */}
        <div className="w-full sm:w-[160px]">
          <Select
            value={params?.status || 'ALL'}
            onChange={(value) =>
              setParams((prev) => ({
                ...prev,
                status: value,
                page: 1,
              }))
            }
            options={statusOptions}
            className="w-full"
          />
        </div>
        {/* Search input */}
        <div className="w-full sm:w-[320px]">
          <Input
            placeholder="Tìm kiếm theo tiêu đề..."
            value={params?.keyword || ''}
            onChange={(e) =>
              setParams((prev) => ({
                ...prev,
                keyword: e.target.value,
                page: 1,
              }))
            }
            prefix={<MagnifyingGlassIcon className="h-5 w-5 text-slate-400 mr-1.5" />}
            className="w-full px-4 border-slate-200 focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 text-slate-700 text-sm"
          />
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
