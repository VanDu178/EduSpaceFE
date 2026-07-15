import { useState, useEffect, useRef } from 'react';
import { Form, Input, Select, Switch, Button, Row, Col } from 'antd';
import { ArrowLeftIcon, ArrowUpTrayIcon, TrashIcon } from '@heroicons/react/24/outline';
import type { Post, PostType, PostPayload } from '../types';

interface PostFormProps {
  postTypes: PostType[];
  initialData: Post | null;
  onSubmit: (values: PostPayload) => void;
  onCancel: () => void;
  isSaving: boolean;
}

const { Option } = Select;
const { TextArea } = Input;

const PostForm = ({
  postTypes,
  initialData,
  onSubmit,
  onCancel,
  isSaving,
}: PostFormProps) => {
  const [form] = Form.useForm();
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cập nhật giá trị form khi thay đổi initialData (chế độ sửa hoặc tạo mới)
  useEffect(() => {
    if (initialData) {
      form.setFieldsValue({
        title: initialData.title || '',
        summary: initialData.summary || '',
        content: initialData.content || '',
        postTypeId: initialData.postTypeId || (postTypes[0]?.id || 0),
        published: initialData.published || false,
      });
      setThumbnail(initialData.thumbnail || null);
    } else {
      form.resetFields();
      form.setFieldsValue({
        postTypeId: postTypes[0]?.id || 0,
        published: false,
      });
      setThumbnail(null);
    }
  }, [initialData, postTypes, form]);

  // Xử lý mã hóa ảnh sang Base64
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

  // Kích hoạt khi Form của Ant Design hoàn tất kiểm tra quy tắc (validation) thành công
  const onFinish = (values: any) => {
    onSubmit({
      title: values.title,
      summary: values.summary,
      content: values.content,
      postTypeId: values.postTypeId,
      published: values.published,
      thumbnail: thumbnail,
    });
  };

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-6 md:p-8">
      {/* Form Header */}
      <div className="flex items-center justify-between pb-6 border-b border-slate-100 mb-8">
        <div className="flex items-center space-x-3">
          <Button
            type="text"
            icon={<ArrowLeftIcon className="h-5 w-5" />}
            onClick={onCancel}
            className="text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-xl flex items-center justify-center"
            title="Quay lại"
          />
          <div>
            <h3 className="text-lg font-bold text-slate-800">
              {initialData ? 'Cập Nhật Bài Viết' : 'Viết Bài Mới'}
            </h3>
            <p className="text-xs text-slate-400 font-medium">
              {initialData ? 'Thay đổi thông tin bài viết và lưu cấu hình.' : 'Tạo một bài viết mới trong cơ sở dữ liệu.'}
            </p>
          </div>
        </div>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        requiredMark={false}
      >
        <Row gutter={32}>
          {/* Cột trái: Nội dung chính */}
          <Col xs={24} lg={16} className="space-y-6">
            {/* Tiêu đề bài viết */}
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

            {/* Mô tả ngắn */}
            <Form.Item
              label={<span className="text-sm font-semibold text-slate-700">Mô tả ngắn</span>}
              name="summary"
            >
              <TextArea
                rows={3}
                placeholder="Mô tả tóm tắt nội dung bài viết để hiển thị trên thẻ bài viết..."
                className="px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 text-slate-800 text-sm placeholder-slate-400"
              />
            </Form.Item>

            {/* Nội dung bài viết */}
            <Form.Item
              label={<span className="text-sm font-semibold text-slate-700">Nội dung bài viết</span>}
              name="content"
            >
              <div className="border border-slate-200 rounded-xl overflow-hidden flex flex-col bg-white">
                {/* Fake Toolbar */}
                <div className="bg-slate-50 border-b border-slate-200 px-3 py-2 flex items-center justify-between text-slate-500">
                  <div className="flex gap-1 text-xs">
                    <span className="font-bold px-1.5 py-0.5 hover:bg-slate-200 rounded cursor-pointer">B</span>
                    <span className="italic px-1.5 py-0.5 hover:bg-slate-200 rounded cursor-pointer">I</span>
                    <span className="underline px-1.5 py-0.5 hover:bg-slate-200 rounded cursor-pointer">U</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Markdown Supported</span>
                </div>
                <TextArea
                  rows={8}
                  placeholder="Nhập nội dung bài viết chi tiết tại đây..."
                  className="p-4 border-none focus:shadow-none focus:ring-0 text-slate-800 text-sm min-h-[200px]"
                />
              </div>
            </Form.Item>
          </Col>

          {/* Cột phải: Cấu hình bổ sung */}
          <Col xs={24} lg={8} className="space-y-6">
            {/* Phân loại thể loại */}
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
                    {type.name} ({type.code})
                  </Option>
                ))}
              </Select>
            </Form.Item>

            {/* Ảnh đại diện (Thumbnail Upload) */}
            <div className="space-y-2">
              <span className="text-sm font-semibold text-slate-700 block">Ảnh đại diện (Thumbnail)</span>
              <div
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 relative group min-h-[160px] ${
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
                  <div className="relative w-full h-[140px] rounded-lg overflow-hidden group/img">
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
                        icon={<TrashIcon className="h-4 w-4" />}
                        onClick={(e) => {
                          e.stopPropagation();
                          removeThumbnail();
                        }}
                        title="Xóa hình ảnh"
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center mb-2.5 text-slate-400 group-hover:text-blue-500 transition-colors duration-200">
                      <ArrowUpTrayIcon className="h-6 w-6" />
                    </div>
                    <span className="text-xs font-semibold text-slate-700">Kéo thả file hoặc nhấn để tải lên</span>
                    <span className="text-[10px] text-slate-400 mt-1">PNG, JPG, WEBP kích thước tối đa 5MB</span>
                  </>
                )}
              </div>
            </div>

            {/* Trạng thái xuất bản Switch */}
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <span className="text-sm font-semibold text-slate-700 block">Xuất bản bài viết</span>
                <span className="text-[11px] text-slate-400 font-medium leading-relaxed block mt-0.5">Hiển thị công khai cho mọi học viên.</span>
              </div>
              <Form.Item name="published" valuePropName="checked" className="mb-0">
                <Switch />
              </Form.Item>
            </div>
          </Col>
        </Row>

        {/* Nút tác vụ Form */}
        <div className="flex items-center justify-end space-x-3 pt-6 border-t border-slate-100 mt-8">
          <Button
            onClick={onCancel}
            className="px-5 h-11 rounded-xl border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-50"
          >
            Hủy bỏ
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={isSaving}
            className="px-5 h-11 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 border-none text-sm font-semibold flex items-center"
          >
            {initialData ? 'Cập nhật bài đăng' : 'Tạo bài đăng mới'}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default PostForm;
