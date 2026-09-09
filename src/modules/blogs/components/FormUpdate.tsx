import { useState, useEffect } from 'react';
import { Form, Input, Select, Button, Switch, Upload, Spin, Tooltip } from 'antd';
import toast from 'react-hot-toast';
import {
  ArrowLeftIcon,
  ArrowUpTrayIcon,
  TrashIcon,
  EyeIcon,
  PaperAirplaneIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';
import TiptapEditor from '../../../components/TiptapEditor';
import type { FormInstance } from 'antd';
import type { BlogType } from '../../blogTypes';
import type { Blog, BlogPayload } from '../types';
import ModalPreview from './ModalPreview';
import { processImageFileSelect, BLOG_BANNER_UPLOAD_CONFIG, FOLDER_NAME, uploadSingleFileApi } from '../../upload';


import { BLOG_STATUS, BLOG_STATUS_OPTIONS } from '../constants';
import { generateSlug } from '../utils';

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

const FormUpdate = ({
  initialData,
  form,
  blogTypes,
  onSubmit,
  onCancel,
  isSaving,
}: FormUpdateProps) => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [bannerPreviewUrl, setBannerPreviewUrl] = useState<string | null>(null);
  const [isBannerRemoved, setIsBannerRemoved] = useState(false);
  const [isSlugTouched, setIsSlugTouched] = useState(true);
  const [isUploadingBanner, setIsUploadingBanner] = useState(false);

  const isLoading = isSaving || isUploadingBanner;

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
      const initialStatus = initialData.status || BLOG_STATUS.DRAFT;
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

      setBannerPreviewUrl(initialData.bannerUrl || initialData.thumbnailUrl || null);
      setBannerFile(null);
      setIsBannerRemoved(false);
    }
  }, [initialData, form, blogTypes]);

  // Clean up object URL on component unmount
  useEffect(() => {
    return () => {
      if (bannerPreviewUrl && bannerPreviewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(bannerPreviewUrl);
      }
    };
  }, [bannerPreviewUrl]);

  // Auto generate slug when title changes if slug has not been manually touched
  useEffect(() => {
    if (!isSlugTouched && title) {
      const generated = generateSlug(title);
      form.setFieldValue('slug', generated);
    }
  }, [title, isSlugTouched, form]);

  const handleSyncSlug = () => {
    setIsSlugTouched(false);
    const generated = generateSlug(title || '');
    form.setFieldValue('slug', generated);
  };

  const handleSelectBanner = async (file: File) => {
    const result = await processImageFileSelect(file, bannerPreviewUrl, BLOG_BANNER_UPLOAD_CONFIG);
    if (!result) return;

    setBannerFile(result.file);
    setBannerPreviewUrl(result.localBlobUrl);
    setIsBannerRemoved(false);
  };



  const handleRemoveBanner = () => {
    if (bannerPreviewUrl && bannerPreviewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(bannerPreviewUrl);
    }
    setBannerFile(null);
    setBannerPreviewUrl(null);
    setIsBannerRemoved(true);
  };

  const onFinish = async (values: any) => {
    let finalBannerUrl: string | null = initialData?.bannerUrl || initialData?.thumbnailUrl || null;

    if (bannerFile) {
      setIsUploadingBanner(true);
      try {
        const res = await uploadSingleFileApi(bannerFile, FOLDER_NAME.BLOGS);
        finalBannerUrl = res.url;
      } catch (err: any) {
        toast.error("Đã xảy ra vấn đề khi cập nhật bài viết. Vui lòng thử lại!");
        setIsUploadingBanner(false);
        return;
      } finally {
        setIsUploadingBanner(false);
      }
    } else if (isBannerRemoved) {
      finalBannerUrl = null;
    }

    const finalSlug = generateSlug(values.slug || values.title);
    onSubmit({
      title: values.title,
      slug: finalSlug,
      blogTypeId: Number(values.blogTypeId),
      bannerUrl: finalBannerUrl,
      thumbnailUrl: finalBannerUrl,
      isPremium: values.isPremium || false,
      summary: values.summary || null,
      content: values.content || null,
      status: values.status || BLOG_STATUS.DRAFT,
    });
  };

  return (
    <>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        disabled={isLoading}
        initialValues={{
          title: initialData?.title || '',
          slug: initialData?.slug || generateSlug(initialData?.title || ''),
          summary: initialData?.summary || '',
          content: initialData?.content || '',
          blogTypeId: initialData?.blogTypeId || blogTypes[0]?.id || 1,
          status: initialData?.status || BLOG_STATUS.DRAFT,
          isPremium: initialData?.isPremium || false,
        }}
        className="-m-5 h-[calc(100vh-104px)] flex flex-col overflow-hidden bg-slate-50/40"
      >
        {/* Title Bar */}
        <div className="bg-white px-5 py-2.5 flex items-center justify-between z-10 shrink-0 border-b border-slate-200/80">
          <div className="flex items-center gap-2.5">
            <Button
              type="text"
              icon={<ArrowLeftIcon className="h-4 w-4" />}
              onClick={onCancel}
              disabled={isLoading}
              className="text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg flex items-center justify-center p-1.5"
            />
            <h1 className="text-sm font-bold text-slate-800 tracking-tight">CẬP NHẬT</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => setIsPreviewOpen(true)}
              disabled={isLoading}
              className="px-3.5 h-8.5 rounded-lg border-slate-200 text-slate-600 text-xs font-medium hover:bg-slate-50 hover:text-sky-600 flex items-center gap-1.5"
            >
              <EyeIcon className="h-4 w-4" />
              Xem trước
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={isLoading}
              disabled={isLoading}
              className="px-4 h-8.5 rounded-lg bg-sky-600 hover:bg-sky-700 border-none text-xs font-semibold flex items-center gap-1.5"
            >
              <PaperAirplaneIcon className="h-4 w-4" />
              Lưu thay đổi
            </Button>
          </div>
        </div>

        {/* Main Compact Layout */}
        <Spin
          spinning={isLoading}
          tip={'Đang cập nhật bài viết...'}
          wrapperClassName="flex-1 min-h-0 flex flex-col [&>.ant-spin-container]:flex-1 [&>.ant-spin-container]:min-h-0 [&>.ant-spin-container]:flex [&>.ant-spin-container]:flex-col"
        >
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
                      SLUG<span className="text-sm text-rose-500 font-bold ml-0.5">*</span>
                    </span>
                  </div>
                  <Form.Item
                    name="slug"
                    rules={[{ required: true, message: 'Vui lòng nhập đường dẫn (slug)!' }]}
                    className="mb-0"
                  >
                    <Input
                      prefix={<span className="text-slate-400 text-xs font-mono select-none">/blogs/</span>}
                      suffix={
                        <Tooltip title="Tạo lại slug từ tiêu đề">
                          <button
                            type="button"
                            onClick={handleSyncSlug}
                            disabled={isLoading}
                            className="p-1 text-slate-400 hover:text-sky-600 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed rounded transition-colors flex items-center justify-center"
                          >
                            <ArrowPathIcon className="h-3.5 w-3.5" />
                          </button>
                        </Tooltip>
                      }
                      placeholder="duong-dan-bai-viet"
                      onChange={(e) => {
                        if (!e.target.value.trim()) {
                          setIsSlugTouched(false);
                        } else {
                          setIsSlugTouched(true);
                        }
                      }}
                      onBlur={(e) => {
                        const val = e.target.value;
                        if (val.trim()) {
                          const cleaned = generateSlug(val);
                          form.setFieldValue('slug', cleaned);
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
                    <TiptapEditor placeholder="Nhập nội dung chi tiết tại đây..." disabled={isLoading} />
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
                        {BLOG_STATUS_OPTIONS.map((option) => (
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

                  {bannerPreviewUrl ? (
                    <div className="relative w-full h-32 rounded-lg overflow-hidden group border border-slate-200">
                      <img src={bannerPreviewUrl} alt="Cover preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <Button
                          type="primary"
                          danger
                          shape="circle"
                          size="small"
                          icon={<TrashIcon className="h-4 w-4" />}
                          onClick={handleRemoveBanner}
                          disabled={isLoading}
                        />
                      </div>
                    </div>
                  ) : (
                    <Upload.Dragger
                      accept={BLOG_BANNER_UPLOAD_CONFIG.ACCEPT_STRING}
                      showUploadList={false}
                      disabled={isLoading}
                      beforeUpload={(file) => {
                        handleSelectBanner(file);
                        return false;
                      }}
                      className="!border-dashed !border-slate-200 hover:!border-sky-500 !bg-slate-50/50 hover:!bg-slate-50 !rounded-lg transition-all"
                    >
                      <Spin spinning={isUploadingBanner} tip="Đang chuẩn bị...">
                        <div className="flex flex-col items-center py-2">
                          <ArrowUpTrayIcon className="h-5 w-5 text-slate-400 mb-1" />
                          <span className="text-xs font-medium text-slate-600">Tải ảnh bìa</span>
                          <span className="text-[10px] text-slate-400">{BLOG_BANNER_UPLOAD_CONFIG.HINT_TEXT}</span>
                        </div>
                      </Spin>
                    </Upload.Dragger>
                  )}
                </div>

              </div>
            </div>
          </div>
        </Spin>
      </Form>

      {/* Live Preview Modal */}
      <ModalPreview
        open={isPreviewOpen}
        onCancel={() => setIsPreviewOpen(false)}
        title={title}
        slug={slug}
        summary={summary}
        contentHtml={contentHtml}
        bannerUrl={bannerPreviewUrl}
        selectedBlogType={selectedBlogType}
        isPremium={isPremium}
        status={status}
      />

    </>
  );
};

export default FormUpdate;
