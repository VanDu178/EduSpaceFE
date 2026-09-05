import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { ticketApi } from '../api';
import type { TicketCategory, TicketPriority } from '../types';

export const TICKET_QUERY_KEY = ['tickets'];

export const useTicketsQuery = (params?: { status?: string; category?: string; priority?: string; search?: string; limit?: number }) => {
  const cleanParams = params
    ? Object.fromEntries(Object.entries(params).filter(([_, v]) => v !== '' && v !== undefined && v !== null))
    : undefined;

  return useInfiniteQuery({
    queryKey: [...TICKET_QUERY_KEY, cleanParams],
    queryFn: ({ pageParam }) =>
      ticketApi.getTickets({
        ...cleanParams,
        cursor: pageParam as number | undefined
      }),
    initialPageParam: undefined as number | undefined,
    getNextPageParam: (lastPage) => lastPage?.pagination?.nextCursor ?? undefined
  });
};

export const useTicketDetailQuery = (id: number | null) => {
  return useQuery({
    queryKey: [...TICKET_QUERY_KEY, 'detail', id],
    queryFn: () => ticketApi.getTicketById(id!),
    enabled: Boolean(id),
  });
};

export const useAddTicketCommentMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: { content: string; attachments?: string[] } }) =>
      ticketApi.addTicketComment(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [...TICKET_QUERY_KEY, 'detail', variables.id] });
      toast.success('Đã gửi phản hồi');
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Lỗi gửi phản hồi');
    },
  });
};

export const useUpdateTicketStatusMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      ticketApi.updateTicketStatus(id, status),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [...TICKET_QUERY_KEY, 'detail', variables.id] });
      queryClient.invalidateQueries({ queryKey: TICKET_QUERY_KEY });
      toast.success('Đã cập nhật trạng thái Ticket');
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Không thể cập nhật trạng thái');
    },
  });
};

export const useConvertChatToTicketMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { conversationId: number; title: string; description?: string; category?: TicketCategory; priority?: TicketPriority; attachments?: string[] }) =>
      ticketApi.convertChatToTicket(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: TICKET_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ['supportChat'] });
      toast.success(`Đã chuyển cuộc chat thành Ticket #${data?.data?.code}`);
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Lỗi chuyển cuộc chat thành Ticket');
    },
  });
};

export * from './useTicketRealtime';
