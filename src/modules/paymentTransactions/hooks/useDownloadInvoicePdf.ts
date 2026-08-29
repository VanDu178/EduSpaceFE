import { useState } from 'react';
import { downloadInvoicePdfApi } from '../api';
import toast from 'react-hot-toast';

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
