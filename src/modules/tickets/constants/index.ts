import type { TicketCategory, TicketPriority, TicketStatus } from '../types';

export const TICKET_STATUS_LABELS: Record<TicketStatus, { label: string; color: string }> = {
  OPEN: { label: 'OPEN (Mới tạo)', color: 'bg-amber-100 text-amber-800 border-amber-300' },
  IN_PROGRESS: { label: 'IN_PROGRESS (Đang xử lý)', color: 'bg-sky-100 text-sky-800 border-sky-300' },
  PENDING_USER: { label: 'PENDING_USER (Chờ khách)', color: 'bg-orange-100 text-orange-800 border-orange-300' },
  RESOLVED: { label: 'RESOLVED (Đã xong)', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
  CLOSED: { label: 'CLOSED (Đã đóng)', color: 'bg-slate-200 text-slate-700 border-slate-300' },
};

export const TICKET_CATEGORY_LABELS: Record<TicketCategory, string> = {
  PAYMENT: '💳 Thanh toán / Chuyển khoản',
  ACCOUNT: '👤 Tài khoản / Đăng nhập',
  TECHNICAL: '🛠️ Lỗi Kỹ thuật',
  OTHER: '📁 Khác',
};

export const TICKET_PRIORITY_LABELS: Record<TicketPriority, { label: string; color: string }> = {
  LOW: { label: 'LOW', color: 'bg-slate-100 text-slate-700' },
  MEDIUM: { label: 'MEDIUM', color: 'bg-sky-100 text-sky-800' },
  HIGH: { label: 'HIGH', color: 'bg-amber-100 text-amber-800' },
  URGENT: { label: 'URGENT', color: 'bg-rose-100 text-rose-800' },
};
