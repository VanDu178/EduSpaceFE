import { useState, useEffect } from 'react';
import { Modal, Form, Input, InputNumber, Button, Upload, Spin } from 'antd';
import type { UploadFile, UploadProps } from 'antd/es/upload/interface';
import { PlusOutlined } from '@ant-design/icons';
import toast from 'react-hot-toast';
import { useCreatePaymentRefundMutation, useUpdatePaymentRefundMutation } from '../hooks';
import type { PaymentRefund, ConfirmRefundParams, UpdateRefundParams } from '../types';
import { uploadMultipleFilesApi } from '../../../services/uploadService';
import { formatCurrency } from '../../../utils/format';

interface FormRefundModalProps {
  open: boolean;
  transaction: any | null;
  refund?: PaymentRefund | null;
  onClose: () => void;
  onSuccess?: () => void;
}

const FormRefundModal = ({
  open,
  transaction,
  refund,
  onClose,
  onSuccess,
}: FormRefundModalProps) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [previewOpen, setPreviewOpen] = useState<boolean>(false);
  const [previewImage, setPreviewImage] = useState<string>('');
  const [previewTitle, setPreviewTitle] = useState<string>('');
  const [isUploadingFiles, setIsUploadingFiles] = useState<boolean>(false);

  const createRefundMutation = useCreatePaymentRefundMutation();
  const updateRefundMutation = useUpdatePaymentRefundMutation();

  const isEditMode = Boolean(refund && refund.id);

  // Tính toán số tiền nạp dư
  const paidAmount = Number(transaction?.paidAmount || 0);
  const orderAmount = Number(transaction?.amount || 0);
  const overpaidAmount = Math.max(0, paidAmount - orderAmount);

  // Tổng tiền đã hoàn (trừ phiếu đang sửa nếu đang ở chế độ Edit)
  const allRefunds = transaction?.refunds || [];
  const otherRefundsTotal = allRefunds
    .filter((r: any) => (isEditMode ? r.id !== refund?.id : true))
    .reduce((acc: number, r: any) => acc + Number(r.amount), 0);

  const remainingRefundable = Math.max(0, overpaidAmount - otherRefundsTotal);

  useEffect(() => {
    if (open && transaction) {
      if (isEditMode && refund) {
        form.setFieldsValue({
          amount: Number(refund.amount),
          refundRef: refund.refundRef || '',
          notes: refund.notes || '',
        });

        // Nạp danh sách ảnh đã upload trước đây
        const existingProofFiles: UploadFile[] = (refund.proofUrls || []).map((url, idx) => ({
          uid: `existing-${idx}-${Date.now()}`,
          name: `Anh-minh-chung-${idx + 1}.png`,
          status: 'done',
          url,
        }));
        setFileList(existingProofFiles);
      } else {
        form.setFieldsValue({
          amount: remainingRefundable,
          refundRef: '',
          notes: '',
        });
        setFileList([]);
      }
    }
  }, [open, transaction, refund, isEditMode, remainingRefundable, form]);

  if (!transaction) return null;

  // Xử lý xem trước ảnh full size
  const handlePreview = async (file: UploadFile) => {
    let src = file.url || (file.preview as string);
    if (!src && file.originFileObj) {
      src = URL.createObjectURL(file.originFileObj as Blob);
    }
    setPreviewImage(src || '');
    setPreviewOpen(true);
    setPreviewTitle(file.name || (src ? src.substring(src.lastIndexOf('/') + 1) : 'Ảnh minh chứng'));
  };

  // Giới hạn tệp & ngăn Antd upload tự động (Chờ bấm Submit)
  const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const handleBeforeUpload = (file: File) => {
    if (fileList.length >= 3) {
      toast.error('Chỉ được tải lên tối đa 3 ảnh minh chứng!');
      return Upload.LIST_IGNORE;
    }
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      toast.error('Chỉ được chọn tệp định dạng hình ảnh (PNG, JPG, JPEG, WEBP)!');
      return Upload.LIST_IGNORE;
    }
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      toast.error('Dung lượng tệp ảnh không được vượt quá 5MB!');
      return Upload.LIST_IGNORE;
    }
    // Ngăn Antd tự động gửi request HTTP upload
    return false;
  };

  const handleSubmit = async (values: any) => {
    try {
      setIsUploadingFiles(true);

      // 1. Phân loại danh sách tệp: URL đã có sẵn vs Tệp mới chọn từ máy
      const existingUrls: string[] = fileList
        .filter((file) => file.url && !file.originFileObj)
        .map((file) => file.url as string);

      const newFilesToUpload: File[] = fileList
        .filter((file) => file.originFileObj)
        .map((file) => file.originFileObj as File);

      let newlyUploadedUrls: string[] = [];

      // 2. Upload các tệp mới chọn lên Supabase Storage ở thư mục riêng 'refund-proofs'
      if (newFilesToUpload.length > 0) {
        const uploadResults = await uploadMultipleFilesApi(newFilesToUpload, 'refund-proofs');
        newlyUploadedUrls = uploadResults.map((res) => res.url);
      }

      // 3. Tổng hợp danh sách URL ảnh minh chứng cuối cùng
      const finalProofUrls = [...existingUrls, ...newlyUploadedUrls];

      if (isEditMode && refund) {
        const updateParams: UpdateRefundParams = {
          amount: Number(values.amount),
          refundRef: values.refundRef?.trim(),
          proofUrls: finalProofUrls,
          notes: values.notes?.trim(),
        };

        updateRefundMutation.mutate(
          { id: refund.id, params: updateParams },
          {
            onSuccess: (res) => {
              setIsUploadingFiles(false);
              if (res?.success) {
                form.resetFields();
                onClose();
                if (onSuccess) onSuccess();
              }
            },
            onError: () => {
              setIsUploadingFiles(false);
            },
          }
        );
      } else {
        const confirmParams: ConfirmRefundParams = {
          paymentTxId: transaction.id,
          amount: Number(values.amount),
          refundRef: values.refundRef?.trim(),
          proofUrls: finalProofUrls,
          notes: values.notes?.trim(),
        };

        createRefundMutation.mutate(confirmParams, {
          onSuccess: (res) => {
            setIsUploadingFiles(false);
            if (res?.success) {
              form.resetFields();
              onClose();
              if (onSuccess) onSuccess();
            }
          },
          onError: () => {
            setIsUploadingFiles(false);
          },
        });
      }
    } catch (error: any) {
      setIsUploadingFiles(false);
      toast.error(error?.message || 'Có lỗi xảy ra khi tải ảnh minh chứng lên hệ thống');
    }
  };

  const isSubmitting = createRefundMutation.isPending || updateRefundMutation.isPending || isUploadingFiles;

  return (
    <>
      <Modal
        title={
          <div className="space-y-1">
            <span className="text-base font-bold text-slate-800">
              {isEditMode ? 'Chỉnh sửa phiếu hoàn tiền' : 'Xác nhận hoàn tiền dư'}
            </span>
            <p className="text-xs text-slate-500 font-normal">
              Giao dịch <span className="font-mono font-bold text-sky-600">#{transaction.code}</span> (Nạp dư {formatCurrency(overpaidAmount)})
            </p>
          </div>
        }
        open={open}
        onCancel={onClose}
        footer={null}
        destroyOnClose
        width={540}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="mt-4 space-y-4"
        >
          <Form.Item
            label="Số tiền hoàn (VNĐ)"
            name="amount"
            rules={[
              { required: true, message: 'Vui lòng nhập số tiền hoàn' },
              {
                type: 'number',
                min: 1,
                max: remainingRefundable,
                message: `Số tiền hoàn không được vượt quá ${formatCurrency(remainingRefundable)}`,
              },
            ]}
          >
            <InputNumber
              className="w-full rounded-xl py-1 text-sm border-slate-200"
              formatter={(val) => `${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={(val) => val?.replace(/\$\s?|(,*)/g, '') as any}
              placeholder="Nhập số tiền..."
            />
          </Form.Item>

          <Form.Item
            label="Mã giao dịch ngân hàng"
            name="refundRef"
            rules={[{ required: true, message: 'Vui lòng nhập mã giao dịch ngân hàng hoàn tiền' }]}
          >
            <Input
              placeholder="Ví dụ: FT2408301234..."
              className="rounded-xl py-2 border-slate-200 font-mono text-sm"
            />
          </Form.Item>

          {/* Upload ảnh minh chứng chuyển khoản */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-700">
                Ảnh minh chứng bill chuyển khoản
              </label>
              <span className="text-[11px] text-slate-400 italic">
                Tối đa 3 ảnh | Định dạng PNG, JPG, WEBP (&lt; 5MB)
              </span>
            </div>
            <Spin spinning={isUploadingFiles} tip="Đang tải ảnh lên Supabase Storage...">
              <Upload
                listType="picture-card"
                fileList={fileList}
                onPreview={handlePreview}
                onChange={handleChange}
                beforeUpload={handleBeforeUpload}
                accept="image/*"
                maxCount={3}
                multiple
              >
                {fileList.length < 3 && (
                  <div className="flex flex-col items-center justify-center text-slate-500 hover:text-sky-600">
                    <PlusOutlined className="text-base mb-1" />
                    <span className="text-[11px] font-medium">Tải ảnh lên</span>
                  </div>
                )}
              </Upload>
            </Spin>
          </div>

          <Form.Item label="Ghi chú hoàn tiền" name="notes">
            <Input.TextArea
              rows={3}
              placeholder="Nhập thông tin tài khoản nhận của khách hoặc ghi chú đối soát..."
              className="rounded-xl border-slate-200 text-xs"
            />
          </Form.Item>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <Button className="rounded-xl" onClick={onClose} disabled={isSubmitting}>
              Hủy
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={isSubmitting}
              className="bg-emerald-600 hover:!bg-emerald-700 font-semibold"
            >
              {isEditMode ? 'Cập nhật' : 'Xác nhận hoàn tiền'}
            </Button>
          </div>
        </Form>
      </Modal>

      {/* Modal phóng to xem ảnh minh chứng */}
      <Modal
        open={previewOpen}
        title={previewTitle}
        footer={null}
        onCancel={() => setPreviewOpen(false)}
        centered
      >
        <img alt="Minh chứng hoàn tiền" className="w-full h-auto rounded-xl object-contain max-h-[75vh]" src={previewImage} />
      </Modal>
    </>
  );
};

export default FormRefundModal;
