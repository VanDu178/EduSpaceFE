import { useEffect, useState } from 'react';
import {
  Drawer,
  Form,
  Input,
  Select,
  Radio,
  Switch,
  TimePicker,
  Upload,
  Button,
  Tooltip,
  Spin,
} from 'antd';
import toast from 'react-hot-toast';
import {
  LinkIcon,
  CloudArrowUpIcon,
  PhotoIcon,
  XMarkIcon,
  CheckCircleIcon,
  QuestionMarkCircleIcon,
  VideoCameraIcon,
  PlayIcon,
} from '@heroicons/react/24/outline';
import type { Video, VideoPayload, VideoType } from '../types';
import {
  STATUS_OPTIONS,
  SOURCE_TYPE_OPTIONS,
  DEFAULT_VIDEO_FORM_VALUES,
  THUMBNAIL_UPLOAD_CONFIG,
  VIDEO_UPLOAD_CONFIG,
  YOUTUBE_ID_REGEX,
} from '../constants';
import { generateSlug, getDirectVideoUrl, getVideoDurationFromFile, secondsToDayjs, dayjsToSeconds } from '../utils';
import { uploadSingleFileApi } from '../../../services/uploadService';

interface FormUpdateProps {
  open: boolean;
  video: Video | null;
  videoTypes: VideoType[];
  onSubmit: (payload: VideoPayload) => Promise<void>;
  onClose: () => void;
}

