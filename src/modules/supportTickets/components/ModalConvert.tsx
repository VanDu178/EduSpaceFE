import React from 'react';
import { XMarkIcon, TicketIcon, PhotoIcon } from '@heroicons/react/24/outline';
import { Image, Input, Select, Form, Button } from 'antd';
import type { FormInstance } from 'antd';
import type { TicketCategory, TicketPriority } from '../types';
import {
  TICKET_CATEGORY_OPTIONS,
  TICKET_PRIORITY_OPTIONS,
  DEFAULT_CONVERT_FORM_VALUES,
  TICKET_ATTACHMENT_LIMITS
} from '../constants';

const { TextArea } = Input;

export interface PreviewFile {
  file: File;
  url: string;
}

interface ModalConvertProps {
  open: boolean;
  form: FormInstance;
  previewFiles?: PreviewFile[];
  isConverting: boolean;
  onClose: () => void;
  onFileSelect?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveAttachment?: (index: number) => void;
  onSubmit: (values: {
    title: string;
    category: TicketCategory;
    priority: TicketPriority;
    description: string;
  }) => void;
}

export const ModalConvert = ({
  open,
  form,
  previewFiles = [],
  isConverting,
  onClose,
  onFileSelect,
  onRemoveAttachment,
  onSubmit
}: ModalConvertProps) => {
  if (!open) return null;

  const isMaxReached = previewFiles.length >= TICKET_ATTACHMENT_LIMITS.MAX_COUNT;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/40 backdrop-blur-sm animate-fadeIn"
      onClick={() => {
        if (!isConverting) onClose();
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg bg-white border border-slate-200/80 rounded-2xl flex flex-col max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 p-4 pb-3 bg-white shrink-0">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 bg-sky-100 text-sky-700 rounded-lg">
              <TicketIcon className="w-4 h-4" />
            </div>
            <span className="text-base font-bold text-slate-900">Chuyển chat thành yêu cầu hỗ trợ</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isConverting}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition cursor-pointer disabled:pointer-events-none disabled:opacity-50"
            title="Đóng cửa sổ"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Form Container */}
        <Form
          form={form}
          layout="vertical"
          onFinish={onSubmit}
          initialValues={DEFAULT_CONVERT_FORM_VALUES}
          className="flex flex-col flex-1 overflow-hidden min-h-0"
        >
          {/* Scrollable Form Body */}
          <div className="p-4 sm:p-5 space-y-2.5 overflow-y-auto flex-1">
            {/* Field: Title */}
            <Form.Item
              name="title"
              label={<span className="text-xs font-semibold text-slate-700">Tiêu đề sự cố <span className="text-red-500">*</span></span>}
              rules={[{ required: true, message: 'Vui lòng nhập tiêu đề sự cố!' }]}
              className="mb-2.5"
            >
              <Input
                disabled={isConverting}
                placeholder="VD: Cần kiểm tra giao dịch nạp tiền VietQR"
                className="w-full text-xs sm:text-sm rounded-xl py-2 border-slate-200 hover:border-sky-400 focus:border-sky-500"
              />
            </Form.Item>

            {/* Grid 2 cột: Category & Priority */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-2.5">
              <Form.Item
                name="category"
                label={<span className="text-xs font-semibold text-slate-700">Phân loại sự cố <span className="text-red-500">*</span></span>}
                rules={[{ required: true, message: 'Vui lòng chọn phân loại sự cố!' }]}
                className="mb-0"
              >
                <Select
                  disabled={isConverting}
                  options={TICKET_CATEGORY_OPTIONS}
                  className="w-full text-xs sm:text-sm"
                />
              </Form.Item>

              <Form.Item
                name="priority"
                label={<span className="text-xs font-semibold text-slate-700">Độ ưu tiên <span className="text-red-500">*</span></span>}
                rules={[{ required: true, message: 'Vui lòng chọn độ ưu tiên!' }]}
                className="mb-0"
              >
                <Select
                  disabled={isConverting}
                  options={TICKET_PRIORITY_OPTIONS}
                  className="w-full text-xs sm:text-sm"
                />
              </Form.Item>
            </div>

            {/* Field: Description */}
            <Form.Item
              name="description"
              label={<span className="text-xs font-semibold text-slate-700">Mô tả chi tiết <span className="text-red-500">*</span></span>}
              rules={[{ required: true, message: 'Vui lòng nhập mô tả chi tiết!' }]}
              className="mb-2.5"
            >
              <TextArea
                rows={2}
                disabled={isConverting}
                placeholder="Nhập nội dung chi tiết mô tả nguyên nhân hoặc yêu cầu từ phía Admin..."
                className="w-full text-xs sm:text-sm rounded-xl resize-none py-1.5 border-slate-200 hover:border-sky-400 focus:border-sky-500"
              />
            </Form.Item>

            {/* Field: Image Upload Section */}
            <Form.Item
              name="attachments"
              label={
                <div className="flex items-center justify-between w-full">
                  <span className="text-xs font-semibold text-slate-800">Hình ảnh minh họa đính kèm</span>
                  <span className="text-[11px] font-mono text-sky-700 font-bold bg-sky-100 px-1.5 py-0.5 rounded-md">
                    {previewFiles.length}/{TICKET_ATTACHMENT_LIMITS.MAX_COUNT}
                  </span>
                </div>
              }
              className="mb-2"
            >
              <div>
                <input
                  id="admin-ticket-convert-image-upload"
                  type="file"
                  onChange={onFileSelect}
                  accept="image/*, .png, .jpg, .jpeg, .webp, .gif"
                  multiple
                  className="hidden"
                  disabled={isConverting || isMaxReached}
                />

                {!isMaxReached && (
                  <label
                    htmlFor="admin-ticket-convert-image-upload"
                    className={`group flex flex-col items-center justify-center space-y-1 w-full p-2.5 border-2 border-dashed border-sky-300 hover:border-sky-500 bg-gradient-to-br from-sky-50/70 to-blue-50/40 hover:from-sky-100/80 hover:to-blue-100/60 text-sky-800 rounded-xl cursor-pointer transition duration-200 ${isConverting ? 'pointer-events-none opacity-50 cursor-not-allowed' : ''
                      }`}
                  >
                    <div className="flex items-center space-x-1.5 font-semibold text-xs text-sky-700">
                      <PhotoIcon className="w-4.5 h-4.5 text-sky-600 group-hover:scale-110 transition-transform duration-200" />
                      <span>Chọn hình ảnh đính kèm từ máy tính</span>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-1.5 text-[11px]">
                      <span className="text-slate-500 font-medium">Hỗ trợ:</span>
                      <div className="flex items-center gap-1">
                        {['PNG', 'JPG', 'JPEG', 'WEBP', 'GIF'].map((ext) => (
                          <span
                            key={ext}
                            className="bg-white/90 border border-sky-200 text-sky-700 font-semibold px-1.5 py-0.2 rounded text-[10px]"
                          >
                            {ext}
                          </span>
                        ))}
                      </div>
                      <span className="text-slate-400">•</span>
                      <span className="text-slate-600 font-medium">Tối đa {TICKET_ATTACHMENT_LIMITS.MAX_SIZE_MB}MB/ảnh</span>
                    </div>
                  </label>
                )}

                {previewFiles.length > 0 && (
                  <Image.PreviewGroup>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {previewFiles.map((item, idx) => (
                        <div
                          key={idx}
                          className="relative group border border-slate-200 rounded-lg overflow-hidden w-16 h-16 bg-slate-100 hover:border-sky-400 transition duration-200 shrink-0"
                        >
                          <Image
                            src={item.url}
                            alt={`attachment-${idx}`}
                            width="100%"
                            height="100%"
                            className="w-full h-full object-cover"
                            style={{ objectFit: 'cover' }}
                          />

                          {onRemoveAttachment && (
                            <button
                              type="button"
                              disabled={isConverting}
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                onRemoveAttachment(idx);
                              }}
                              className="absolute top-1 right-1 z-10 bg-red-500/90 hover:bg-red-600 text-white rounded-full p-1 cursor-pointer transition disabled:pointer-events-none"
                              title="Xóa ảnh này"
                            >
                              <XMarkIcon className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </Image.PreviewGroup>
                )}
              </div>
            </Form.Item>
          </div>

          {/* Fixed Footer Actions */}
          <div className="flex items-center justify-end space-x-2.5 p-3.5 sm:p-4 bg-white border-t border-slate-100 shrink-0">
            <Button
              type="default"
              onClick={onClose}
              disabled={isConverting}
              className="px-4 py-1.5 rounded-xl border-slate-200 text-slate-700 text-xs sm:text-sm font-semibold h-auto"
            >
              Hủy
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={isConverting}
              className="px-5 py-1.5 bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 border-none text-white text-xs sm:text-sm font-bold rounded-xl h-auto"
            >
              Chuyển thành yêu cầu hỗ trợ
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};
