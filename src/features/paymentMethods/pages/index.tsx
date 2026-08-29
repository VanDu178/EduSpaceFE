import { useState } from 'react';
import { Button } from 'antd';
import { PlusIcon } from '@heroicons/react/24/outline';
import FilterBar from '../components/FilterBar';
import ListPage from '../components/ListPage';
import FormCreate from '../components/FormCreate';
import FormUpdate from '../components/FormUpdate';
import FormDetail from '../components/FormDetail';
import {
  usePaymentMethodsQuery,
  useCreatePaymentMethodMutation,
  useUpdatePaymentMethodMutation,
  useTogglePaymentMethodStatusMutation,
  useUpdatePaymentMethodSortOrderMutation,
  useDeletePaymentMethodMutation,
} from '../hooks';
import type { PaymentMethod, PaymentMethodFilterParams, CreatePaymentMethodDto, UpdatePaymentMethodDto } from '../types';

const defaultParam: PaymentMethodFilterParams = {
  keyword: '',
  status: 'ALL',
};

export const PaymentMethodListPage = () => {
  const [params, setParams] = useState<PaymentMethodFilterParams>(defaultParam);

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [detailDrawerOpen, setDetailDrawerOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<PaymentMethod | null>(null);

  // Queries & Mutations
  const { data: paymentMethods = [], isLoading } = usePaymentMethodsQuery(params);
  const createMutation = useCreatePaymentMethodMutation();
  const updateMutation = useUpdatePaymentMethodMutation();
  const toggleStatusMutation = useTogglePaymentMethodStatusMutation();
  const updateSortOrderMutation = useUpdatePaymentMethodSortOrderMutation();
  const deleteMutation = useDeletePaymentMethodMutation();

  const handleCreateSubmit = (values: CreatePaymentMethodDto) => {
    createMutation.mutate(values, {
      onSuccess: () => setCreateModalOpen(false),
    });
  };

  const handleUpdateSubmit = (id: number, values: UpdatePaymentMethodDto) => {
    updateMutation.mutate(
      { id, payload: values },
      {
        onSuccess: () => {
          setUpdateModalOpen(false);
          setSelectedRecord(null);
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
          <h2 className="text-xl font-bold text-slate-800">Phương thức thanh toán</h2>
        </div>
        <Button
          type="primary"
          onClick={() => setCreateModalOpen(true)}
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
          data={paymentMethods}
          isLoading={isLoading}
          onViewDetail={(record) => {
            setSelectedRecord(record);
            setDetailDrawerOpen(true);
          }}
          onEdit={(record) => {
            setSelectedRecord(record);
            setUpdateModalOpen(true);
          }}
          onToggleStatus={handleToggleStatus}
          onUpdateSortOrder={handleUpdateSortOrder}
          onDelete={handleDelete}
        />
      </div>

      {/* Form Create Modal */}
      <FormCreate
        visible={createModalOpen}
        onCancel={() => setCreateModalOpen(false)}
        onSubmit={handleCreateSubmit}
        loading={createMutation.isPending}
        existingMethods={paymentMethods}
      />

      {/* Form Update Modal */}
      <FormUpdate
        visible={updateModalOpen}
        data={selectedRecord}
        onCancel={() => {
          setUpdateModalOpen(false);
          setSelectedRecord(null);
        }}
        onSubmit={handleUpdateSubmit}
        loading={updateMutation.isPending}
        existingMethods={paymentMethods}
      />

      {/* Detail Drawer */}
      <FormDetail
        visible={detailDrawerOpen}
        data={selectedRecord}
        onClose={() => {
          setDetailDrawerOpen(false);
          setSelectedRecord(null);
        }}
      />
    </div>
  );
};

export default PaymentMethodListPage;
