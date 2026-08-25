import { useState } from 'react';
import { Button } from 'antd';
import { PlusIcon } from '@heroicons/react/24/outline';
import { useFeatures } from '../hooks/useFeatures';
import { FilterBar, ListPage, FormCreate, FormUpdate, ModalDetail } from '../components';
import MembershipSubNav from '../../../components/MembershipSubNav';
import type { Feature } from '../types';

const FeatureListPage = () => {
  const {
    features,
    isLoading,
    isSubmitting,
    keyword,
    setKeyword,
    status,
    setStatus,
    handleCreate,
    handleUpdate,
    handleUpdateSortOrder,
    handleToggleStatus,
    handleDelete,
  } = useFeatures();

  const [isCreateOpen, setIsCreateOpen] = useState<boolean>(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState<boolean>(false);
  const [isDetailOpen, setIsDetailOpen] = useState<boolean>(false);
  const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null);

  const handleOpenDetail = (feature: Feature) => {
    setSelectedFeature(feature);
    setIsDetailOpen(true);
  };

  const handleOpenEdit = (feature: Feature) => {
    setSelectedFeature(feature);
    setIsUpdateOpen(true);
  };

  return (
    <div className="space-y-5 flex flex-col flex-1 h-full overflow-hidden">
      {/* Header section */}
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Danh sách tính năng</h2>
        </div>
        <Button
          type="primary"
          onClick={() => setIsCreateOpen(true)}
          className="px-5 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-600 border-none text-sm font-semibold flex items-center justify-center cursor-pointer h-10"
        >
          <span className="flex items-center gap-2">
            <PlusIcon className="h-5 w-5" />
            Thêm mới
          </span>
        </Button>
      </div>

      {/* Sub Navigation (Tabs) */}
      <div className="shrink-0">
        <MembershipSubNav />
      </div>

      {/* Toolbar / Filter */}
      <div className="shrink-0">
        <FilterBar
          keyword={keyword}
          onSearchChange={setKeyword}
          status={status}
          onStatusChange={setStatus}
        />
      </div>


      {/* Table Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <ListPage
          features={features}
          isLoading={isLoading}
          onViewDetail={handleOpenDetail}
          onEdit={handleOpenEdit}
          onDelete={handleDelete}
          onToggleStatus={handleToggleStatus}
          onUpdateSortOrder={handleUpdateSortOrder}
        />
      </div>

      {/* Drawers & Modals */}
      <FormCreate
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSave={handleCreate}
        isLoading={isSubmitting}
      />

      <FormUpdate
        isOpen={isUpdateOpen}
        onClose={() => {
          setIsUpdateOpen(false);
          setSelectedFeature(null);
        }}
        onSave={handleUpdate}
        isLoading={isSubmitting}
        feature={selectedFeature}
      />

      <ModalDetail
        isOpen={isDetailOpen}
        onClose={() => {
          setIsDetailOpen(false);
          setSelectedFeature(null);
        }}
        feature={selectedFeature}
      />
    </div>
  );
};

export default FeatureListPage;
