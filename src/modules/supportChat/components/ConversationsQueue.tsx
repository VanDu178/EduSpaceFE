import type { SupportConversation } from '../types';
import { CONVERSATION_STATUS_LABELS } from '../constants';

interface ConversationsQueueProps {
  conversations: SupportConversation[];
  selectedConversation: SupportConversation | null;
  isLoadingConversations: boolean;
  onSelectConversation: (conv: SupportConversation) => void;
  onRefreshConversations?: () => void;
}

export const ConversationsQueue = ({
  conversations,
  selectedConversation,
  isLoadingConversations,
  onSelectConversation
}: ConversationsQueueProps) => {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-2 min-h-0">
        {isLoadingConversations && (
          <div className="text-center py-6 text-slate-400 text-xs italic">Đang tải cuộc trò chuyện...</div>
        )}
        {!isLoadingConversations && conversations.length === 0 && (
          <div className="text-center py-10 text-slate-400 text-xs italic">Không tìm thấy cuộc trò chuyện nào.</div>
        )}
        {conversations.map((conv) => {
          const isUnread = (conv.agentUnreadCount || 0) > 0;
          const statusInfo = CONVERSATION_STATUS_LABELS[conv.status] || {
            label: conv.status,
            color: 'bg-slate-200 text-slate-600 border-slate-300'
          };

          return (
            <div
              key={conv.id}
              onClick={() => onSelectConversation(conv)}
              className={`relative p-3 rounded-xl border cursor-pointer transition ${selectedConversation?.id === conv.id
                ? 'bg-sky-50/80 border-sky-500'
                : isUnread
                  ? 'bg-emerald-50/40 hover:bg-emerald-50/80 border-emerald-300'
                  : 'bg-slate-50/60 hover:bg-slate-100 border-slate-200/80'
                }`}
            >
              {isUnread && (
                <span
                  className="absolute -top-0.5 -right-0.5 z-10 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white animate-pulse"
                  title="Có tin nhắn mới chưa đọc"
                />
              )}
              <div className="flex items-center justify-between text-xs mb-1">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className={`!truncate max-w-[150px] ${isUnread ? 'font-bold text-slate-900' : 'font-semibold text-slate-800'}`}>
                    {conv.user?.name || "Khách hàng ẩn danh"}
                  </span>
                </div>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${statusInfo.color}`}
                >
                  {statusInfo.label}
                </span>
              </div>
              <p className={`text-xs line-clamp-1 ${isUnread ? 'font-semibold text-slate-800' : 'text-slate-500'}`}>
                {conv.lastMessage || 'Bắt đầu trò chuyện'}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

