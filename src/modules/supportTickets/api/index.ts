import api from '../../../services/api';
import type { TicketCategory, TicketPriority } from '../types';

const BASE_PATH = '/support/tickets';

export const ticketApi = {
  getTickets: async (params?: { status?: string; category?: string; priority?: string; search?: string; page?: number; limit?: number; cursor?: number }) => {
    const res = await api.get(`${BASE_PATH}`, { params });
    return res.data;
  },

  getTicketById: async (id: number) => {
    const res = await api.get(`${BASE_PATH}/${id}`);
    return res.data;
  },

  markAsRead: async (id: number) => {
    const res = await api.post(`${BASE_PATH}/${id}/read`);
    return res.data;
  },

  addTicketComment: async (id: number, data: { content: string; attachments?: string[] }) => {
    const res = await api.post(`${BASE_PATH}/${id}/comments`, data);
    return res.data;
  },

  updateTicketStatus: async (id: number, status: string) => {
    const res = await api.patch(`${BASE_PATH}/${id}/status`, { status });
    return res.data;
  },

  updateTicket: async (id: number, data: { priority?: TicketPriority; category?: TicketCategory }) => {
    const res = await api.patch(`${BASE_PATH}/${id}`, data);
    return res.data;
  },

  convertChatToTicket: async (data: { conversationId: number; title: string; description?: string; category?: TicketCategory; priority?: TicketPriority; attachments?: string[] }) => {
    const res = await api.post('/support/chat/convert-to-ticket', data);
    return res.data;
  }
};

export default ticketApi;
