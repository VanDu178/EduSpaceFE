import { Input, Select } from 'antd';
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';
import type { PaymentMethodFilterParams } from '../types';

interface FilterBarProps {
  filters: PaymentMethodFilterParams;
  onFilterChange: (newFilters: Partial<PaymentMethodFilterParams>) => void;
}

const FilterBar = ({ filters, onFilterChange }: FilterBarProps) => {
  return (
    <div className="flex flex-wrap justify-between items-center gap-3">
      {/* Nhãn Bộ lọc */}
      <span
        className="h-11 rounded-xl flex gap-2 items-center justify-center border-slate-200 text-slate-500"
        title="Bộ lọc"
      >
        <FunnelIcon className="h-5 w-5" />
        <span>Bộ lọc</span>
      </span>

      <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap w-full sm:w-auto">
        {/* Lọc Trạng thái */}
        <div className="w-full sm:w-[180px]">
          <Select
            value={filters?.status || 'ALL'}
            onChange={(val) => onFilterChange({ status: val })}
            options={[
              { value: 'ALL', label: 'Tất cả trạng thái' },
              { value: 'active', label: 'Hoạt động' },
              { value: 'inactive', label: 'Vô hiệu hóa' },
            ]}
            className="w-full"
          />
        </div>

        {/* Ô nhập tìm kiếm */}
        <div className="w-full sm:w-[280px]">
          <Input
            placeholder="Tìm kiếm..."
            value={filters?.keyword || ''}
            onChange={(e) => onFilterChange({ keyword: e.target.value })}
            prefix={<MagnifyingGlassIcon className="h-5 w-5 text-slate-400 mr-1.5" />}
            allowClear
            className="w-full px-4 border-slate-200 focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 text-slate-700 text-sm"
          />
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
