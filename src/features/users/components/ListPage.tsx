import { Table, Badge, Button, Popconfirm, Tooltip, Tag, Empty } from 'antd';
import { LockClosedIcon, LockOpenIcon, KeyIcon, PencilSquareIcon } from '@heroicons/react/24/outline';
import type { ColumnsType } from 'antd/es/table';
import type { User } from '../types';

interface ListPageProps {
  users: User[];
  isLoading: boolean;
  onToggleLock: (id: number, currentStatus: 'active' | 'locked') => void;
  onEdit: (user: User) => void;
  onResetPassword: (user: User) => void;
  pagination?: {
    current: number;
    pageSize: number;
    total: number;
    onChange: (page: number, pageSize: number) => void;
  };
}

const ListPage = ({
  users,
  isLoading,
  onToggleLock,
  onEdit,
  onResetPassword,
  pagination,
}: ListPageProps) => {

  const currentUserStr = localStorage.getItem('user');
  let currentUserId: number | null = null;
  if (currentUserStr) {
    try {
      currentUserId = JSON.parse(currentUserStr).id;
    } catch (e) {
      console.error(e);
    }
  }

  if (!isLoading && users.length === 0) {
    return (
      <div className="py-16 flex items-center justify-center flex-1">
        <Empty description="Không có người dùng nào" />
      </div>
    );
  }

  const columns: ColumnsType<User> = [
    {
      title: 'Họ và Tên',
      dataIndex: 'name',
      key: 'name',
      render: (name) => (
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-yellow-300 text-yellow-800 text-white rounded-full flex items-center justify-center text-slate-500 font-bold text-xs border border-slate-200/80">
            {name ? name.charAt(0).toUpperCase() : 'U'}
          </div>
          <span className="font-semibold text-slate-800">{name || 'Người dùng ẩn danh'}</span>
        </div>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (email) => <span className="text-slate-500 font-medium">{email}</span>,
    },
    {
      title: 'Vai trò',
      dataIndex: 'role',
      align: 'center',
      key: 'role',
      width: 150,
      render: (role) => {
        if (role === 'admin') {
          return (
            <Tag color="blue" className="font-semibold px-2.5 py-0.5 rounded-full border-none">
              Quản trị viên
            </Tag>
          );
        }
        return (
          <Tag color="default" className="font-semibold px-2.5 py-0.5 rounded-full border-none bg-slate-100 text-slate-600">
            Khách hàng
          </Tag>
        );
      },
    },
    {
      title: 'Trạng thái',
      key: 'status',
      width: 120,
      align: 'center',
      render: (_, record) => {
        const isLocked = record?.status === 'locked';
        return (
          <Badge
            status={isLocked ? 'error' : 'processing'}
            text={isLocked ? 'Bị khóa' : 'Hoạt động'}
            className="font-semibold text-xs text-slate-600"
          />
        );
      },
    },
    {
      title: 'Hành động',
      key: 'action',
      width: 180,
      align: 'center',
      render: (_, record) => {
        const isLocked = record?.status === 'locked';
        const isSelf = record?.id === currentUserId;

        return (
          <div className="flex items-center justify-center space-x-2">
            <Tooltip title="Cập nhật">
              <Button
                type="text"
                onClick={() => onEdit(record)}
                className="text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg flex items-center justify-center"
                icon={<PencilSquareIcon className="h-4 w-4" />}
              />
            </Tooltip>

            <Popconfirm
              title="Đặt lại mật khẩu"
              description={`Bạn có chắc chắn muốn đặt lại mật khẩu của "${record?.name || record?.email}"? Mật khẩu mới sẽ được sinh ngẫu nhiên.`}
              onConfirm={() => onResetPassword(record)}
              okText="Đồng ý"
              cancelText="Hủy"
              placement='topLeft'
            >
              <Tooltip title="Đặt lại mật khẩu">
                <Button
                  type="text"
                  className="text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg flex items-center justify-center"
                  icon={<KeyIcon className="h-4 w-4" />}
                />
              </Tooltip>
            </Popconfirm>

            {isSelf ? (
              <Tooltip title="Không được phép tự khóa tài khoản của chính mình">
                <span className="inline-block cursor-not-allowed">
                  <Button
                    type="text"
                    danger
                    disabled
                    className="text-slate-300 hover:text-slate-300 hover:bg-transparent rounded-lg flex items-center justify-center cursor-not-allowed opacity-50"
                    icon={<LockClosedIcon className="h-4 w-4" />}
                  />
                </span>
              </Tooltip>
            ) : (
              <Popconfirm
                title={isLocked ? 'Mở khóa' : 'Khóa'}
                description={`Bạn có chắc chắn muốn ${isLocked ? 'mở khóa' : 'khóa'} tài khoản của "${record?.name || record?.email}"?`}
                onConfirm={() => onToggleLock(record?.id, record?.status || 'active')}
                okText="Đồng ý"
                cancelText="Hủy"
                okButtonProps={{ danger: !isLocked }}
                placement='topLeft'
              >
                <Tooltip title={isLocked ? 'Mở khóa' : 'Khóa'}>
                  <Button
                    type="text"
                    danger={!isLocked}
                    className={isLocked ? 'text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg flex items-center justify-center' : 'text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg flex items-center justify-center'}
                    icon={isLocked ? <LockOpenIcon className="h-4 w-4" /> : <LockClosedIcon className="h-4 w-4" />}
                  />
                </Tooltip>
              </Popconfirm>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <Table
      dataSource={users}
      columns={columns}
      rowKey="id"
      loading={isLoading}
      scroll={{ y: 'calc(100vh - 316px)' }}
      pagination={pagination ? {
        current: pagination.current,
        pageSize: pagination.pageSize,
        total: pagination.total,
        onChange: pagination.onChange,
        showSizeChanger: true,
        pageSizeOptions: ['5', '10', '20', '50'],
        style: { marginBottom: 0 }
      } : false}
    />
  );
};

export default ListPage;
