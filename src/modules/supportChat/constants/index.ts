import type { ConversationStatus } from '../types';

export const CONVERSATION_STATUS_LABELS: Record<ConversationStatus, { label: string; color: string }> = {
  BOT: { label: 'AI Bot', color: 'bg-purple-100 text-purple-800 border-purple-300' },
  WAITING_AGENT: { label: 'Đang chờ', color: 'bg-amber-100 text-amber-800 border-amber-300 animate-pulse' },
  AGENT_HANDLING: { label: 'Đang chat', color: 'bg-sky-100 text-sky-800 border-sky-300' },
  RESOLVED: { label: 'Hoàn tất', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
  CONVERTED_TO_TICKET: { label: 'Đã tạo Ticket', color: 'bg-slate-200 text-slate-700 border-slate-300' },
};
