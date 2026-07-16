import { useState, useRef } from 'react';
import { Form, Input, Select, Button, Row, Col } from 'antd';
import { ArrowLeftIcon, ArrowUpTrayIcon, TrashIcon } from '@heroicons/react/24/outline';
import "@blocknote/core/fonts/inter.css";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { useCreateBlockNote } from "@blocknote/react";
import type { FormInstance } from 'antd';
import type { PostType, PostPayload } from '../types';

interface FormCreateProps {
  form: FormInstance;
  postTypes: PostType[];
  onSubmit: (values: PostPayload) => void;
  onCancel: () => void;
  isSaving: boolean;
}

const { Option } = Select;
const { TextArea } = Input;

const FormCreate = ({
  form,
  postTypes,
  onSubmit,
  onCancel,
  isSaving,
}: FormCreateProps) => {
  const editor = useCreateBlockNote();
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Vui lòng chọn một file ảnh hợp lệ (PNG, JPG, WEBP)!');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setThumbnail(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const removeThumbnail = () => {
    setThumbnail(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const onFinish = (values: any) => {
    const contentHtml = editor.blocksToHTMLLossy(editor.document);
    onSubmit({
      title: values.title,
      summary: values.summary,
      content: contentHtml,
      postTypeId: values.postTypeId,
      published: false, // Mặc định tạo mới chưa xuất bản
      thumbnail: thumbnail,
    });
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      requiredMark={false}
      initialValues={{
        postTypeId: postTypes[0]?.id || 1,
      }}
      className="-m-5 h-[calc(100vh-120px)] flex flex-col overflow-hidden bg-slate-50/30"
    >
      {/* Header cố định */}
      <div className="bg-white py-4 px-8 flex items-center justify-between z-30 flex-shrink-0">
        <div className="flex items-center space-x-3">
          <Button
            type="text"
            icon={<ArrowLeftIcon className="h-5 w-5" />}
            onClick={onCancel}
            className="text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-xl flex items-center justify-center"
          />
          <div>
            <h3 className="text-lg font-bold text-slate-800">Tạo bài viết mới</h3>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            onClick={onCancel}
            className="px-5 h-10 rounded-xl border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-50"
          >
            Hủy bỏ
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={isSaving}
            className="px-5 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 border-none text-sm font-semibold flex items-center"
          >
            Tạo bài đăng
          </Button>
        </div>
      </div>

      {/* Vùng nội dung cuộn nội bộ */}
      <div className="flex-1 overflow-y-auto p-8 space-y-6 max-w-7xl w-full mx-auto">
        {/* Vùng Thông Tin Trên */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 md:p-8 shadow-sm">
          <Row gutter={24}>
            {/* Cột 1 & 2: Tiêu đề và mô tả */}
            <Col xs={24} md={16} className="space-y-4">
              <Form.Item
                label={<span className="text-sm font-semibold text-slate-700">Tiêu đề bài viết</span>}
                name="title"
                rules={[{ required: true, message: 'Vui lòng nhập tiêu đề bài viết!' }]}
              >
                <Input
                  placeholder="Nhập tiêu đề hấp dẫn..."
                  className="px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 text-slate-800 text-sm placeholder-slate-400"
                />
              </Form.Item>

              <Form.Item
                label={<span className="text-sm font-semibold text-slate-700">Mô tả ngắn</span>}
                name="summary"
              >
                <TextArea
                  rows={3}
                  placeholder="Mô tả tóm tắt nội dung để hiển thị trên thẻ bài viết..."
                  className="px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 text-slate-800 text-sm placeholder-slate-400"
                />
              </Form.Item>
            </Col>

            {/* Cột 3: Loại bài viết và Ảnh đại diện */}
            <Col xs={24} md={8} className="space-y-4">
              <Form.Item
                label={<span className="text-sm font-semibold text-slate-700">Phân loại bài viết</span>}
                name="postTypeId"
                rules={[{ required: true, message: 'Vui lòng chọn thể loại!' }]}
              >
                <Select
                  placeholder="Chọn thể loại"
                  className="w-full"
                >
                  {postTypes.map((type) => (
                    <Option key={type.id} value={type.id}>
                      {type.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <div className="space-y-2">
                <span className="text-sm font-semibold text-slate-700 block">Ảnh đại diện</span>
                <div
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border border-dashed rounded-xl p-3 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 relative min-h-[110px] ${dragActive ? 'border-blue-500 bg-blue-50/20' : 'border-slate-200 hover:border-blue-500 bg-slate-50/50 hover:bg-slate-50'
                    }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />

                  {thumbnail ? (
                    <div className="relative w-full h-[90px] rounded-lg overflow-hidden group/img">
                      <img
                        src={thumbnail}
                        alt="Thumbnail preview"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover/img:opacity-100 flex items-center justify-center transition-opacity duration-200">
                        <Button
                          type="primary"
                          danger
                          shape="circle"
                          size="small"
                          icon={<TrashIcon className="h-4 w-4" />}
                          onClick={(e) => {
                            e.stopPropagation();
                            removeThumbnail();
                          }}
                        />
                      </div>
                    </div>
                  ) : (
                    <>
                      <ArrowUpTrayIcon className="h-5 w-5 text-slate-400 mb-1" />
                      <span className="text-xs font-semibold text-slate-600">Nhấp để tải lên</span>
                    </>
                  )}
                  <p className="mt-2 text-xs text-slate-500">Hỗ trợ các định dạng: PNG, JPG, WEBP. Kích thước tối đa: 5MB.</p>
                </div>
              </div>
            </Col>
          </Row>
        </div>

        {/* Vùng Soạn Thảo Dưới Trải Rộng 100% */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 md:p-8 shadow-sm min-h-[350px]">
          <Form.Item
            label={<span className="text-sm font-semibold text-slate-700">Nội dung bài viết chi tiết</span>}
            name="content"
          >
            <BlockNoteView editor={editor} theme="light" />
          </Form.Item>
        </div>
      </div>
    </Form>
  );
};

export default FormCreate;
