import React from 'react';
import {
  ClockIcon,
  UserCircleIcon,
  PhotoIcon,
  XMarkIcon,
  PaperClipIcon,
  PaperAirplaneIcon
} from '@heroicons/react/24/outline';
import { Image, Select } from 'antd';
import toast from 'react-hot-toast';
import type { Ticket } from '../types';
import { TICKET_STATUS, TICKET_ATTACHMENT_LIMITS } from '../constants';
import { getTicketStatusOptions } from '../utils';

export interface CommentFile {
  file: File;
  url: string;
}

interface ModalDetailProps {
  selectedTicket: Ticket | null;
  ticketCommentText: string;
  commentFiles: CommentFile[];
  setCommentFiles: React.Dispatch<React.SetStateAction<CommentFile[]>>;
  onRemoveCommentFile: (index: number) => void;
  isSubmittingComment: boolean;
  isUpdatingStatus?: boolean;
  onUpdateTicketStatus: (status?: string) => void;
  onCommentTextChange: (text: string) => void;
  onAddTicketComment: (e: React.FormEvent) => void;
}

export const ModalDetail = ({
  selectedTicket,
  ticketCommentText,
  commentFiles,
  setCommentFiles,
  onRemoveCommentFile,
  isSubmittingComment,
  isUpdatingStatus,
  onUpdateTicketStatus,
  onCommentTextChange,
  onAddTicketComment
}: ModalDetailProps) => {
  if (!selectedTicket) {
    return (
      <div className="bg-white border border-slate-200/80 rounded-2xl flex-1 flex items-center justify-center text-slate-400 text-xs italic h-full">
        Chọn một Ticket từ danh sách bên trái để xem thông tin chi tiết.
      </div>
    );
  }


  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    e.target.value = '';

    const remainingSlots = TICKET_ATTACHMENT_LIMITS.MAX_COUNT - commentFiles.length;
    if (remainingSlots <= 0) {
      toast.error(`Bạn đã đính kèm tối đa ${TICKET_ATTACHMENT_LIMITS.MAX_COUNT} hình ảnh.`);
      return;
    }

    if (fileArray.length > remainingSlots) {
      toast.error(`Chỉ được chọn thêm tối đa ${remainingSlots} hình ảnh.`);
    }

    const filesToProcess = fileArray.slice(0, remainingSlots);
    const validFiles: File[] = [];

    for (const file of filesToProcess) {
      const isImageMime = file.type ? file.type.toLowerCase().startsWith('image/') : false;
      const isImageExt = /\.(jpe?g|png|webp|gif|bmp|heic|svg|jfif)$/i.test(file.name);

      if (!isImageMime && !isImageExt) {
        toast.error(`File "${file.name}" không phải định dạng ảnh hợp lệ.`);
        continue;
      }

      if (file.size > TICKET_ATTACHMENT_LIMITS.MAX_SIZE_BYTES) {
        toast.error(`File "${file.name}" vượt quá dung lượng ${TICKET_ATTACHMENT_LIMITS.MAX_SIZE_MB}MB.`);
        continue;
      }

      validFiles.push(file);
    }

    if (validFiles.length === 0) return;

    const newFiles: CommentFile[] = validFiles.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));

    setCommentFiles((prev) => [...prev, ...newFiles]);
    toast.success(`Đã thêm ${newFiles.length} ảnh đính kèm.`);
  };

  const isMaxReached = commentFiles.length >= TICKET_ATTACHMENT_LIMITS.MAX_COUNT;

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl flex flex-col h-full overflow-hidden p-4">
      {/* Header Ticket Information */}
      <div className="pb-3 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 flex-shrink-0">
        <div className="space-y-1.5 min-w-0">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-snug truncate">
            {selectedTicket.title}
          </h2>
        </div>

        {/* Quick Status Update Selector */}
        <div className="flex items-center shrink-0 self-start sm:self-center">
          <Select
            value={selectedTicket.status}
            options={getTicketStatusOptions(selectedTicket.status)}
            onChange={(value) => {
              onUpdateTicketStatus(value);
            }}
            loading={isUpdatingStatus}
            disabled={isUpdatingStatus || selectedTicket.status === TICKET_STATUS.CLOSED}
            className="w-36 sm:w-40 text-xs"
          />
        </div>
      </div>

      {/* Unified Scrollable Body: Description + Exchange History */}
      <div className="flex-1 overflow-y-auto min-h-0 py-3 space-y-4 pr-1.5 border-b border-slate-100">
        {/* Description Content */}
        <div>
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
            Nội dung yêu cầu
          </span>
          <div className="text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-wrap border-l-4 border-sky-500 bg-sky-50/40 p-3 rounded-r-2xl">
            {selectedTicket.description}
          </div>
        </div>

        {/* Comments Exchange History Timeline */}
        <div className="space-y-3 pt-1">
          <h3 className="text-xs font-bold text-slate-900 flex items-center justify-between">
            <span>Lịch sử trao đổi & phản hồi</span>
            <span className="text-[11px] font-normal text-slate-400">({selectedTicket.comments?.length || 0} phản hồi)</span>
          </h3>

          {/* Comments Timeline List */}
          <div>
            {(!selectedTicket.comments || selectedTicket.comments.length === 0) ? (
              <div className="text-center text-xs italic text-slate-400">
                Chưa có phản hồi nào cho Yêu cầu này.
              </div>
            ) : (
              <div className="relative pl-1 sm:pl-2 space-y-4 before:absolute before:left-4 sm:before:left-5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200/80">
                {selectedTicket.comments.map((comment) => {
                  const isAdmin = comment.sender?.role?.toLowerCase() === 'admin';

                  return (
                    <div key={comment.id} className="relative flex items-start space-x-3 sm:space-x-4">
                      {/* Timeline Avatar Icon */}
                      <div
                        className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shrink-0 z-10 border-2 ${isAdmin
                          ? 'bg-sky-50 border-sky-500 text-sky-600'
                          : 'bg-slate-100 border-slate-300 text-slate-500'
                          }`}
                      >
                        {isAdmin ? (
                          <Image
                            src={"/logo.png"}
                            alt="admin logo"
                            preview={false}
                            className="object-cover rounded-full"
                          />
                        ) : (
                          <UserCircleIcon className="w-4 h-4 sm:w-5 sm:h-5 text-slate-500" />
                        )}
                      </div>

                      {/* Comment Card Bubble */}
                      <div
                        className={`flex-1 min-w-0 p-3.5 rounded-2xl border ${isAdmin
                          ? 'bg-sky-50/40 border-sky-200/90 border-l-4 border-l-sky-500'
                          : 'bg-white border-slate-200/90 border-l-4 border-l-slate-400'
                          }`}
                      >
                        {/* Comment Header: Sender Name, Role Badge, Time */}
                        <div className="flex flex-wrap items-center justify-between gap-2 pb-2 mb-2 border-b border-slate-100">
                          <div className="flex items-center space-x-2 min-w-0">
                            <span className="text-xs font-bold text-slate-900 truncate">
                              {isAdmin ? "Bạn" : comment.sender?.name}
                            </span>
                          </div>

                          <span className="text-[11px] text-slate-400 flex items-center space-x-1">
                            <ClockIcon className="w-3 h-3 text-slate-400" />
                            <span>
                              {new Date(comment.createdAt).toLocaleString('vi-VN', {
                                hour: '2-digit',
                                minute: '2-digit',
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric'
                              })}
                            </span>
                          </span>
                        </div>

                        {/* Content Body */}
                        <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap text-slate-800 font-normal">
                          {comment.content}
                        </p>

                        {/* Attachment Images */}
                        {Array.isArray(comment.attachments) && comment.attachments.length > 0 && (
                          <div className="mt-2.5 pt-2.5 border-t border-slate-200/50">
                            <p className="text-[11px] font-medium text-slate-500 mb-1.5 flex items-center space-x-1">
                              <PaperClipIcon className="w-3.5 h-3.5" />
                              <span>Ảnh đính kèm ({comment.attachments.length}):</span>
                            </p>
                            <Image.PreviewGroup>
                              <div className="flex flex-wrap gap-2">
                                {comment.attachments.map((imgUrl, imgIdx) => (
                                  <div
                                    key={imgIdx}
                                    className="w-16 h-16 border border-slate-200/80 rounded-xl overflow-hidden bg-white"
                                  >
                                    <Image
                                      src={imgUrl}
                                      alt={`attachment-${imgIdx}`}
                                      width="100%"
                                      height="100%"
                                      className="w-full h-full object-cover"
                                      style={{ objectFit: 'cover' }}
                                    />
                                  </div>
                                ))}
                              </div>
                            </Image.PreviewGroup>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Integrated Chat Reply Form */}
      {selectedTicket.status !== 'CLOSED' ? (
        <form onSubmit={onAddTicketComment} className="pt-2 space-y-2 flex-shrink-0">
          {/* Attachment Image Preview Thumbnails */}
          {commentFiles.length > 0 && (
            <Image.PreviewGroup>
              <div className="flex flex-wrap gap-2 pb-2 border-b border-slate-100">
                {commentFiles.map((item, idx) => (
                  <div
                    key={idx}
                    className="relative border border-slate-200/80 rounded-xl overflow-hidden w-14 h-14 bg-slate-100 group"
                  >
                    <Image
                      src={item.url}
                      alt={`attachment-${idx}`}
                      width="100%"
                      height="100%"
                      className="w-full h-full object-cover"
                      style={{ objectFit: 'cover' }}
                    />
                    <button
                      type="button"
                      disabled={isSubmittingComment}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onRemoveCommentFile(idx);
                      }}
                      className="absolute top-1 right-1 z-10 bg-slate-900/70 hover:bg-rose-600 text-white rounded-full p-1 cursor-pointer transition disabled:pointer-events-none"
                      title="Xóa ảnh"
                    >
                      <XMarkIcon className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                {commentFiles.length < TICKET_ATTACHMENT_LIMITS.MAX_COUNT && (
                  <label
                    htmlFor="admin-ticket-image-upload"
                    className="w-14 h-14 border-2 border-dashed border-slate-200 hover:border-sky-400 hover:bg-sky-50/50 rounded-xl flex flex-col items-center justify-center text-slate-400 hover:text-sky-600 cursor-pointer transition"
                  >
                    <PhotoIcon className="w-4 h-4" />
                    <span className="text-[9px] font-medium mt-0.5">+Thêm</span>
                  </label>
                )}
              </div>
            </Image.PreviewGroup>
          )}

          {/* Input Bar */}
          <div className="flex items-end gap-2 bg-slate-100/80 hover:bg-slate-100 border border-slate-200/80 focus-within:border-sky-500 focus-within:bg-white rounded-2xl p-2 transition">
            <input
              id="admin-ticket-image-upload"
              type="file"
              onChange={handleFileSelect}
              accept="image/*, .png, .jpg, .jpeg, .webp, .gif"
              multiple
              className="hidden"
              disabled={isSubmittingComment || isMaxReached}
            />

            {/* Upload Image Icon Button */}
            <label
              htmlFor="admin-ticket-image-upload"
              title={isMaxReached ? `Đã đạt tối đa ${TICKET_ATTACHMENT_LIMITS.MAX_COUNT} ảnh` : `Đính kèm hình ảnh (Tối đa ${TICKET_ATTACHMENT_LIMITS.MAX_COUNT} ảnh, ${TICKET_ATTACHMENT_LIMITS.MAX_SIZE_MB}MB/ảnh)`}
              className={`flex items-center justify-center w-8 h-8 rounded-full text-sky-600 hover:bg-sky-100/70 cursor-pointer transition shrink-0 ${isSubmittingComment || isMaxReached ? 'pointer-events-none opacity-40 cursor-not-allowed' : ''
                }`}
            >
              <PhotoIcon className="w-5 h-5" />
            </label>

            {/* Textarea Input */}
            <textarea
              rows={1}
              placeholder="Nhập phản hồi..."
              value={ticketCommentText}
              onChange={(e) => onCommentTextChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  if (!isSubmittingComment && (ticketCommentText.trim() || commentFiles.length > 0)) {
                    onAddTicketComment(e);
                  }
                }
              }}
              disabled={isSubmittingComment}
              className="w-full bg-transparent border-0 p-1 text-xs text-slate-800 focus:outline-none transition resize-none disabled:opacity-50 disabled:cursor-not-allowed max-h-24 min-h-[32px] py-1"
            />

            {/* Send Button */}
            <button
              type="submit"
              disabled={isSubmittingComment || (!ticketCommentText.trim() && commentFiles.length === 0)}
              className="flex items-center justify-center w-8 h-8 rounded-full bg-sky-600 hover:bg-sky-700 text-white transition shrink-0 disabled:pointer-events-none disabled:opacity-40 disabled:cursor-not-allowed border border-sky-500"
              title="Gửi phản hồi"
            >
              {isSubmittingComment ? (
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <PaperAirplaneIcon className="w-3.5 h-3.5 -translate-y-[0.5px] translate-x-[0.5px]" />
              )}
            </button>
          </div>
        </form>
      ) : (
        <div className="bg-slate-100 border border-slate-200/80 p-3 rounded-2xl text-center text-xs text-slate-500 italic font-medium flex-shrink-0">
          Ticket này đã đóng. Không thể gửi thêm phản hồi mới.
        </div>
      )}
    </div>
  );
};
