import React, { useRef, useEffect, useState } from 'react';
import { Spin, Image } from 'antd';
import { ArrowsRightLeftIcon, PaperAirplaneIcon, PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline';
import type { SupportConversation, SupportMessage } from '../types';
import { uploadSingleFileApi, deleteFileApi, FOLDER_NAME } from '../../upload';

interface ChatWindowProps {
  selectedConversation: SupportConversation | null;
  chatMessages: SupportMessage[];
  isLoadingMessages?: boolean;
  chatInputText: string;
  isSendingMessage: boolean;
  onAcceptConversation: (convId: number) => void;
  onSendChatMessage: (e?: React.FormEvent, attachments?: string[]) => void;
  onChangeChatInputText: (text: string) => void;
  onOpenConvertModal: () => void;
  onResolveConversation: (convId: number) => void;
}

export const ChatWindow = ({
  selectedConversation,
  chatMessages,
  isLoadingMessages = false,
  chatInputText,
  isSendingMessage,
  onAcceptConversation,
  onSendChatMessage,
  onChangeChatInputText,
  onOpenConvertModal,
  onResolveConversation
}: ChatWindowProps) => {
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pendingAttachments, setPendingAttachments] = useState<string[]>([]);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const pendingAttachmentsRef = useRef<string[]>([]);
  useEffect(() => {
    pendingAttachmentsRef.current = pendingAttachments;
  }, [pendingAttachments]);

  // Clean up unsent attachments on conversation switch or unmount
  useEffect(() => {
    return () => {
      if (pendingAttachmentsRef.current.length > 0) {
        pendingAttachmentsRef.current.forEach((url) => {
          deleteFileApi(url).catch((err) => console.error('Lỗi tự dọn dẹp ảnh rác:', err));
        });
      }
    };
  }, [selectedConversation?.id]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    e.target.value = '';

    if (!file.type.toLowerCase().startsWith('image/')) {
      return;
    }

    try {
      setIsUploadingImage(true);
      const res = await uploadSingleFileApi(file, FOLDER_NAME.SUPPORT_CHAT);
      if (res?.url) {
        setPendingAttachments((prev) => [...prev, res.url]);
      }
    } catch (err) {
      console.error('Lỗi upload ảnh:', err);
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleRemoveAttachment = async (index: number) => {
    const targetUrl = pendingAttachments[index];
    setPendingAttachments((prev) => prev.filter((_, i) => i !== index));
    if (targetUrl) {
      try {
        await deleteFileApi(targetUrl);
      } catch (err) {
        console.error('Lỗi xóa file ảnh khỏi storage:', err);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInputText.trim() && pendingAttachments.length === 0) return;
    onSendChatMessage(e, pendingAttachments.length > 0 ? pendingAttachments : undefined);
    setPendingAttachments([]);
  };

  if (!selectedConversation) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl flex-1 flex items-center justify-center text-slate-400 text-xs italic h-full">
        Chọn một cuộc trò chuyện từ danh sách bên trái để tiếp nhận.
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl flex flex-col h-full overflow-hidden">
      {/* Top Bar */}
      <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between flex-shrink-0">
        <div>
          <h4 className="text-sm font-bold text-slate-900">
            {selectedConversation.user?.name || selectedConversation.user?.email}
          </h4>
        </div>

        <div className="flex items-center space-x-2">
          {selectedConversation.status === 'WAITING_AGENT' && (
            <button
              onClick={() => onAcceptConversation(selectedConversation.id)}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium rounded-lg cursor-pointer"
            >
              Tiếp Nhận Chat
            </button>
          )}

          {selectedConversation.status === 'AGENT_HANDLING' && (
            <>
              <button
                onClick={onOpenConvertModal}
                className="px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-800 text-xs font-medium rounded-lg cursor-pointer flex items-center space-x-1"
              >
                <ArrowsRightLeftIcon className="w-3.5 h-3.5" />
                <span>Tạo Ticket</span>
              </button>
              <button
                onClick={() => onResolveConversation(selectedConversation.id)}
                className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 text-xs font-medium rounded-lg cursor-pointer"
              >
                Hoàn Tất
              </button>
            </>
          )}
        </div>
      </div>

      {/* Messages Body */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5 bg-slate-50/50 min-h-0">
        {isLoadingMessages ? (
          <div className="flex items-center justify-center h-full py-12">
            <Spin size="small" />
          </div>
        ) : chatMessages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-slate-400 text-xs italic py-12">
            Chưa có tin nhắn nào trong cuộc trò chuyện này.
          </div>
        ) : (
          <Image.PreviewGroup>
            {chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.senderType === 'AGENT' ? 'items-end' : msg.senderType === 'SYSTEM' ? 'items-center' : 'items-start'
                  }`}
              >
                {msg.senderType === 'SYSTEM' ? (
                  <div className="bg-slate-200 text-slate-600 text-[11px] px-2.5 py-0.5 rounded-full border border-slate-300 my-1 font-medium">
                    {msg.content}
                  </div>
                ) : (
                  <div
                    className={`max-w-[75%] p-2.5 rounded-xl text-xs ${msg.senderType === 'AGENT'
                      ? 'bg-sky-600 text-white rounded-br-none border border-sky-500'
                      : 'bg-white text-slate-800 rounded-bl-none border border-slate-200'
                      }`}
                  >
                    {msg.attachments && msg.attachments.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-1.5">
                        {msg.attachments.map((imgUrl, idx) => (
                          <Image
                            key={idx}
                            src={imgUrl}
                            alt="Attachment"
                            className="rounded-lg object-cover max-w-[180px] max-h-[180px] border border-slate-200"
                          />
                        ))}
                      </div>
                    )}
                    {msg.content && <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>}
                    <span className={`text-[9px] block text-right mt-1 opacity-75 ${msg.senderType === 'AGENT' ? 'text-sky-100' : 'text-slate-400'}`}>
                      {new Date(msg.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </Image.PreviewGroup>
        )}
        <div ref={chatBottomRef} />
      </div>

      {/* Bottom Input */}
      {selectedConversation.status === 'AGENT_HANDLING' ? (
        <form onSubmit={handleSubmit} className="p-2.5 bg-white border-t border-slate-200 flex flex-col space-y-2 flex-shrink-0">
          {/* Pending Attachments Preview */}
          {pendingAttachments.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1">
              {pendingAttachments.map((url, index) => (
                <div key={index} className="relative group w-14 h-14 rounded-lg overflow-hidden border border-slate-200 bg-slate-100">
                  <img src={url} alt="preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemoveAttachment(index)}
                    className="absolute top-0.5 right-0.5 bg-slate-900/70 hover:bg-slate-900 text-white p-0.5 rounded-full cursor-pointer"
                  >
                    <XMarkIcon className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center space-x-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
              disabled={isUploadingImage || isSendingMessage}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploadingImage || isSendingMessage}
              className="p-2 text-slate-500 hover:text-sky-600 hover:bg-slate-100 rounded-lg transition cursor-pointer"
              title="Gửi hình ảnh"
            >
              {isUploadingImage ? <Spin size="small" /> : <PhotoIcon className="w-5 h-5" />}
            </button>

            <input
              type="text"
              placeholder="Nhập nội dung trả lời..."
              value={chatInputText}
              onChange={(e) => onChangeChatInputText(e.target.value)}
              disabled={isSendingMessage}
              className="flex-1 bg-slate-50 border border-slate-200 text-xs text-slate-800 px-3 py-2 rounded-lg focus:outline-none focus:border-sky-500"
            />
            <button
              type="submit"
              disabled={isSendingMessage || isUploadingImage || (!chatInputText.trim() && pendingAttachments.length === 0)}
              className="px-3.5 py-2 bg-sky-600 hover:bg-sky-700 text-white font-medium text-xs rounded-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <PaperAirplaneIcon className="w-4 h-4" />
            </button>
          </div>
        </form>
      ) : (
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-center text-xs text-slate-500 flex-shrink-0">
          Bấm <strong>"Tiếp Nhận Chat"</strong> ở trên để bắt đầu nhắn tin với Khách hàng.
        </div>
      )}
    </div>
  );
};
