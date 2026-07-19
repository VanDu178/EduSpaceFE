import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import { PlusIcon } from '@heroicons/react/24/outline';
import { ListPage, FilterBar } from '../components';
import { usePostsQuery, useDeletePostMutation, useUpdatePostStatusMutation } from '../hooks';
import { usePostTypesQuery } from '../../postTypes';
import type { Params } from '../types';

import { DEFAULT_PARAMS } from '../constants';

const Index = () => {
  const navigate = useNavigate();

  // State tìm kiếm, lọc và phân trang dữ liệu
  const [params, setParams] = useState<Params>(DEFAULT_PARAMS);

  // React Query Custom Hooks
  const { data, isLoading, error } = usePostsQuery({
    page: params.page,
    limit: params.limit,
    keyword: params.keyword || undefined,
    postType: params.postType !== 'ALL' ? params.postType : undefined,
    published: params.published !== 'ALL' ? params.published : undefined,
  });
  const { data: postTypes = [] } = usePostTypesQuery();
  const deleteMutation = useDeletePostMutation();
  const updateStatusMutation = useUpdatePostStatusMutation();

  const posts = data?.posts || [];

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

  // Kích hoạt cập nhật trạng thái bài viết
  const handleUpdateStatusClick = (id: number, published: boolean) => {
    updateStatusMutation.mutate({ id, published });
  };



  return (
    <div className="space-y-6 flex flex-1 flex-col h-full">
      <div className="flex items-center justify-between mb-2 shrink-0">
        <h2 className="text-xl font-bold text-slate-800">Danh sách bài viết</h2>
        <Button
          type="primary"
          onClick={() => {
            navigate('/admin/posts/create');
          }}
          className="px-5 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 border-none text-sm font-semibold flex items-center justify-center cursor-pointer"
        >
          <span className='flex items-center gap-2'>
            <PlusIcon className="h-5 w-5" />
            Thêm mới
          </span>
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-medium shrink-0">
          Có lỗi xảy ra khi tải dữ liệu bài viết: {(error as Error).message}
        </div>
      )}


      {/* Toolbar */}
      <div className="shrink-0">
        <FilterBar
          params={params}
          setParams={setParams}
          postTypes={postTypes}
        />
      </div>

      {/* Table list wrapper */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <ListPage
          posts={posts}
          onViewDetail={handleViewDetailClick}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
          onUpdateStatus={handleUpdateStatusClick}
          isUpdatingStatus={updateStatusMutation.isPending}
          updatingStatusId={updateStatusMutation.variables?.id}
          isLoading={isLoading}
          pagination={{
            current: params.page || 1,
            pageSize: params.limit || 10,
            total: data?.pagination.total || 0,
            onChange: (p, ps) => {
              setParams((prev) => ({
                ...prev,
                page: p,
                limit: ps,
              }));
            },
          }}
        />
      </div>
    </div>
  );
};

export default Index;
