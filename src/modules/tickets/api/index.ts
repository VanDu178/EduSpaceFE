import api from '../../../services/api';
import type { TicketCategory, TicketPriority } from '../types';

const BASE_PATH = '/support/tickets';

export const ticketApi = {
  getTickets: async (params?: { status?: string; category?: string; priority?: string; search?: string; page?: number; limit?: number }) => {
    const res = await api.get(`${BASE_PATH}`, { params });
    return res.data;
  },

  getTicketById: async (id: number) => {
    const res = await api.get(`${BASE_PATH}/${id}`);
    return res.data;
  },

  addTicketComment: async (id: number, data: { content: string; attachments?: string[] }) => {
    const res = await api.post(`${BASE_PATH}/${id}/comments`, data);
    return res.data;
  },

  updateTicketStatus: async (id: number, data: { status?: string; priority?: string; category?: string }) => {
    const res = await api.patch(`${BASE_PATH}/${id}/status`, data);
    return res.data;
  },

  convertChatToTicket: async (data: { conversationId: number; title: string; category?: TicketCategory; priority?: TicketPriority }) => {
    const res = await api.post('/support/chat/convert-to-ticket', data);
    return res.data;
  }
};

export default ticketApi;
