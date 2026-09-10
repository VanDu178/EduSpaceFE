export type ConversationStatus = 'BOT' | 'WAITING_AGENT' | 'AGENT_HANDLING' | 'RESOLVED' | 'CONVERTED_TO_TICKET';
export type SenderType = 'USER' | 'BOT' | 'AGENT' | 'SYSTEM';

export interface ChatUser {
  id: number;
  name?: string | null;
  email: string;
  avatarUrl?: string | null;
  role?: string;
}

export interface SupportMessage {
  id: number;
  conversationId: number;
  senderType: SenderType;
  senderId?: number | null;
  content: string;
  metadata?: any;
  attachments?: string[] | null;
  isSystemNotice?: boolean;
  createdAt: string;
}

export interface SupportConversation {
  id: number;
  code: string;
  userId: number;
  assignedTo?: number | null;
  status: ConversationStatus;
  lastMessage?: string | null;
  lastSender?: SenderType | null;
  userUnreadCount?: number;
  agentUnreadCount?: number;
  createdAt: string;
  updatedAt: string;
  user?: ChatUser;
  agent?: ChatUser | null;
  messages?: SupportMessage[];
}

export interface AdminPresenceStatus {
  isOnline: boolean;
  activeAdminId?: number | null;
}

export interface ChatFilterParams {
  status?: string | null;
  search?: string | null;
}
