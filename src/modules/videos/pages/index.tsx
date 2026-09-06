import { useState } from 'react';
import { Button } from 'antd';
import { PlusIcon } from '@heroicons/react/24/outline';
import type { Video, VideoPayload, VideoQueryParams } from '../types';
import {
  useVideosQuery,
  useVideoTypesQuery,
  useCreateVideoMutation,
  useUpdateVideoMutation,
  useUpdateVideoStatusMutation,
  useUpdateVideoAccessMutation,
  useDeleteVideoMutation,
} from '../hooks';
import { FormCreate, FormUpdate, PreviewModal, FilterBar, ListPage } from '../components';
import { DEFAULT_PARAMS } from '../constants';

const VideoListPage = () => {
  // Pagination & Filter Params State
  const [params, setParams] = useState<VideoQueryParams>(DEFAULT_PARAMS);

  // Modal States
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<boolean>(false);
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);
  const [previewVideo, setPreviewVideo] = useState<Video | null>(null);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState<boolean>(false);

  // Queries & Mutations from custom hooks
  const { data: videoTypesData } = useVideoTypesQuery();
  const videoTypes = videoTypesData?.videoTypes || [];

  const { data: videosData, isLoading } = useVideosQuery({
    ...params,
    search: params.search?.trim() || undefined,
  });

  const videos = videosData?.videos || [];
  const total = videosData?.pagination?.total || 0;

  const { isPending: isPendingCreate, mutateAsync: createVideoMutation } = useCreateVideoMutation();
  const { isPending: isPendingUpdate, mutateAsync: updateVideoMutation } = useUpdateVideoMutation();
  const { isPending: isPendingStatus, mutate: updateVideoStatusMutation } = useUpdateVideoStatusMutation();
  const { isPending: isPendingAccess, mutate: updateVideoAccessMutation } = useUpdateVideoAccessMutation();
  const { isPending: isPendingDelete, mutate: deleteVideoMutation } = useDeleteVideoMutation();

  const isFormOpen = isCreateModalOpen || isUpdateModalOpen;
  const isMutating = isPendingCreate || isPendingUpdate || isPendingStatus || isPendingAccess || isPendingDelete;
  const isBusy = isFormOpen || isMutating;

  // Submit Form Tạo mới Video
  const handleCreateSubmit = async (payload: VideoPayload) => {
    await createVideoMutation(payload);
  };

  // Submit Form Cập nhật Video
  const handleUpdateSubmit = async (payload: VideoPayload) => {
    if (editingVideo) {
      await updateVideoMutation({ id: editingVideo.id, payload });
    }
  };

  // Đổi nhanh trạng thái Status (draft / published / archived)
  const handleStatusChange = (id: string, newStatus: string) => {
    updateVideoStatusMutation({ id, status: newStatus });
  };

  // Đổi nhanh quyền Premium
  const handleAccessChange = (id: string, isPremium: boolean, teaserDuration?: number) => {
    updateVideoAccessMutation({ id, isPremium, teaserDuration });
  };

  // Xóa Video
  const handleDelete = (id: string) => {
    deleteVideoMutation(id);
  };

  const activePreviewVideo = previewVideo
    ? videos.find((v) => v.id === previewVideo.id) || previewVideo
    : null;

  return (
    <div className="space-y-6 flex flex-col flex-1 h-full overflow-hidden">
      {/* Header Phân hệ */}
      <div className="flex items-center justify-between mb-2 shrink-0">
        <h2 className="text-xl font-bold text-slate-800">Danh sách video</h2>

        <Button
          type="primary"
          disabled={isBusy}
          onClick={() => {
            setIsCreateModalOpen(true);
          }}
          className="bg-gradient-to-r from-sky-500 to-cyan-600 border-none text-sm font-semibold rounded-xl px-5 h-10 flex items-center justify-center cursor-pointer text-white hover:opacity-90 transition-opacity gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <PlusIcon className="w-4 h-4" />
          <span>Thêm mới</span>
        </Button>
      </div>

      {/* Thanh Lọc & Tìm Kiếm (FilterBar) */}
      <div className="shrink-0">
        <FilterBar videoTypes={videoTypes} params={params} setParams={setParams} disabled={isBusy} />
      </div>

      {/* Bảng dữ liệu Admin */}
      <ListPage
        videos={videos}
        isLoading={isLoading}
        disabled={isBusy}
        page={params.page || 1}
        limit={params.limit || 10}
        total={total}
        onPageChange={(p, l) => {
          setParams((prev) => ({ ...prev, page: p, limit: l }));
        }}
        onPreview={(video) => {
          setPreviewVideo(video);
          setIsPreviewModalOpen(true);
        }}
        onEdit={(video) => {
          setEditingVideo(video);
          setIsUpdateModalOpen(true);
        }}
        onDelete={handleDelete}
        onStatusChange={handleStatusChange}
        onAccessChange={handleAccessChange}
      />

      {/* Form Modal Tạo mới */}
      <FormCreate
        open={isCreateModalOpen}
        videoTypes={videoTypes}
        onSubmit={handleCreateSubmit}
        onClose={() => setIsCreateModalOpen(false)}
      />

      {/* Form Modal Cập nhật */}
      <FormUpdate
        open={isUpdateModalOpen}
        video={editingVideo}
        videoTypes={videoTypes}
        onSubmit={handleUpdateSubmit}
        onClose={() => {
          setIsUpdateModalOpen(false);
          setEditingVideo(null);
        }}
      />

      {/* Preview Modal xem trước */}
      <PreviewModal
        open={isPreviewModalOpen}
        video={activePreviewVideo}
        onClose={() => setIsPreviewModalOpen(false)}
        onEdit={(video) => {
          setIsPreviewModalOpen(false);
          setEditingVideo(video);
          setIsUpdateModalOpen(true);
        }}
        onAccessChange={handleAccessChange}
      />
    </div>
  );
};

export default VideoListPage;
