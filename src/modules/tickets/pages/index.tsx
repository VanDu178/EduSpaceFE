import React, { useState } from 'react';
import { TicketIcon } from '@heroicons/react/24/outline';
import type { Ticket } from '../types';
import { TicketHub } from '../components';
import {
  useTicketsQuery,
  useAddTicketCommentMutation,
  useUpdateTicketStatusMutation
} from '../hooks';
import ticketApi from '../api';
import toast from 'react-hot-toast';

export const TicketListPage: React.FC = () => {
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [filterCategory, setFilterCategory] = useState<string>('');
  const [searchKeyword, setSearchKeyword] = useState<string>('');

  const { data: ticketsData, isLoading: isLoadingTickets, refetch: refetchTickets } = useTicketsQuery({
    status: filterStatus || undefined,
    category: filterCategory || undefined,
    search: searchKeyword || undefined
  });
  const tickets: Ticket[] = ticketsData?.data || [];

  const addTicketCommentMutation = useAddTicketCommentMutation();
  const updateTicketStatusMutation = useUpdateTicketStatusMutation();

  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [ticketCommentText, setTicketCommentText] = useState('');
  const [newStatus, setNewStatus] = useState<string>('');

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

  return (
    <div className="flex flex-col h-[calc(100vh-110px)] overflow-hidden text-slate-800">
      <div className="flex items-center justify-between gap-4 mb-3 flex-shrink-0">
        <div className="flex items-center space-x-2">
          <TicketIcon className="w-6 h-6 text-sky-600" />
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">Quản Lý Ticket Hỗ Trợ</h1>
        </div>
      </div>

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
    </div>
  );
};

export default TicketListPage;
