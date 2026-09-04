import React from 'react';
import { ArrowPathIcon } from '@heroicons/react/24/outline';
import type { SupportConversation } from '../types';

interface ConversationsQueueProps {
  conversations: SupportConversation[];
  selectedConversation: SupportConversation | null;
  isLoadingConversations: boolean;
  onSelectConversation: (conv: SupportConversation) => void;
  onRefreshConversations: () => void;
}

export const ConversationsQueue: React.FC<ConversationsQueueProps> = ({
  conversations,
  selectedConversation,
  isLoadingConversations,
  onSelectConversation,
  onRefreshConversations
}) => {
  return (
    <div className="bg-white border border-slate-200 rounded-xl flex flex-col h-full overflow-hidden">
      <div className="p-3 border-b border-slate-200 flex items-center justify-between bg-slate-50/50 flex-shrink-0">
        <h3 className="text-sm font-bold text-slate-900">Danh sách cuộc trò chuyện</h3>
        <button onClick={onRefreshConversations} className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer">
          <ArrowPathIcon className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-2 min-h-0">
        {isLoadingConversations && (
          <div className="text-center py-6 text-slate-500 text-xs">Đang tải cuộc trò chuyện...</div>
        )}
        {!isLoadingConversations && conversations.length === 0 && (
          <div className="text-center py-10 text-slate-500 text-xs">Chưa có cuộc trò chuyện nào.</div>
        )}
        {conversations.map((conv) => (
          <div
            key={conv.id}
            onClick={() => onSelectConversation(conv)}
            className={`p-3 rounded-lg border cursor-pointer transition ${selectedConversation?.id === conv.id
                ? 'bg-sky-50/80 border-sky-500'
                : 'bg-slate-50/60 hover:bg-slate-100 border-slate-200'
              }`}
          >
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-semibold text-slate-900 truncate max-w-[170px]">
                {conv.user?.name || conv.user?.email || `User #${conv.userId}`}
              </span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${conv.status === 'WAITING_AGENT'
                    ? 'bg-amber-100 text-amber-800 border border-amber-300 animate-pulse'
                    : conv.status === 'AGENT_HANDLING'
                      ? 'bg-sky-100 text-sky-800 border border-sky-300'
                      : 'bg-slate-200 text-slate-600'
                  }`}
              >
                {conv.status === 'WAITING_AGENT' ? 'Đang chờ' : conv.status === 'AGENT_HANDLING' ? 'Đang chat' : conv.status}
              </span>
            </div>
            <p className="text-xs text-slate-500 line-clamp-1">{conv.lastMessage || 'Bắt đầu trò chuyện'}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
