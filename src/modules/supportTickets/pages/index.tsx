import React, { useState } from 'react';
import { Form } from 'antd';
import toast from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';
import { useSocketEvent } from '../../../config/socket/SocketContext';
import { uploadMultipleFilesApi, deleteFileApi } from '../../../services/uploadService';
import {
  SupportChatPage,
  AdminPresenceToggle,
  useAdminStatusQuery,
  useConversationsQuery
} from '../../supportChat';
import type { SupportConversation } from '../../supportChat';
import { ModalConvert } from '../components';
import type { PreviewFile } from '../components/ModalConvert';
import { useConvertChatToTicketMutation } from '../hooks';
import type { TicketCategory, TicketPriority } from '../types';
import { SupportTicketPage } from './SupportTicketPage';

export { SupportTicketPage, SupportTicketPage as TicketListPage } from './SupportTicketPage';

export const SupportCenterPage = () => {
  const [activeTab, setActiveTab] = useState<'chat' | 'tickets'>('chat');
  const queryClient = useQueryClient();
  const [convertForm] = Form.useForm();

  // Admin status and conversation count for tabs header
  const { data: adminStatusData } = useAdminStatusQuery();
  const isAdminOnline = Boolean(adminStatusData?.data?.isOnline);

  // Đồng bộ Realtime trạng thái Online từ Socket event
  useSocketEvent<{ isOnline: boolean; activeAdminCount: number }>('admin_presence_updated', (data) => {
    queryClient.setQueryData(['supportChat', 'adminStatus'], (old: any) => {
      if (!old) return { success: true, data: { isOnline: data.isOnline, activeAdminCount: data.activeAdminCount } };
      return {
        ...old,
        data: {
          ...old.data,
          isOnline: data.isOnline,
          activeAdminCount: data.activeAdminCount
        }
      };
    });
  });

  const { data: conversationsData } = useConversationsQuery();
  const conversations: SupportConversation[] = conversationsData?.data || [];
  const waitingCount = conversations.filter((c) => c.status === 'WAITING_AGENT').length;

  // Convert Chat to Ticket Modal States & Mutation
  const [showConvertModal, setShowConvertModal] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState<SupportConversation | null>(null);
  const [previewFiles, setPreviewFiles] = useState<PreviewFile[]>([]);
  const [isUploadingImages, setIsUploadingImages] = useState(false);

  const convertChatToTicketMutation = useConvertChatToTicketMutation();

  const handleOpenConvertModal = (conv: SupportConversation) => {
    setSelectedConversation(conv);
    setShowConvertModal(true);
    convertForm.resetFields();
    convertForm.setFieldsValue({
      title: '',
      category: 'TECHNICAL',
      priority: 'MEDIUM',
      description: ''
    });
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    e.target.value = '';

    const remainingSlots = 3 - previewFiles.length;
    if (remainingSlots <= 0) {
      convertForm.setFields([
        { name: 'attachments', errors: ['Bạn đã đính kèm tối đa 3 hình ảnh.'] }
      ]);
      return;
    }

    let fileErrorMsg: string | undefined = undefined;
    const filesToProcess = fileArray.slice(0, remainingSlots);
    const newItems: PreviewFile[] = [];

    for (const file of filesToProcess) {
      const isImageMime = file.type ? file.type.toLowerCase().startsWith('image/') : false;
      const isImageExt = /\.(jpe?g|png|webp|gif|bmp|heic|svg|jfif)$/i.test(file.name);

      if (!isImageMime && !isImageExt) {
        fileErrorMsg = `File "${file.name}" không phải định dạng ảnh hợp lệ.`;
        continue;
      }

      if (file.size > 5 * 1024 * 1024) {
        fileErrorMsg = `File "${file.name}" vượt quá dung lượng 5MB.`;
        continue;
      }

      newItems.push({
        file,
        url: URL.createObjectURL(file),
      });
    }

    if (newItems.length > 0) {
      setPreviewFiles((prev) => [...prev, ...newItems]);
      if (fileErrorMsg) {
        convertForm.setFields([{ name: 'attachments', errors: [fileErrorMsg] }]);
      } else {
        convertForm.setFields([{ name: 'attachments', errors: [] }]);
      }
    } else if (fileErrorMsg) {
      convertForm.setFields([{ name: 'attachments', errors: [fileErrorMsg] }]);
    }
  };

  const handleRemoveAttachment = (index: number) => {
    setPreviewFiles((prev) => {
      const itemToRemove = prev[index];
      if (itemToRemove) {
        URL.revokeObjectURL(itemToRemove.url);
      }
      return prev.filter((_, i) => i !== index);
    });
    convertForm.setFields([{ name: 'attachments', errors: [] }]);
  };

  const handleConvertChatToTicket = async (values: {
    title: string;
    category: TicketCategory;
    priority: TicketPriority;
    description: string;
  }) => {
    if (!selectedConversation || convertChatToTicketMutation.isPending || isUploadingImages) return;

    try {
      setIsUploadingImages(true);
      let uploadedUrls: string[] = [];

      if (previewFiles.length > 0) {
        const rawFiles = previewFiles.map((item) => item.file);
        const uploadResults = await uploadMultipleFilesApi(rawFiles, 'support-tickets');
        uploadedUrls = uploadResults.map((item) => item.url).filter(Boolean);
      }

      convertChatToTicketMutation.mutate(
        {
          conversationId: selectedConversation.id,
          title: values.title.trim(),
          description: values.description.trim(),
          category: values.category,
          priority: values.priority,
          attachments: uploadedUrls.length > 0 ? uploadedUrls : undefined
        },
        {
          onSuccess: () => {
            setShowConvertModal(false);
            convertForm.resetFields();
            setPreviewFiles([]);
            setSelectedConversation(null);
            setIsUploadingImages(false);
          },
          onError: async (err: any) => {
            if (uploadedUrls.length > 0) {
              await Promise.allSettled(uploadedUrls.map((url) => deleteFileApi(url)));
            }
            const msg = err?.response?.data?.message || err?.message || 'Không thể chuyển đổi cuộc trò chuyện thành Ticket';
            convertForm.setFields([
              {
                name: 'title',
                errors: [msg]
              }
            ]);
            setIsUploadingImages(false);
          }
        }
      );
    } catch (err: any) {
      convertForm.setFields([
        {
          name: 'attachments',
          errors: ['Lỗi khi tải ảnh minh họa lên hệ thống']
        }
      ]);
      setIsUploadingImages(false);
    }
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
          onOpenConvertModal={handleOpenConvertModal}
        />
      )}

      {/* TAB 2: Support Ticket Management Page Component */}
      {activeTab === 'tickets' && <SupportTicketPage />}

      {/* Convert Chat to Ticket Modal */}
      <ModalConvert
        open={showConvertModal}
        form={convertForm}
        previewFiles={previewFiles}
        isConverting={convertChatToTicketMutation.isPending || isUploadingImages}
        onClose={() => {
          setShowConvertModal(false);
          setPreviewFiles([]);
          convertForm.resetFields();
        }}
        onFileSelect={handleFileSelect}
        onRemoveAttachment={handleRemoveAttachment}
        onSubmit={handleConvertChatToTicket}
      />
    </div>
  );
};

export default SupportCenterPage;
