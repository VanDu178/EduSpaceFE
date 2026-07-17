import { useState } from 'react';
import { ListPage, FilterBar } from '../components';
import { useUsersQuery } from '../hooks';
import { DEFAULT_USER_PARAMS } from '../constants';
import type { UserParams } from '../types';

const UserListPage = () => {
  const [params, setParams] = useState<UserParams>(DEFAULT_USER_PARAMS);
  const [lockedUserIds, setLockedUserIds] = useState<number[]>([]);

  // React Query Hook lấy danh sách người dùng
  const { data: users = [], isLoading } = useUsersQuery();

  // Khóa / mở khóa tài khoản
  const handleToggleLock = (userId: number) => {
    setLockedUserIds((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  // Lọc dữ liệu cục bộ theo keyword và role
  const filteredUsers = users.filter((u) => {
    const matchesKeyword =
      !params.keyword ||
      (u.name?.toLowerCase().includes(params.keyword.toLowerCase()) || false) ||
      u.email.toLowerCase().includes(params.keyword.toLowerCase());

    const matchesRole =
      !params.role ||
      params.role === 'ALL' ||
      u.role === params.role;

    return matchesKeyword && matchesRole;
  });

  // Phân trang dữ liệu cục bộ
  const total = filteredUsers.length;
  const page = params.page || 1;
  const limit = params.limit || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

  return (
    <div className="space-y-6 flex flex-col overflow-hidden">
      <h2 className="text-xl font-bold text-slate-800 mb-2 shrink-0">Danh sách người dùng</h2>

      {/* Toolbar */}
      <div className="pb-4 shrink-0">
        <FilterBar params={params} setParams={setParams} />
      </div>

      {/* Table list wrapper */}
      <div className="flex-1 min-h-0 bg-white  overflow-hidden flex flex-col">
        <ListPage
          users={paginatedUsers}
          isLoading={isLoading}
          lockedUserIds={lockedUserIds}
          onToggleLock={handleToggleLock}
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
    </div>
  );
};

export default UserListPage;
