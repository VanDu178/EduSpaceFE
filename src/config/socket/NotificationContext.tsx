import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { useSocketEvent } from './SocketContext';
import notificationService, { type NotificationItem } from '../../services/notificationService';
import { TicketIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';

interface NotificationContextValue {
  notifications: NotificationItem[];
  unreadCount: number;
  isLoading: boolean;
  fetchNotifications: () => Promise<void>;
  markAsRead: (id?: number) => Promise<void>;
  requestWindowPermission: () => Promise<void>;
  permissionState: NotificationPermission;
}

const NotificationContext = createContext<NotificationContextValue>({
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  fetchNotifications: async () => {},
  markAsRead: async () => {},
  requestWindowPermission: async () => {},
  permissionState: 'default',
});

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [permissionState, setPermissionState] = useState<NotificationPermission>('default');

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

  const playNotificationSound = useCallback(() => {
    try {
      if (typeof window !== 'undefined') {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContext) {
          const ctx = new AudioContext();
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(587.33, ctx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15);
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
  }, []);

  // Handle incoming Realtime Socket Notification for Admin
  useSocketEvent<{ notification: NotificationItem; unreadCount: number }>(
    'notification:new',
    useCallback(
      (data) => {
        if (!data || !data.notification) return;

        const newNoti = data.notification;

        setNotifications((prev) => [newNoti, ...prev.filter((n) => n.id !== newNoti.id)]);
        setUnreadCount(data.unreadCount !== undefined ? data.unreadCount : (prev) => prev + 1);

        // Sound alert
        playNotificationSound();

        // Toast notification UI
        toast.custom(
          (t) => (
            <div
              className={`${
                t.visible ? 'animate-enter' : 'animate-leave'
              } max-w-sm w-full bg-white shadow-xl rounded-2xl pointer-events-auto border border-sky-100 p-4 flex gap-3 items-start backdrop-blur-md`}
            >
              <div className="p-2 bg-sky-50 rounded-xl shrink-0 text-sky-600">
                <TicketIcon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-slate-900 line-clamp-1">{newNoti.title}</p>
                <p className="text-xs text-slate-600 mt-0.5 line-clamp-2">{newNoti.content}</p>
              </div>
            </div>
          ),
          { duration: 5000 }
        );

        // Window Notification
        if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
          try {
            new Notification(newNoti.title, {
              body: newNoti.content,
              icon: '/logo.png',
            });
          } catch (err) {
            console.error('[NotificationContext Admin] Window notification error:', err);
          }
        }
      },
      [playNotificationSound]
    )
  );

  // Handle incoming Realtime Support Chat Notice for Admin
  useSocketEvent<{
    conversationId: number;
    user?: { id: number; name?: string; email?: string; avatarUrl?: string };
    message?: { id: number; content: string; createdAt: string };
  }>(
    'user_new_message_notice',
    useCallback(
      (data) => {
        if (!data || !data.message) return;

        const senderName = data.user?.name || data.user?.email || 'Khách hàng';
        const title = `Tin nhắn CSKH từ ${senderName}`;
        const content = data.message.content || '[Tệp đính kèm]';

        // Sound alert
        playNotificationSound();

        // Toast notification UI
        toast.custom(
          (t) => (
            <div
              onClick={() => {
                toast.dismiss(t.id);
                if (typeof window !== 'undefined') {
                  window.location.href = '/support-chat';
                }
              }}
              className={`${
                t.visible ? 'animate-enter' : 'animate-leave'
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
          { duration: 6000 }
        );

        // Window Notification
        if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
          try {
            const winNoti = new Notification(title, {
              body: content,
              icon: data.user?.avatarUrl || '/logo.png',
            });
            winNoti.onclick = () => {
              window.focus();
              if (typeof window !== 'undefined') {
                window.location.href = '/support-chat';
              }
            };
          } catch (err) {
            console.error('[NotificationContext Admin] Chat window notification error:', err);
          }
        }
      },
      [playNotificationSound]
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
    } catch (err) {
      console.error('[NotificationContext Admin] Mark as read error:', err);
    }
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        isLoading,
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