export const FormUpdate = ({
  open,
  video,
  videoTypes,
  onSubmit,
  onClose,
}: FormUpdateProps) => {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [uploadingThumb, setUploadingThumb] = useState(false);
  const [thumbnailUrl, setThumbnailUrl] = useState<string>('');
  const [storagePath, setStoragePath] = useState<string>('');
  const [isSlugTouched, setIsSlugTouched] = useState(false);
  const [isPreviewingDirectVideo, setIsPreviewingDirectVideo] = useState(false);

  // Theo dõi giá trị sourceType, youtubeVideoId & isPremium từ Form ant design
  const sourceType = Form.useWatch('sourceType', form) || DEFAULT_VIDEO_FORM_VALUES.sourceType;
  const youtubeVideoId = Form.useWatch('youtubeVideoId', form);
  const isPremium = Form.useWatch('isPremium', form);
  const isYoutubeValid = YOUTUBE_ID_REGEX.test(youtubeVideoId || '');

  // Reset state và nạp dữ liệu khi prop video/open thay đổi
  useEffect(() => {
    if (open && video) {
      const teaserTime = secondsToDayjs(video.teaserDuration);
      const durationTime = secondsToDayjs(video.duration);

      form.setFieldsValue({
        title: video.title,
        slug: video.slug,
        description: video.description,
        sourceType: video.sourceType || 'youtube',
        youtubeVideoId: video.youtubeVideoId,
        durationTime,
        teaserTime,
        isPremium: video.isPremium ?? false,
        status: video.status || 'draft',
        videoTypeId: video.videoTypeId,
      });
      setThumbnailUrl(video.thumbnailUrl || '');
      setStoragePath(video.storagePath || '');
      setIsSlugTouched(false);
      setIsPreviewingDirectVideo(false);
    }
  }, [open, video, form]);

  const isBusy = submitting || uploadingVideo || uploadingThumb;

  // Reset state tạm khi đóng drawer
  const handleDrawerClose = () => {
    if (isBusy) return;
    form.resetFields();
    setThumbnailUrl('');
    setStoragePath('');
    setIsSlugTouched(false);
    setIsPreviewingDirectVideo(false);
    onClose();
  };

  // Xử lý upload file Video trực tiếp lên Storage
  const handleUploadVideoFile = async (file: File) => {
    const isLtMax = file.size / 1024 / 1024 < VIDEO_UPLOAD_CONFIG.MAX_SIZE_MB;
    if (!isLtMax) {
      toast.error(`Dung lượng file video phải nhỏ hơn ${VIDEO_UPLOAD_CONFIG.DISPLAY_SIZE_TEXT}!`);
      return false;
    }

    setUploadingVideo(true);
    try {
      // Tự động đo thời lượng video trên trình duyệt
      const extractedDuration = await getVideoDurationFromFile(file);
      if (extractedDuration > 0) {
        form.setFieldValue('durationTime', secondsToDayjs(extractedDuration));
      }

      const res = await uploadSingleFileApi(file, 'videos');
      setStoragePath(res.url || res.path);
      setIsPreviewingDirectVideo(false);
      toast.success('Tải file video lên thành công!');
    } catch (err: any) {
      console.error('Upload video error:', err);
      toast.error(err?.response?.data?.message || 'Upload file video thất bại!');
    } finally {
      setUploadingVideo(false);
    }
  };

  // Xử lý upload Thumbnail (chỉ áp dụng với Nguồn tải lên trực tiếp)
  const handleUploadThumbnail = async (file: File) => {
    const isLt5M = file.size / 1024 / 1024 < THUMBNAIL_UPLOAD_CONFIG.MAX_SIZE_MB;
    if (!isLt5M) {
      toast.error(`Dung lượng ảnh đại diện phải nhỏ hơn ${THUMBNAIL_UPLOAD_CONFIG.MAX_SIZE_MB}MB!`);
      return false;
    }

    setUploadingThumb(true);
    try {
      const res = await uploadSingleFileApi(file, 'thumbnails');
      setThumbnailUrl(res.url);
      toast.success('Tải ảnh đại diện thành công!');
    } catch (err: any) {
      console.error('Upload thumbnail error:', err);
      toast.error(err?.response?.data?.message || 'Upload ảnh thất bại!');
    } finally {
      setUploadingThumb(false);
    }
  };

  // Submit Form
  const handleFinish = async (values: any) => {
    setSubmitting(true);
    try {
      const duration = dayjsToSeconds(values.durationTime);
      const teaserDuration = values.isPremium ? dayjsToSeconds(values.teaserTime) : 0;

      const payload: VideoPayload = {
        title: values.title,
        slug: generateSlug(values.slug || ''),
        description: values.description,
        sourceType: values.sourceType,
        youtubeVideoId: values.sourceType === 'youtube' ? values.youtubeVideoId?.trim() || null : null,
        storagePath: values.sourceType === 'direct_upload' ? storagePath : null,
        duration,
        teaserDuration,
        thumbnailUrl: values.sourceType === 'youtube' ? null : (thumbnailUrl || null),
        isPremium: values.isPremium,
        status: values.status,
        videoTypeId: values.videoTypeId,
      };

      await onSubmit(payload);
      handleDrawerClose();
    } catch (err: any) {
      console.error('Submit update form error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Drawer
      title={
        <div className="flex items-center gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-800 m-0 leading-tight">Cập nhật</h3>
          </div>
        </div>
      }
      open={open}
      onClose={handleDrawerClose}
      maskClosable={!isBusy}
      closable={!isBusy}
      width={800}
      footer={
        <div className="flex items-center justify-end gap-3 px-2 py-1">
          <Button
            onClick={handleDrawerClose}
            disabled={isBusy}
            className="rounded-xl h-10 px-5 border-slate-200 text-slate-600 hover:text-slate-800 font-medium"
          >
            Hủy
          </Button>
          <Button
            type="primary"
            onClick={() => form.submit()}
            loading={submitting}
            disabled={isBusy}
            className="bg-gradient-to-r from-sky-500 to-cyan-600 border-none text-white font-semibold rounded-xl h-10 px-6 cursor-pointer flex items-center justify-center gap-1.5"
          >
            Cập nhật
          </Button>
        </div>
      }
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        disabled={isBusy}
        className="py-2"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Cột Trái: Thông tin chính & Nguồn video (7/12) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 m-0">Nội dung & Nguồn dữ liệu</h4>
            </div>

            <Form.Item
              name="title"
              label={<span className="text-xs font-semibold text-slate-700">Tiêu đề video</span>}
              rules={[{ required: true, message: 'Vui lòng nhập tiêu đề video' }]}
              className="mb-0"
            >
              <Input
                placeholder="Ví dụ: Lớp học Phân tích Kỹ thuật Nâng cao"
                className="rounded-lg"
                onChange={(e) => {
                  if (!isSlugTouched) {
                    form.setFieldValue('slug', generateSlug(e.target.value));
                  }
                }}
              />
            </Form.Item>

            <Form.Item
              name="slug"
              label={
                <span className="text-xs font-semibold text-slate-700 flex items-center">
                  Đường dẫn Slug
                  <Tooltip title="Đường dẫn tĩnh không dấu (tự động tạo từ tiêu đề hoặc tùy chỉnh thủ công).">
                    <QuestionMarkCircleIcon className="w-3.5 h-3.5 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer ml-1" />
                  </Tooltip>
                </span>
              }
              rules={[{ required: true, message: 'Vui lòng nhập đường dẫn slug' }]}
              className="mb-0"
            >
              <Input
                placeholder="lop-hoc-phan-tich-ky-thuat-nang-cao"
                className="font-mono rounded-lg"
                onChange={() => {
                  if (!isSlugTouched) {
                    setIsSlugTouched(true);
                  }
                }}
                onBlur={(e) => {
                  const rawValue = e.target.value;
                  if (rawValue) {
                    form.setFieldValue('slug', generateSlug(rawValue));
                  }
                }}
              />
            </Form.Item>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Form.Item
                name="videoTypeId"
                label={<span className="text-xs font-semibold text-slate-700">Phân loại video</span>}
                rules={[{ required: true, message: 'Vui lòng chọn phân loại' }]}
                className="mb-0"
              >
                <Select placeholder="Chọn phân loại" className="w-full">
                  {videoTypes.map((vt) => (
                    <Select.Option key={vt.id} value={vt.id}>
                      {vt.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                name="status"
                label={<span className="text-xs font-semibold text-slate-700">Trạng thái</span>}
                className="mb-0"
              >
                <Select placeholder="Chọn trạng thái" className="w-full">
                  {STATUS_OPTIONS.map((opt) => (
                    <Select.Option key={opt.value} value={opt.value}>
                      {opt.label}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </div>

            <Form.Item
              name="sourceType"
              label={<span className="text-xs font-semibold text-slate-700">Loại nguồn dữ liệu</span>}
              className="mb-0"
            >
              <Radio.Group className="w-full">
                <div className="grid grid-cols-2 gap-1.5">
                  {SOURCE_TYPE_OPTIONS.map((opt) => {
                    const isYoutube = opt.value === 'youtube';
                    const isActive = sourceType === opt.value;
                    return (
                      <label
                        key={opt.value}
                        className={`flex items-center justify-start gap-2 cursor-pointer text-xs font-semibold transition-all duration-200 select-none ${isActive
                          ? 'bg-white text-slate-800'
                          : 'text-slate-500 hover:text-slate-700 hover:rounded-lg hover:bg-slate-200/50'
                          }`}
                      >
                        <Radio value={opt.value} className="hidden" />
                        {isYoutube ? (
                          <LinkIcon className={`w-4 h-4 transition-colors ${isActive ? 'text-rose-500' : 'text-slate-400'}`} />
                        ) : (
                          <CloudArrowUpIcon className={`w-4 h-4 transition-colors ${isActive ? 'text-sky-500' : 'text-slate-400'}`} />
                        )}
                        <span>{opt.label}</span>
                      </label>
                    );
                  })}
                </div>
              </Radio.Group>
            </Form.Item>

            {sourceType === 'youtube' ? (
              <Form.Item
                name="youtubeVideoId"
                label={
                  <span className="text-xs font-semibold text-slate-700 flex items-center">
                    YouTube Video ID
                    <Tooltip title="Chỉ nhập 11 ký tự Video ID trong đường dẫn YouTube (Ví dụ: dQw4w9WgXcQ).">
                      <QuestionMarkCircleIcon className="w-3.5 h-3.5 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer ml-1" />
                    </Tooltip>
                  </span>
                }
                rules={[
                  { required: sourceType === 'youtube', message: 'Vui lòng nhập 11 ký tự YouTube Video ID' },
                  { pattern: YOUTUBE_ID_REGEX, message: 'ID Video YouTube phải chứa đúng 11 ký tự' },
                ]}
                className="mb-0"
              >
                <Input
                  placeholder="dQw4w9WgXcQ"
                  prefix={<LinkIcon className="w-4 h-4 text-slate-400 mr-1" />}
                  maxLength={11}
                  className="font-mono rounded-lg"
                />
              </Form.Item>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-700 flex items-center">
                    File video
                    <Tooltip title={VIDEO_UPLOAD_CONFIG.HINT_TEXT}>
                      <QuestionMarkCircleIcon className="w-3.5 h-3.5 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer ml-1" />
                    </Tooltip>
                  </label>
                </div>

                {storagePath ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 rounded-xl border border-emerald-200/80 bg-emerald-50/40">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                          <VideoCameraIcon className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-slate-800 m-0 truncate font-mono">{storagePath}</p>
                          <span className="text-[10px] text-emerald-600 font-medium flex items-center gap-1 mt-0.5">
                            <CheckCircleIcon className="w-3 h-3" /> Đã tải lên thành công
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          type="text"
                          size="small"
                          icon={<PlayIcon className="w-4 h-4 text-sky-600" />}
                          onClick={() => setIsPreviewingDirectVideo(!isPreviewingDirectVideo)}
                          className="hover:bg-sky-50 text-sky-600 text-xs font-medium rounded-lg flex items-center gap-1 px-2 h-8"
                        >
                          {isPreviewingDirectVideo ? 'Ẩn xem trước' : 'Xem trước'}
                        </Button>
                        <Button
                          type="text"
                          size="small"
                          disabled={isBusy}
                          icon={<XMarkIcon className="w-4 h-4 text-slate-400 hover:text-rose-600" />}
                          onClick={() => {
                            if (isBusy) return;
                            setStoragePath('');
                            setIsPreviewingDirectVideo(false);
                          }}
                          className="hover:bg-rose-50 rounded-lg h-8 w-8 p-0"
                          title="Xóa video"
                        />
                      </div>
                    </div>

                    {isPreviewingDirectVideo && (
                      <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-black border border-slate-800">
                        <video
                          src={getDirectVideoUrl(storagePath)}
                          controls
                          autoPlay
                          className="w-full h-full object-contain"
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  <Upload
                    disabled={isBusy}
                    beforeUpload={(file) => {
                      handleUploadVideoFile(file);
                      return false;
                    }}
                    showUploadList={false}
                    accept={VIDEO_UPLOAD_CONFIG.ACCEPT_STRING}
                    className="w-full block [&_.ant-upload-select]:!w-full [&_.ant-upload-select]:!block [&_.ant-upload]:!w-full"
                  >
                    <div className="w-full border-2 border-dashed border-slate-200 hover:border-sky-400 bg-slate-50/60 hover:bg-sky-50/30 rounded-xl p-4 transition-all flex flex-col items-center justify-center cursor-pointer text-center group">
                      {uploadingVideo ? (
                        <div className="flex flex-col items-center py-2 text-sky-600">
                          <Spin size="small" />
                          <span className="text-xs font-medium mt-2">Đang tải video lên...</span>
                        </div>
                      ) : (
                        <>
                          <div className="w-9 h-9 rounded-full bg-slate-100 group-hover:bg-sky-100 text-slate-400 group-hover:text-sky-600 flex items-center justify-center mb-2 transition-colors">
                            <VideoCameraIcon className="w-5 h-5" />
                          </div>
                          <p className="text-xs font-semibold text-slate-700 group-hover:text-sky-600 transition-colors m-0">
                            Nhấp hoặc kéo thả để tải video lên
                          </p>
                          <div className="flex items-center justify-center gap-2 mt-2">
                            <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-500 border border-slate-200/60">
                              {VIDEO_UPLOAD_CONFIG.FORMATS_TEXT}
                            </span>
                            <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-500 border border-slate-200/60">
                              Tối đa {VIDEO_UPLOAD_CONFIG.DISPLAY_SIZE_TEXT}
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                  </Upload>
                )}
              </div>
            )}

            <Form.Item
              name="description"
              label={<span className="text-xs font-semibold text-slate-700">Mô tả ngắn</span>}
              className="mb-0"
            >
              <Input.TextArea rows={4} placeholder="Nhập tóm tắt nội dung video..." className="rounded-lg" />
            </Form.Item>
          </div>

          {/* Cột Phải: Media, Xem thử & Cấu hình (5/12) */}
          <div className="lg:col-span-5 space-y-4 lg:border-l lg:border-slate-100 lg:pl-6">
            <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 m-0">Thiết lập</h4>
            </div>

            {sourceType === 'youtube' ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-700 flex items-center">
                    Xem trước Video YouTube
                  </label>
                  {isYoutubeValid && (
                    <span className="text-[10px] font-mono text-emerald-600 font-medium bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60">
                      ID Hợp lệ
                    </span>
                  )}
                </div>

                {isYoutubeValid ? (
                  <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-black border border-slate-200/80 shadow-sm">
                    <iframe
                      className="w-full h-full border-0"
                      src={`https://www.youtube.com/embed/${youtubeVideoId}`}
                      title="YouTube Video Preview"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <div className="aspect-video w-full rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/60 flex flex-col items-center justify-center text-center p-4">
                    <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mb-2">
                      <PlayIcon className="w-5 h-5" />
                    </div>
                    <p className="text-xs font-semibold text-slate-600 m-0">Xem trước Video YouTube</p>
                    <span className="text-[11px] text-slate-400 mt-1">
                      Nhập đúng 11 ký tự YouTube Video ID để tải trình phát xem trước
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-700 flex items-center">
                    Ảnh đại diện (Thumbnail)
                    <Tooltip title={THUMBNAIL_UPLOAD_CONFIG.HINT_TEXT}>
                      <QuestionMarkCircleIcon className="w-3.5 h-3.5 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer ml-1" />
                    </Tooltip>
                  </label>
                </div>

                {thumbnailUrl ? (
                  <div className="relative aspect-video w-full rounded-xl overflow-hidden border border-slate-200/80 group bg-slate-900">
                    <img src={thumbnailUrl} alt="Thumbnail preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-slate-900/40 transition-colors" />
                    <button
                      type="button"
                      disabled={isBusy}
                      onClick={() => !isBusy && setThumbnailUrl('')}
                      className="absolute top-2.5 right-2.5 z-10 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Xóa ảnh đại diện"
                    >
                      <XMarkIcon className="w-4 h-4 stroke-[2.5]" />
                      <span>Xóa ảnh</span>
                    </button>
                  </div>
                ) : (
                  <Upload
                    disabled={isBusy}
                    beforeUpload={(file) => {
                      handleUploadThumbnail(file);
                      return false;
                    }}
                    showUploadList={false}
                    accept={THUMBNAIL_UPLOAD_CONFIG.ACCEPT_STRING}
                    className="w-full block [&_.ant-upload-select]:!w-full [&_.ant-upload-select]:!block [&_.ant-upload]:!w-full"
                  >
                    <div className="w-full border-2 border-dashed border-slate-200 hover:border-sky-400 bg-slate-50/60 hover:bg-sky-50/30 rounded-xl p-4 transition-all flex flex-col items-center justify-center cursor-pointer text-center group">
                      {uploadingThumb ? (
                        <div className="flex flex-col items-center py-2 text-sky-600">
                          <Spin size="small" />
                          <span className="text-xs font-medium mt-2">Đang tải ảnh lên...</span>
                        </div>
                      ) : (
                        <>
                          <div className="w-9 h-9 rounded-full bg-slate-100 group-hover:bg-sky-100 text-slate-400 group-hover:text-sky-600 flex items-center justify-center mb-2 transition-colors">
                            <PhotoIcon className="w-5 h-5" />
                          </div>
                          <p className="text-xs font-semibold text-slate-700 group-hover:text-sky-600 transition-colors m-0">
                            Nhấp hoặc kéo thả để tải ảnh lên
                          </p>
                          <div className="flex items-center justify-center gap-2 mt-2">
                            <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-500 border border-slate-200/60">
                              {THUMBNAIL_UPLOAD_CONFIG.FORMATS_TEXT}
                            </span>
                            <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-500 border border-slate-200/60">
                              Tối đa {THUMBNAIL_UPLOAD_CONFIG.MAX_SIZE_MB}MB
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                  </Upload>
                )}
              </div>
            )}

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-1">
                <span className="text-xs font-semibold text-slate-800">Nội dung trả phí</span>
                <Tooltip title="Yêu cầu tài khoản trả phí để xem video này">
                  <QuestionMarkCircleIcon className="w-3.5 h-3.5 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer" />
                </Tooltip>
              </div>
              <Form.Item name="isPremium" valuePropName="checked" noStyle>
                <Switch />
              </Form.Item>
            </div>

            <Form.Item
              name="durationTime"
              label={
                <span className="text-xs font-semibold text-slate-700 flex items-center">
                  Thời lượng video
                  <Tooltip title="Tự động trích xuất khi tải video trực tiếp, hoặc nhập thủ công (HH:mm:ss).">
                    <QuestionMarkCircleIcon className="w-3.5 h-3.5 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer ml-1" />
                  </Tooltip>
                </span>
              }
              className="mb-0"
            >
              <TimePicker format="HH:mm:ss" placeholder="00:00:00" className="w-full rounded-lg" />
            </Form.Item>

            {isPremium && (
              <Form.Item
                name="teaserTime"
                dependencies={['durationTime']}
                label={
                  <span className="text-xs font-semibold text-slate-700 flex items-center">
                    Thời gian xem thử
                    <Tooltip title="Thời lượng xem thử trước khi mua (bỏ trống nếu cho xem đầy đủ).">
                      <QuestionMarkCircleIcon className="w-3.5 h-3.5 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer ml-1" />
                    </Tooltip>
                  </span>
                }
                rules={[
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value) return Promise.resolve();
                      const durationTime = getFieldValue('durationTime');
                      const durationSec = dayjsToSeconds(durationTime);
                      const teaserSec = dayjsToSeconds(value);

                      if (durationSec > 0 && teaserSec > durationSec) {
                        return Promise.reject(new Error('Thời gian xem thử không được lớn hơn thời lượng video'));
                      }
                      return Promise.resolve();
                    },
                  }),
                ]}
                className="mb-0"
              >
                <TimePicker format="HH:mm:ss" placeholder="00:00:00" className="w-full rounded-lg" />
              </Form.Item>
            )}
          </div>
        </div>
      </Form>
    </Drawer>
  );
};
