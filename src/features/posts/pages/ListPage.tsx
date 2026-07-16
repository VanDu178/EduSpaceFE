import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input, Select, Button } from 'antd';
import { MagnifyingGlassIcon, PlusIcon, FunnelIcon } from '@heroicons/react/24/outline';
import PostTable from '../components/PostTable';
import { usePostsQuery, useDeletePostMutation } from '../hooks';

const filterOptions = [
  { value: 'ALL', label: 'Tất cả thể loại' },
  { value: 'KIENTHUC', label: 'Kiến thức' },
  { value: 'BAITAP', label: 'Bài tập' },
  { value: 'PROJECT_LOG', label: 'Project Log' },
  { value: 'GENERAL', label: 'Chung' }
];

const ListPage = () => {
  const navigate = useNavigate();

  // State tìm kiếm và lọc dữ liệu
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('ALL');

  // React Query Custom Hooks
  const { data: posts = [], isLoading, error } = usePostsQuery();
  const deleteMutation = useDeletePostMutation();

  // Kích hoạt chế độ Edit bài viết
  const handleEditClick = (id: number) => {
    navigate(`/admin/posts/${id}/edit`);
  };

  // Kích hoạt chế độ Xem chi tiết bài viết
  const handleViewDetailClick = (id: number) => {
    navigate(`/admin/posts/${id}`);
  };

  // Kích hoạt chế độ Delete bài viết
  const handleDeleteClick = (id: number) => {
    deleteMutation.mutate(id);
  };

  // Lọc danh sách bài viết theo thanh tìm kiếm và bộ lọc thể loại
  const filteredPosts = posts.filter((post) => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase());
    const postTypeCode = post.postType?.code?.toUpperCase() || 'GENERAL';
    const matchesType = filterType === 'ALL' || postTypeCode === filterType;

    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6 flex flex-col h-[calc(100vh-120px)] overflow-hidden">
      <h2 className="text-xl font-bold text-slate-800 mb-2 shrink-0">Danh sách bài viết</h2>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-medium shrink-0">
          ⚠️ Có lỗi xảy ra khi tải dữ liệu bài viết: {(error as Error).message}
        </div>
      )}

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 shrink-0">
        {/* Search and Filters */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Advanced Filter Button */}
          <Button
            icon={<FunnelIcon className="h-5 w-5" />}
            className="h-11 rounded-xl flex items-center justify-center border-slate-200 text-slate-500 hover:text-blue-600 hover:border-blue-500 transition-colors"
            title="Bộ lọc nâng cao"
          />

          {/* Search input */}
          <div className="w-full sm:w-[320px]">
            <Input
              placeholder="Tìm kiếm theo tiêu đề bài viết..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              prefix={<MagnifyingGlassIcon className="h-5 w-5 text-slate-400 mr-1.5" />}
              className="w-full px-4 rounded-xl border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 text-slate-700 text-sm"
            />
          </div>

          {/* Post Type Filter */}
          <div className="w-full sm:w-[180px]">
            <Select
              value={filterType}
              onChange={(value) => setFilterType(value)}
              options={filterOptions}
              className="w-full [&_.ant-select-selector]:!rounded-xl [&_.ant-select-selector]:!border-slate-200 [&_.ant-select-selector]:!px-4"
            />
          </div>
        </div>

        {/* Create Button */}
        <Button
          type="primary"
          icon={<PlusIcon className="h-5 w-5" />}
          onClick={() => {
            navigate('/admin/posts/create');
          }}
          className="px-5 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 border-none text-sm font-semibold flex items-center justify-center cursor-pointer shrink-0"
        >
          Viết bài mới
        </Button>
      </div>

      {/* Table list wrapper */}
      <div className="flex-1 min-h-0 bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm flex flex-col">
        <PostTable
          posts={filteredPosts}
          onViewDetail={handleViewDetailClick}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default ListPage;
