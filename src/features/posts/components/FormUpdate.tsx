import { useState, useEffect, useRef } from 'react';
import { Form, Input, Select, Switch, Button, Row, Col } from 'antd';
import { ArrowLeftIcon, ArrowUpTrayIcon, TrashIcon } from '@heroicons/react/24/outline';
import "@blocknote/core/fonts/inter.css";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { useCreateBlockNote } from "@blocknote/react";
import type { FormInstance } from 'antd';
import type { Post, PostType, PostPayload } from '../types';

interface FormUpdateProps {
  form: FormInstance;
  postTypes: PostType[];
  initialData: Post;
  onSubmit: (values: PostPayload) => void;
  onCancel: () => void;
  isSaving: boolean;
}

const { Option } = Select;
const { TextArea } = Input;

const FormUpdate = ({
  form,
  postTypes,
  initialData,
  onSubmit,
  onCancel,
  isSaving,
}: FormUpdateProps) => {
  const editor = useCreateBlockNote();
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Nạp dữ liệu ban đầu cho Form khi initialData thay đổi
  useEffect(() => {
    if (initialData) {
      form.setFieldsValue({
        title: initialData.title,
        summary: initialData.summary || '',
        postTypeId: initialData.postTypeId,
        published: initialData.published || false,
      });
      setThumbnail(initialData.thumbnail || null);
    }
  }, [initialData, form]);

  // Nạp dữ liệu HTML vào BlockNote editor khi có nội dung cũ
  useEffect(() => {
    if (initialData?.content) {
      const blocks = editor.tryParseHTMLToBlocks(initialData.content);
      editor.replaceBlocks(editor.document, blocks);
    }
  }, [initialData, editor]);

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
      published: values.published,
      thumbnail: thumbnail,
    });
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      requiredMark={false}
      className="-m-5 h-[calc(100vh-64px)] flex flex-col overflow-hidden bg-slate-50/30"
    >
      {/* Header cố định */}
      <div className="bg-white border-b border-slate-200/80 py-4 px-8 flex items-center justify-between shadow-sm z-30 flex-shrink-0">
        <div className="flex items-center space-x-3">
          <Button
            type="text"
            icon={<ArrowLeftIcon className="h-5 w-5" />}
            onClick={onCancel}
            className="text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-xl flex items-center justify-center"
          />
          <div>
            <h3 className="text-lg font-bold text-slate-800">Chỉnh sửa bài viết</h3>
            <p className="text-xs text-slate-400 font-medium">Bố cục chỉnh sửa dữ liệu và thay đổi trạng thái xuất bản.</p>
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
            Lưu thay đổi
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

            {/* Cột 3: Loại bài viết, Ảnh đại diện & Trạng thái xuất bản */}
            <Col xs={24} md={8} className="space-y-4">
              <Form.Item
                label={<span className="text-sm font-semibold text-slate-700">Phân loại bài viết</span>}
                name="postTypeId"
                rules={[{ required: true, message: 'Vui lòng chọn thể loại!' }]}
              >
                <Select
                  placeholder="Chọn thể loại"
                  className="w-full h-11 [&_.ant-select-selector]:!rounded-xl [&_.ant-select-selector]:!border-slate-200 [&_.ant-select-selector]:!px-4"
                >
                  {postTypes.map((type) => (
                    <Option key={type.id} value={type.id}>
                      {type.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Row gutter={16}>
                <Col span={12}>
                  <div className="space-y-2">
                    <span className="text-sm font-semibold text-slate-700 block">Ảnh đại diện</span>
                    <div
                      onDragEnter={handleDrag}
                      onDragOver={handleDrag}
                      onDragLeave={handleDrag}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={`border border-dashed rounded-xl p-2 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 relative min-h-[90px] ${
                        dragActive ? 'border-blue-500 bg-blue-50/20' : 'border-slate-200 hover:border-blue-500 bg-slate-50/50 hover:bg-slate-50'
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
                        <div className="relative w-full h-[70px] rounded-lg overflow-hidden group/img">
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
                          <ArrowUpTrayIcon className="h-5 w-5 text-slate-400 mb-0.5" />
                          <span className="text-xs font-semibold text-slate-600">Chọn ảnh</span>
                          <span className="text-[10px] font-semibold text-slate-500">Tải lên</span>
                        </>
                      )}
                    </div>
                  </div>
                </Col>

                <Col span={12}>
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 h-[115px] flex flex-col justify-between">
                    <div>
                      <span className="text-xs font-semibold text-slate-700 block">Xuất bản</span>
                      <span className="text-[9px] text-slate-400 leading-tight block mt-0.5">Hiển thị cho học viên</span>
                    </div>
                    <Form.Item name="published" valuePropName="checked" className="mb-0">
                      <Switch size="small" />
                    </Form.Item>
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
        </div>

        {/* Vùng Soạn Thảo Dưới Trải Rộng 100% */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 md:p-8 shadow-sm">
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

export default FormUpdate;
