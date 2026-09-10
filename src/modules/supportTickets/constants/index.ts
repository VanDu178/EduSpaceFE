import type { TicketCategory, TicketPriority, TicketStatus, TicketFilterParams } from '../types';

export const TICKET_STATUS = {
  OPEN: 'OPEN',
  IN_PROGRESS: 'IN_PROGRESS',
  PENDING_USER: 'PENDING_USER',
  RESOLVED: 'RESOLVED',
  CLOSED: 'CLOSED',
} as const;

export const TICKET_STATUS_LABELS: Record<TicketStatus, { label: string; bgClass: string; textClass: string; dotClass: string }> = {
  OPEN: { label: 'Mới', bgClass: 'bg-amber-50 border-amber-200', textClass: 'text-amber-700', dotClass: 'bg-amber-500' },
  IN_PROGRESS: { label: 'Đang xử lý', bgClass: 'bg-sky-50 border-sky-200', textClass: 'text-sky-700', dotClass: 'bg-sky-500' },
  PENDING_USER: { label: 'Chờ phản hồi', bgClass: 'bg-orange-50 border-orange-200', textClass: 'text-orange-700', dotClass: 'bg-orange-500' },
  RESOLVED: { label: 'Đã giải quyết', bgClass: 'bg-emerald-50 border-emerald-200', textClass: 'text-emerald-700', dotClass: 'bg-emerald-500' },
  CLOSED: { label: 'Đã đóng', bgClass: 'bg-slate-100 border-slate-200', textClass: 'text-slate-600', dotClass: 'bg-slate-400' },
};

export const TICKET_STATUS_OPTIONS: { value: TicketStatus; label: string }[] = (
  Object.keys(TICKET_STATUS_LABELS) as TicketStatus[]
).map((key) => ({
  value: key,
  label: TICKET_STATUS_LABELS[key].label,
}));



export const TICKET_CATEGORY = {
  PAYMENT: 'PAYMENT',
  ACCOUNT: 'ACCOUNT',
  TECHNICAL: 'TECHNICAL',
  OTHER: 'OTHER',
} as const;

export const TICKET_CATEGORY_LABELS: Record<TicketCategory, string> = {
  PAYMENT: 'Thanh toán / Chuyển khoản',
  ACCOUNT: 'Tài khoản / Đăng nhập',
  TECHNICAL: 'Lỗi Kỹ thuật',
  OTHER: 'Khác',
};

export const TICKET_CATEGORY_OPTIONS: { value: TicketCategory; label: string }[] = (
  Object.keys(TICKET_CATEGORY_LABELS) as TicketCategory[]
).map((key) => ({
  value: key,
  label: TICKET_CATEGORY_LABELS[key],
}));

export const TICKET_PRIORITY = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  URGENT: 'URGENT',
} as const;

export const TICKET_PRIORITY_LABELS: Record<TicketPriority, { label: string; color: string }> = {
  LOW: { label: 'Thấp', color: 'bg-slate-100 text-slate-700' },
  MEDIUM: { label: 'Trung bình', color: 'bg-sky-100 text-sky-800' },
  HIGH: { label: 'Cao', color: 'bg-amber-100 text-amber-800' },
  URGENT: { label: 'Khẩn cấp', color: 'bg-rose-100 text-rose-800' },
};

export const TICKET_PRIORITY_OPTIONS: { value: TicketPriority; label: string }[] = (
  Object.keys(TICKET_PRIORITY_LABELS) as TicketPriority[]
).map((key) => ({
  value: key,
  label: TICKET_PRIORITY_LABELS[key].label,
}));

export const SUPPORT_CENTER_TABS = {
  CHAT: 'chat',
  TICKETS: 'tickets',
} as const;

export type SupportCenterTab = (typeof SUPPORT_CENTER_TABS)[keyof typeof SUPPORT_CENTER_TABS];

export const DEFAULT_CONVERT_FORM_VALUES = {
  title: '',
  category: TICKET_CATEGORY.TECHNICAL as TicketCategory,
  priority: TICKET_PRIORITY.MEDIUM as TicketPriority,
  description: '',
} as const;

export const DEFAULT_TICKET_FILTER_PARAMS: TicketFilterParams = {
  status: null,
  category: null,
  priority: null,
  search: '',
};

export const TICKET_ATTACHMENT_LIMITS = {
  MAX_COUNT: 3,
  MAX_SIZE_BYTES: 5 * 1024 * 1024, // 5MB
  MAX_SIZE_MB: 5,
} as const;

/**
 * TẬP TRUNG HÓA TẤT CẢ TÊN SOCKET EVENT CHO TICKET SUPPORT (FE ADMIN)
 */
export const TICKET_SOCKET_EVENTS = {
  COMMENT_ADDED: 'ticket:comment_added',
  STATUS_CHANGED: 'ticket:status_changed',
  CREATED: 'ticket:created',
  UPDATED: 'ticket:updated',
  JOIN_TICKET: 'join_ticket',
  LEAVE_TICKET: 'leave_ticket',
  ADMIN_PRESENCE_UPDATED: 'admin_presence_updated',
} as const;

