import { useState } from 'react';
import { Form, Input, Select, Button, Space, Tag, Modal, Switch, Upload, message } from 'antd';
import {
  ArrowLeftIcon,
  ArrowUpTrayIcon,
  TrashIcon,
  EyeIcon,
  PaperAirplaneIcon,
} from '@heroicons/react/24/outline';
import BlockNoteEditor from '../../../components/BlockNoteEditor';
import type { FormInstance } from 'antd';
import type { PostType, PostPayload } from '../types';
import { getPostTypeStyles } from '../utils';

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
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [thumbnail, setThumbnail] = useState<string | null>(null);

  // Watch form fields for live preview modal
  const title = Form.useWatch('title', form);
  const summary = Form.useWatch('summary', form);
  const postTypeId = Form.useWatch('postTypeId', form);
  const published = Form.useWatch('published', form);
  const contentHtml = Form.useWatch('content', form) || '';

  const selectedPostType = postTypes.find((type) => type.id === postTypeId) || postTypes[0];


  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      message.error('Vui lòng chọn một file ảnh hợp lệ (PNG, JPG, WEBP)!');
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

  const removeThumbnail = () => {
    setThumbnail(null);
  };

  const onFinish = (values: any) => {
    onSubmit({
      title: values?.title,
      summary: values?.summary,
      content: values?.content,
      postTypeId: values?.postTypeId,
      published: values?.published || false,
      thumbnail: thumbnail,
    });
  };

  return (
    <>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        requiredMark={false}
        initialValues={{
          postTypeId: postTypes[0]?.id || 1,
          published: false,
        }}
        className="-m-5 h-[calc(100vh-104px)] flex flex-col overflow-hidden bg-slate-50/30"
      >
        {/* Thanh Tiêu Đề (Title Bar) */}
        <div className="bg-white py-3.5 pt-1 pb-6 pr-6 flex items-center justify-between z-10 flex-shrink-0 border-b border-slate-200/60">
          <div className="flex items-center">
            <Button
              type="text"
              icon={<ArrowLeftIcon className="h-4 w-4" />}
              onClick={onCancel}
              className="text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg flex items-center justify-center p-2"
            />
            <span className="text-sm font-bold text-slate-800">THÊM MỚI BÀI VIẾT</span>
          </div>
          <div className="flex items-center space-x-2.5">
            <Button

              onClick={() => setIsPreviewOpen(true)}
              className="px-4 h-9.5 rounded-lg border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 hover:text-sky-600 flex items-center gap-1.5 "
            >
              <span className="flex items-center gap-1.5">
                <EyeIcon className="h-4 w-4" />
                Xem trước
              </span>
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={isSaving}
              className="px-4 h-9.5 rounded-lg bg-sky-600 hover:bg-sky-700 border-none text-sm font-semibold flex items-center gap-1.5 animate-pulse-subtle"
            >
              <span className="flex items-center gap-1.5">
                <PaperAirplaneIcon className="h-4 w-4" />
                Lưu
              </span>
            </Button>
          </div>
        </div>

        {/* Vùng nội dung chia làm 2 cột: Trái nhập liệu, Phải cài đặt */}
        <div className="flex-1 overflow-y-auto pt-3 md:pt-3 ">
          <div className="max-w-6xl mx-auto grid grid-cols-12 gap-3">
            {/* Cột Trái: Vùng soạn thảo chính */}
            <div className="col-span-12 lg:col-span-8 space-y-6">
              <div className="bg-white border border-slate-100 rounded-2xl p-3  space-y-6 min-h-[500px]">
                {/* Tiêu đề  */}
                <div>
                  <span className="text-[10px] font-bold text-slate-400 tracking-wider block mb-1">TIÊU ĐỀ</span>
                  <Form.Item
                    name="title"
                    rules={[{ required: true, message: 'Vui lòng nhập tiêu đề!' }]}
                    className="mb-0"
                  >
                    <Input
                      placeholder="Nhập tiêu đề..."
                      className="text-2xl font-bold border-0 border-b border-slate-100 rounded-none hover:border-slate-200 focus:border-sky-500  focus:ring-0 px-0 pb-3 transition-colors bg-transparent placeholder:text-slate-300 [&_.ant-input]:text-2xl [&_.ant-input]:font-bold"
                    />
                  </Form.Item>
                </div>

                {/* BlockNote Editor */}
                <div>
                  <span className="text-[10px] font-bold text-slate-400 tracking-wider block mb-1">NỘI DUNG</span>
                  <Form.Item
                    name="content"
                    className="mb-0"
                  >
                    <BlockNoteEditor placeholder="Bắt đầu viết nội dung  tuyệt vời của bạn ở đây..." />
                  </Form.Item>
                </div>
              </div>
            </div>

            {/* Cột Phải: Sidebar cài đặt */}
            <div className="col-span-12 lg:col-span-4">
              <div className="bg-white border border-slate-100 rounded-2xl p-3 space-y-4">
                {/* Phần 1: Ảnh đại diện  */}
                <div className=" space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 tracking-wider block">ẢNH ĐẠI DIỆN</span>

                  {thumbnail ? (
                    <div className="relative w-full h-[140px] rounded-xl overflow-hidden group/img border border-slate-200">
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
                    <Upload.Dragger
                      accept="image/*"
                      showUploadList={false}
                      beforeUpload={(file) => {
                        handleFile(file);
                        return false;
                      }}
                      className="!border-dashed !border-slate-200 hover:!border-sky-500 !bg-slate-50/30 hover:!bg-slate-50 !rounded-xl  transition-all duration-200 flex flex-col items-center justify-center text-center"
                    >
                      <div className="flex flex-col items-center justify-center ">
                        <ArrowUpTrayIcon className="h-6 w-6 text-slate-400 mb-2" />
                        <span className="text-sm font-medium text-slate-600">Kéo thả hoặc click để tải ảnh đại diện</span>
                        <span className="text-xs text-slate-400 mt-1">Hỗ trợ PNG, JPG, WEBP</span>
                      </div>
                    </Upload.Dragger>
                  )}
                </div>

                {/* Phần 2: Phân loại */}
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 tracking-wider block">PHÂN LOẠI</span>

                  <Form.Item
                    name="postTypeId"
                    rules={[{ required: true, message: 'Vui lòng chọn thể loại!' }]}
                    className="mb-0"
                  >
                    <Select
                      placeholder="Chọn phân loại"
                      className="w-full h-11"
                      dropdownClassName="rounded-xl border border-slate-100"
                    >
                      {postTypes.map((type) => {
                        return (
                          <Option key={type.id} value={type.id}>
                            <div className="flex items-center gap-2 py-1">
                              <span className="text-slate-700 text-sm font-medium">{type.name}</span>
                            </div>
                          </Option>
                        );
                      })}
                    </Select>
                  </Form.Item>
                </div>

                {/* Phần 3: Mô tả ngắn */}
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 tracking-wider block">MÔ TẢ NGẮN</span>

                  <Form.Item
                    name="summary"
                    className="mb-0"
                  >
                    <TextArea
                      rows={4}
                      placeholder="Mô tả tóm tắt nội dung..."
                      className="px-4 rounded-xl border border-slate-200 focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 text-slate-800 text-sm placeholder-slate-400"
                    />
                  </Form.Item>
                </div>

                {/* Phần 4: Trạng thái hiển thị */}
                <div className="flex items-center justify-between pt-2">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-bold text-slate-400 tracking-wider block">TRẠNG THÁI HIỂN THỊ</span>
                    <span className="text-xs text-slate-400">Công khai  sau khi lưu</span>
                  </div>
                  <Form.Item name="published" valuePropName="checked" className="mb-0">
                    <Switch
                      className="bg-slate-200 [&.ant-switch-checked]:bg-sky-600"
                    />
                  </Form.Item>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Form>

      {/* Modal Xem trước  */}
      <Modal
        title={null}
        open={isPreviewOpen}
        onCancel={() => setIsPreviewOpen(false)}
        footer={null}
        width={900}
        centered
        styles={{ body: { padding: '24px', backgroundColor: '#f8fafc', maxHeight: '80vh', overflowY: 'auto' } }}
        className="preview-modal rounded-2xl overflow-hidden"
      >
        <div className="max-w-3xl mx-auto py-4">
          <article className="bg-white border border-slate-200/80 rounded-2xl p-6 md:p-8  space-y-6">
            {/* Phân loại & Trạng thái */}
            <div className="flex items-center justify-between flex-wrap gap-2">
              <Space>
                <Tag color={getPostTypeStyles(selectedPostType?.code)} className="font-semibold px-3 py-0.5 rounded-full border-none">
                  {selectedPostType?.name || 'Frontend Development'}
                </Tag>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${published
                  ? 'bg-emerald-50 text-emerald-800'
                  : 'bg-amber-50 text-amber-800'
                  }`}>
                  {published ? 'Đã xuất bản' : 'Bản nháp'}
                </span>
              </Space>
              <span className="text-xs text-slate-400 font-medium">Bản xem trước</span>
            </div>

            {/* Tiêu đề */}
            <h1 className="text-3xl font-extrabold text-slate-800 leading-tight">
              {title || <span className="text-slate-300 italic">Tiêu đề  chưa nhập...</span>}
            </h1>

            {/* Mô tả ngắn */}
            {summary ? (
              <div className="bg-slate-50/70 border-l-4 border-sky-500 p-4 rounded-r-xl">
                <p className="text-slate-600 italic text-sm leading-relaxed whitespace-pre-wrap">
                  {summary}
                </p>
              </div>
            ) : (
              <div className="bg-slate-50/30 border-l-4 border-slate-200 p-4 rounded-r-xl">
                <p className="text-slate-300 italic text-xs leading-relaxed">
                  Mô tả ngắn chưa nhập...
                </p>
              </div>
            )}

            {/* Ảnh đại diện */}
            {thumbnail ? (
              <div className="w-full max-h-[350px] overflow-hidden rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-center">
                <img
                  src={thumbnail}
                  alt={title || "Preview image"}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-full h-[180px] rounded-xl border border-dashed border-slate-200 bg-slate-50/50 flex flex-col items-center justify-center text-slate-400">
                <span className="text-xs">Chưa chọn ảnh đại diện</span>
              </div>
            )}

            {/* Đường kẻ phân cách */}
            <hr className="border-slate-100" />

            {/* Nội dung chi tiết */}
            <div
              className="text-slate-700 text-sm leading-relaxed space-y-4 break-words prose max-w-none [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_h1]:text-2xl [&_h1]:font-bold [&_h2]:text-xl [&_h2]:font-bold [&_h3]:text-lg [&_h3]:font-bold [&_p]:leading-relaxed"
              dangerouslySetInnerHTML={{ __html: contentHtml || '<p class="text-slate-400 italic">Nội dung chi tiết chưa nhập...</p>' }}
            />
          </article>
        </div>
      </Modal>
    </>
  );
};

export default FormCreate;
