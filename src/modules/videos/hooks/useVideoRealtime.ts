import { useEffect, useRef, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useSocketEvent } from '../../../config/socket/SocketContext';
import { QUERY_KEY } from './index';
import { VIDEO_SOCKET_EVENTS } from '../constants';

const DEBOUNCE_DELAY = 300; // 300ms window để gom nhóm bão sự kiện socket

export const useVideoRealtime = () => {
  const queryClient = useQueryClient();
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const debouncedInvalidateVideos = useCallback(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    debounceTimerRef.current = setTimeout(() => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      debounceTimerRef.current = null;
    }, DEBOUNCE_DELAY);
  }, [queryClient]);

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  // Lắng nghe sự kiện socket khi Bunny Webhook hoàn tất mã hóa processStatus
  useSocketEvent<{ videoId: string; processStatus: string }>(
    VIDEO_SOCKET_EVENTS.PROCESS_STATUS_UPDATED,
    (data) => {
      if (data?.videoId) {
        queryClient.invalidateQueries({ queryKey: [...QUERY_KEY, 'detail', data.videoId] });
      }
      debouncedInvalidateVideos();
    }
  );
};
