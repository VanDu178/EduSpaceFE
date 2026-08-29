import { useState } from 'react';
import { Button } from 'antd';
import { PlusIcon } from '@heroicons/react/24/outline';
import { ListPage, FilterBar, FormCreate, FormUpdate, FormDetail } from '../components';
import type { PaymentAccount, CreatePaymentAccountDto, UpdatePaymentAccountDto, PaymentAccountQueryParams } from '../types';
import {
  usePaymentAccountsQuery,
  useActiveVietqrBanksQuery,
  useCreatePaymentAccountMutation,
  useUpdatePaymentAccountMutation,
  useTogglePaymentAccountStatusMutation,
  useSetDefaultPaymentAccountMutation,
  useDeletePaymentAccountMutation,
} from '../hooks';

const defaultParam: PaymentAccountQueryParams = {
  keyword: '',
  status: 'ALL',
};

const PaymentAccountPage = () => {
  const [params, setParams] = useState<PaymentAccountQueryParams>(defaultParam);

  // Queries
  const { data: accounts = [], isLoading } = usePaymentAccountsQuery(params);

  const { data: vietqrBanks = [], isLoading: isBanksLoading } = useActiveVietqrBanksQuery();

  // Mutations
  const createMutation = useCreatePaymentAccountMutation();
  const updateMutation = useUpdatePaymentAccountMutation();
  const toggleStatusMutation = useTogglePaymentAccountStatusMutation();
  const setDefaultMutation = useSetDefaultPaymentAccountMutation();
  const deleteMutation = useDeletePaymentAccountMutation();

  // Drawer states
  const [isCreateOpen, setIsCreateOpen] = useState<boolean>(false);

  const [isUpdateOpen, setIsUpdateOpen] = useState<boolean>(false);
  const [selectedUpdateAccount, setSelectedUpdateAccount] = useState<PaymentAccount | null>(null);

  const [isDetailOpen, setIsDetailOpen] = useState<boolean>(false);
  const [selectedDetailAccount, setSelectedDetailAccount] = useState<PaymentAccount | null>(null);

  // Xử lý tạo mới
  const handleCreate = async (values: CreatePaymentAccountDto) => {
    createMutation.mutate(values, {
      onSuccess: (res) => {
        if (res?.success) {
          setIsCreateOpen(false);
        }
      },
    });
  };

  // Xử lý cập nhật
  const handleUpdate = async (values: UpdatePaymentAccountDto) => {
    if (!selectedUpdateAccount) return;
    updateMutation.mutate(
      { id: selectedUpdateAccount.id, values },
      {
        onSuccess: (res) => {
          if (res?.success) {
            setIsUpdateOpen(false);
            setSelectedUpdateAccount(null);
          }
        },
      }
    );
  };

  // Xử lý đổi trạng thái kích hoạt nhanh bằng Switch
  const handleToggleStatus = (record: PaymentAccount) => {
    toggleStatusMutation.mutate(record.id);
  };

  // Xử lý bật/tắt tài khoản mặc định
  const handleSetDefault = (record: PaymentAccount) => {
    setDefaultMutation.mutate(record.id);
  };

  // Xử lý xóa bản ghi
  const handleDelete = (id: number) => {
    deleteMutation.mutate(id);
  };

  return (
    <div className="space-y-5 flex flex-col flex-1 h-full overflow-hidden">
      {/* Header section */}
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Danh sách tài khoản thanh toán</h2>
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

      {/* Toolbar / Filter */}
      <div className="shrink-0">
        <FilterBar params={params} setParams={setParams} />
      </div>

      {/* Table Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <ListPage
          paymentAccounts={accounts}
          isLoading={isLoading}
          banks={vietqrBanks}
          onViewDetail={(account) => {
            setSelectedDetailAccount(account);
            setIsDetailOpen(true);
          }}
          onEdit={(account) => {
            setSelectedUpdateAccount(account);
            setIsUpdateOpen(true);
          }}
          onDelete={handleDelete}
          onToggleStatus={handleToggleStatus}
          onSetDefault={handleSetDefault}
        />
      </div>

      {/* Drawer Thêm mới */}
      <FormCreate
        open={isCreateOpen}
        confirmLoading={createMutation.isPending}
        banks={vietqrBanks}
        isBanksLoading={isBanksLoading}
        onCancel={() => setIsCreateOpen(false)}
        onSubmit={handleCreate}
      />

      {/* Drawer Cập nhật */}
      <FormUpdate
        open={isUpdateOpen}
        confirmLoading={updateMutation.isPending}
        banks={vietqrBanks}
        isBanksLoading={isBanksLoading}
        data={selectedUpdateAccount}
        onCancel={() => {
          setIsUpdateOpen(false);
          setSelectedUpdateAccount(null);
        }}
        onSubmit={handleUpdate}
      />

      {/* Drawer Chi tiết */}
      <FormDetail
        open={isDetailOpen}
        data={selectedDetailAccount}
        onCancel={() => {
          setIsDetailOpen(false);
          setSelectedDetailAccount(null);
        }}
      />
    </div>
  );
};

export default PaymentAccountPage;
