import React from 'react';
import type { Ticket } from '../types';

interface ModalDetailProps {
  selectedTicket: Ticket | null;
  newStatus: string;
  ticketCommentText: string;
  isSubmittingComment: boolean;
  onNewStatusChange: (status: string) => void;
  onUpdateTicketStatus: () => void;
  onCommentTextChange: (text: string) => void;
  onAddTicketComment: (e: React.FormEvent) => void;
}

export const ModalDetail: React.FC<ModalDetailProps> = ({
  selectedTicket,
  newStatus,
  ticketCommentText,
  isSubmittingComment,
  onNewStatusChange,
  onUpdateTicketStatus,
  onCommentTextChange,
  onAddTicketComment
}) => {
  if (!selectedTicket) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl flex-1 flex items-center justify-center text-slate-400 text-xs h-full">
        Chọn một Ticket từ danh sách bên trái để xem thông tin chi tiết.
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl flex flex-col h-full overflow-hidden">
      <div className="flex-1 flex flex-col p-3 overflow-hidden">
        {/* Header detail */}
        <div className="pb-2.5 border-b border-slate-200 flex items-start justify-between flex-shrink-0">
          <div>
            <div className="flex items-center space-x-2 text-xs mb-0.5">
              <span className="font-mono text-sky-700 font-bold text-xs">#{selectedTicket.code}</span>
              <span className="text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.2 rounded border border-slate-200 font-medium">
                Category: {selectedTicket.category}
              </span>
            </div>
            <h3 className="text-sm font-bold text-slate-900">{selectedTicket.title}</h3>
            <p className="text-[11px] text-slate-500">Người tạo: {selectedTicket.creator?.name} ({selectedTicket.creator?.email})</p>
          </div>

          {/* Status Change Selector */}
          <div className="flex items-center space-x-1.5">
            <select
              value={newStatus}
              onChange={(e) => onNewStatusChange(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-xs text-slate-800 p-1.5 rounded-lg"
            >
              <option value="OPEN">OPEN</option>
              <option value="IN_PROGRESS">IN_PROGRESS</option>
              <option value="PENDING_USER">PENDING_USER</option>
              <option value="RESOLVED">RESOLVED</option>
              <option value="CLOSED">CLOSED</option>
            </select>
            <button
              onClick={onUpdateTicketStatus}
              className="px-2.5 py-1.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-medium rounded-lg cursor-pointer"
            >
              Lưu
            </button>
          </div>
        </div>

        {/* Description */}
        <div className="my-2 p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 max-h-28 overflow-y-auto whitespace-pre-wrap flex-shrink-0">
          {selectedTicket.description}
        </div>

        {/* Comments Stream */}
        <div className="flex-1 overflow-y-auto space-y-2 my-1 pr-1 min-h-0">
          <h5 className="text-[11px] font-semibold text-slate-500">Lịch sử phản hồi:</h5>
          {selectedTicket.comments?.map((c) => (
            <div
              key={c.id}
              className={`p-2.5 rounded-lg text-xs ${
                c.sender?.role === 'admin'
                  ? 'bg-purple-50 border border-purple-200 text-purple-900'
                  : 'bg-slate-50 border border-slate-200 text-slate-800'
              }`}
            >
              <div className="flex items-center justify-between font-medium text-[10px] mb-1">
                <span className={c.sender?.role === 'admin' ? 'text-purple-700 font-bold' : 'text-sky-700 font-semibold'}>
                  {c.sender?.name || c.sender?.email} {c.sender?.role === 'admin' && '(Admin)'}
                </span>
                <span className="text-slate-400">
                  {new Date(c.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <p className="whitespace-pre-wrap">{c.content}</p>
            </div>
          ))}
        </div>

        {/* Add Reply */}
        {selectedTicket.status !== 'CLOSED' && (
          <form onSubmit={onAddTicketComment} className="pt-2 border-t border-slate-200 flex space-x-2 flex-shrink-0">
            <input
              type="text"
              placeholder="Nhập phản hồi xử lý cho Khách hàng..."
              value={ticketCommentText}
              onChange={(e) => onCommentTextChange(e.target.value)}
              disabled={isSubmittingComment}
              className="flex-1 bg-slate-50 border border-slate-200 text-xs text-slate-800 px-3 py-1.5 rounded-lg"
            />
            <button
              type="submit"
              disabled={isSubmittingComment || !ticketCommentText.trim()}
              className="px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-medium rounded-lg cursor-pointer"
            >
              Gửi Phản Hồi
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
