import type { ChatFilterParams } from '../types';
import api from '../../../services/api';

const BASE_PATH = '/support';

export const chatApi = {
  getConversations: async (params?: ChatFilterParams) => {
    const res = await api.get(`${BASE_PATH}/chat/conversations`, { params });
    return res.data;
  },

  getConversationDetail: async (id: number) => {
    const res = await api.get(`${BASE_PATH}/chat/conversations/${id}`);
    return res.data;
  },

  acceptConversation: async (id: number) => {
    const res = await api.post(`${BASE_PATH}/chat/conversations/${id}/accept`);
    return res.data;
  },

  sendMessage: async (data: { conversationId: number; content: string; attachments?: string[] }) => {
    const res = await api.post(`${BASE_PATH}/chat/message`, data);
    return res.data;
  },

  resolveConversation: async (id: number) => {
    const res = await api.post(`${BASE_PATH}/chat/conversations/${id}/resolve`);
    return res.data;
  },

  getAdminStatus: async () => {
    const res = await api.get(`${BASE_PATH}/admin/status`);
    return res.data;
  },

  setAdminStatus: async (isOnline: boolean) => {
    const res = await api.patch(`${BASE_PATH}/admin/status`, { isOnline });
    return res.data;
  }
};

export default chatApi;
