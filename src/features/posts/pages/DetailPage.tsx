import { useNavigate, useParams } from 'react-router-dom';
import { Button, Tag, Badge, Spin } from 'antd';
import { CalendarIcon, ClockIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { usePostQuery } from '../hooks';
import { getPostTypeStyles } from '../utils';

const DetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Gọi API lấy chi tiết  theo ID
  const { data, isLoading } = usePostQuery(id ? Number(id) : undefined);
  const post = data?.post;

  // Định dạng ngày tháng hiển thị đẹp mắt
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'N/A';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="-m-5 h-[calc(100vh-104px)] flex flex-col overflow-hidden bg-slate-50/30">
      {/* Title Bar với Button Back */}
      <div className="bg-white border-b border-slate-100 p-3.5 pr-6 flex items-center sticky top-0 z-10 flex-shrink-0">
        <Button
          type="text"
          icon={<ArrowLeftIcon className="h-4 w-4" />}
          onClick={() => navigate('/admin/posts')}
          className="text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg flex items-center justify-center p-2 mr-2"
        />
        <span className="text-sm font-bold text-slate-800 uppercase tracking-wider">Chi tiết bài viết</span>
      </div>

      {/* Vùng nội dung cuộn */}
      <div className="flex-1 overflow-y-auto p-5">
        {isLoading ? (
          <div className="h-96 flex items-center justify-center">
            <Spin size="large" tip="Đang tải thông tin chi tiết ..." />
          </div>
        ) : !post ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl max-w-2xl mx-auto text-center mt-10">
            <p className="font-semibold text-lg">Không tìm thấy !</p>
            <p className="text-sm mt-1"> này không tồn tại hoặc đã bị xóa khỏi hệ thống.</p>
            <Button onClick={() => navigate('/admin/posts')} className="mt-4 rounded-xl">Quay lại danh sách</Button>
          </div>
        ) : (
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 items-start">
              {/* Main Content Column */}
              <div className="lg:col-span-2">
                <article className="bg-white border border-slate-200/80 rounded-2xl p-3 md:p-8 space-y-3">
                  {/* Category tag & ID */}
                  <div className="flex items-center justify-between">
                    <Tag color={getPostTypeStyles(post.postType?.code)} className="font-semibold px-3 py-1 rounded-full border-none">
                      {post.postType?.name || 'Chung'}
                    </Tag>
                    <span className="text-xs text-slate-400 font-medium bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
                      Mã : #{post.id}
                    </span>
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
                    <div className="w-full max-h-[400px] overflow-hidden rounded-xl border border-slate-100">
                      <img
                        src={post.thumbnail}
                        alt={post.title}
                        className="w-full h-full object-cover hover:scale-[1.01] transition-transform duration-300"
                      />
                    </div>
                  )}

                  {/* Horizontal divider */}
                  <hr className="border-slate-100" />

                  {/* Content Description */}
                  <div className="prose max-w-none text-slate-700 text-sm md:text-base leading-relaxed">
                    {post.content ? (
                      <div dangerouslySetInnerHTML={{ __html: post.content }} />
                    ) : (
                      <p className="text-slate-400 italic">Không có nội dung chi tiết cho  này.</p>
                    )}
                  </div>
                </article>
              </div>

              {/* Sidebar / Info Column */}
              <div className="space-y-6">
                <div className="bg-white border border-slate-200/80 rounded-2xl p-6 space-y-5">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Thông tin </h4>

                  <div className="space-y-4">
                    {/* Status */}
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <span className="text-slate-500 text-sm font-medium">Trạng thái</span>
                      <Badge
                        status={post.published ? 'success' : 'warning'}
                        text={post.published ? 'Đã xuất bản' : 'Bản nháp'}
                        className="font-bold text-xs"
                      />
                    </div>

                    {/* Post Type */}
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <span className="text-slate-500 text-sm font-medium">Thể loại</span>
                      <Tag color={getPostTypeStyles(post.postType?.code)} className="font-semibold px-2.5 py-0.5 rounded-full border-none">
                        {post.postType?.name || 'Chung'}
                      </Tag>
                    </div>

                    {/* Created At */}
                    <div className="space-y-1 border-b border-slate-100 pb-3">
                      <div className="flex items-center text-slate-500 text-sm font-medium gap-1.5">
                        <CalendarIcon className="h-4 w-4 text-slate-400" />
                        <span>Ngày đăng</span>
                      </div>
                      <div className="text-slate-800 text-sm font-semibold pl-[22px]">
                        {formatDate(post.createdAt)}
                      </div>
                    </div>

                    {/* Updated At */}
                    <div className="space-y-1">
                      <div className="flex items-center text-slate-500 text-sm font-medium gap-1.5">
                        <ClockIcon className="h-4 w-4 text-slate-400" />
                        <span>Cập nhật cuối</span>
                      </div>
                      <div className="text-slate-800 text-sm font-semibold pl-[22px]">
                        {formatDate(post.updatedAt)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DetailPage;
