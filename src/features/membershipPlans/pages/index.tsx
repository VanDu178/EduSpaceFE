import { useState } from 'react';
import { Button } from 'antd';
import { PlusIcon } from '@heroicons/react/24/outline';
import { ListPage, FilterBar, FormCreate, FormUpdate, ModalDetail } from '../components';
import MembershipSubNav from '../../../components/MembershipSubNav';
import {
  useMembershipPlansQuery,
  useCreateMembershipPlanMutation,
  useUpdateMembershipPlanMutation,
  useToggleMembershipPlanStatusMutation,
  useDeleteMembershipPlanMutation,
} from '../hooks';
import type { MembershipPlanParams, MembershipPlan, MembershipPlanPayload } from '../types';
import { DEFAULT_MEMBERSHIP_PLAN_PARAMS } from '../constants';
import { useLoadingToast } from '../../../hooks';

const MembershipPlanPage = () => {
  const [params, setParams] = useState<MembershipPlanParams>(DEFAULT_MEMBERSHIP_PLAN_PARAMS);
  const [isCreateOpen, setIsCreateOpen] = useState<boolean>(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState<boolean>(false);
  const [isDetailOpen, setIsDetailOpen] = useState<boolean>(false);
  const [editingPlan, setEditingPlan] = useState<MembershipPlan | null>(null);
  const [detailPlan, setDetailPlan] = useState<MembershipPlan | null>(null);

  // React Query Hooks
  const { data: plans = [], isLoading } = useMembershipPlansQuery(params);

  const { mutate: createPlan, isPending: isCreateLoading } = useCreateMembershipPlanMutation();
  const { mutate: updatePlan, isPending: isUpdateLoading } = useUpdateMembershipPlanMutation();
  const { mutate: toggleStatus, isPending: isToggleLoading } = useToggleMembershipPlanStatusMutation();
  const { mutate: deletePlan, isPending: isDeleteLoading } = useDeleteMembershipPlanMutation();

  // Handlers
  const handleOpenCreate = () => {
    setIsCreateOpen(true);
  };

  const handleOpenEdit = (plan: MembershipPlan) => {
    setEditingPlan(plan);
    setIsUpdateOpen(true);
  };

  const handleOpenDetail = (plan: MembershipPlan) => {
    setDetailPlan(plan);
    setIsDetailOpen(true);
  };

  const handleCreateSave = (values: MembershipPlanPayload) => {
    createPlan(values, {
      onSuccess: () => setIsCreateOpen(false),
    });
  };

  const handleUpdateSave = (values: MembershipPlanPayload) => {
    if (!editingPlan) return;
    updatePlan(
      { id: editingPlan.id, data: values },
      {
        onSuccess: () => {
          setIsUpdateOpen(false);
          setEditingPlan(null);
        },
      }
    );
  };

  const handleToggleStatus = (id: number) => {
    toggleStatus(id);
  };

  const handleDeletePlan = (id: number) => {
    deletePlan(id);
  };

  // Toast chỉ báo trạng thái đang xử lý
  useLoadingToast(isCreateLoading, 'Đang tạo gói hội viên mới...');
  useLoadingToast(isUpdateLoading, 'Đang cập nhật gói hội viên...');
  useLoadingToast(isToggleLoading, 'Đang cập nhật trạng thái...');
  useLoadingToast(isDeleteLoading, 'Đang xóa gói hội viên...');

  // Lọc gói hội viên theo từ khóa tìm kiếm
  const filteredPlans = plans.filter((plan) => {
    if (!params.keyword?.trim()) return true;
    const kw = params.keyword.trim().toLowerCase();
    return (
      plan.name.toLowerCase().includes(kw) ||
      plan.code.toLowerCase().includes(kw) ||
      (plan.tagLine && plan.tagLine.toLowerCase().includes(kw))
    );
  });

  return (
    <div className="space-y-5 flex flex-col flex-1 h-full overflow-hidden">
      {/* Header section */}
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Danh sách gói hội viên</h2>
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
          plans={filteredPlans}
          isLoading={isLoading}
          onViewDetail={handleOpenDetail}
          onEdit={handleOpenEdit}
          onDelete={handleDeletePlan}
          onToggleStatus={handleToggleStatus}
        />
      </div>

      {/* Modal Thêm mới */}
      <FormCreate
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSave={handleCreateSave}
        isLoading={isCreateLoading}
      />

      {/* Modal Cập nhật */}
      <FormUpdate
        isOpen={isUpdateOpen}
        onClose={() => {
          setIsUpdateOpen(false);
          setEditingPlan(null);
        }}
        onSave={handleUpdateSave}
        isLoading={isUpdateLoading}
        plan={editingPlan}
      />

      {/* Drawer Chi tiết */}
      <ModalDetail
        isOpen={isDetailOpen}
        onClose={() => {
          setIsDetailOpen(false);
          setDetailPlan(null);
        }}
        plan={detailPlan}
      />
    </div>
  );
};

export default MembershipPlanPage;

