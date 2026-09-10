import { useEffect, useRef, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useSocket, useSocketEvent } from '../../../config/socket/SocketContext';
import { TICKET_QUERY_KEY } from './index';
import { TICKET_SOCKET_EVENTS } from '../constants';
import { playNotificationChime } from '../../../config/socket/NotificationContext';

const DEBOUNCE_DELAY = 500; // 500ms window để gom nhóm bão sự kiện socket

export function useTicketRealtime(ticketId?: number | null) {
  const { socket } = useSocket();
  const queryClient = useQueryClient();
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Hàm invalidate danh sách ticket có debounce chống bão refetch
  const debouncedInvalidateTickets = useCallback(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    debounceTimerRef.current = setTimeout(() => {
      queryClient.invalidateQueries({ queryKey: TICKET_QUERY_KEY });
      debounceTimerRef.current = null;
    }, DEBOUNCE_DELAY);
  }, [queryClient]);

  // Cleanup timer khi component unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  // Join/Leave socket room cho Ticket detail cụ thể
  useEffect(() => {
    if (!socket || !ticketId) return;

    socket.emit(TICKET_SOCKET_EVENTS.JOIN_TICKET, { ticketId });

    return () => {
      socket.emit(TICKET_SOCKET_EVENTS.LEAVE_TICKET, { ticketId });
    };
  }, [socket, ticketId]);

  // Realtime comment mới
  useSocketEvent<any>(TICKET_SOCKET_EVENTS.COMMENT_ADDED, (data) => {
    playNotificationChime();
    const targetId = data?.ticketId || ticketId;
    if (targetId) {
      queryClient.invalidateQueries({ queryKey: [...TICKET_QUERY_KEY, 'detail', targetId] });
    }
    debouncedInvalidateTickets();
  });

  // Realtime status đổi
  useSocketEvent<any>(TICKET_SOCKET_EVENTS.STATUS_CHANGED, (data) => {
    const targetId = data?.id || ticketId;
    if (targetId) {
      queryClient.invalidateQueries({ queryKey: [...TICKET_QUERY_KEY, 'detail', targetId] });
    }
    debouncedInvalidateTickets();
  });

  // Realtime ticket mới được tạo
  useSocketEvent<any>(TICKET_SOCKET_EVENTS.CREATED, () => {
    debouncedInvalidateTickets();
  });

  // Realtime ticket được cập nhật tổng thể
  useSocketEvent<any>(TICKET_SOCKET_EVENTS.UPDATED, () => {
    debouncedInvalidateTickets();
  });

  // Tự động refetch dữ liệu khi Socket kết nối lại (Reconnected sau sự cố đứt mạng)
  useEffect(() => {
    if (!socket) return;
    const handleConnect = () => {
      debouncedInvalidateTickets();
    };
    socket.on('connect', handleConnect);
    return () => {
      socket.off('connect', handleConnect);
    };
  }, [socket, debouncedInvalidateTickets]);
}


