import { Select } from 'antd';
import { MagnifyingGlassIcon, XMarkIcon, FunnelIcon } from '@heroicons/react/24/outline';
import type { TicketFilterParams } from '../types';
import {
  TICKET_STATUS_OPTIONS,
  TICKET_CATEGORY_OPTIONS,
  TICKET_PRIORITY_OPTIONS
} from '../constants';

interface FilterBarProps {
  params: TicketFilterParams;
  onFilterChange: (field: keyof TicketFilterParams, value: string | null) => void;
  onLoadTickets: () => void;
  onClearFilters: () => void;
}

export const FilterBar = ({
  params,
  onFilterChange,
  onLoadTickets,
  onClearFilters
}: FilterBarProps) => {
  const isAnyFilterActive = Boolean(params.status || params.category || params.priority || params.search);

  return (
    <div className="p-3 border-b border-slate-200/80 bg-white flex-shrink-0 space-y-2.5">
      {/* Row 1: 3 Filters (Status, Category, Priority) */}
      <div className="grid grid-cols-3 gap-2 text-xs">
        <Select
          placeholder="Trạng thái"
          allowClear
          value={params.status || undefined}
          onChange={(value) => {
            onFilterChange('status', value || null);
          }}
          options={TICKET_STATUS_OPTIONS}
          className="w-full text-xs"
        />

        <Select
          placeholder="Loại"
          allowClear
          value={params.category || undefined}
          onChange={(value) => {
            onFilterChange('category', value || null);
          }}
          options={TICKET_CATEGORY_OPTIONS}
          className="w-full text-xs"
        />

        <Select
          placeholder="Độ khẩn cấp"
          allowClear
          value={params.priority || undefined}
          onChange={(value) => {
            onFilterChange('priority', value || null);
          }}
          options={TICKET_PRIORITY_OPTIONS}
          className="w-full text-xs"
        />
      </div>

      {/* Row 2: Search Input & Search Button */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm kiếm..."
            value={params.search}
            onChange={(e) => onFilterChange('search', e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') onLoadTickets();
            }}
            className="w-full bg-slate-50 border border-slate-200/80 text-xs text-slate-800 pl-9 pr-7 py-2 rounded-xl focus:outline-none focus:border-sky-500 focus:bg-white transition"
          />
          {params.search && (
            <button
              onClick={() => {
                onFilterChange('search', '');
              }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
            >
              <XMarkIcon className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <button
          onClick={onLoadTickets}
          className="px-3.5 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold rounded-xl flex items-center space-x-1.5 cursor-pointer border border-sky-500 transition flex-shrink-0"
        >
          <FunnelIcon className="w-3.5 h-3.5" />
          <span>Tìm kiếm</span>
        </button>
      </div>

      {isAnyFilterActive && (
        <div className="flex items-center justify-between pt-1">
          <span className="text-[11px] text-slate-500">Đang áp dụng bộ lọc</span>
          <button
            onClick={onClearFilters}
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

