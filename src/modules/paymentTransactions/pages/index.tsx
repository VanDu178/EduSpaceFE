import { useState } from 'react';
import { Button } from 'antd';
import { ArrowPathIcon } from '@heroicons/react/24/outline';
import { usePaymentTransactions } from '../hooks/usePaymentTransactions';
import type { PaymentTransaction } from '../types';
import FilterBar from '../components/FilterBar';
import ListPage from '../components/ListPage';
import FormDetail from '../components/FormDetail';

const PaymentTransactionPage = () => {
  const {
    transactions,
    isLoading,
    isApproving,
    pagination,
    params,
    setParams,
    fetchTransactions,
    handlePageChange,
    handleApprove,
    handleCancel,
  } = usePaymentTransactions();

  // State Drawer chi tiết
  const [isDetailOpen, setIsDetailOpen] = useState<boolean>(false);
  const [selectedTransaction, setSelectedTransaction] = useState<PaymentTransaction | null>(null);

  const handleViewDetail = (transaction: PaymentTransaction) => {
    setSelectedTransaction(transaction);
    setIsDetailOpen(true);
  };

  return (
    <div className="space-y-5 flex flex-col flex-1 h-full overflow-hidden">
      {/* Header section */}
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Danh sách giao dịch VietQR</h2>
        </div>
        <Button
          type="primary"
          onClick={fetchTransactions}
          loading={isLoading}
          className="px-5 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-600 border-none text-sm font-semibold flex items-center justify-center cursor-pointer h-10"
        >
          <span className="flex items-center gap-2">
            <ArrowPathIcon className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} />
            Tải lại dữ liệu
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
          transactions={transactions}
          isLoading={isLoading}
          isApproving={isApproving}
          onViewDetail={handleViewDetail}
          onApprove={handleApprove}
          onCancel={handleCancel}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            onChange: handlePageChange,
          }}
        />
      </div>

      {/* Drawer Xem Chi tiết Giao dịch */}
      <FormDetail
        open={isDetailOpen}
        transaction={selectedTransaction}
        onClose={() => setIsDetailOpen(false)}
      />
    </div>
  );
};

export default PaymentTransactionPage;
