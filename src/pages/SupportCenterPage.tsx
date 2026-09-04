import React, { useState } from 'react';
import { BellIcon } from '@heroicons/react/24/outline';
import {
  LiveChatHub,
  AdminPresenceToggle,
  useAdminStatusQuery,
  useConversationsQuery,
  useAcceptConversationMutation,
  useSendChatMessageMutation,
  useResolveConversationMutation
} from '../modules/supportChat';
import type { SupportConversation, SupportMessage } from '../modules/supportChat';
import {
  TicketHub,
  ModalConvert,
  useTicketsQuery,
  useAddTicketCommentMutation,
  useUpdateTicketStatusMutation,
  useConvertChatToTicketMutation
} from '../modules/tickets';
import type { Ticket, TicketCategory, TicketPriority } from '../modules/tickets';
import { ticketApi } from '../modules/tickets';
import { chatApi } from '../modules/supportChat';
import { useSocket, useSocketEvent } from '../config/socket/SocketContext';
import toast from 'react-hot-toast';

export const SupportCenterPage = () => {
  const [activeTab, setActiveTab] = useState<'chat' | 'tickets'>('chat');
  const { socket } = useSocket();

  // React Query Hooks for Chat Realtime (supportChat module)
  const { data: adminStatusData, refetch: refetchAdminStatus } = useAdminStatusQuery();
  const isAdminOnline = Boolean(adminStatusData?.data?.isOnline);

  const { data: conversationsData, isLoading: isLoadingConversations, refetch: refetchConversations } = useConversationsQuery();
  const conversations: SupportConversation[] = conversationsData?.data || [];

  const acceptConversationMutation = useAcceptConversationMutation();
  const sendMessageMutation = useSendChatMessageMutation();
  const resolveConversationMutation = useResolveConversationMutation();

  const [selectedConversation, setSelectedConversation] = useState<SupportConversation | null>(null);
  const [chatMessages, setChatMessages] = useState<SupportMessage[]>([]);
  const [chatInputText, setChatInputText] = useState('');

  // Lắng nghe socket event 'admin_presence_updated'
  useSocketEvent('admin_presence_updated', () => {
    refetchAdminStatus();
  });

  // Lắng nghe socket event 'user_new_message_notice'
  useSocketEvent<{ conversationId: number; message: SupportMessage }>('user_new_message_notice', (data) => {
    toast.custom(() => (
      <div className="bg-white border border-sky-500 text-slate-800 p-3 rounded-xl flex items-center space-x-3">
        <BellIcon className="w-6 h-6 text-sky-600 animate-bounce" />
        <div>
          <p className="text-xs font-bold text-slate-900">Tin nhắn mới từ Khách hàng!</p>
          <p className="text-xs text-slate-600 line-clamp-1">{data.message.content}</p>
        </div>
      </div>
    ));
    refetchConversations();
  });

  // Lắng nghe socket event 'new_message'
  useSocketEvent<{ conversationId: number; message: SupportMessage }>('new_message', (data) => {
    if (selectedConversation && selectedConversation.id === data.conversationId) {
      setChatMessages((prev) => {
        if (prev.some((m) => m.id === data.message.id)) return prev;
        return [...prev, data.message];
      });
    }
  });

  // --- Realtime Chat Handlers ---
  const handleSelectConversation = async (conv: SupportConversation) => {
    setSelectedConversation(conv);
    try {
      const res = await chatApi.getConversationDetail(conv.id);
      setSelectedConversation(res.data);
      setChatMessages(res.data?.messages || []);
      if (socket) {
        socket.emit('join_conversation', { conversationId: conv.id });
      }
    } catch {
      // Ignore
    }
  };

  const handleAcceptConversation = (convId: number) => {
    acceptConversationMutation.mutate(convId, {
      onSuccess: (res) => {
        setSelectedConversation(res.data);
        setChatMessages(res.data?.messages || []);
        refetchConversations();
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
            setChatMessages((prev) => {
              if (prev.some((m) => m.id === res.data.id)) return prev;
              return [...prev, res.data];
            });
          }
        }
      }
    );
  };

  const handleResolveConversation = (convId: number) => {
    resolveConversationMutation.mutate(convId, {
      onSuccess: () => {
        setSelectedConversation(null);
        refetchConversations();
      }
    });
  };

  // --- Ticket Management Handlers ---
  const handleClearFilters = () => {
    setFilterStatus('');
    setFilterCategory('');
    setSearchKeyword('');
    refetchTickets();
  };

  const handleSelectTicket = async (ticketId: number) => {
    try {
      const res = await ticketApi.getTicketById(ticketId);
      setSelectedTicket(res.data);
      setNewStatus(res.data.status);
    } catch (err: any) {
      toast.error('Lỗi tải Ticket');
    }
  };

  const handleAddTicketComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketCommentText.trim() || !selectedTicket || addTicketCommentMutation.isPending) return;

    addTicketCommentMutation.mutate(
      { id: selectedTicket.id, data: { content: ticketCommentText.trim() } },
      {
        onSuccess: () => {
          setTicketCommentText('');
          handleSelectTicket(selectedTicket.id);
        }
      }
    );
  };

  const handleUpdateTicketStatus = () => {
    if (!selectedTicket || !newStatus) return;

    updateTicketStatusMutation.mutate(
      { id: selectedTicket.id, data: { status: newStatus } },
      {
        onSuccess: (res) => {
          setSelectedTicket(res.data);
          refetchTickets();
        }
      }
    );
  };

  const handleConvertChatToTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedConversation || !convertTitle.trim() || convertChatToTicketMutation.isPending) return;

    convertChatToTicketMutation.mutate(
      {
        conversationId: selectedConversation.id,
        title: convertTitle,
        category: convertCategory,
        priority: convertPriority
      },
      {
        onSuccess: () => {
          setShowConvertModal(false);
          setConvertTitle('');
          setSelectedConversation(null);
          refetchConversations();
          refetchTickets();
        }
      }
    );
  };

  return (
    <div className="flex flex-col h-[calc(100vh-110px)] overflow-hidden text-slate-800">
      {/* Header Compact */}
      <div className="flex items-center justify-between gap-4 mb-3 flex-shrink-0">
        <div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">Trung tâm hổ trợ CSKH</h1>
        </div>

        {/* Admin Presence Badge */}
        <AdminPresenceToggle isAdminOnline={isAdminOnline} />
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 mb-3 text-xs sm:text-sm flex-shrink-0">
        <button
          onClick={() => setActiveTab('chat')}
          className={`py-2 px-4 font-semibold flex items-center space-x-2 border-b-2 cursor-pointer transition ${activeTab === 'chat'
            ? 'border-sky-600 text-sky-600 bg-white rounded-t-lg'
            : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
        >
          <span>Live chat</span>
          {conversations.filter((c) => c.status === 'WAITING_AGENT').length > 0 && (
            <span className="bg-amber-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
              {conversations.filter((c) => c.status === 'WAITING_AGENT').length}
            </span>
          )}
        </button>

        <button
          onClick={() => {
            setActiveTab('tickets');
            refetchTickets();
          }}
          className={`py-2 px-4 font-semibold flex items-center space-x-2 border-b-2 cursor-pointer transition ${activeTab === 'tickets'
            ? 'border-sky-600 text-sky-600 bg-white rounded-t-lg'
            : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
        >
          <span>Quản lý ticket hổ trợ</span>
        </button>
      </div>

      {/* TAB 1: Realtime Chat Component (from supportChat module) */}
      {activeTab === 'chat' && (
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
          onOpenConvertModal={() => setShowConvertModal(true)}
          onResolveConversation={handleResolveConversation}
        />
      )}

      {/* TAB 2: Ticket Management Component (from tickets module) */}
      {activeTab === 'tickets' && (
        <TicketHub
          tickets={tickets}
          selectedTicket={selectedTicket}
          isLoadingTickets={isLoadingTickets}
          searchKeyword={searchKeyword}
          filterStatus={filterStatus}
          filterCategory={filterCategory}
          newStatus={newStatus}
          ticketCommentText={ticketCommentText}
          isSubmittingComment={addTicketCommentMutation.isPending}
          onSearchChange={setSearchKeyword}
          onFilterStatusChange={setFilterStatus}
          onFilterCategoryChange={setFilterCategory}
          onLoadTickets={refetchTickets}
          onClearFilters={handleClearFilters}
          onSelectTicket={handleSelectTicket}
          onNewStatusChange={setNewStatus}
          onUpdateTicketStatus={handleUpdateTicketStatus}
          onCommentTextChange={setTicketCommentText}
          onAddTicketComment={handleAddTicketComment}
        />
      )}

      {/* Convert Chat to Ticket Modal (from tickets module) */}
      <ModalConvert
        open={showConvertModal}
        convertTitle={convertTitle}
        convertCategory={convertCategory}
        convertPriority={convertPriority}
        isConverting={convertChatToTicketMutation.isPending}
        onClose={() => setShowConvertModal(false)}
        onTitleChange={setConvertTitle}
        onCategoryChange={setConvertCategory}
        onPriorityChange={setConvertPriority}
        onSubmit={handleConvertChatToTicket}
      />
    </div>
  );
};

export default SupportCenterPage;
