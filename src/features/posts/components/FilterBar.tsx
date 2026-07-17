import { Input, Select, Button } from 'antd';
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';
import type React from 'react';
import type { Params } from '../types';
import { FILTER_OPTIONS } from '../constants';

interface FilterBarProps {
  params: Params;
  setParams: React.Dispatch<React.SetStateAction<Params>>;
}

const FilterBar = ({
  params,
  setParams
}: FilterBarProps) => {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Advanced Filter Button */}
      <Button
        icon={<FunnelIcon className="h-5 w-5" />}
        className="h-11 rounded-xl flex items-center justify-center border-slate-200 text-slate-500 hover:text-blue-600 hover:border-blue-500 transition-colors"
        title="Bộ lọc nâng cao"
      />

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
          options={FILTER_OPTIONS}
          className="w-full"
        />
      </div>
    </div>
  );
};

export default FilterBar;
