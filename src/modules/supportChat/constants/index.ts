import type { ConversationStatus } from '../types';


export const CHAT_STATUS = {
  WAITING_AGENT: 'WAITING_AGENT',
  AGENT_HANDLING: 'AGENT_HANDLING',
  RESOLVED: 'RESOLVED',
  CONVERTED_TO_TICKET: 'CONVERTED_TO_TICKET',
}

export const SENDER_TYPE = {
  USER: 'USER',
  AGENT: 'AGENT',
  SYSTEM: 'SYSTEM',
}

export const CONVERSATION_STATUS_LABELS: Record<ConversationStatus, { label: string; color: string }> = {
  BOT: { label: 'AI Bot', color: 'bg-purple-100 text-purple-800 border-purple-300' },
  WAITING_AGENT: { label: 'Đang chờ', color: 'bg-amber-100 text-amber-800 border-amber-300 animate-pulse' },
  AGENT_HANDLING: { label: 'Đang chat', color: 'bg-sky-100 text-sky-800 border-sky-300' },
  RESOLVED: { label: 'Hoàn tất', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
  CONVERTED_TO_TICKET: { label: 'Đã chuyển thành yêu cầu', color: 'bg-slate-200 text-slate-700 border-slate-300' },
};

export const CHAT_STATUS_OPTIONS = [
  // { value: 'BOT', label: 'AI Bot' },
  { value: CHAT_STATUS.WAITING_AGENT, label: 'Đang chờ phản hồi' },
  { value: CHAT_STATUS.AGENT_HANDLING, label: 'Đang chat' },
  { value: CHAT_STATUS.RESOLVED, label: 'Hoàn tất' },
  { value: CHAT_STATUS.CONVERTED_TO_TICKET, label: 'Đã chuyển thành yêu cầu hỗ trợ' },
];

/**
 * TẬP TRUNG HÓA TẤT CẢ TÊN SOCKET EVENT CHO SUPPORT CHAT (FE ADMIN)
 */
export const CHAT_SOCKET_EVENTS = {
  JOIN_CONVERSATION: 'join_conversation',
  LEAVE_CONVERSATION: 'leave_conversation',
  SEND_MESSAGE: 'send_message',
  NEW_MESSAGE: 'new_message',
  USER_NEW_MESSAGE_NOTICE: 'user_new_message_notice',
  CONVERSATION_CONVERTED: 'conversation_converted',
  CONVERSATIONS_AUTO_ESCALATED: 'conversations_auto_escalated',
  ADMIN_PRESENCE_UPDATED: 'admin_presence_updated',
  CONVERSATION_UPDATED: 'conversation_updated',
} as const;

export const CHAT_EVENT_NAME = CHAT_SOCKET_EVENTS;

