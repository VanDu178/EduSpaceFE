import { useState } from 'react';
import { Button } from 'antd';
import { ArrowPathIcon } from '@heroicons/react/24/outline';
import {
  useVietqrBanksQuery,
  useSyncVietqrBanksMutation,
  useToggleVietqrBankStatusMutation,
} from '../hooks';
import type { VietqrBank } from '../types';
import FilterBar from '../components/FilterBar';
import ListPage from '../components/ListPage';
import FormDetail from '../components/FormDetail';

const VietqrBankListPage = () => {
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // React Query hooks
  const { data: banks = [], isLoading } = useVietqrBanksQuery({
    keyword: searchKeyword || undefined,
    status: statusFilter,
  });
  const syncMutation = useSyncVietqrBanksMutation();
  const toggleStatusMutation = useToggleVietqrBankStatusMutation();

  // Detail Modal state
  const [isDetailOpen, setIsDetailOpen] = useState<boolean>(false);
  const [selectedBank, setSelectedBank] = useState<VietqrBank | null>(null);

  // Xử lý Đồng bộ từ VietQR
  const handleSync = () => {
    syncMutation.mutate();
  };

  // Xử lý bật/tắt trạng thái
  const handleToggleStatus = (bank: VietqrBank) => {
    toggleStatusMutation.mutate(bank.id);
  };

  // Xem chi tiết
  const handleViewDetail = (bank: VietqrBank) => {
    setSelectedBank(bank);
    setIsDetailOpen(true);
  };

  return (
    <div className="space-y-5 flex flex-col flex-1 h-full overflow-hidden">
      {/* Header section */}
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Danh sách ngân hàng VietQR hỗ trợ</h2>
        </div>
        <Button
          type="primary"
          onClick={handleSync}
          loading={syncMutation.isPending}
          className="px-5 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-600 border-none text-sm font-semibold flex items-center justify-center cursor-pointer h-10"
        >
          <span className="flex items-center gap-2">
            <ArrowPathIcon className={`h-5 w-5 ${syncMutation.isPending ? 'animate-spin' : ''}`} />
            Đồng bộ từ VietQR
          </span>
        </Button>
      </div>

      {/* Toolbar / Filter */}
      <div className="shrink-0">
        <FilterBar
          params={{ keyword: searchKeyword, status: statusFilter }}
          setParams={(updater) => {
            if (typeof updater === 'function') {
              const next = updater({ keyword: searchKeyword, status: statusFilter });
              setSearchKeyword(next.keyword || '');
              setStatusFilter(next.status || 'ALL');
            } else {
              setSearchKeyword(updater.keyword || '');
              setStatusFilter(updater.status || 'ALL');
            }
          }}
        />
      </div>

      {/* Table Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <ListPage
          banks={banks}
          isLoading={isLoading}
          onViewDetail={handleViewDetail}
          onToggleStatus={handleToggleStatus}
        />
      </div>

      {/* Drawer Xem Chi tiết */}
      <FormDetail
        open={isDetailOpen}
        bank={selectedBank}
        onClose={() => setIsDetailOpen(false)}
      />
    </div>
  );
};

export default VietqrBankListPage;
