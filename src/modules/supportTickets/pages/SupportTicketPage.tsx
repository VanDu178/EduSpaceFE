import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import type { Ticket, TicketFilterParams } from '../types';
import { FilterBar, ListPage, ModalDetail, type CommentFile } from '../components';
import { uploadMultipleFilesApi, FOLDER_NAME } from '../../upload';
import { DEFAULT_TICKET_FILTER_PARAMS } from '../constants';
import {
  useTicketsQuery,
  useTicketDetailQuery,
  useAddTicketCommentMutation,
  useUpdateTicketStatusMutation,
  useMarkTicketAsReadMutation,
  useTicketRealtime
} from '../hooks';

export const SupportTicketPage = () => {
  const [filterParams, setFilterParams] = useState<TicketFilterParams>(DEFAULT_TICKET_FILTER_PARAMS);
  const [selectedTicketId, setSelectedTicketId] = useState<number | null>(null);
  const location = useLocation();

  // Kích hoạt Realtime Socket listener cho Admin Ticket List & Detail
  useTicketRealtime(selectedTicketId);

  const {
    data: ticketsData,
    isLoading: isLoadingTickets,
    refetch: refetchTickets,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useTicketsQuery(filterParams);

  useEffect(() => {
    const state = location.state as { targetTab?: string; targetId?: number } | null;
    if (state?.targetId && (state.targetTab === 'tickets' || !state.targetTab)) {
      setFilterParams(DEFAULT_TICKET_FILTER_PARAMS);
      setSelectedTicketId(state.targetId);
      refetchTickets();
    }
  }, [location.state, refetchTickets]);

  const rawTickets: Ticket[] = ticketsData?.pages.flatMap((page) => page?.data || []) || [];
  const ticketsMap = new Map<number, Ticket>();
  rawTickets.forEach((t) => ticketsMap.set(t.id, t));
  const tickets = Array.from(ticketsMap.values());

  const { isPending: isPendingAddComment, mutate: addTicketCommentMutation } = useAddTicketCommentMutation();
  const { isPending: isPendingUpdateStatus, mutate: updateTicketStatusMutation } = useUpdateTicketStatusMutation();
  const { mutate: markTicketAsReadMutation } = useMarkTicketAsReadMutation();
  const [isUploadingImages, setIsUploadingImages] = useState(false);

  const { data: ticketDetailRes } = useTicketDetailQuery(selectedTicketId);
  const selectedTicket: Ticket | null = ticketDetailRes?.data || null;

  const [ticketCommentText, setTicketCommentText] = useState('');
  const [commentFiles, setCommentFiles] = useState<CommentFile[]>([]);

  const isSubmittingComment = isPendingAddComment || isUploadingImages;

  const handleFilterChange = (field: keyof TicketFilterParams, value: string | null) => {
    setFilterParams((prev) => ({ ...prev, [field]: value }));
  };

  const handleClearFilters = () => {
    setFilterParams(DEFAULT_TICKET_FILTER_PARAMS);
  };

  const handleSelectTicket = (ticketId: number) => {
    setSelectedTicketId(ticketId);
    const target = tickets.find((t) => t.id === ticketId);
    if (target && (target.assigneeUnreadCount || 0) > 0) {
      markTicketAsReadMutation(ticketId);
    }
  };

  const handleRemoveCommentFile = (index: number) => {
    setCommentFiles((prev) => {
      const target = prev[index];
      if (target?.url) {
        URL.revokeObjectURL(target.url);
      }
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleAddTicketComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!ticketCommentText.trim() && commentFiles.length === 0) || !selectedTicket || isSubmittingComment) return;

    try {
      setIsUploadingImages(true);

      // 1. Upload ảnh đính kèm lên Supabase Storage với folder 'support-tickets'
      let uploadedUrls: string[] = [];
      if (commentFiles.length > 0) {
        const rawFiles = commentFiles.map((item) => item.file);
        const uploadResults = await uploadMultipleFilesApi(rawFiles, FOLDER_NAME.SUPPORT_TICKETS);
        uploadedUrls = uploadResults.map((item) => item.url).filter(Boolean);
      }

      // 2. Gửi phản hồi kèm theo mảng Public URL ảnh
      addTicketCommentMutation(
        {
          id: selectedTicket.id,
          data: {
            content: ticketCommentText.trim(),
            attachments: uploadedUrls.length > 0 ? uploadedUrls : undefined
          }
        },
        {
          onSuccess: () => {
            setTicketCommentText('');
            commentFiles.forEach((item) => URL.revokeObjectURL(item.url));
            setCommentFiles([]);
          }
        }
      );
    } catch (err: any) {
      toast.error(err?.response?.data?.message || err?.message || 'Có lỗi xảy ra khi tải ảnh lên hệ thống');
    } finally {
      setIsUploadingImages(false);
    }
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
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
            onFetchNextPage={fetchNextPage}
          />
        </div>

        {/* Right Column: Ticket Detail */}
        <div className="lg:col-span-7 h-full overflow-hidden">
          <ModalDetail
            selectedTicket={selectedTicket}
            ticketCommentText={ticketCommentText}
            commentFiles={commentFiles}
            setCommentFiles={setCommentFiles}
            onRemoveCommentFile={handleRemoveCommentFile}
            isSubmittingComment={isSubmittingComment}
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
