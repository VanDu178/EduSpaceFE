import { Input, Select } from 'antd';
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';
import { BLOG_STATUS } from '../constants';
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
    { value: BLOG_STATUS.ALL, label: 'Tất cả trạng thái' },
    { value: BLOG_STATUS.PUBLISHED, label: 'Đã xuất bản' },
    { value: BLOG_STATUS.DRAFT, label: 'Bản nháp' },
    { value: BLOG_STATUS.ARCHIVED, label: 'Lưu trữ' },
  ];

  const accessOptions = [
    { value: 'ALL', label: 'Tất cả quyền' },
    { value: 'false', label: 'Miễn phí' },
    { value: 'true', label: 'Trả phí' },
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
      <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
        {/* Select Category Filter */}
        <div className="w-full sm:w-[170px]">
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
        {/* Select Access Rights Filter */}
        <div className="w-full sm:w-[150px]">
          <Select
            value={params?.isPremium || 'ALL'}
            onChange={(value) =>
              setParams((prev) => ({
                ...prev,
                isPremium: value,
                page: 1,
              }))
            }
            options={accessOptions}
            className="w-full"
          />
        </div>
        {/* Select Status Filter */}
        <div className="w-full sm:w-[160px]">
          <Select
            value={params?.status || BLOG_STATUS.ALL}
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
        <div className="w-full sm:w-[280px]">
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
