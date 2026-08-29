import { Input, Select } from 'antd';
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';
import type React from 'react';
import type { UserSubscriptionParams } from '../types';

interface FilterBarProps {
  params: UserSubscriptionParams;
  setParams: React.Dispatch<React.SetStateAction<UserSubscriptionParams>>;
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
            value={params?.status || 'all'}
            onChange={(value) =>
              setParams((prev) => ({
                ...prev,
                status: value,
                page: 1,
              }))
            }
            options={[
              { value: 'all', label: 'Tất cả trạng thái' },
              { value: 'active', label: 'Hoạt động' },
              { value: 'pending_payment', label: 'Chờ thanh toán' },
              { value: 'cancelled', label: 'Đã hủy' },
              { value: 'expired', label: 'Hết hạn' },
            ]}
            className="w-full"
          />
        </div>

        {/* Ô nhập tìm kiếm */}
        <div className="w-full sm:w-[280px]">
          <Input
            placeholder="Tìm theo mã đơn, email, tên..."
            value={params?.search || ''}
            onChange={(e) =>
              setParams((prev) => ({
                ...prev,
                search: e.target.value,
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
