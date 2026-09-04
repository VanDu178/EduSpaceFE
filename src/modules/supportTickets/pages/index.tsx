import React, { useState } from 'react';
import {
  SupportChatPage,
  AdminPresenceToggle,
  useAdminStatusQuery,
  useConversationsQuery
} from '../../supportChat';
import type { SupportConversation } from '../../supportChat';
import { ModalConvert } from '../components';
import { useConvertChatToTicketMutation } from '../hooks';
import type { TicketCategory, TicketPriority } from '../types';
import { SupportTicketPage } from './SupportTicketPage';

export { SupportTicketPage, SupportTicketPage as TicketListPage } from './SupportTicketPage';

export const SupportCenterPage = () => {
  const [activeTab, setActiveTab] = useState<'chat' | 'tickets'>('chat');

  // Admin status and conversation count for tabs header
  const { data: adminStatusData } = useAdminStatusQuery();
  const isAdminOnline = Boolean(adminStatusData?.data?.isOnline);

  const { data: conversationsData } = useConversationsQuery();
  const conversations: SupportConversation[] = conversationsData?.data || [];
  const waitingCount = conversations.filter((c) => c.status === 'WAITING_AGENT').length;

  // Convert Chat to Ticket Modal States & Mutation
  const [showConvertModal, setShowConvertModal] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState<SupportConversation | null>(null);
  const [convertTitle, setConvertTitle] = useState('');
  const [convertCategory, setConvertCategory] = useState<TicketCategory>('TECHNICAL');
  const [convertPriority, setConvertPriority] = useState<TicketPriority>('MEDIUM');
  const convertChatToTicketMutation = useConvertChatToTicketMutation();

  const handleOpenConvertModal = (conv: SupportConversation) => {
    setSelectedConversation(conv);
    setShowConvertModal(true);
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
        }
      }
    );
  };

  return (
    <div className="flex flex-col h-[calc(100vh-110px)] overflow-hidden text-slate-800">
      {/* Header Compact */}
      <div className="flex items-center justify-between gap-4 mb-3 flex-shrink-0">
        <div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">Trung tâm hỗ trợ CSKH</h1>
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
          {waitingCount > 0 && (
            <span className="bg-amber-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
              {waitingCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('tickets')}
          className={`py-2 px-4 font-semibold flex items-center space-x-2 border-b-2 cursor-pointer transition ${activeTab === 'tickets'
              ? 'border-sky-600 text-sky-600 bg-white rounded-t-lg'
              : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
        >
          <span>Quản lý yêu cầu hỗ trợ</span>
        </button>
      </div>

      {/* TAB 1: Support Chat Page (from supportChat module) */}
      {activeTab === 'chat' && (
        <SupportChatPage
          showHeader={false}
          onOpenConvertModal={handleOpenConvertModal}
        />
      )}

      {/* TAB 2: Support Ticket Management Page Component */}
      {activeTab === 'tickets' && <SupportTicketPage />}

      {/* Convert Chat to Ticket Modal */}
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

