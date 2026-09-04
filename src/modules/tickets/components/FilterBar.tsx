import React from 'react';
import { MagnifyingGlassIcon, XMarkIcon, FunnelIcon } from '@heroicons/react/24/outline';

interface FilterBarProps {
  searchKeyword: string;
  filterStatus: string;
  filterCategory: string;
  onSearchChange: (keyword: string) => void;
  onFilterStatusChange: (status: string) => void;
  onFilterCategoryChange: (category: string) => void;
  onLoadTickets: () => void;
  onClearFilters: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  searchKeyword,
  filterStatus,
  filterCategory,
  onSearchChange,
  onFilterStatusChange,
  onFilterCategoryChange,
  onLoadTickets,
  onClearFilters
}) => {
  const isAnyFilterActive = Boolean(filterStatus || filterCategory || searchKeyword);

  return (
    <div className="p-3 border-b border-slate-200 bg-white flex-shrink-0 space-y-2.5">
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm mã TK, tiêu đề sự cố..."
            value={searchKeyword}
            onChange={(e) => onSearchChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') onLoadTickets();
            }}
            className="w-full bg-slate-50 border border-slate-200 text-xs text-slate-800 pl-9 pr-7 py-2 rounded-xl focus:outline-none focus:border-sky-500 focus:bg-white transition"
          />
          {searchKeyword && (
            <button
              onClick={() => {
                onSearchChange('');
                onLoadTickets();
              }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
            >
              <XMarkIcon className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <button
          onClick={onLoadTickets}
          className="px-3.5 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold rounded-xl flex items-center space-x-1.5 cursor-pointer border border-sky-500 transition"
        >
          <FunnelIcon className="w-3.5 h-3.5" />
          <span>Lọc</span>
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="relative">
          <select
            value={filterStatus}
            onChange={(e) => {
              onFilterStatusChange(e.target.value);
              onLoadTickets();
            }}
            className="w-full bg-slate-50 hover:bg-slate-100/80 border border-slate-200 text-slate-700 font-medium px-2.5 py-1.5 rounded-xl appearance-none cursor-pointer focus:outline-none focus:border-sky-500 transition"
          >
            <option value="">-- Trạng thái (Tất cả) --</option>
            <option value="OPEN">🔵 OPEN (Mới tạo)</option>
            <option value="IN_PROGRESS">🟡 IN_PROGRESS (Đang xử lý)</option>
            <option value="PENDING_USER">🟠 PENDING_USER (Chờ khách)</option>
            <option value="RESOLVED">🟢 RESOLVED (Đã xong)</option>
            <option value="CLOSED">⚫ CLOSED (Đã đóng)</option>
          </select>
        </div>

        <div className="relative">
          <select
            value={filterCategory}
            onChange={(e) => {
              onFilterCategoryChange(e.target.value);
              onLoadTickets();
            }}
            className="w-full bg-slate-50 hover:bg-slate-100/80 border border-slate-200 text-slate-700 font-medium px-2.5 py-1.5 rounded-xl appearance-none cursor-pointer focus:outline-none focus:border-sky-500 transition"
          >
            <option value="">-- Phân loại (Tất cả) --</option>
            <option value="PAYMENT">💳 Thanh toán / Chuyển khoản</option>
            <option value="ACCOUNT">👤 Tài khoản / Đăng nhập</option>
            <option value="TECHNICAL">🛠️ Lỗi Kỹ thuật</option>
            <option value="OTHER">📁 Khác</option>
          </select>
        </div>
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
