import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import { PlusIcon } from '@heroicons/react/24/outline';
import { ListPage, FilterBar } from '../components';
import {
  useBlogsQuery,
  useDeleteBlogMutation,
  useUpdateBlogStatusMutation,
  useUpdateBlogAccessMutation,
} from '../hooks';
import { useBlogTypesQuery } from '../../blogTypes';
import { BLOG_STATUS } from '../constants';
import type { Params } from '../types';

const DEFAULT_PARAMS: Params = {
  page: 1,
  limit: 10,
  keyword: '',
  blogType: 'ALL',
  status: BLOG_STATUS.ALL,
  isPremium: 'ALL',
};

const Index = () => {
  const navigate = useNavigate();

  // State tìm kiếm, lọc và phân trang dữ liệu
  const [params, setParams] = useState<Params>(DEFAULT_PARAMS);

  // React Query Custom Hooks
  const { data, isLoading } = useBlogsQuery({
    page: params?.page,
    limit: params?.limit,
    keyword: params?.keyword || undefined,
    blogType: params?.blogType !== 'ALL' ? params?.blogType : undefined,
    status: params?.status !== BLOG_STATUS.ALL ? params?.status : undefined,
    isPremium: params?.isPremium !== 'ALL' ? params?.isPremium : undefined,
  });
  const { data: blogTypes = [] } = useBlogTypesQuery();
  const deleteMutation = useDeleteBlogMutation();
  const updateStatusMutation = useUpdateBlogStatusMutation();
  const updateAccessMutation = useUpdateBlogAccessMutation();

  const blogs = data?.blogs || [];

  // Kích hoạt chế độ Edit
  const handleEditClick = (id: number) => {
    navigate(`/admin/blogs/${id}/edit`);
  };

  // Kích hoạt chế độ Xem chi tiết
  const handleViewDetailClick = (id: number) => {
    navigate(`/admin/blogs/${id}`);
  };

  // Kích hoạt chế độ Delete
  const handleDeleteClick = (id: number) => {
    deleteMutation.mutate(id);
  };

  // Kích hoạt cập nhật trạng thái
  const handleUpdateStatusClick = (id: number, status: string) => {
    updateStatusMutation.mutate({ id, status });
  };

  // Kích hoạt cập nhật quyền truy cập (Miễn phí / Trả phí)
  const handleUpdateAccessClick = (id: number, isPremium: boolean) => {
    updateAccessMutation.mutate({ id, isPremium });
  };

  return (
    <div className="space-y-6 flex flex-1 flex-col h-full">
      <div className="flex items-center justify-between mb-2 shrink-0">
        <h2 className="text-xl font-bold text-slate-800">Danh sách bài viết</h2>
        <Button
          type="primary"
          onClick={() => {
            navigate('/admin/blogs/create');
          }}
          className="px-5 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-600 border-none text-sm font-semibold flex items-center justify-center cursor-pointer"
        >
          <span className='flex items-center gap-2'>
            <PlusIcon className="h-5 w-5" />
            Thêm mới
          </span>
        </Button>
      </div>
      {/* Toolbar */}
      <div className="shrink-0">
        <FilterBar
          params={params}
          setParams={setParams}
          blogTypes={blogTypes}
        />
      </div>

      {/* Table list wrapper */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <ListPage
          blogs={blogs}
          onViewDetail={handleViewDetailClick}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
          onUpdateStatus={handleUpdateStatusClick}
          isUpdatingStatus={updateStatusMutation.isPending}
          updatingStatusId={updateStatusMutation.variables?.id}
          onUpdateAccess={handleUpdateAccessClick}
          isUpdatingAccess={updateAccessMutation.isPending}
          updatingAccessId={updateAccessMutation.variables?.id}
          isLoading={isLoading}
          pagination={{
            current: params?.page || 1,
            pageSize: params?.limit || 10,
            total: data?.pagination?.total || 0,
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
