export type TicketCategory = 'PAYMENT' | 'ACCOUNT' | 'TECHNICAL' | 'OTHER';
export type TicketPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
export type TicketStatus = 'OPEN' | 'IN_PROGRESS' | 'PENDING_USER' | 'RESOLVED' | 'CLOSED';

export interface TicketFilterParams {
  status: string | null;
  category: string | null;
  priority: string | null;
  search: string;
}

export interface TicketUser {
  id: number;
  name?: string | null;
  email: string;
  avatarUrl?: string | null;
  role?: string;
}

export interface TicketComment {
  id: number;
  ticketId: number;
  senderId: number;
  content: string;
  attachments?: string[] | null;
  createdAt: string;
  sender?: TicketUser;
}

export interface Ticket {
  id: number;
  code: string;
  title: string;
  description: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  creatorId: number;
  assigneeId?: number | null;
  sourceConversationId?: number | null;
  creatorUnreadCount?: number;
  assigneeUnreadCount?: number;
  resolvedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  creator?: TicketUser;
  assignee?: TicketUser | null;
  comments?: TicketComment[];
}
