import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Input, Select, Switch, Button, Row, Col, Spin } from 'antd';
import "@blocknote/core/fonts/inter.css";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { useCreateBlockNote } from "@blocknote/react";
import { ArrowLeftOutlined, UploadOutlined, DeleteOutlined } from '@ant-design/icons';
import { usePostsQuery, useUpdatePostMutation } from '../hooks';
import type { PostType, PostPayload } from '../types';

const { Option } = Select;
const { TextArea } = Input;

const staticPostTypes: PostType[] = [
  { id: 1, name: 'Kiến thức', code: 'KIENTHUC', description: 'Bài viết chia sẻ kiến thức' },
  { id: 2, name: 'Bài tập', code: 'BAITAP', description: 'Bài viết chứa bài tập và lời giải' },
  { id: 3, name: 'Project Log', code: 'PROJECT_LOG', description: 'Nhật ký thực hiện dự án' },
  { id: 4, name: 'Chung', code: 'GENERAL', description: 'Danh mục bài viết chung' },
];

const PostEditPage = () => {
  const editor = useCreateBlockNote();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Lấy dữ liệu từ cache/query danh sách bài viết
  const { data: posts = [], isLoading } = usePostsQuery();
  const post = posts.find((p) => p.id === Number(id));

  const updateMutation = useUpdatePostMutation(Number(id), staticPostTypes, () => {
    navigate('/admin/posts');
  });

  // Tải trước dữ liệu vào form
  useEffect(() => {
    if (post) {
      form.setFieldsValue({
        title: post.title,
        summary: post.summary || '',
        content: post.content || '',
        postTypeId: post.postTypeId,
        published: post.published || false,
      });
      setThumbnail(post.thumbnail || null);
    }
  }, [post, form]);
  // Load existing HTML content into BlockNote editor when editing
  useEffect(() => {
    if (post?.content) {
      const blocks = editor.tryParseHTMLToBlocks(post.content);
      editor.replaceBlocks(editor.document, blocks);
    }
  }, [post, editor]);

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
    const payload: PostPayload = {
      title: values.title,
      summary: values.summary,
      content: contentHtml,
      postTypeId: values.postTypeId,
      published: values.published,
      thumbnail: thumbnail,
    };
    updateMutation.mutate({
      id: Number(id),
      data: payload,
    });
  };

  if (isLoading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <Spin size="large" tip="Đang tải dữ liệu bài viết..." />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl max-w-2xl mx-auto text-center">
        <p className="font-semibold text-lg">⚠️ Không tìm thấy bài viết!</p>
        <p className="text-sm mt-1">Bài viết này không tồn tại hoặc đã bị xóa khỏi hệ thống.</p>
        <Button onClick={() => navigate('/admin/posts')} className="mt-4 rounded-xl">Quay lại danh sách</Button>
      </div>
    );
  }

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      requiredMark={false}
      className="-mx-8 -mt-8"
    >
      {/* Sticky Header */}
      <div className="sticky top-16 bg-white z-30 border-b border-slate-200/80 py-4 px-8 flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-3">
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate('/admin/posts')}
            className="text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-xl"
          />
          <div>
            <h3 className="text-lg font-bold text-slate-800">Chỉnh sửa bài viết</h3>
            <p className="text-xs text-slate-400 font-medium">Bố cục chỉnh sửa dữ liệu và thay đổi trạng thái xuất bản.</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            onClick={() => navigate('/admin/posts')}
            className="px-5 h-10 rounded-xl border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-50"
          >
            Hủy bỏ
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={updateMutation.isPending}
            className="px-5 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 border-none text-sm font-semibold flex items-center"
          >
            Lưu thay đổi
          </Button>
        </div>
      </div>

      <div className="p-8 space-y-6 max-w-7xl mx-auto">
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
                  {staticPostTypes.map((type) => (
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
                      className={`border border-dashed rounded-xl p-2 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 relative min-h-[90px] ${dragActive ? 'border-blue-500 bg-blue-50/20' : 'border-slate-200 hover:border-blue-500 bg-slate-50/50 hover:bg-slate-50'
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
                              icon={<DeleteOutlined />}
                              onClick={(e) => {
                                e.stopPropagation();
                                removeThumbnail();
                              }}
                            />
                          </div>
                        </div>
                      ) : (
                        <>
                          <UploadOutlined className="text-base text-slate-400 mb-0.5" />
                          <span className="text-xs font-semibold text-slate-600">Chọn ảnh đại diện</span>
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

export default PostEditPage;
