import React from 'react';
import { ConversationsQueue } from './ConversationsQueue';
import { ChatWindow } from './ChatWindow';
import type { SupportConversation, SupportMessage } from '../types';

interface LiveChatHubProps {
  conversations: SupportConversation[];
  selectedConversation: SupportConversation | null;
  chatMessages: SupportMessage[];
  chatInputText: string;
  isSendingMessage: boolean;
  isLoadingConversations: boolean;
  onSelectConversation: (conv: SupportConversation) => void;
  onRefreshConversations: () => void;
  onAcceptConversation: (convId: number) => void;
  onSendChatMessage: (e?: React.FormEvent) => void;
  onChangeChatInputText: (text: string) => void;
  onOpenConvertModal: () => void;
  onResolveConversation: (convId: number) => void;
}

export const LiveChatHub: React.FC<LiveChatHubProps> = ({
  conversations,
  selectedConversation,
  chatMessages,
  chatInputText,
  isSendingMessage,
  isLoadingConversations,
  onSelectConversation,
  onRefreshConversations,
  onAcceptConversation,
  onSendChatMessage,
  onChangeChatInputText,
  onOpenConvertModal,
  onResolveConversation
}) => {
  return (
    <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 min-h-0 overflow-hidden">
      <div className="lg:col-span-4 h-full overflow-hidden">
        <ConversationsQueue
          conversations={conversations}
          selectedConversation={selectedConversation}
          isLoadingConversations={isLoadingConversations}
          onSelectConversation={onSelectConversation}
          onRefreshConversations={onRefreshConversations}
        />
      </div>

      <div className="lg:col-span-8 h-full overflow-hidden">
        <ChatWindow
          selectedConversation={selectedConversation}
          chatMessages={chatMessages}
          chatInputText={chatInputText}
          isSendingMessage={isSendingMessage}
          onAcceptConversation={onAcceptConversation}
          onSendChatMessage={onSendChatMessage}
          onChangeChatInputText={onChangeChatInputText}
          onOpenConvertModal={onOpenConvertModal}
          onResolveConversation={onResolveConversation}
        />
      </div>
    </div>
  );
};
