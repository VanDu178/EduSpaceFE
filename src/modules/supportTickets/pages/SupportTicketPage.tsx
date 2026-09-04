import React, { useState } from 'react';
import type { Ticket, TicketFilterParams } from '../types';
import { FilterBar, ListPage, ModalDetail } from '../components';
import {
  useTicketsQuery,
  useTicketDetailQuery,
  useAddTicketCommentMutation,
  useUpdateTicketStatusMutation,
  useTicketRealtime
} from '../hooks';

const DEFAULT_FILTER_PARAMS: TicketFilterParams = {
  status: '',
  category: '',
  priority: '',
  search: ''
};

export const SupportTicketPage = () => {
  const [filterParams, setFilterParams] = useState<TicketFilterParams>(DEFAULT_FILTER_PARAMS);
  const [selectedTicketId, setSelectedTicketId] = useState<number | null>(null);

  // Kích hoạt Realtime Socket listener cho Admin Ticket List & Detail
  useTicketRealtime(selectedTicketId);

  const { data: ticketsData, isLoading: isLoadingTickets, refetch: refetchTickets } = useTicketsQuery(filterParams);
  const tickets: Ticket[] = ticketsData?.data || [];

  const { isPending: isPendingAddComment, mutate: addTicketCommentMutation } = useAddTicketCommentMutation();
  const { isPending: isPendingUpdateStatus, mutate: updateTicketStatusMutation } = useUpdateTicketStatusMutation();

  const { data: ticketDetailRes } = useTicketDetailQuery(selectedTicketId);
  const selectedTicket: Ticket | null = ticketDetailRes?.data || null;

  const [ticketCommentText, setTicketCommentText] = useState('');
  const [commentAttachments, setCommentAttachments] = useState<string[]>([]);

  const handleFilterChange = (field: keyof TicketFilterParams, value: string) => {
    setFilterParams((prev) => ({ ...prev, [field]: value }));
  };

  const handleClearFilters = () => {
    setFilterParams(DEFAULT_FILTER_PARAMS);
  };

  const handleSelectTicket = (ticketId: number) => {
    setSelectedTicketId(ticketId);
  };

  const handleRemoveCommentAttachment = (index: number) => {
    setCommentAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddTicketComment = (e: React.FormEvent) => {
    e.preventDefault();
    if ((!ticketCommentText.trim() && commentAttachments.length === 0) || !selectedTicket || isPendingAddComment) return;

    addTicketCommentMutation(
      {
        id: selectedTicket.id,
        data: {
          content: ticketCommentText.trim(),
          attachments: commentAttachments.length > 0 ? commentAttachments : undefined
        }
      },
      {
        onSuccess: () => {
          setTicketCommentText('');
          setCommentAttachments([]);
        }
      }
    );
  };

  const handleUpdateTicketStatus = (statusValue?: string) => {
    if (!selectedTicket || !statusValue) return;
    updateTicketStatusMutation({ id: selectedTicket.id, status: statusValue });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-110px)] overflow-hidden text-slate-800">
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 min-h-0 overflow-hidden">
        {/* Left Column: Filter + List */}
        <div className="lg:col-span-5 bg-white border border-slate-200/80 rounded-2xl flex flex-col h-full overflow-hidden">
          <FilterBar
            params={filterParams}
            onFilterChange={handleFilterChange}
            onLoadTickets={refetchTickets}
            onClearFilters={handleClearFilters}
          />
          <ListPage
            tickets={tickets}
            selectedTicket={selectedTicket}
            isLoadingTickets={isLoadingTickets}
            onSelectTicket={handleSelectTicket}
          />
        </div>

        {/* Right Column: Ticket Detail */}
        <div className="lg:col-span-7 h-full overflow-hidden">
          <ModalDetail
            selectedTicket={selectedTicket}
            ticketCommentText={ticketCommentText}
            commentAttachments={commentAttachments}
            setCommentAttachments={setCommentAttachments}
            onRemoveCommentAttachment={handleRemoveCommentAttachment}
            isSubmittingComment={isPendingAddComment}
            isUpdatingStatus={isPendingUpdateStatus}
            onUpdateTicketStatus={handleUpdateTicketStatus}
            onCommentTextChange={setTicketCommentText}
            onAddTicketComment={handleAddTicketComment}
          />
        </div>
      </div>
    </div>
  );
};

export default SupportTicketPage;
