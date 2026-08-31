import { useState } from 'react';
import { Button } from 'antd';
import { PlusIcon } from '@heroicons/react/24/outline';
import { ListPage, FilterBar, FormCreate, FormUpdate, ModalDetail } from '../components';
import PlanModalDetail from '../../membershipPlans/components/ModalDetail';
import { useMembershipPlanQuery } from '../../membershipPlans/hooks';
import {
  useSubscriptions,
  useSubscriptionDetail,
  useCreateSubscription,
  useUpdateSubscriptionStatus,
  useDeleteSubscription,
} from '../hooks';
import type { UserSubscription, UserSubscriptionParams } from '../types';

const defaultParam: UserSubscriptionParams = {
  page: 1,
  limit: 10,
  status: 'all',
  search: '',
};

const SubscriptionPage = () => {
  const [params, setParams] = useState<UserSubscriptionParams>(defaultParam);

  const [isCreateOpen, setIsCreateOpen] = useState<boolean>(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState<boolean>(false);
  const [isDetailOpen, setIsDetailOpen] = useState<boolean>(false);
  const [isPlanDetailOpen, setIsPlanDetailOpen] = useState<boolean>(false);

  const [selectedIdForDetail, setSelectedIdForDetail] = useState<number | null>(null);
  const [selectedPlanIdForDetail, setSelectedPlanIdForDetail] = useState<number | null>(null);
  const [selectedItemForUpdate, setSelectedItemForUpdate] = useState<UserSubscription | null>(null);

  // Hook danh sách thanh toán
  const { items, pagination, loading, refetch } = useSubscriptions(params);

  // Hook xem chi tiết đơn thanh toán
  const { data: detailData, loading: detailLoading } = useSubscriptionDetail(selectedIdForDetail);

  // Hook xem chi tiết gói hội viên
  const { data: planDetailData } = useMembershipPlanQuery(selectedPlanIdForDetail ?? undefined);

  // Hook tạo mới
  const { createItem, submitting: createSubmitting } = useCreateSubscription(() => {
    refetch();
  });

  // Hook cập nhật
  const { updateStatus, submitting: updateSubmitting } = useUpdateSubscriptionStatus(() => {
    refetch();
  });

  // Hook xóa gói do Admin cấp
  const { deleteItem } = useDeleteSubscription(() => {
    refetch();
  });

  // Handlers
  const handleOpenCreate = () => {
    setIsCreateOpen(true);
  };

  const handleOpenDetail = (subscription: UserSubscription) => {
    setSelectedIdForDetail(subscription.id);
    setIsDetailOpen(true);
  };

  const handleCloseDetail = () => {
    setIsDetailOpen(false);
    setSelectedIdForDetail(null);
  };

  const handleOpenPlanDetail = (planId: number) => {
    setSelectedPlanIdForDetail(planId);
    setIsPlanDetailOpen(true);
  };

  const handleClosePlanDetail = () => {
    setIsPlanDetailOpen(false);
    setSelectedPlanIdForDetail(null);
  };

  const handleOpenUpdate = (subscription: UserSubscription) => {
    setSelectedItemForUpdate(subscription);
    setIsUpdateOpen(true);
  };

  const handleCloseUpdate = () => {
    setIsUpdateOpen(false);
    setSelectedItemForUpdate(null);
  };

  return (
    <div className="space-y-5 flex flex-col flex-1 h-full overflow-hidden">
      {/* Header section */}
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Quản lý đăng ký gói dịch vụ</h2>
        </div>
        <Button
          type="primary"
          onClick={handleOpenCreate}
          className="px-5 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-600 border-none text-sm font-semibold flex items-center justify-center cursor-pointer h-10"
        >
          <span className="flex items-center gap-2">
            <PlusIcon className="h-5 w-5" />
            Thêm mới
          </span>
        </Button>
      </div>

      {/* Toolbar / Filter */}
      <div className="shrink-0">
        <FilterBar params={params} setParams={setParams} />
      </div>

      {/* Table Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <ListPage
          subscriptions={items}
          isLoading={loading}
          onViewDetail={handleOpenDetail}
          onViewPlanDetail={handleOpenPlanDetail}
          onEdit={handleOpenUpdate}
          onDelete={(sub) => deleteItem(sub.id)}
          pagination={{
            current: pagination.currentPage,
            pageSize: pagination.itemsPerPage,
            total: pagination.totalItems,
            onChange: (page, pageSize) => {
              setParams((prev) => ({
                ...prev,
                page,
                limit: pageSize,
              }));
            },
          }}
        />
      </div>

      {/* Modal Xem chi tiết đơn thanh toán */}
      <ModalDetail
        open={isDetailOpen}
        data={detailData}
        loading={detailLoading}
        onClose={handleCloseDetail}
      />

      {/* Drawer Xem chi tiết gói hội viên */}
      <PlanModalDetail
        isOpen={isPlanDetailOpen}
        onClose={handleClosePlanDetail}
        plan={planDetailData || null}
      />

      {/* Modal Thêm mới */}
      <FormCreate
        open={isCreateOpen}
        submitting={createSubmitting}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={createItem}
      />

      {/* Modal Cập nhật */}
      <FormUpdate
        open={isUpdateOpen}
        data={selectedItemForUpdate}
        submitting={updateSubmitting}
        onClose={handleCloseUpdate}
        onSubmit={updateStatus}
      />
    </div>
  );
};

export default SubscriptionPage;
