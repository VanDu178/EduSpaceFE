import { useState, useEffect } from 'react';
import { Form, Input, Select, Button, Space, Tag, Modal, Switch, Upload, message, Spin } from 'antd';
import {
  ArrowLeftIcon,
  ArrowUpTrayIcon,
  TrashIcon,
  EyeIcon,
  PaperAirplaneIcon,
  LinkIcon,
} from '@heroicons/react/24/outline';
import TiptapEditor from '../../../components/TiptapEditor';
import type { FormInstance } from 'antd';
import type { BlogType } from '../../blogTypes';
import type { Blog, BlogPayload } from '../types';
import { getBlogTypeStyles } from '../utils';
import { uploadSingleFileApi } from '../../../services/uploadService';

interface FormUpdateProps {
  form: FormInstance;
  blogTypes: BlogType[];
  initialData: Blog;
  onSubmit: (values: BlogPayload) => void;
  onCancel: () => void;
  isSaving: boolean;
}

const { Option } = Select;
const { TextArea } = Input;

const StatusOptions = [
  {
    value: 'draft',
    label: 'Bản nháp',
  },
  {
    value: 'published',
    label: 'Đã xuất bản',
  },
  {
    value: 'archived',
    label: 'Lưu trữ',
  },
];

const generateSlug = (text: string): string => {
  if (!text) return '';
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'd')
    .replace(/([^0-9a-z-\s])/g, '')
    .replace(/(\s+)/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
};

