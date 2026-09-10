import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useSocketEvent } from './SocketContext';
import notificationService, { type NotificationItem } from '../../services/notificationService';
import { ChatBubbleLeftRightIcon, TicketIcon } from '@heroicons/react/24/outline';
import { CHAT_SOCKET_EVENTS } from '../../modules/supportChat/constants';
import { TICKET_SOCKET_EVENTS } from '../../modules/supportTickets/constants';

interface NotificationContextValue {
  notifications: NotificationItem[];
  unreadCount: number;
  isLoading: boolean;
  soundEnabled: boolean;
  activeChatId: number | null;
  setActiveChatId: (id: number | null) => void;
  toggleSoundEnabled: () => void;
  fetchNotifications: () => Promise<void>;
  markAsRead: (id?: number) => Promise<void>;
  requestWindowPermission: () => Promise<void>;
  permissionState: NotificationPermission;
}

const NotificationContext = createContext<NotificationContextValue>({
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  soundEnabled: true,
  activeChatId: null,
  setActiveChatId: () => { },
  toggleSoundEnabled: () => { },
  fetchNotifications: async () => { },
  markAsRead: async () => { },
  requestWindowPermission: async () => { },
  permissionState: 'default',
});

let lastChimeTimestamp = 0;

export const playNotificationChime = (forcePlay: boolean = false) => {
  try {
    if (typeof window !== 'undefined') {
      if (!forcePlay) {
        const isEnabled = localStorage.getItem('admin_notification_sound_enabled');
        if (isEnabled !== null && isEnabled === 'false') {
          return;
        }

        const now = Date.now();
        if (now - lastChimeTimestamp < 500) {
          // Prevent double-chime when multiple notification socket events fire simultaneously (e.g. notification:new + USER_NEW_MESSAGE_NOTICE)
          return;
        }
        lastChimeTimestamp = now;
      }

      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContext) {
        const ctx = new AudioContext();
        if (ctx.state === 'suspended') {
          ctx.resume();
        }
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(783.99, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.35);
      }
    }
  } catch (e) {
    console.log('Audio playback prevented or unsupported:', e);
  }
};

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [permissionState, setPermissionState] = useState<NotificationPermission>('default');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('admin_notification_sound_enabled');
      return stored !== 'false';
    }
    return true;
  });
  const [activeChatId, setActiveChatIdState] = useState<number | null>(null);
  const activeChatIdRef = React.useRef<number | null>(null);

  const setActiveChatId = useCallback((id: number | null) => {
    activeChatIdRef.current = id;
    setActiveChatIdState(id);
  }, []);

  const navigate = useNavigate();

  const toggleSoundEnabled = useCallback(() => {
    setSoundEnabled((prev) => {
      const next = !prev;
      if (typeof window !== 'undefined') {
        localStorage.setItem('admin_notification_sound_enabled', String(next));
      }
      if (next) {
        playNotificationChime(true);
      }
      return next;
    });
  }, []);

  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPermissionState(Notification.permission);
    }
  }, []);

  const requestWindowPermission = useCallback(async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      const result = await Notification.requestPermission();
      setPermissionState(result);
    }
  }, []);

  const fetchNotifications = useCallback(async () => {
    if (!token) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }
    try {
      setIsLoading(true);
      const data = await notificationService.getNotifications(1, 30);
      setNotifications(data.notifications || []);
      setUnreadCount(data.unreadCount || 0);
    } catch (err) {
      console.error('[NotificationContext Admin] Fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchNotifications();
    } else {
      setNotifications([]);
      setUnreadCount(0);
    }
  }, [token, fetchNotifications]);

  // Multi-tab sync via Storage Event + BroadcastChannel
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'admin_notification_sync_trigger') {
        fetchNotifications();
      }
    };
    window.addEventListener('storage', handleStorage);

    let channel: BroadcastChannel | null = null;
    if ('BroadcastChannel' in window) {
      channel = new BroadcastChannel('eduspace_notification_sync');
      channel.onmessage = (event) => {
        if (event.data?.type === 'SYNC_NOTIFICATIONS') {
          fetchNotifications();
        }
      };
    }

    return () => {
      window.removeEventListener('storage', handleStorage);
      if (channel) {
        channel.close();
      }
    };
  }, [fetchNotifications]);

  const broadcastSync = useCallback(() => {
    if (typeof window === 'undefined') return;
    try {
      // 1. Native storage event trigger for all other open tabs
      localStorage.setItem('admin_notification_sync_trigger', Date.now().toString());

      // 2. BroadcastChannel trigger
      if ('BroadcastChannel' in window) {
        const channel = new BroadcastChannel('eduspace_notification_sync');
        channel.postMessage({ type: 'SYNC_NOTIFICATIONS', timestamp: Date.now() });
        setTimeout(() => channel.close(), 1000);
      }
    } catch (err) {
      console.warn('[NotificationContext] Multi-tab sync error:', err);
    }
  }, []);

  const queryClient = useQueryClient();

  // Handle incoming Realtime Socket Notification for Admin
  useSocketEvent<{ notification: NotificationItem; unreadCount: number }>(
    'notification:new',
    useCallback(
      (data) => {
        if (!data || !data.notification) return;

        const newNoti = data.notification;

        setNotifications((prev) => [newNoti, ...prev.filter((n) => n.id !== newNoti.id)]);
        setUnreadCount(data.unreadCount !== undefined ? data.unreadCount : (prev) => prev + 1);

        // Sound alert for non-ticket notifications (Ticket handles sound chime for urgent tickets)
        if (!newNoti.type.startsWith('TICKET_')) {
          playNotificationChime();
        } else {
          queryClient.invalidateQueries({ queryKey: ['tickets'] });
        }

        broadcastSync();
      },
      [broadcastSync, queryClient]
    )
  );

  // Handle incoming Realtime Ticket Created Event for Admin
  useSocketEvent<any>(
    TICKET_SOCKET_EVENTS.CREATED,
    useCallback(
      (ticket) => {
        if (!ticket) return;

        // Invalidate tickets React Query cache so badges refresh in real-time
        queryClient.invalidateQueries({ queryKey: ['tickets'] });

        // Show Toast & Play Sound ONLY if ticket priority is HIGH or URGENT
        if (ticket.priority === 'HIGH' || ticket.priority === 'URGENT') {
          playNotificationChime();
          const priorityLabel = ticket.priority === 'URGENT' ? 'Cực kỳ khẩn cấp' : 'Ưu tiên cao';
          const title = `🚨 [${priorityLabel}] Ticket hỗ trợ mới #${ticket.code || ticket.id}`;
          const content = ticket.title || ticket.description || 'Khách hàng vừa gửi yêu cầu hỗ trợ mới.';

          toast.custom(
            (t) => (
              <div
                onClick={() => {
                  toast.dismiss(t.id);
                  navigate('/admin/support', {
                    state: {
                      targetTab: 'tickets',
                      targetId: ticket.id,
                    },
                  });
                }}
                className={`${
                  t.visible ? 'animate-enter' : 'animate-leave'
                } max-w-sm w-full bg-white shadow-xl rounded-2xl pointer-events-auto border border-amber-200 p-4 flex gap-3 items-start backdrop-blur-md cursor-pointer hover:bg-amber-50/50 transition-colors`}
              >
                <div className="p-2 bg-amber-100 rounded-xl shrink-0 text-amber-700">
                  <TicketIcon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-amber-900 line-clamp-1">{title}</p>
                  <p className="text-xs text-slate-600 mt-0.5 line-clamp-2">{content}</p>
                </div>
              </div>
            ),
            { duration: 8000, position: 'bottom-right' }
          );
        } else {
          // Normal tickets silently trigger multi-tab sync & badge updates
          broadcastSync();
        }
      },
      [navigate, queryClient, broadcastSync]
    )
  );

  // Handle incoming Realtime Ticket Updated Event
  useSocketEvent<any>(
    TICKET_SOCKET_EVENTS.UPDATED,
    useCallback(() => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
    }, [queryClient])
  );

  // Handle incoming Realtime Support Chat Notice for Admin
  useSocketEvent<{
    conversationId: number;
    user?: { id: number; name?: string; email?: string; avatarUrl?: string };
    message?: { id: number; content: string; createdAt: string };
  }>(
    CHAT_SOCKET_EVENTS.USER_NEW_MESSAGE_NOTICE,
    useCallback(
      (data) => {
        if (!data || !data.message) return;

        // Sound alert MUST ALWAYS play for incoming user messages
        playNotificationChime();

        // If Admin is currently viewing & actively chatting in this conversation, suppress ONLY the Toast popup
        if (activeChatIdRef.current && activeChatIdRef.current === data.conversationId) {
          return;
        }

        const senderName = data.user?.name || 'Khách hàng';
        const title = `Tin nhắn mới từ ${senderName}`;
        const content = data.message.content || '[Tệp đính kèm]';

        // Toast notification UI
        toast.custom(
          (t) => (
            <div
              onClick={() => {
                toast.dismiss(t.id);
                navigate('/admin/support', {
                  state: {
                    targetTab: 'chat',
                    targetId: data.conversationId,
                  },
                });
              }}
              className={`${t.visible ? 'animate-enter' : 'animate-leave'
                } max-w-sm w-full bg-white shadow-xl rounded-2xl pointer-events-auto border border-emerald-100 p-4 flex gap-3 items-start backdrop-blur-md cursor-pointer hover:bg-emerald-50/50 transition-colors`}
            >
              <div className="p-2 bg-emerald-50 rounded-xl shrink-0 text-emerald-600">
                <ChatBubbleLeftRightIcon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-slate-900 line-clamp-1">{title}</p>
                <p className="text-xs text-slate-600 mt-0.5 line-clamp-2">{content}</p>
              </div>
            </div>
          ),
          { duration: 6000, position: 'bottom-right' }
        );
      },
      [navigate]
    )
  );

  const markAsRead = useCallback(async (id?: number) => {
    try {
      if (id) {
        setNotifications((prev) =>
          prev.map((item) => (item.id === id ? { ...item, isRead: true } : item))
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      } else {
        setNotifications((prev) => prev.map((item) => ({ ...item, isRead: true })));
        setUnreadCount(0);
      }
      await notificationService.markAsRead(id);
      broadcastSync();
    } catch (err) {
      console.error('[NotificationContext Admin] Mark as read error:', err);
    }
  }, [broadcastSync]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        isLoading,
        soundEnabled,
        activeChatId,
        setActiveChatId,
        toggleSoundEnabled,
        fetchNotifications,
        markAsRead,
        requestWindowPermission,
        permissionState,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);
