import { useNavigate, useParams } from 'react-router-dom';
import { Button, Tag, Badge, Spin, Space } from 'antd';
import { ArrowLeftIcon, PencilSquareIcon } from '@heroicons/react/24/outline';
import { usePostsQuery } from '../hooks';

const PostDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Lấy dữ liệu từ cache/query danh sách bài viết
  const { data: posts = [], isLoading } = usePostsQuery();
  const post = posts.find((p) => p.id === Number(id));

  // Lấy kiểu màu sắc tương ứng cho loại bài viết (badge)
  const getPostTypeStyles = (code?: string) => {
    const normCode = code?.toUpperCase() || 'GENERAL';
    switch (normCode) {
      case 'KIENTHUC':
      case 'KIEN_THUC':
        return 'purple';
      case 'BAITAP':
      case 'BAI_TAP':
        return 'emerald';
      case 'PROJECT_LOG':
      case 'PROJECTLOG':
        return 'amber';
      default:
        return 'blue';
    }
  };

  if (isLoading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <Spin size="large" tip="Đang tải thông tin chi tiết bài viết..." />
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
    <div className="-mx-8 -mt-8">
      {/* Sticky Header */}
      <div className="sticky top-16 bg-white z-30 border-b border-slate-200/80 py-4 px-8 flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-3">
          <Button
            type="text"
            icon={<ArrowLeftIcon className="h-5 w-5" />}
            onClick={() => navigate('/admin/posts')}
            className="text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-xl flex items-center justify-center"
          />
          <div>
            <h3 className="text-lg font-bold text-slate-800">Chi tiết bài viết</h3>
            <p className="text-xs text-slate-400 font-medium">Xem nội dung bài viết và định cấu hình xuất bản.</p>
          </div>
        </div>
        <Button
          type="primary"
          icon={<PencilSquareIcon className="h-5 w-5" />}
          onClick={() => navigate(`/admin/posts/${post.id}/edit`)}
          className="px-5 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 border-none text-sm font-semibold flex items-center justify-center cursor-pointer"
        >
          Chỉnh sửa bài đăng
        </Button>
      </div>

      <div className="p-8 max-w-4xl mx-auto space-y-8">
        {/* Main Content Card */}
        <article className="bg-white border border-slate-200/80 rounded-2xl p-6 md:p-10 shadow-sm space-y-6">
          
          {/* Categories and Status tags */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <Space>
              <Tag color={getPostTypeStyles(post.postType?.code)} className="font-semibold px-3 py-1 rounded-full border-none">
                {post.postType?.name || 'Chung'}
              </Tag>
              <Badge
                status={post.published ? 'success' : 'warning'}
                text={post.published ? 'Đã xuất bản' : 'Bản nháp'}
                className="font-bold text-xs"
              />
            </Space>
            <span className="text-xs text-slate-400 font-medium">Mã số bài đăng: #{post.id}</span>
          </div>

          {/* Title */}
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 leading-tight">
            {post.title}
          </h1>

          {/* Summary Block */}
          {post.summary && (
            <div className="bg-slate-50/70 border-l-4 border-blue-500 p-4 rounded-r-xl">
              <p className="text-slate-600 italic text-sm md:text-base leading-relaxed">
                {post.summary}
              </p>
            </div>
          )}

          {/* Thumbnail Image */}
          {post.thumbnail && (
            <div className="w-full max-h-[400px] overflow-hidden rounded-xl border border-slate-100 shadow-sm">
              <img
                src={post.thumbnail}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Horizontal divider */}
          <hr className="border-slate-100" />

          {/* Content Description */}
          <div className="prose max-w-none text-slate-700 text-sm md:text-base leading-relaxed space-y-4">
            {post.content ? (
              post.content.split('\n').map((paragraph, index) => (
                <p key={index} className="whitespace-pre-line">
                  {paragraph}
                </p>
              ))
            ) : (
              <p className="text-slate-400 italic">Không có nội dung chi tiết cho bài viết này.</p>
            )}
          </div>
        </article>
      </div>
    </div>
  );
};

export default PostDetailPage;
