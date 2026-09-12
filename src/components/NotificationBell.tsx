import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Popover, Badge, Spin, Empty } from 'antd';
import {
  BellIcon,
  CheckIcon,
  TicketIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/outline';
import { useNotification } from '../config/socket/NotificationContext';
import type { NotificationItem } from '../services/notificationService';

export const NotificationBell: React.FC = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const {
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    requestWindowPermission,
    permissionState,
  } = useNotification();

  const handleNotificationClick = async (item: NotificationItem) => {
    if (!item.isRead) {
      await markAsRead(item.id);
    }
    setOpen(false);
    if (item.link) {
      try {
        const dummyUrl = new URL(item.link, 'http://localhost');
        const path = dummyUrl.pathname;
        const params = new URLSearchParams(dummyUrl.search);
        const tabParam = params.get('tab');
        const ticketIdParam = params.get('ticketId');
        const chatIdParam = params.get('chatId') || params.get('conversationId');

        if (path === '/admin/support' || path === '/support') {
          const targetTab = tabParam || (ticketIdParam ? 'tickets' : 'chat');
          const targetId = ticketIdParam ? Number(ticketIdParam) : (chatIdParam ? Number(chatIdParam) : undefined);

          navigate(path, {
            state: {
              targetTab,
              targetId,
            },
          });
          return;
        }
      } catch {
        // Fallback nếu parse URL gặp lỗi
      }

      const targetPath = item.link.startsWith('/') ? item.link : `/${item.link}`;
      navigate(targetPath);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'TICKET_CREATED':
      case 'TICKET_REPLIED':
      case 'TICKET_STATUS_CHANGED':
        return <TicketIcon className="w-4 h-4 text-sky-600" />;
      default:
        return <InformationCircleIcon className="w-4 h-4 text-slate-600" />;
    }
  };

  const formatTimeAgo = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / (1000 * 60));
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      if (diffMins < 1) return 'Vừa xong';
      if (diffMins < 60) return `${diffMins} phút trước`;
      if (diffHours < 24) return `${diffHours} giờ trước`;
      if (diffDays < 7) return `${diffDays} ngày trước`;
      return date.toLocaleDateString('vi-VN');
    } catch {
      return dateString;
    }
  };

  const dropdownContent = (
    <div className="w-80 sm:w-96 max-h-[460px] flex flex-col bg-white rounded-xl border border-slate-200 overflow-hidden font-sans">
      {/* Dropdown Header */}
      <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-sm text-slate-900">Thông báo Quản trị</span>
          {unreadCount > 0 && (
            <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-sky-100 text-sky-700">
              {unreadCount} mới
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={() => markAsRead()}
            className="text-xs font-medium text-sky-600 hover:text-sky-700 hover:underline flex items-center gap-1 transition-colors cursor-pointer"
          >
            <CheckIcon className="w-3.5 h-3.5" />
            <span>Đã đọc tất cả</span>
          </button>
        )}
      </div>

      {/* Permission Request Prompt */}
      {permissionState === 'default' && (
        <div className="px-4 py-2.5 bg-amber-50/80 border-b border-amber-100 flex items-center justify-between gap-2">
          <p className="text-xs text-amber-800">Bật thông báo trình duyệt để nhận yêu cầu hỗ trợ mới.</p>
          <button
            onClick={requestWindowPermission}
            className="px-2.5 py-1 text-xs font-semibold bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors shrink-0 cursor-pointer"
          >
            Bật ngay
          </button>
        </div>
      )}

      {/* Notification List */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
        {isLoading && notifications.length === 0 ? (
          <div className="py-8 flex justify-center items-center">
            <Spin size="small" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="py-8 text-center">
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={<span className="text-xs text-slate-500">Chưa có thông báo nào</span>} />
          </div>
        ) : (
          notifications.map((item) => (
            <div
              key={item.id}
              onClick={() => handleNotificationClick(item)}
              className={`p-3.5 flex gap-3 items-start transition-colors cursor-pointer ${item.isRead ? 'bg-white hover:bg-slate-50' : 'bg-sky-50/40 hover:bg-sky-50/80'
                }`}
            >
              <div className={`p-2 rounded-lg shrink-0 mt-0.5 ${item.isRead ? 'bg-slate-100' : 'bg-sky-100'}`}>
                {getNotificationIcon(item.type)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className={`text-xs ${item.isRead ? 'font-medium text-slate-800' : 'font-semibold text-slate-900'} line-clamp-1`}>
                    {item.title}
                  </p>
                  {!item.isRead && <span className="w-2 h-2 rounded-full bg-sky-500 shrink-0" />}
                </div>

                <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                  {item.content}
                </p>

                <p className="text-[11px] text-slate-400 mt-1.5 font-normal">
                  {formatTimeAgo(item.createdAt)}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  return (
    <Popover
      content={dropdownContent}
      trigger="click"
      open={open}
      onOpenChange={setOpen}
      placement="bottomRight"
      overlayClassName="notification-bell-popover"
      styles={{ body: { padding: 0, backgroundColor: 'transparent' } }}
    >
      <button
        type="button"
        className="relative p-2 text-slate-600 hover:text-sky-600 rounded-xl hover:bg-slate-100/80 transition-colors flex items-center justify-center cursor-pointer"
        aria-label="Thông báo"
      >
        <Badge count={unreadCount} overflowCount={99} size="small" offset={[-2, 2]}>
          <BellIcon className="w-5 h-5 text-slate-700" />
        </Badge>
      </button>
    </Popover>
  );
};

export default NotificationBell;
