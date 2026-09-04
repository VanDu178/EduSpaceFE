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
          const statusInfo = CONVERSATION_STATUS_LABELS[conv.status] || {
            label: conv.status,
            color: 'bg-slate-200 text-slate-600 border-slate-300'
          };

          return (
            <div
              key={conv.id}
              onClick={() => onSelectConversation(conv)}
              className={`p-3 rounded-xl border cursor-pointer transition ${selectedConversation?.id === conv.id
                ? 'bg-sky-50/80 border-sky-500'
                : 'bg-slate-50/60 hover:bg-slate-100 border-slate-200/80'
                }`}
            >
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-semibold text-slate-900 truncate max-w-[170px]">
                  {conv.user?.name || conv.user?.email || `User #${conv.userId}`}
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${statusInfo.color}`}
                >
                  {statusInfo.label}
                </span>
              </div>
              <p className="text-xs text-slate-500 line-clamp-1">{conv.lastMessage || 'Bắt đầu trò chuyện'}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

