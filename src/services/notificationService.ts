import api from './api';

export interface NotificationItem {
  id: number;
  userId: number;
  title: string;
  content: string;
  type: 'TICKET_CREATED' | 'TICKET_REPLIED' | 'TICKET_STATUS_CHANGED' | 'SYSTEM';
  link?: string | null;
  isRead: boolean;
  createdAt: string;
}

export interface NotificationResponse {
  notifications: NotificationItem[];
  unreadCount: number;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const notificationService = {
  getNotifications: async (page = 1, limit = 20): Promise<NotificationResponse> => {
    const res = await api.get('/notifications', { params: { page, limit } });
    return res.data.data;
  },

  markAsRead: async (id?: number): Promise<{ unreadCount: number }> => {
    const url = id ? `/notifications/${id}/read` : '/notifications/read';
    const res = await api.patch(url);
    return res.data.data;
  },
};

export default notificationService;