const FormUpdate = ({
  form,
  blogTypes,
  initialData,
  onSubmit,
  onCancel,
  isSaving,
}: FormUpdateProps) => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [bannerUrl, setBannerUrl] = useState<string | null>(null);
  const [isSlugTouched, setIsSlugTouched] = useState(true);
  const [isUploadingBanner, setIsUploadingBanner] = useState(false);

  // Watch form values for preview and slug auto-generation
  const title = Form.useWatch('title', form);
  const slug = Form.useWatch('slug', form);
  const summary = Form.useWatch('summary', form);
  const blogTypeId = Form.useWatch('blogTypeId', form);
  const status = Form.useWatch('status', form);
  const isPremium = Form.useWatch('isPremium', form);
  const contentHtml = Form.useWatch('content', form) || '';

  const selectedBlogType = blogTypes.find((type) => type.id === blogTypeId) || blogTypes[0];

  // Nạp dữ liệu ban đầu cho Form khi initialData thay đổi
  useEffect(() => {
    if (initialData) {
      const initialStatus = initialData.status || 'draft';
      const initialTypeId = initialData.blogTypeId || blogTypes[0]?.id || 1;

      form.setFieldsValue({
        title: initialData.title || '',
        slug: initialData.slug || generateSlug(initialData.title || ''),
        summary: initialData.summary || '',
        content: initialData.content || '',
        blogTypeId: initialTypeId,
        status: initialStatus,
        isPremium: initialData.isPremium || false,
      });

      setBannerUrl(initialData.bannerUrl || initialData.thumbnailUrl || null);
    }
  }, [initialData, form, blogTypes]);

  // Auto generate slug when title changes if slug has not been manually touched
  useEffect(() => {
    if (!isSlugTouched && title) {
      const generated = generateSlug(title);
      form.setFieldValue('slug', generated);
    }
  }, [title, isSlugTouched, form]);

  const handleBannerUpload = async (file: File) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error('Vui lòng chọn file hình ảnh hợp lệ (PNG, JPG, WEBP, GIF)!');
      return;
    }
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error('Dung lượng ảnh bìa không được vượt quá 5MB!');
      return;
    }

    setIsUploadingBanner(true);
    const hideLoading = message.loading('Đang tải ảnh lên Supabase Storage...', 0);
    try {
      const res = await uploadSingleFileApi(file, 'blogs');
      setBannerUrl(res.url);
      message.success('Tải ảnh bìa lên Supabase thành công!');
    } catch (err: any) {
      console.error('Lỗi upload banner:', err);
      message.error(err.response?.data?.message || 'Không thể tải ảnh lên Supabase Storage!');
    } finally {
      hideLoading();
      setIsUploadingBanner(false);
    }
  };


  const onFinish = (values: any) => {
    onSubmit({
      title: values.title,
      slug: values.slug || generateSlug(values.title),
      blogTypeId: Number(values.blogTypeId),
      bannerUrl: bannerUrl || null,
      thumbnailUrl: bannerUrl || null,
      isPremium: values.isPremium || false,
      summary: values.summary || null,
      content: values.content || null,
      status: values.status || 'draft',
    });
  };

  return (
    <>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        className="-m-5 h-[calc(100vh-104px)] flex flex-col overflow-hidden bg-slate-50/40"
      >
        {/* Title Bar */}
        <div className="bg-white px-5 py-2.5 flex items-center justify-between z-10 shrink-0 border-b border-slate-200/80">
          <div className="flex items-center gap-2.5">
            <Button
              type="text"
              icon={<ArrowLeftIcon className="h-4 w-4" />}
              onClick={onCancel}
              className="text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg flex items-center justify-center p-1.5"
            />
            <h1 className="text-sm font-bold text-slate-800 tracking-tight">CẬP NHẬT</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => setIsPreviewOpen(true)}
              className="px-3.5 h-8.5 rounded-lg border-slate-200 text-slate-600 text-xs font-medium hover:bg-slate-50 hover:text-sky-600 flex items-center gap-1.5"
            >
              <EyeIcon className="h-4 w-4" />
              Xem trước
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={isSaving}
              className="px-4 h-8.5 rounded-lg bg-sky-600 hover:bg-sky-700 border-none text-xs font-semibold flex items-center gap-1.5"
            >
              <PaperAirplaneIcon className="h-4 w-4" />
              Lưu thay đổi
            </Button>
          </div>
        </div>

        {/* Main Compact Layout */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          <div className="max-w-5xl mx-auto grid grid-cols-12 gap-4">

            {/* Left Main Editor Area */}
            <div className="col-span-12 lg:col-span-8 space-y-4">

              {/* Title Section */}
              <div>
                <span className="text-[10px] font-bold text-slate-400 tracking-wider block mb-1">
                  TIÊU ĐỀ <span className="text-sm text-rose-500 font-bold ml-0.5">*</span>
                </span>
                <Form.Item
                  name="title"
                  rules={[{ required: true, message: 'Vui lòng nhập tiêu đề!' }]}
                  className="mb-0"
                >
                  <Input
                    placeholder="Nhập tiêu đề..."
                    className="text-xl font-bold border-0 border-b border-slate-200 rounded-none hover:border-slate-300 focus:border-sky-500 focus:ring-0 px-0 pb-2 transition-colors bg-transparent placeholder:text-slate-300 text-slate-800"
                  />
                </Form.Item>
              </div>

              {/* Slug Section */}
              <div>
                <div className="mb-1">
                  <span className="text-[10px] font-bold text-slate-400 tracking-wider flex items-center gap-1">
                    <LinkIcon className="h-3 w-3 text-slate-400" />
                    ĐƯỜNG DẪN (SLUG) <span className="text-sm text-rose-500 font-bold ml-0.5">*</span>
                  </span>
                </div>
                <Form.Item
                  name="slug"
                  rules={[{ required: true, message: 'Vui lòng nhập đường dẫn (slug)!' }]}
                  className="mb-0"
                >
                  <Input
                    prefix={<span className="text-slate-400 text-xs font-mono select-none">/blogs/</span>}
                    placeholder="duong-dan-bai-viet"
                    onChange={(e) => {
                      if (!e.target.value.trim()) {
                        setIsSlugTouched(false);
                      } else {
                        setIsSlugTouched(true);
                      }
                    }}
                    className="rounded-lg border-slate-200 focus:border-sky-500 text-slate-700 text-xs font-mono h-9"
                  />
                </Form.Item>
              </div>

              {/* Content Editor Section */}
              <div className="pt-1">
                <span className="text-[10px] font-bold text-slate-400 tracking-wider block mb-1.5">
                  NỘI DUNG CHI TIẾT <span className="text-sm text-rose-500 font-bold ml-0.5">*</span>
                </span>
                <Form.Item
                  name="content"
                  rules={[{ required: true, message: 'Vui lòng nhập nội dung chi tiết!' }]}
                  className="mb-0"
                >
                  <TiptapEditor placeholder="Nhập nội dung chi tiết tại đây..." />
                </Form.Item>
              </div>
            </div>

            {/* Right Compact Panel */}
            <div className="col-span-12 lg:col-span-4 space-y-4">

              {/* Category & Status Section */}
              <div className="space-y-3">
                <span className="text-[10px] font-bold text-slate-400 tracking-wider block">CẤU HÌNH</span>

                {/* Category / BlogType */}
                <div>
                  <label className="text-xs font-medium text-slate-600 mb-1 block">
                    Thể loại <span className="text-sm text-rose-500 font-bold ml-0.5">*</span>
                  </label>
                  <Form.Item
                    name="blogTypeId"
                    rules={[{ required: true, message: 'Vui lòng chọn thể loại!' }]}
                    className="mb-0"
                  >
                    <Select placeholder="Chọn thể loại" className="w-full h-9 text-xs">
                      {blogTypes.map((type) => (
                        <Option key={type?.id} value={type?.id}>
                          <span className="text-slate-700 text-xs font-medium">{type?.name}</span>
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </div>

                {/* Status */}
                <div>
                  <label className="text-xs font-medium text-slate-600 mb-1 block">Trạng thái xuất bản</label>
                  <Form.Item name="status" className="mb-0">
                    <Select className="w-full h-9 text-xs">
                      {StatusOptions.map((option) => (
                        <Option key={option.value} value={option.value}>
                          <span className="text-slate-700 text-xs font-medium">{option.label}</span>
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </div>

                {/* Premium / VIP Switch */}
                <div className="flex items-center justify-between pt-1">
                  <div>
                    <span className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                      Nội dung trả phí
                    </span>
                    <span className="text-[10px] text-slate-400 block">Dành riêng cho hội viên</span>
                  </div>
                  <Form.Item name="isPremium" valuePropName="checked" className="mb-0">
                    <Switch size="small" className="bg-slate-200 [&.ant-switch-checked]:bg-amber-500" />
                  </Form.Item>
                </div>
              </div>

              {/* Summary Section */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-slate-400 tracking-wider block">
                  MÔ TẢ NGẮN
                </span>
                <Form.Item
                  name="summary"
                  className="mb-0"
                >
                  <TextArea
                    rows={3}
                    placeholder="Mô tả tóm tắt nội dung..."
                    className="p-2.5 rounded-lg border border-slate-200 focus:border-sky-500 text-slate-800 text-xs placeholder:text-slate-400"
                  />
                </Form.Item>
              </div>

              {/* Cover Banner Upload Section */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-slate-400 tracking-wider block">
                  ẢNH BÌA
                </span>

                {bannerUrl ? (
                  <div className="relative w-full h-32 rounded-lg overflow-hidden group border border-slate-200">
                    <img src={bannerUrl} alt="Cover preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <Button
                        type="primary"
                        danger
                        shape="circle"
                        size="small"
                        icon={<TrashIcon className="h-4 w-4" />}
                        onClick={() => setBannerUrl(null)}
                      />
                    </div>
                  </div>
                ) : (
                  <Upload.Dragger
                    accept="image/png,image/jpeg,image/webp,image/gif"
                    showUploadList={false}
                    disabled={isUploadingBanner}
                    beforeUpload={(file) => {
                      handleBannerUpload(file);
                      return false;
                    }}
                    className="!border-dashed !border-slate-200 hover:!border-sky-500 !bg-slate-50/50 hover:!bg-slate-50 !rounded-lg transition-all"
                  >
                    <Spin spinning={isUploadingBanner} tip="Đang tải lên...">
                      <div className="flex flex-col items-center py-2">
                        <ArrowUpTrayIcon className="h-5 w-5 text-slate-400 mb-1" />
                        <span className="text-xs font-medium text-slate-600">Tải ảnh bìa</span>
                        <span className="text-[10px] text-slate-400">PNG, JPG, WEBP, GIF (Tối đa 5MB)</span>
                      </div>
                    </Spin>
                  </Upload.Dragger>
                )}
              </div>

            </div>
          </div>
        </div>
      </Form>

      {/* Live Preview Modal */}
      <Modal
        title={null}
        open={isPreviewOpen}
        onCancel={() => setIsPreviewOpen(false)}
        footer={null}
        width={860}
        centered
        styles={{ body: { padding: '20px', backgroundColor: '#ffffff', maxHeight: '85vh', overflowY: 'auto' } }}
        className="preview-modal rounded-xl overflow-hidden"
      >
        <div className="max-w-2xl mx-auto space-y-5">
          {/* Banner Image Preview */}
          {bannerUrl && (
            <div className="w-full h-48 rounded-lg overflow-hidden border border-slate-100">
              <img src={bannerUrl} alt="Cover" className="w-full h-full object-cover" />
            </div>
          )}

          {/* Meta header */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <Space>
              <Tag color={getBlogTypeStyles(selectedBlogType?.code)} className="font-semibold px-2.5 py-0.5 rounded-full border-none text-xs">
                {selectedBlogType?.name || 'Chưa chọn thể loại'}
              </Tag>
              {isPremium && (
                <Tag color="gold" className="font-semibold px-2.5 py-0.5 rounded-full border-none text-xs flex items-center gap-1">
                  ★ VIP Premium
                </Tag>
              )}
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${status === 'published'
                  ? 'bg-emerald-50 text-emerald-800'
                  : status === 'archived'
                    ? 'bg-slate-100 text-slate-700'
                    : 'bg-amber-50 text-amber-800'
                  }`}
              >
                {status === 'published' ? 'Đã xuất bản' : status === 'archived' ? 'Lưu trữ' : 'Bản nháp'}
              </span>
            </Space>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-extrabold text-slate-800 leading-tight">
            {title || <span className="text-slate-300 italic">Tiêu đề chưa nhập...</span>}
          </h1>

          {/* Slug */}
          <div className="text-xs font-mono text-slate-400">
            URL: /blogs/{slug || 'duong-dan-bai-viet'}
          </div>

          {/* Summary Excerpt */}
          {summary ? (
            <div className="bg-slate-50 border-l-3 border-sky-500 p-3 rounded-r-lg">
              <p className="text-slate-600 italic text-xs leading-relaxed whitespace-pre-wrap">{summary}</p>
            </div>
          ) : (
            <div className="bg-slate-50/50 border-l-3 border-slate-200 p-2.5 rounded-r-lg">
              <p className="text-slate-300 italic text-xs">Chưa có mô tả ngắn...</p>
            </div>
          )}

          <hr className="border-slate-100" />

          {/* Content Body */}
          <div
            className="text-slate-700 text-sm leading-relaxed space-y-3 break-words prose max-w-none [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_h1]:text-xl [&_h1]:font-bold [&_h2]:text-lg [&_h2]:font-bold [&_h3]:text-base [&_h3]:font-bold [&_p]:leading-relaxed"
            dangerouslySetInnerHTML={{
              __html: contentHtml || '<p class="text-slate-400 italic">Nội dung chi tiết chưa nhập...</p>',
            }}
          />
        </div>
      </Modal>
    </>
  );
};

export default FormUpdate;
