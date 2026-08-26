import { useState, useCallback, useEffect } from 'react';
import { message } from 'antd';
import type { PaymentTransaction, PaymentTransactionParams } from '../types';
import {
  fetchPaymentTransactionsApi,
  approvePaymentTransactionApi,
  cancelPaymentTransactionApi,
} from '../api';

export const usePaymentTransactions = (initialParams?: PaymentTransactionParams) => {
  const [transactions, setTransactions] = useState<PaymentTransaction[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isApproving, setIsApproving] = useState<boolean>(false);
  const [params, setParams] = useState<PaymentTransactionParams>({
    page: 1,
    limit: 10,
    status: 'all',
    search: '',
    ...initialParams,
  });
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const fetchTransactions = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await fetchPaymentTransactionsApi(params);
      setTransactions(data.items);
      setPagination({
        current: data.pagination.currentPage,
        pageSize: data.pagination.itemsPerPage,
        total: data.pagination.totalItems,
      });
    } catch (error: any) {
      message.error(error.message || 'Không thể tải danh sách giao dịch VietQR');
    } finally {
      setIsLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const handlePageChange = (page: number, pageSize: number) => {
    setParams((prev) => ({ ...prev, page, limit: pageSize }));
  };

  const handleSearch = (search: string) => {
    setParams((prev) => ({ ...prev, search, page: 1 }));
  };

  const handleStatusFilter = (status: string) => {
    setParams((prev) => ({ ...prev, status, page: 1 }));
  };

  const handleApprove = async (id: number, paymentRef?: string) => {
    setIsApproving(true);
    try {
      const res = await approvePaymentTransactionApi(id, paymentRef);
      if (res?.success) {
        message.success('🎉 Duyệt thanh toán và kích hoạt gói thành công!');
        fetchTransactions();
        return true;
      } else {
        message.error(res?.message || 'Duyệt thanh toán thất bại');
        return false;
      }
    } catch (error: any) {
      message.error(error.message || 'Lỗi khi duyệt thanh toán');
      return false;
    } finally {
      setIsApproving(false);
    }
  };

  const handleCancel = async (code: string) => {
    try {
      const res = await cancelPaymentTransactionApi(code);
      if (res?.success) {
        message.success('Đã hủy giao dịch thanh toán');
        fetchTransactions();
        return true;
      } else {
        message.error(res?.message || 'Hủy giao dịch thất bại');
        return false;
      }
    } catch (error: any) {
      message.error(error.message || 'Lỗi khi hủy giao dịch');
      return false;
    }
  };

  return {
    transactions,
    isLoading,
    isApproving,
    pagination,
    params,
    fetchTransactions,
    handlePageChange,
    handleSearch,
    handleStatusFilter,
    handleApprove,
    handleCancel,
  };
};
