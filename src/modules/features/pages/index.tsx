import { useState } from 'react';
import { Button } from 'antd';
import { PlusIcon } from '@heroicons/react/24/outline';
import {
  useFeaturesQuery,
  useCreateFeatureMutation,
  useUpdateFeatureMutation,
  useUpdateFeatureSortOrderMutation,
  useToggleFeatureStatusMutation,
  useDeleteFeatureMutation,
} from '../hooks';
import { FilterBar, ListPage, FormCreate, FormUpdate, ModalDetail } from '../components';
import MembershipSubNav from '../../../components/MembershipSubNav';
import { FEATURE_STATUS } from '../constants';
import type { Feature, FeaturePayload, FeatureQueryParams } from '../types';

const DEFAULT_PARAMS: FeatureQueryParams = {
  keyword: '',
  status: FEATURE_STATUS.ALL,
};

const FeatureListPage = () => {
  const [params, setParams] = useState<FeatureQueryParams>(DEFAULT_PARAMS);
  const [isCreateOpen, setIsCreateOpen] = useState<boolean>(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState<boolean>(false);
  const [isDetailOpen, setIsDetailOpen] = useState<boolean>(false);
  const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null);

  // Queries & Mutations
  const { data: features = [], isLoading } = useFeaturesQuery(params);
  const createMutation = useCreateFeatureMutation();
  const updateMutation = useUpdateFeatureMutation();
  const toggleStatusMutation = useToggleFeatureStatusMutation();
  const updateSortOrderMutation = useUpdateFeatureSortOrderMutation();
  const deleteMutation = useDeleteFeatureMutation();

  const handleOpenDetail = (feature: Feature) => {
    setSelectedFeature(feature);
    setIsDetailOpen(true);
  };

  const handleOpenEdit = (feature: Feature) => {
    setSelectedFeature(feature);
    setIsUpdateOpen(true);
  };

  const handleCreateSubmit = (values: FeaturePayload) => {
    createMutation.mutate(values, {
      onSuccess: (res) => {
        if (res?.success) {
          setIsCreateOpen(false);
        }
      },
    });
  };

  const handleUpdateSubmit = (values: FeaturePayload) => {
    if (!selectedFeature) return;
    updateMutation.mutate(
      { id: selectedFeature.id, payload: values },
      {
        onSuccess: (res) => {
          if (res?.success) {
            setIsUpdateOpen(false);
            setSelectedFeature(null);
          }
        },
      }
    );
  };

  const handleToggleStatus = (id: number) => {
    toggleStatusMutation.mutate(id);
  };

  const handleUpdateSortOrder = (id: number, sortOrder: number) => {
    updateSortOrderMutation.mutate({ id, sortOrder });
  };

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id);
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
        <FilterBar params={params} setParams={setParams} />
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
        onSave={handleCreateSubmit}
        isLoading={createMutation.isPending}
      />

      <FormUpdate
        isOpen={isUpdateOpen}
        onClose={() => {
          setIsUpdateOpen(false);
          setSelectedFeature(null);
        }}
        onSave={handleUpdateSubmit}
        isLoading={updateMutation.isPending}
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
