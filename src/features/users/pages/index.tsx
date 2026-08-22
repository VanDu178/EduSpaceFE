import { useState } from 'react';
import { Button } from 'antd';
import { ListPage, FilterBar, FormCreate, FormUpdate, ModalResetSuccess } from '../components';
import type { ResetSuccessData } from '../components';
import {
  useUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useResetPasswordMutation,
  useToggleUserStatusMutation
} from '../hooks';
import type { UserParams, User } from '../types';
import { PlusIcon } from '@heroicons/react/16/solid';
import { DEFAULT_USER_PARAMS } from '../constants';
import { useLoadingToast } from '../../../hooks';

const index = () => {
  const [params, setParams] = useState<UserParams>(DEFAULT_USER_PARAMS);

  // State quản lý độc lập 2 Modal Thêm và Cập nhật
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  // State hiển thị mật khẩu mới sau khi reset
  const [resetSuccessData, setResetSuccessData] = useState<ResetSuccessData | null>(null);

  // React Query Hook lấy danh sách người dùng
  const { data, isLoading } = useUsersQuery(params);
  const users = data?.users || [];

  // Mutations
  const { mutate: createUserMutation, isPending: isCreateLoading } = useCreateUserMutation();
  const { mutate: updateUserMutation, isPending: isUpdateLoading } = useUpdateUserMutation();
  const { mutate: resetPasswordMutation, isPending: isResetPasswordLoading } = useResetPasswordMutation();
  const { mutate: toggleUserStatusMutation, isPending: isToggleUserStatusLoading } = useToggleUserStatusMutation();

  // Khóa / mở khóa tài khoản
  const handleToggleLock = (userId: number, currentStatus: 'active' | 'locked') => {
    toggleUserStatusMutation({
      id: userId,
      status: currentStatus === 'active' ? 'locked' : 'active',
    });
  };

  // Mở modal tạo mới
  const handleOpenCreate = () => {
    setIsCreateOpen(true);
  };

  // Mở modal chỉnh sửa
  const handleOpenEdit = (user: User) => {
    setEditingUser(user);
    setIsUpdateOpen(true);
  };

  // Lưu tạo mới tài khoản
  const handleCreateUser = (values: any) => {
    createUserMutation(values, {
      onSuccess: () => setIsCreateOpen(false),
    });
  };

  // Lưu cập nhật tài khoản
  const handleUpdateUser = (values: any) => {
    if (!editingUser) return;
    updateUserMutation(
      { id: editingUser.id, data: values },
      {
        onSuccess: () => {
          setIsUpdateOpen(false);
          setEditingUser(null);
        },
      }
    );
  };

  // Xử lý Reset Mật Khẩu
  const handleResetPassword = (user: User) => {
    resetPasswordMutation(user.id, {
      onSuccess: (data) => {
        if (data) {
          setResetSuccessData({
            email: data.email,
            newPassword: data.newPassword,
            loginUrl: data.loginUrl,
          });
        }
      },
    });
  };


  const total = data?.pagination?.total || 0;
  const page = params.page || 1;
  const limit = params.limit || 10;

  useLoadingToast(isCreateLoading, 'Đang tạo tài khoản...');
  useLoadingToast(isUpdateLoading, 'Đang cập nhật tài khoản...');
  useLoadingToast(isResetPasswordLoading, 'Đang reset mật khẩu...');
  useLoadingToast(isToggleUserStatusLoading, 'Đang thay đổi trạng thái tài khoản...');

  return (
    <div className="space-y-6 flex flex-col flex-1 h-full overflow-hidden">
      <div className="flex items-center justify-between mb-2 shrink-0">
        <h2 className="text-xl font-bold text-slate-800">Danh sách người dùng</h2>
        <Button
          type="primary"
          onClick={handleOpenCreate}
          className="px-5 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-600 border-none text-sm font-semibold flex items-center justify-center cursor-pointer">
          <span className='flex items-center gap-2'>
            <PlusIcon className="h-5 w-5" />
            Thêm mới
          </span>
        </Button>
      </div>

      {/* Toolbar */}
      <div className="shrink-0">
        <FilterBar params={params} setParams={setParams} />
      </div>

      {/* Table list wrapper */}
      <div className=" bg-white overflow-hidden flex flex-col flex-1">
        <ListPage
          users={users}
          isLoading={isLoading}
          onToggleLock={handleToggleLock}
          onEdit={handleOpenEdit}
          onResetPassword={handleResetPassword}
          pagination={{
            current: page,
            pageSize: limit,
            total: total,
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

      {/* Modal Thêm Người dùng */}
      <FormCreate
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSave={handleCreateUser}
        isLoading={isCreateLoading}
      />

      {/* Modal Cập nhật Người dùng */}
      <FormUpdate
        isOpen={isUpdateOpen}
        onClose={() => {
          setIsUpdateOpen(false);
          setEditingUser(null);
        }}
        onSave={handleUpdateUser}
        isLoading={isUpdateLoading}
        user={editingUser}
      />

      {/* Modal hiển thị thông tin reset mật khẩu thành công */}
      <ModalResetSuccess
        data={resetSuccessData}
        onClose={() => setResetSuccessData(null)}
      />
    </div>
  );
};

export default index;
