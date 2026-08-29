import { Input, Select } from 'antd';
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';
import type React from 'react';
import { FILTER_STATUS } from '../constants';
import type { MembershipPlanParams } from '../types';

interface FilterBarProps {
  params: MembershipPlanParams;
  setParams: React.Dispatch<React.SetStateAction<MembershipPlanParams>>;
}

const FilterBar = ({ params, setParams }: FilterBarProps) => {
  return (
    <div className="flex flex-wrap justify-between items-center gap-3">
      {/* Nút / Nhãn Bộ lọc nâng cao */}
      <span
        className="h-11 rounded-xl flex gap-2 items-center justify-center border-slate-200 text-slate-500"
        title="Bộ lọc nâng cao"
      >
        <FunnelIcon className="h-5 w-5" />
        <span>Bộ lọc</span>
      </span>

      <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap w-full sm:w-auto">
        {/* Lọc Trạng thái */}
        <div className="w-full sm:w-[180px]">
          <Select
            value={params?.isActive || FILTER_STATUS.ALL}
            onChange={(value) =>
              setParams((prev) => ({
                ...prev,
                isActive: value,
              }))
            }
            options={[
              { value: FILTER_STATUS.ALL, label: 'Tất cả trạng thái' },
              { value: FILTER_STATUS.ACTIVE, label: 'Đang kích hoạt' },
              { value: FILTER_STATUS.INACTIVE, label: 'Đang ẩn' },
            ]}
            className="w-full"
          />
        </div>

        {/* Ô nhập tìm kiếm */}
        <div className="w-full sm:w-[280px]">
          <Input
            placeholder="Tìm theo tên hoặc mã gói hội viên..."
            value={params?.keyword || ''}
            onChange={(e) =>
              setParams((prev) => ({
                ...prev,
                keyword: e.target.value,
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
