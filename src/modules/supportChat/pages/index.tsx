import React, { useState, useEffect } from 'react';
import { ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';
import type { SupportConversation, SupportMessage, ChatFilterParams } from '../types';
import { ConversationsQueue, ChatWindow, AdminPresenceToggle, FilterBar } from '../components';
import {
  useAdminStatusQuery,
  useConversationsQuery,
  useConversationDetailQuery,
  useAcceptConversationMutation,
  useSendChatMessageMutation,
  useResolveConversationMutation
} from '../hooks';
import { useSocket, useSocketEvent } from '../../../config/socket/SocketContext';

export interface SupportChatPageProps {
  onOpenConvertModal?: (conversation: SupportConversation) => void;
  showHeader?: boolean;
}

const defaultFilterParams: ChatFilterParams = {
  status: '',
  search: ''
}

export const SupportChatPage = ({ onOpenConvertModal, showHeader = true }: SupportChatPageProps = {}) => {
  const [filterParams, setFilterParams] = useState<ChatFilterParams>(defaultFilterParams);
  const { data: adminStatusData } = useAdminStatusQuery();
  const isAdminOnline = Boolean(adminStatusData?.data?.isOnline);

  const { data: conversationsData, isLoading: isLoadingConversations, refetch: refetchConversations } = useConversationsQuery(filterParams);
  const conversations: SupportConversation[] = conversationsData?.data || [];

  const { mutate: acceptConversationMutation } = useAcceptConversationMutation();
  const { isPending: isPendingSendMessage, mutate: sendMessageMutation } = useSendChatMessageMutation();
  const { mutate: resolveConversationMutation } = useResolveConversationMutation();

  const [selectedConversation, setSelectedConversation] = useState<SupportConversation | null>(null);
  const [chatMessages, setChatMessages] = useState<SupportMessage[]>([]);
  const [chatInputText, setChatInputText] = useState('');

  const { data: conversationDetailData, isLoading: isLoadingMessages } = useConversationDetailQuery(selectedConversation?.id || null);

  useEffect(() => {
    if (conversationDetailData?.data?.messages) {
      setChatMessages(conversationDetailData.data.messages);
    }
  }, [conversationDetailData]);

  const { socket } = useSocket();

  useSocketEvent('user_new_message_notice', () => {
    refetchConversations();
  });

  useSocketEvent<{ conversationId: number; message: SupportMessage }>('new_message', (data) => {
    if (selectedConversation && selectedConversation.id === data.conversationId) {
      setChatMessages((prev) => {
        if (prev.some((m) => m.id === data.message.id)) return prev;
        return [...prev, data.message];
      });
    }
  });

  const handleSelectConversation = (conv: SupportConversation) => {
    setSelectedConversation(conv);
    if (socket) {
      socket.emit('join_conversation', { conversationId: conv.id });
    }
  };

  const handleAcceptConversation = (convId: number) => {
    acceptConversationMutation(convId, {
      onSuccess: (res) => {
        if (res?.data) {
          setSelectedConversation(res.data);
          if (res.data.messages) {
            setChatMessages(res.data.messages);
          }
        }
      }
    });
  };

  const handleSendAdminChatMessage = (e?: React.FormEvent, attachments?: string[]) => {
    if (e) e.preventDefault();
    if ((!chatInputText.trim() && (!attachments || attachments.length === 0)) || !selectedConversation || isPendingSendMessage) return;

    const text = chatInputText.trim();
    setChatInputText('');

    sendMessageMutation(
      { conversationId: selectedConversation.id, content: text, attachments },
      {
        onSuccess: (res) => {
          if (res?.data) {
            setChatMessages((prev) => {
              if (prev.some((m) => m.id === res.data.id)) return prev;
              return [...prev, res.data];
            });
            if (socket) {
              socket.emit('send_message', {
                conversationId: selectedConversation.id,
                content: text,
                attachments
              });
            }
          }
        }
      }
    );
  };

  const handleResolveConversation = (convId: number) => {
    resolveConversationMutation(convId, {
      onSuccess: () => {
        setSelectedConversation(null);
        setChatMessages([]);
      }
    });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-110px)] overflow-hidden text-slate-800">
      {showHeader && (
        <div className="flex items-center justify-between gap-4 mb-3 flex-shrink-0">
          <div className="flex items-center space-x-2">
            <ChatBubbleLeftRightIcon className="w-6 h-6 text-sky-600" />
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">Quản lý kênh chat</h1>
          </div>

          <AdminPresenceToggle isAdminOnline={isAdminOnline} />
        </div>
      )}

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 min-h-0 overflow-hidden">
        <div className="lg:col-span-4 h-full flex flex-col overflow-hidden bg-white border border-slate-200/80 rounded-2xl">
          <FilterBar filterParams={filterParams} onFilterChange={setFilterParams} />
          <div className="flex-1 min-h-0">
            <ConversationsQueue
              conversations={conversations}
              selectedConversation={selectedConversation}
              isLoadingConversations={isLoadingConversations}
              onSelectConversation={handleSelectConversation}
              onRefreshConversations={refetchConversations}
            />
          </div>
        </div>

        <div className="lg:col-span-8 h-full overflow-hidden">
          <ChatWindow
            selectedConversation={selectedConversation}
            chatMessages={chatMessages}
            isLoadingMessages={isLoadingMessages}
            chatInputText={chatInputText}
            isSendingMessage={isPendingSendMessage}
            onAcceptConversation={handleAcceptConversation}
            onSendChatMessage={handleSendAdminChatMessage}
            onChangeChatInputText={setChatInputText}
            onOpenConvertModal={() => {
              if (onOpenConvertModal && selectedConversation) {
                onOpenConvertModal(selectedConversation);
              }
            }}
            onResolveConversation={handleResolveConversation}
          />
        </div>
      </div>
    </div>
  );
};

export default SupportChatPage;

