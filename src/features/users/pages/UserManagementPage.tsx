import { useState } from 'react';
import { Table, Badge, Input, Empty, Popconfirm, Button, Tooltip } from 'antd';
import { MagnifyingGlassIcon, LockClosedIcon, LockOpenIcon, FunnelIcon } from '@heroicons/react/24/outline';
import type { ColumnsType } from 'antd/es/table';
import { useUsersQuery } from '../hooks';
import type { User } from '../types';

const UserManagementPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [lockedUserIds, setLockedUserIds] = useState<number[]>([]);

  // React Query Custom Hook
  const { data: users = [], isLoading } = useUsersQuery();

  const handleToggleLock = (userId: number) => {
    setLockedUserIds((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const columns: ColumnsType<User> = [
    {
      title: 'Họ và Tên',
      dataIndex: 'name',
      key: 'name',
      render: (name) => (
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-xs border border-slate-200">
            {name ? name.charAt(0).toUpperCase() : 'U'}
          </div>
          <span className="font-semibold text-slate-800">{name || 'Người dùng ẩn danh'}</span>
        </div>
      ),
    },
    {
      title: 'Email Đăng Ký',
      dataIndex: 'email',
      key: 'email',
      render: (email) => <span className="text-slate-500 font-medium">{email}</span>,
    },
    {
      title: 'Trạng thái',
      key: 'status',
      width: 120,
      align: 'center',
      render: (_, record) => {
        const isLocked = lockedUserIds.includes(record.id);
        return (
          <Badge
            status={isLocked ? 'error' : 'processing'}
            text={isLocked ? 'Bị khóa' : 'Hoạt động'}
            className="font-semibold text-xs"
          />
        );
      },
    },
    {
      title: 'Hành động',
      key: 'action',
      width: 120,
      align: 'center',
      render: (_, record) => {
        const isLocked = lockedUserIds.includes(record.id);
        return (
          <Popconfirm
            title={isLocked ? 'Mở khóa tài khoản' : 'Khóa tài khoản'}
            description={`Bạn có chắc chắn muốn ${isLocked ? 'mở khóa' : 'khóa'} tài khoản của "${record.name || record.email}"?`}
            onConfirm={() => handleToggleLock(record.id)}
            okText="Đồng ý"
            cancelText="Hủy"
            okButtonProps={{ danger: !isLocked }}
          >
            <Tooltip title={isLocked ? 'Mở khóa tài khoản' : 'Khóa tài khoản'}>
              <Button
                type="text"
                danger={!isLocked}
                className={isLocked ? 'text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg flex items-center justify-center' : 'text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg flex items-center justify-center'}
                icon={isLocked ? <LockOpenIcon className="h-5 w-5" /> : <LockClosedIcon className="h-5 w-5" />}
              />
            </Tooltip>
          </Popconfirm>
        );
      },
    },
  ];

  const filteredUsers = users.filter((u) => {
    return (
      (u.name?.toLowerCase().includes(searchQuery.toLowerCase()) || false) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="space-y-6 flex flex-col w-[calc(100vw-300px)] h-[calc(100vh-130px)] overflow-hidden">
      <h2 className="text-xl font-bold text-slate-800 mb-2 shrink-0">Danh sách người dùng</h2>

      {/* Filter and Search Bar */}
      <div className="flex items-center gap-3 pb-4 shrink-0">
        {/* Advanced Filter Button */}
        <Button

          icon={<FunnelIcon className="h-5 w-5" />}
          className="h-11 rounded-xl flex items-center justify-center border-slate-200 text-slate-500 hover:text-blue-600 hover:border-blue-500 transition-colors"
          title="Bộ lọc nâng cao"
        />

        {/* Search input */}
        <div className="w-full sm:w-[320px]">
          <Input

            prefix={<MagnifyingGlassIcon className="h-5 w-5 text-slate-400 mr-1.5" />}
            placeholder="Tìm theo tên hoặc email người dùng..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full  rounded-xl border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 text-slate-700 text-sm"
          />
        </div>
      </div>

      {/* User Table / Empty State Wrapper */}
      <div className="flex-1 min-h-0 bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm flex flex-col">
        {!isLoading && filteredUsers.length === 0 ? (
          <div className="py-16 flex items-center justify-center flex-1">
            <Empty description="Không có người dùng nào" />
          </div>
        ) : (
          <Table
            dataSource={filteredUsers}
            columns={columns}
            rowKey="id"
            loading={isLoading}
            size="small"
            scroll={{ x: true, y: 'calc(100vh - 370px)' }}
            pagination={{
              pageSize: 10,
              showSizeChanger: false,
              className: 'pr-6',
            }}
            className="flex-1 flex flex-col"
          />
        )}
      </div>
    </div>
  );
};

export default UserManagementPage;
