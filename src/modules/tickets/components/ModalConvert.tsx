import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import type { TicketCategory, TicketPriority } from '../types';

interface ModalConvertProps {
  open: boolean;
  convertTitle: string;
  convertCategory: TicketCategory;
  convertPriority: TicketPriority;
  isConverting: boolean;
  onClose: () => void;
  onTitleChange: (title: string) => void;
  onCategoryChange: (cat: TicketCategory) => void;
  onPriorityChange: (pri: TicketPriority) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const ModalConvert: React.FC<ModalConvertProps> = ({
  open,
  convertTitle,
  convertCategory,
  convertPriority,
  isConverting,
  onClose,
  onTitleChange,
  onCategoryChange,
  onPriorityChange,
  onSubmit
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-xl p-4 text-slate-800">
        <div className="flex items-center justify-between mb-3 border-b border-slate-200 pb-2">
          <h3 className="text-sm font-bold text-slate-900">Tạo Ticket từ Cuộc Chat Trực Tiếp</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 cursor-pointer">
            <XMarkIcon className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-3">
          <div>
            <label className="text-xs text-slate-700 block mb-1">Tiêu đề Ticket</label>
            <input
              type="text"
              required
              placeholder="VD: Cần kiểm tra giao dịch nạp tiền VietQR"
              value={convertTitle}
              onChange={(e) => onTitleChange(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-xs text-slate-800 p-2 rounded-lg"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-700 block mb-1">Danh mục</label>
              <select
                value={convertCategory}
                onChange={(e: any) => onCategoryChange(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-xs text-slate-800 p-2 rounded-lg"
              >
                <option value="PAYMENT">Thanh toán</option>
                <option value="ACCOUNT">Tài khoản</option>
                <option value="TECHNICAL">Kỹ thuật</option>
                <option value="OTHER">Khác</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-700 block mb-1">Độ ưu tiên</label>
              <select
                value={convertPriority}
                onChange={(e: any) => onPriorityChange(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-xs text-slate-800 p-2 rounded-lg"
              >
                <option value="LOW">LOW</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="HIGH">HIGH</option>
                <option value="URGENT">URGENT</option>
              </select>
            </div>
          </div>

          <p className="text-[11px] text-amber-800 bg-amber-50 border border-amber-200 p-2 rounded-lg font-medium">
            Lịch sử tin nhắn sẽ được trích xuất tự động vào phần mô tả của Ticket.
          </p>

          <div className="flex justify-end space-x-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs rounded-lg font-medium cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isConverting || !convertTitle.trim()}
              className="px-3.5 py-1.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold rounded-lg cursor-pointer"
            >
              {isConverting ? 'Đang tạo...' : 'Xác Nhận Tạo Ticket'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
