import React, { useState, useEffect, useRef } from 'react';
import { ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';
import type { SupportConversation, SupportMessage } from '../types';
import { LiveChatHub, AdminPresenceToggle } from '../components';
import {
  useAdminStatusQuery,
  useConversationsQuery,
  useToggleAdminStatusMutation,
  useAcceptConversationMutation,
  useSendChatMessageMutation,
  useResolveConversationMutation
} from '../hooks';
import { io, Socket } from 'socket.io-client';

export const SupportChatPage: React.FC = () => {
  const { data: adminStatusData } = useAdminStatusQuery();
  const isAdminOnline = Boolean(adminStatusData?.data?.isOnline);

  const { data: conversationsData, isLoading: isLoadingConversations, refetch: refetchConversations } = useConversationsQuery();
  const conversations: SupportConversation[] = conversationsData?.data || [];

  const toggleAdminStatusMutation = useToggleAdminStatusMutation();
  const acceptConversationMutation = useAcceptConversationMutation();
  const sendMessageMutation = useSendChatMessageMutation();
  const resolveConversationMutation = useResolveConversationMutation();

  const [selectedConversation, setSelectedConversation] = useState<SupportConversation | null>(null);
  const [chatMessages, setChatMessages] = useState<SupportMessage[]>([]);
  const [chatInputText, setChatInputText] = useState('');

  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
    const socketUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

    if (token) {
      const socket = io(socketUrl, {
        auth: { token },
        transports: ['websocket', 'polling']
      });

      socketRef.current = socket;

      socket.on('user_new_message_notice', () => {
        refetchConversations();
      });

      socket.on('new_message', (data: { conversationId: number; message: SupportMessage }) => {
        if (selectedConversation && selectedConversation.id === data.conversationId) {
          setChatMessages((prev) => {
            if (prev.some((m) => m.id === data.message.id)) return prev;
            return [...prev, data.message];
          });
        }
      });

      return () => {
        socket.disconnect();
      };
    }
  }, [selectedConversation, refetchConversations]);

  const handleToggleAdminStatus = () => {
    const nextStatus = !isAdminOnline;
    toggleAdminStatusMutation.mutate(nextStatus, {
      onSuccess: () => {
        if (socketRef.current) {
          socketRef.current.emit('toggle_admin_status', { isOnline: nextStatus });
        }
      }
    });
  };

  const handleSelectConversation = (conv: SupportConversation) => {
    setSelectedConversation(conv);
    setChatMessages(conv.messages || []);
    if (socketRef.current) {
      socketRef.current.emit('join_conversation', { conversationId: conv.id });
    }
  };

  const handleAcceptConversation = (convId: number) => {
    acceptConversationMutation.mutate(convId, {
      onSuccess: (res) => {
        setSelectedConversation(res.data);
        setChatMessages(res.data?.messages || []);
      }
    });
  };

  const handleSendAdminChatMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chatInputText.trim() || !selectedConversation || sendMessageMutation.isPending) return;

    const text = chatInputText.trim();
    setChatInputText('');

    sendMessageMutation.mutate(
      { conversationId: selectedConversation.id, content: text },
      {
        onSuccess: (res) => {
          if (res.data) {
            setChatMessages((prev) => [...prev, res.data]);
            if (socketRef.current) {
              socketRef.current.emit('send_message', {
                conversationId: selectedConversation.id,
                content: text
              });
            }
          }
        }
      }
    );
  };

  const handleResolveConversation = (convId: number) => {
    resolveConversationMutation.mutate(convId, {
      onSuccess: () => {
        setSelectedConversation(null);
      }
    });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-110px)] overflow-hidden text-slate-800">
      <div className="flex items-center justify-between gap-4 mb-3 flex-shrink-0">
        <div className="flex items-center space-x-2">
          <ChatBubbleLeftRightIcon className="w-6 h-6 text-sky-600" />
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">Hỗ Trợ Live Chat Trực Tiếp</h1>
        </div>

        <AdminPresenceToggle
          isAdminOnline={isAdminOnline}
          isTogglingStatus={toggleAdminStatusMutation.isPending}
          onToggleStatus={handleToggleAdminStatus}
        />
      </div>

      <LiveChatHub
        conversations={conversations}
        selectedConversation={selectedConversation}
        chatMessages={chatMessages}
        chatInputText={chatInputText}
        isSendingMessage={sendMessageMutation.isPending}
        isLoadingConversations={isLoadingConversations}
        onSelectConversation={handleSelectConversation}
        onRefreshConversations={refetchConversations}
        onAcceptConversation={handleAcceptConversation}
        onSendChatMessage={handleSendAdminChatMessage}
        onChangeChatInputText={setChatInputText}
        onOpenConvertModal={() => {}}
        onResolveConversation={handleResolveConversation}
      />
    </div>
  );
};

export default SupportChatPage;
