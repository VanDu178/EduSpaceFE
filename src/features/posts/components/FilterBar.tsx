import { Input, Select } from 'antd';
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';
import type React from 'react';
import type { Params } from '../types';
import type { PostType } from '../../postTypes';

interface FilterBarProps {
  params: Params;
  setParams: React.Dispatch<React.SetStateAction<Params>>;
  postTypes: PostType[];
}

const FilterBar = ({
  params,
  setParams,
  postTypes
}: FilterBarProps) => {
  const filterOptions = [
    { value: 'ALL', label: 'Tất cả thể loại' },
    ...postTypes.map((type) => ({
      value: type.code,
      label: type.name,
    }))
  ];

  const statusOptions = [
    { value: 'ALL', label: 'Tất cả trạng thái' },
    { value: 'true', label: 'Đã xuất bản' },
    { value: 'false', label: 'Bản nháp' },
  ];

  return (
    <div className="flex flex-wrap justify-between items-center gap-3">
      {/* Advanced Filter Button */}
      <span
        className="h-11 rounded-xl flex gap-2 items-center justify-center border-slate-200 text-slate-500 "
        title="Bộ lọc nâng cao"
      >
        <FunnelIcon className="h-5 w-5" />
        <span>
          Bộ lọc
        </span>
      </span>
      <div className='flex items-center gap-2'>
        {/* Select Filter */}
        <div className="w-full sm:w-[180px]">
          <Select
            value={params.postType || 'ALL'}
            onChange={(value) =>
              setParams((prev) => ({
                ...prev,
                postType: value,
                page: 1,
              }))
            }
            options={filterOptions}
            className="w-full"
          />
        </div>
        {/* Select Status */}
        <div className="w-full sm:w-[160px]">
          <Select
            value={params.published || 'ALL'}
            onChange={(value) =>
              setParams((prev) => ({
                ...prev,
                published: value,
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
            placeholder="Tìm kiếm theo tiêu đề bài viết..."
            value={params.keyword || ''}
            onChange={(e) =>
              setParams((prev) => ({
                ...prev,
                keyword: e.target.value,
                page: 1,
              }))
            }
            prefix={<MagnifyingGlassIcon className="h-5 w-5 text-slate-400 mr-1.5" />}
            className="w-full px-4 border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 text-slate-700 text-sm"
          />
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
