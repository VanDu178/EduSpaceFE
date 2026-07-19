import { useState } from 'react';
import { Button, message, Modal } from 'antd';
import { ListPage, FilterBar, FormCreate, FormUpdate } from '../components';
import {
  useUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useResetPasswordMutation
} from '../hooks';
import { DEFAULT_USER_PARAMS } from '../constants';
import type { UserParams, User } from '../types';
import { PlusIcon } from '@heroicons/react/16/solid';

const UserListPage = () => {
  const [params, setParams] = useState<UserParams>(DEFAULT_USER_PARAMS);
  const [lockedUserIds, setLockedUserIds] = useState<number[]>([]);

  // State quản lý độc lập 2 Modal Thêm và Cập nhật
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // State hiển thị mật khẩu mới sau khi reset
  const [resetSuccessData, setResetSuccessData] = useState<{
    email: string;
    newPassword: string;
    loginUrl: string;
  } | null>(null);

  // React Query Hook lấy danh sách người dùng
  const { data, isLoading } = useUsersQuery(params);
  const users = data?.users || [];

  // Mutations
  const createUserMutation = useCreateUserMutation();
  const updateUserMutation = useUpdateUserMutation();
  const resetPasswordMutation = useResetPasswordMutation();

  // Khóa / mở khóa tài khoản
  const handleToggleLock = (userId: number) => {
    setLockedUserIds((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
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
    createUserMutation.mutate(values, {
      onSuccess: () => {
        message.success('Tạo tài khoản người dùng thành công!');
        setIsCreateOpen(false);
      },
      onError: (err: any) => {
        message.error(err.message || 'Lỗi khi tạo tài khoản');
      }
    });
  };

  // Lưu cập nhật tài khoản
  const handleUpdateUser = (values: any) => {
    if (!editingUser) return;
    updateUserMutation.mutate({
      id: editingUser.id,
      data: values
    }, {
      onSuccess: () => {
        message.success('Cập nhật thông tin tài khoản thành công!');
        setIsUpdateOpen(false);
        setEditingUser(null);
      },
      onError: (err: any) => {
        message.error(err.message || 'Lỗi khi cập nhật tài khoản');
      }
    });
  };

  // Xử lý Reset Mật Khẩu
  const handleResetPassword = (user: User) => {
    resetPasswordMutation.mutate(user.id, {
      onSuccess: (data) => {
        setResetSuccessData({
          email: data.email,
          newPassword: data.newPassword,
          loginUrl: data.loginUrl
        });
      },
      onError: (err: any) => {
        message.error(err.message || 'Không thể đặt lại mật khẩu');
      }
    });
  };

  // Copy thông tin
  const handleCopyText = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    message.success(`Đã sao chép ${type} vào bộ nhớ tạm!`);
  };

  const total = data?.pagination?.total || 0;
  const page = params.page || 1;
  const limit = params.limit || 10;

  const isCreateLoading = createUserMutation.isPending;
  const isUpdateLoading = updateUserMutation.isPending;

  return (
    <div className="space-y-6 flex flex-col overflow-hidden">
      <div className="flex items-center justify-between mb-2 shrink-0">
        <h2 className="text-xl font-bold text-slate-800">Danh sách người dùng</h2>
        <Button
          type="primary"
          onClick={handleOpenCreate}
          className="px-5 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 border-none text-sm font-semibold flex items-center justify-center cursor-pointer">
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
      <div className="flex-1 min-h-0 bg-white overflow-hidden flex flex-col">
        <ListPage
          users={users}
          isLoading={isLoading}
          lockedUserIds={lockedUserIds}
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
      <Modal
        open={!!resetSuccessData}
        title={<span className="text-lg font-bold text-slate-800">Đặt lại mật khẩu thành công</span>}
        onCancel={() => setResetSuccessData(null)}
        footer={[
          <Button
            key="close"
            type="primary"
            onClick={() => setResetSuccessData(null)}
            className="rounded-lg bg-blue-600 hover:bg-blue-700 font-semibold border-none"
          >
            Đóng
          </Button>
        ]}
        className="max-w-md"
        destroyOnClose
      >
        <div className="pt-4 space-y-4">
          <p className="text-slate-600 text-sm">
            Mật khẩu mới đã được thiết lập thành công. Vui lòng gửi thông tin đăng nhập này cho khách hàng/người dùng:
          </p>
          <div className="bg-slate-50 p-4 rounded-xl space-y-3 border border-slate-100">
            <div>
              <span className="text-xs text-slate-400 block font-semibold">EMAIL ĐĂNG NHẬP</span>
              <span className="text-slate-800 font-semibold text-sm select-all">{resetSuccessData?.email}</span>
            </div>
            <div>
              <span className="text-xs text-slate-400 block font-semibold">MẬT KHẨU MỚI</span>
              <div className="flex items-center justify-between">
                <span className="text-amber-600 font-mono font-bold text-lg select-all">{resetSuccessData?.newPassword}</span>
                <Button
                  type="link"
                  onClick={() => handleCopyText(resetSuccessData?.newPassword || '', 'mật khẩu')}
                  className="text-blue-600 font-semibold p-0 flex items-center hover:text-blue-700"
                >
                  Sao chép
                </Button>
              </div>
            </div>
            <div>
              <span className="text-xs text-slate-400 block font-semibold">ĐƯỜNG DẪN TRANG CHỦ</span>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-mono text-xs overflow-hidden text-ellipsis whitespace-nowrap max-w-[280px]">
                  {resetSuccessData?.loginUrl}
                </span>
                <Button
                  type="link"
                  onClick={() => handleCopyText(resetSuccessData?.loginUrl || '', 'đường dẫn')}
                  className="text-blue-600 font-semibold p-0 flex items-center hover:text-blue-700 text-xs"
                >
                  Sao chép Link
                </Button>
              </div>
            </div>
          </div>
          <div className="bg-amber-50 p-3 rounded-lg border border-amber-100 text-amber-800 text-xs flex flex-col gap-1">
            <span className="font-semibold">Lưu ý bảo mật:</span>
            <span>Mật khẩu này đã được mã hóa trong cơ sở dữ liệu. Admin sẽ không thể xem lại mật khẩu này sau khi đóng hộp thoại này.</span>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default UserListPage;
