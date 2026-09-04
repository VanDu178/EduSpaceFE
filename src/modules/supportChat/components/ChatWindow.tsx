import React, { useRef, useEffect } from 'react';
import { ArrowsRightLeftIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline';
import type { SupportConversation, SupportMessage } from '../types';

interface ChatWindowProps {
  selectedConversation: SupportConversation | null;
  chatMessages: SupportMessage[];
  chatInputText: string;
  isSendingMessage: boolean;
  onAcceptConversation: (convId: number) => void;
  onSendChatMessage: (e?: React.FormEvent) => void;
  onChangeChatInputText: (text: string) => void;
  onOpenConvertModal: () => void;
  onResolveConversation: (convId: number) => void;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  selectedConversation,
  chatMessages,
  chatInputText,
  isSendingMessage,
  onAcceptConversation,
  onSendChatMessage,
  onChangeChatInputText,
  onOpenConvertModal,
  onResolveConversation
}) => {
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  if (!selectedConversation) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl flex-1 flex items-center justify-center text-slate-400 text-xs h-full">
        Chọn một cuộc trò chuyện từ danh sách bên trái để tiếp nhận.
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl flex flex-col h-full overflow-hidden">
      {/* Top Bar */}
      <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between flex-shrink-0">
        <div>
          <h4 className="text-sm font-bold text-slate-900">
            Khách hàng: {selectedConversation.user?.name || selectedConversation.user?.email}
          </h4>
          <p className="text-[11px] text-slate-500 font-mono">Mã Chat: {selectedConversation.code}</p>
        </div>

        <div className="flex items-center space-x-2">
          {selectedConversation.status === 'WAITING_AGENT' && (
            <button
              onClick={() => onAcceptConversation(selectedConversation.id)}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium rounded-lg cursor-pointer"
            >
              Tiếp Nhận Chat
            </button>
          )}

          {selectedConversation.status === 'AGENT_HANDLING' && (
            <>
              <button
                onClick={onOpenConvertModal}
                className="px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-800 text-xs font-medium rounded-lg cursor-pointer flex items-center space-x-1"
              >
                <ArrowsRightLeftIcon className="w-3.5 h-3.5" />
                <span>Tạo Ticket</span>
              </button>
              <button
                onClick={() => onResolveConversation(selectedConversation.id)}
                className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 text-xs font-medium rounded-lg cursor-pointer"
              >
                Hoàn Tất
              </button>
            </>
          )}
        </div>
      </div>

      {/* Messages Body */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5 bg-slate-50/50 min-h-0">
        {chatMessages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${
              msg.senderType === 'AGENT' ? 'items-end' : msg.senderType === 'SYSTEM' ? 'items-center' : 'items-start'
            }`}
          >
            {msg.senderType === 'SYSTEM' ? (
              <div className="bg-slate-200 text-slate-600 text-[11px] px-2.5 py-0.5 rounded-full border border-slate-300 my-1 font-medium">
                {msg.content}
              </div>
            ) : (
              <div
                className={`max-w-[75%] p-2.5 rounded-xl text-xs ${
                  msg.senderType === 'AGENT'
                    ? 'bg-sky-600 text-white rounded-br-none border border-sky-500'
                    : 'bg-white text-slate-800 rounded-bl-none border border-slate-200'
                }`}
              >
                <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                <span className={`text-[9px] block text-right mt-1 opacity-75 ${msg.senderType === 'AGENT' ? 'text-sky-100' : 'text-slate-400'}`}>
                  {new Date(msg.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            )}
          </div>
        ))}
        <div ref={chatBottomRef} />
      </div>

      {/* Bottom Input */}
      {selectedConversation.status === 'AGENT_HANDLING' ? (
        <form onSubmit={onSendChatMessage} className="p-2.5 bg-white border-t border-slate-200 flex items-center space-x-2 flex-shrink-0">
          <input
            type="text"
            placeholder="Nhập nội dung trả lời..."
            value={chatInputText}
            onChange={(e) => onChangeChatInputText(e.target.value)}
            disabled={isSendingMessage}
            className="flex-1 bg-slate-50 border border-slate-200 text-xs text-slate-800 px-3 py-2 rounded-lg focus:outline-none focus:border-sky-500"
          />
          <button
            type="submit"
            disabled={isSendingMessage || !chatInputText.trim()}
            className="px-3.5 py-2 bg-sky-600 hover:bg-sky-700 text-white font-medium text-xs rounded-lg cursor-pointer"
          >
            <PaperAirplaneIcon className="w-4 h-4" />
          </button>
        </form>
      ) : (
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-center text-xs text-slate-500 flex-shrink-0">
          Bấm <strong>"Tiếp Nhận Chat"</strong> ở trên để bắt đầu nhắn tin với Khách hàng.
        </div>
      )}
    </div>
  );
};
