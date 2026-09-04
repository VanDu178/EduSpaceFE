import React from 'react';
import { FilterBar } from './FilterBar';
import { ListPage } from './ListPage';
import { ModalDetail } from './ModalDetail';
import type { Ticket } from '../types';

interface TicketHubProps {
  tickets: Ticket[];
  selectedTicket: Ticket | null;
  isLoadingTickets: boolean;
  searchKeyword: string;
  filterStatus: string;
  filterCategory: string;
  newStatus: string;
  ticketCommentText: string;
  isSubmittingComment: boolean;
  onSearchChange: (keyword: string) => void;
  onFilterStatusChange: (status: string) => void;
  onFilterCategoryChange: (category: string) => void;
  onLoadTickets: () => void;
  onClearFilters: () => void;
  onSelectTicket: (id: number) => void;
  onNewStatusChange: (status: string) => void;
  onUpdateTicketStatus: () => void;
  onCommentTextChange: (text: string) => void;
  onAddTicketComment: (e: React.FormEvent) => void;
}

export const TicketHub: React.FC<TicketHubProps> = ({
  tickets,
  selectedTicket,
  isLoadingTickets,
  searchKeyword,
  filterStatus,
  filterCategory,
  newStatus,
  ticketCommentText,
  isSubmittingComment,
  onSearchChange,
  onFilterStatusChange,
  onFilterCategoryChange,
  onLoadTickets,
  onClearFilters,
  onSelectTicket,
  onNewStatusChange,
  onUpdateTicketStatus,
  onCommentTextChange,
  onAddTicketComment
}) => {
  return (
    <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 min-h-0 overflow-hidden">
      {/* Left Column: Filter + List */}
      <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl flex flex-col h-full overflow-hidden">
        <FilterBar
          searchKeyword={searchKeyword}
          filterStatus={filterStatus}
          filterCategory={filterCategory}
          onSearchChange={onSearchChange}
          onFilterStatusChange={onFilterStatusChange}
          onFilterCategoryChange={onFilterCategoryChange}
          onLoadTickets={onLoadTickets}
          onClearFilters={onClearFilters}
        />
        <ListPage
          tickets={tickets}
          selectedTicket={selectedTicket}
          isLoadingTickets={isLoadingTickets}
          onSelectTicket={onSelectTicket}
        />
      </div>

      {/* Right Column: Ticket Detail */}
      <div className="lg:col-span-7 h-full overflow-hidden">
        <ModalDetail
          selectedTicket={selectedTicket}
          newStatus={newStatus}
          ticketCommentText={ticketCommentText}
          isSubmittingComment={isSubmittingComment}
          onNewStatusChange={onNewStatusChange}
          onUpdateTicketStatus={onUpdateTicketStatus}
          onCommentTextChange={onCommentTextChange}
          onAddTicketComment={onAddTicketComment}
        />
      </div>
    </div>
  );
};
