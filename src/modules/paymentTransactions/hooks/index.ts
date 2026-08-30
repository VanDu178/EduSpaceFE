import { useState, useCallback, useEffect } from 'react';
import toast from 'react-hot-toast';
import type { PaymentTransaction, PaymentTransactionParams, ConfirmRefundParams } from '../types';
import {
  fetchPaymentTransactionsApi,
  approvePaymentTransactionApi,
  cancelPaymentTransactionApi,
  confirmPaymentRefundApi,
  downloadInvoicePdfApi,
} from '../api';

const defaultParam: PaymentTransactionParams = {
  page: 1,
  limit: 10,
  status: 'all',
  search: '',
};

export const PAYMENT_TRANSACTIONS_QUERY_KEY = ['paymentTransactions'];
export const QUERY_KEY = PAYMENT_TRANSACTIONS_QUERY_KEY;

// Hook riêng cho việc tải hóa đơn PDF
export const useDownloadInvoicePdf = () => {
  const [downloadingCode, setDownloadingCode] = useState<string | null>(null);

  const downloadPdf = async (code: string) => {
    setDownloadingCode(code);
    try {
      await downloadInvoicePdfApi(code);
      toast.success('Tải hóa đơn thành công!');
      return true;
    } catch (error: any) {
      console.error('Lỗi khi tải hóa đơn:', error);
      toast.error(error?.message || 'Không thể tải hóa đơn.');
      return false;
    } finally {
      setDownloadingCode(null);
    }
  };

  return {
    downloadPdf,
    downloadingCode,
    isDownloading: (code?: string) => (code ? downloadingCode === code : Boolean(downloadingCode)),
  };
};

// Hook chính quản lý danh sách và thao tác giao dịch VietQR
export const usePaymentTransactions = (initialParams?: PaymentTransactionParams) => {
  const [transactions, setTransactions] = useState<PaymentTransaction[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isApproving, setIsApproving] = useState<boolean>(false);
  const [params, setParams] = useState<PaymentTransactionParams>({
    ...defaultParam,
    ...initialParams,
  });
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const { downloadPdf, downloadingCode, isDownloading } = useDownloadInvoicePdf();

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
      toast.error(error.message || 'Không thể tải danh sách giao dịch VietQR');
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
        toast.success('🎉 Duyệt thanh toán và kích hoạt gói thành công!');
        fetchTransactions();
        return true;
      } else {
        toast.error(res?.message || 'Duyệt thanh toán thất bại');
        return false;
      }
    } catch (error: any) {
      toast.error(error.message || 'Lỗi khi duyệt thanh toán');
      return false;
    } finally {
      setIsApproving(false);
    }
  };

  const handleRefund = async (id: number, refundParams: ConfirmRefundParams) => {
    try {
      const res = await confirmPaymentRefundApi(id, refundParams);
      if (res?.success) {
        toast.success('🎉 Tạo phiếu hoàn tiền CSKH thành công!');
        fetchTransactions();
        return true;
      } else {
        toast.error(res?.message || 'Tạo phiếu hoàn tiền thất bại');
        return false;
      }
    } catch (error: any) {
      toast.error(error.message || 'Lỗi khi tạo phiếu hoàn tiền');
      return false;
    }
  };

  const handleCancel = async (code: string) => {
    try {
      const res = await cancelPaymentTransactionApi(code);
      if (res?.success) {
        toast.success('Đã hủy giao dịch thanh toán');
        fetchTransactions();
        return true;
      } else {
        toast.error(res?.message || 'Hủy giao dịch thất bại');
        return false;
      }
    } catch (error: any) {
      toast.error(error.message || 'Lỗi khi hủy giao dịch');
      return false;
    }
  };

  return {
    transactions,
    isLoading,
    isApproving,
    pagination,
    params,
    setParams,
    fetchTransactions,
    handlePageChange,
    handleSearch,
    handleStatusFilter,
    handleApprove,
    handleRefund,
    handleCancel,
    downloadPdf,
    downloadingCode,
    isDownloading,
  };
};
