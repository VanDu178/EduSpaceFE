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

export const PaymentMethodListPage = () => {
  const [filters, setFilters] = useState<PaymentMethodFilterParams>({
    keyword: '',
    status: 'ALL',
  });

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [detailDrawerOpen, setDetailDrawerOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<PaymentMethod | null>(null);

  // Queries & Mutations
  const { data: paymentMethods = [], isLoading } = usePaymentMethodsQuery(filters);
  const createMutation = useCreatePaymentMethodMutation();
  const updateMutation = useUpdatePaymentMethodMutation();
  const toggleStatusMutation = useTogglePaymentMethodStatusMutation();
  const updateSortOrderMutation = useUpdatePaymentMethodSortOrderMutation();
  const deleteMutation = useDeletePaymentMethodMutation();

  const handleFilterChange = (newFilters: Partial<PaymentMethodFilterParams>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

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
        <FilterBar filters={filters} onFilterChange={handleFilterChange} />
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
