import { Input, Select } from 'antd';
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';
import type React from 'react';
import type { PaymentTransactionParams } from '../types';

interface FilterBarProps {
  params: PaymentTransactionParams;
  setParams: React.Dispatch<React.SetStateAction<PaymentTransactionParams>>;
}

const FilterBar = ({ params, setParams }: FilterBarProps) => {
  return (
    <div className="flex flex-wrap justify-between items-center gap-3">
      {/* Nút / Nhãn Bộ lọc */}
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
              { value: 'pending', label: 'Chờ thanh toán' },
              { value: 'partially_paid', label: 'Thanh toán thiếu' },
              { value: 'completed', label: 'Đã hoàn tất' },
              { value: 'overpaid', label: 'Thanh toán dư' },
              { value: 'expired', label: 'Đã hết hạn' },
              { value: 'cancelled', label: 'Đã hủy' },
            ]}
            className="w-full"
          />
        </div>

        {/* Lọc Trạng thái Hoàn tiền (độc lập) */}
        <div className="w-full sm:w-[200px]">
          <Select
            value={params?.refundStatus || 'all'}
            onChange={(value) =>
              setParams((prev) => ({
                ...prev,
                refundStatus: value,
                page: 1,
              }))
            }
            options={[
              { value: 'all', label: 'Tất cả trạng thái hoàn' },
              { value: 'unrefunded', label: 'Chưa hoàn tiền dư' },
              { value: 'partially_refunded', label: 'Đã hoàn một phần' },
              { value: 'fully_refunded', label: 'Đã hoàn tiền xong' },
            ]}
            className="w-full"
          />
        </div>

        {/* Ô nhập tìm kiếm */}
        <div className="w-full sm:w-[300px]">
          <Input
            placeholder="Tìm theo mã đơn, nội dung CK, email..."
            value={params?.search || ''}
            onChange={(e) =>
              setParams((prev) => ({
                ...prev,
                search: e.target.value,
                page: 1,
              }))
            }
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
