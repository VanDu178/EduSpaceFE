import type { ChatFilterParams } from '../types';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { chatApi } from '../api';

export const CHAT_QUERY_KEY = ['supportChat'];

// Hook lấy trạng thái trực ONLINE/OFFLINE của Admin
export const useAdminStatusQuery = () => {
  return useQuery({
    queryKey: [...CHAT_QUERY_KEY, 'adminStatus'],
    queryFn: () => chatApi.getAdminStatus(),
  });
};

// Hook lấy hàng đợi danh sách cuộc trò chuyện
export const useConversationsQuery = (params?: ChatFilterParams) => {
  return useQuery({
    queryKey: [...CHAT_QUERY_KEY, 'conversations', params?.status, params?.search],
    queryFn: () => chatApi.getConversations(params),
  });
};

// Hook lấy chi tiết 1 cuộc trò chuyện và lịch sử tin nhắn
export const useConversationDetailQuery = (id: number | null) => {
  return useQuery({
    queryKey: [...CHAT_QUERY_KEY, 'conversation', id],
    queryFn: () => chatApi.getConversationDetail(id!),
    enabled: Boolean(id),
  });
};

// Mutation chuyển đổi trạng thái trực CSKH
export const useToggleAdminStatusMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (isOnline: boolean) => chatApi.setAdminStatus(isOnline),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [...CHAT_QUERY_KEY, 'adminStatus'] });
      toast.success(data?.message || 'Đã cập nhật trạng thái trực CSKH');
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Không thể đổi trạng thái');
    },
  });
};

// Mutation tiếp nhận cuộc trò chuyện
export const useAcceptConversationMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => chatApi.acceptConversation(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: [...CHAT_QUERY_KEY, 'conversation', id] });
      queryClient.invalidateQueries({ queryKey: [...CHAT_QUERY_KEY, 'conversations'] });
      toast.success('Đã tiếp nhận cuộc trò chuyện!');
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Không thể tiếp nhận');
    },
  });
};

// Mutation gửi tin nhắn CSKH
export const useSendChatMessageMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { conversationId: number; content: string; attachments?: string[] }) =>
      chatApi.sendMessage(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [...CHAT_QUERY_KEY, 'conversation', variables.conversationId] });
      queryClient.invalidateQueries({ queryKey: [...CHAT_QUERY_KEY, 'conversations'] });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Lỗi gửi tin nhắn');
    },
  });
};

// Mutation hoàn tất cuộc trò chuyện
export const useResolveConversationMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => chatApi.resolveConversation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...CHAT_QUERY_KEY, 'conversations'] });
      toast.success('Đã hoàn tất cuộc trò chuyện');
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Không thể đóng chat');
    },
  });
};

// Mutation đánh dấu cuộc trò chuyện là đã đọc
export const useMarkConversationAsReadMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => chatApi.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...CHAT_QUERY_KEY, 'conversations'] });
    },
  });
};
