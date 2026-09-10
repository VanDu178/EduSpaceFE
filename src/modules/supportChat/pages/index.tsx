import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import type { SupportConversation, SupportMessage, ChatFilterParams } from '../types';
import { ConversationsQueue, ChatWindow, FilterBar } from '../components';
import {
  useConversationsQuery,
  useConversationDetailQuery,
  useAcceptConversationMutation,
  useSendChatMessageMutation,
  useResolveConversationMutation,
  useMarkConversationAsReadMutation
} from '../hooks';
import { useSocket, useSocketEvent } from '../../../config/socket/SocketContext';
import { useNotification, playNotificationChime } from '../../../config/socket/NotificationContext';
import { CHAT_SOCKET_EVENTS } from '../constants';

export interface SupportChatPageProps {
  onOpenConvertModal?: (conversation: SupportConversation) => void;
}

const defaultFilterParams: ChatFilterParams = {
  status: null,
  search: null
}

export const SupportChatPage = ({ onOpenConvertModal }: SupportChatPageProps = {}) => {
  const [filterParams, setFilterParams] = useState<ChatFilterParams>(defaultFilterParams);
  const { data: conversationsData, isLoading: isLoadingConversations, refetch: refetchConversations } = useConversationsQuery(filterParams);
  const conversations: SupportConversation[] = conversationsData?.data || [];

  const { mutate: acceptConversationMutation } = useAcceptConversationMutation();
  const { isPending: isPendingSendMessage, mutate: sendMessageMutation } = useSendChatMessageMutation();
  const { mutate: resolveConversationMutation } = useResolveConversationMutation();
  const { mutate: markConversationAsReadMutation } = useMarkConversationAsReadMutation();

  const { setActiveChatId } = useNotification();
  const [selectedConversation, setSelectedConversation] = useState<SupportConversation | null>(null);
  const [chatMessages, setChatMessages] = useState<SupportMessage[]>([]);
  const [chatInputText, setChatInputText] = useState('');

  const { socket } = useSocket();
  const location = useLocation();
  const locationState = location.state as { targetTab?: string; targetId?: number } | null;
  const targetId = locationState?.targetId;

  // Sync activeChatId to NotificationContext to suppress redundant global toast/sound
  useEffect(() => {
    setActiveChatId(selectedConversation?.id || null);
    return () => {
      setActiveChatId(null);
    };
  }, [selectedConversation?.id, setActiveChatId]);

  // Lấy chi tiết cuộc trò chuyện nếu đã chọn hoặc có targetId từ notification state
  const targetConversationId = selectedConversation?.id || (locationState?.targetTab === 'chat' || !locationState?.targetTab ? targetId : null) || null;
  const { data: conversationDetailData, isLoading: isLoadingMessages } = useConversationDetailQuery(targetConversationId);

  useEffect(() => {
    if (conversationDetailData?.data) {
      if (conversationDetailData.data.messages) {
        setChatMessages(conversationDetailData.data.messages);
      }
      if (!selectedConversation || selectedConversation.id !== conversationDetailData.data.id) {
        setSelectedConversation(conversationDetailData.data);
      }
    }
  }, [conversationDetailData]);

  // Đồng bộ chọn conversation khi conversations queue sẵn sàng hoặc targetId thay đổi
  useEffect(() => {
    if (targetId && (locationState?.targetTab === 'chat' || !locationState?.targetTab)) {
      setFilterParams(defaultFilterParams);
      refetchConversations();
      const found = conversations.find((c) => c.id === targetId);
      if (found) {
        setSelectedConversation(found);
        if (socket) {
          socket.emit(CHAT_SOCKET_EVENTS.JOIN_CONVERSATION, { conversationId: found.id });
        }
        // Clean up location.state after consuming targetId
        window.history.replaceState({}, document.title);
      }
    }
  }, [targetId, conversations, locationState?.targetTab, socket, refetchConversations]);

  useSocketEvent(CHAT_SOCKET_EVENTS.CONVERSATION_UPDATED, () => {
    refetchConversations();
  });

  useSocketEvent<{ conversationId: number; message: SupportMessage }>(CHAT_SOCKET_EVENTS.NEW_MESSAGE, (data) => {
    if (!data || !data.message) return;

    if (selectedConversation && selectedConversation.id === data.conversationId) {
      setChatMessages((prev) => {
        if (prev.some((m) => m.id === data.message.id)) return prev;
        return [...prev, data.message];
      });
    }
  });

  const handleSelectConversation = (conv: SupportConversation) => {
    setSelectedConversation(conv);
    if ((conv.agentUnreadCount || 0) > 0) {
      markConversationAsReadMutation(conv.id);
    }
    if (socket) {
      socket.emit(CHAT_SOCKET_EVENTS.JOIN_CONVERSATION, { conversationId: conv.id });
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
              socket.emit(CHAT_SOCKET_EVENTS.SEND_MESSAGE, {
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

