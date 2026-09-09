import { useEffect, useState } from 'react';
import { Modal, Form, Select, Input, Button, Upload, Spin, Image } from 'antd';
import type { UploadFile, UploadProps } from 'antd/es/upload/interface';
import { PlusIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import type { CreateSubscriptionPayload, BillingCycle } from '../types';
import { PAYMENT_METHOD_OPTIONS } from '../constants';
import { PAYMENT_METHOD_CODES } from '../../paymentMethods/constants';
import { useUsersQuery } from '../../users/hooks';
import { useMembershipPlansQuery } from '../../membershipPlans/hooks';
import { useActivePaymentMethodsQuery } from '../../paymentMethods/hooks';
import { USER_ROLE } from '../../../constants/roles';
import { formatCurrency } from '../../../utils/format';
import { validateImageFile, PROOFS_UPLOAD_CONFIG, uploadMultipleFilesApi, FOLDER_NAME } from '../../upload';


interface FormCreateProps {
  open: boolean;
  submitting: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateSubscriptionPayload) => Promise<boolean>;
}

const FormCreate = ({ open, submitting, onClose, onSubmit }: FormCreateProps) => {
  const [form] = Form.useForm();

  // Custom hooks truy vấn danh sách người dùng, gói hội viên và phương thức thanh toán active
  const { data: usersData, isLoading: isLoadingUsers } = useUsersQuery(
    open ? { page: 1, limit: 100 } : undefined
  );
  const { data: plansData, isLoading: isLoadingPlans } = useMembershipPlansQuery(
    open ? { isActive: 'true' } : undefined
  );
  const { data: activePaymentMethodsData, isLoading: isLoadingPaymentMethods } = useActivePaymentMethodsQuery();

  const users = (usersData?.users || []).filter((u) => u.role !== USER_ROLE.ADMIN);
  const plans = (Array.isArray(plansData) ? plansData : []).filter((p) => (p.tierLevel ?? 1) !== 1);
  const paymentMethods = Array.isArray(activePaymentMethodsData) ? activePaymentMethodsData : [];
  const paymentMethodOptions = paymentMethods.map((pm) => ({
    value: pm.code,
    label: pm.name,
  }));
  const loadingData = isLoadingUsers || isLoadingPlans || isLoadingPaymentMethods;

  // State quản lý upload ảnh minh chứng
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [isUploadingFiles, setIsUploadingFiles] = useState<boolean>(false);
  const [previewOpen, setPreviewOpen] = useState<boolean>(false);
  const [previewIndex, setPreviewIndex] = useState<number>(0);

  useEffect(() => {
    if (open) {
      form.resetFields();
      setFileList([]);
    }
  }, [open, form]);

  // Xử lý xem trước danh sách ảnh minh chứng qua Image.PreviewGroup
  const handlePreview = async (file: UploadFile) => {
    const index = fileList.findIndex((item) => item.uid === file.uid);
    if (index !== -1) {
      setPreviewIndex(index);
    } else {
      setPreviewIndex(0);
    }
    setPreviewOpen(true);
  };

  const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const handleBeforeUpload = async (file: File) => {
    if (fileList.length >= PROOFS_UPLOAD_CONFIG.MAX_COUNT) {
      toast.error(`Chỉ được tải lên tối đa ${PROOFS_UPLOAD_CONFIG.MAX_COUNT} ảnh minh chứng!`);
      return Upload.LIST_IGNORE;
    }
    const result = await validateImageFile(file, PROOFS_UPLOAD_CONFIG);
    if (!result.isValid) {
      toast.error(result.message || 'Tệp không hợp lệ!');
      return Upload.LIST_IGNORE;
    }
    // Ngăn Antd tự động upload ngay lập tức (chờ submit form)
    return false;
  };


  const handleFinish = async (values: any) => {
    try {
      setIsUploadingFiles(true);

      // Upload ảnh mới chọn nếu có
      const filesToUpload: File[] = fileList
        .filter((file) => file.originFileObj)
        .map((file) => file.originFileObj as File);

      let proofUrls: string[] = [];
      if (filesToUpload.length > 0) {
        const uploadResults = await uploadMultipleFilesApi(filesToUpload, FOLDER_NAME.SUBSCRIPTION_PROOFS);
        proofUrls = uploadResults.map((res) => res.url);
      }

      const payload: CreateSubscriptionPayload = {
        userId: values.userId ? Number(values.userId) : undefined,
        planId: Number(values.planId),
        billingCycle: values.billingCycle as BillingCycle,
        paymentMethod: values.paymentMethod,
        paymentRef: values.paymentRef ? String(values.paymentRef).trim() : undefined,
        notes: values.notes ? String(values.notes).trim() : undefined,
        proofUrls: proofUrls.length > 0 ? proofUrls : undefined,
      };

      const success = await onSubmit(payload);
      if (success) {
        onClose();
      }
    } catch (err: any) {
      console.error('Lỗi khi upload ảnh hoặc tạo mới đăng ký gói:', err);
      toast.error('Đã có lỗi xảy ra khi xử lý tệp minh chứng!');
    } finally {
      setIsUploadingFiles(false);
    }
  };

  const isFormSubmitting = submitting || isUploadingFiles;

  return (
    <>
      <Modal
        open={open}
        onCancel={onClose}
        footer={null}
        title={<span className="text-base font-semibold text-slate-800">Thêm mới</span>}
        width={620}
        className="top-8"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          initialValues={{
            billingCycle: 'monthly',
            paymentMethod: PAYMENT_METHOD_CODES.VIETQR,
          }}
          className="pt-3"
        >
          {/* Chọn người dùng */}
          <Form.Item
            name="userId"
            label={<span className="text-xs font-semibold text-slate-700">Người dùng nhận gói</span>}
            rules={[{ required: true, message: 'Vui lòng chọn người dùng' }]}
          >
            <Select
              showSearch
              placeholder="Chọn người dùng..."
              loading={loadingData}
              filterOption={(input, option) =>
                (option?.label ?? '').toString().toLowerCase().includes(input.toLowerCase())
              }
              options={users.map((u) => ({
                value: u.id,
                label: `${u.name || 'N/A'} (${u.email})`,
              }))}
              className="rounded-lg"
            />
          </Form.Item>

          {/* Chọn gói hội viên */}
          <Form.Item
            name="planId"
            label={<span className="text-xs font-semibold text-slate-700">Gói hội viên</span>}
            rules={[{ required: true, message: 'Vui lòng chọn gói hội viên' }]}
          >
            <Select
              placeholder="Chọn gói hội viên..."
              loading={loadingData}
              options={plans.map((p) => ({
                value: p.id,
                label: `${p.name} - Theo tháng: ${formatCurrency(p.monthlyPrice)} / Theo năm: ${formatCurrency(p.yearlyPrice)}`,
              }))}
              className="rounded-lg"
            />
          </Form.Item>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Chu kỳ thanh toán */}
            <Form.Item
              name="billingCycle"
              label={<span className="text-xs font-semibold text-slate-700">Chu kỳ thanh toán</span>}
              rules={[{ required: true, message: 'Vui lòng chọn chu kỳ' }]}
            >
              <Select
                options={[
                  { value: 'monthly', label: 'Hàng tháng' },
                  { value: 'yearly', label: 'Hàng năm' },
                ]}
              />
            </Form.Item>

            {/* Phương thức thanh toán */}
            <Form.Item
              name="paymentMethod"
              label={<span className="text-xs font-semibold text-slate-700">Phương thức thanh toán</span>}
            >
              <Select
                placeholder="Chọn phương thức..."
                loading={isLoadingPaymentMethods}
                options={paymentMethodOptions.length > 0 ? paymentMethodOptions : PAYMENT_METHOD_OPTIONS}
              />
            </Form.Item>
          </div>

          {/* Mã tham chiếu / giao dịch */}
          <Form.Item
            name="paymentRef"
            label={<span className="text-xs font-semibold text-slate-700">Mã giao dịch</span>}
          >
            <Input placeholder="Ví dụ: FT2308239912..." />
          </Form.Item>

          {/* Ghi chú / Lý do cấp gói */}
          <Form.Item
            name="notes"
            label={<span className="text-xs font-semibold text-slate-700">Ghi chú / Lý do cấp gói</span>}
          >
            <Input.TextArea
              rows={3}
              placeholder="Nhập ghi chú hoặc lý do cấp gói hội viên..."
              className="rounded-lg text-sm"
            />
          </Form.Item>

          {/* Upload ảnh minh chứng giao dịch */}
          <Form.Item className="mb-4">
            <div className="flex items-center justify-between w-full mb-1.5">
              <span className="text-xs font-semibold text-slate-700">
                Ảnh minh chứng giao dịch
              </span>
              <span className="text-[11px] text-slate-400 font-normal italic">
                {PROOFS_UPLOAD_CONFIG.HINT_TEXT}
              </span>
            </div>
            <Spin spinning={isUploadingFiles} tip="Đang tải ảnh minh chứng...">
              <Upload
                listType="picture-card"
                fileList={fileList}
                onPreview={handlePreview}
                onChange={handleChange}
                beforeUpload={handleBeforeUpload}
                accept={PROOFS_UPLOAD_CONFIG.ACCEPT_STRING}
                multiple
                className="proof-uploader"
              >
                {fileList.length >= PROOFS_UPLOAD_CONFIG.MAX_COUNT ? null : (
                  <div className="flex flex-col items-center justify-center text-slate-500 hover:text-sky-600 transition-colors">
                    <PlusIcon className="h-5 w-5 mb-1" />
                    <span className="text-xs font-medium">Tải ảnh lên</span>
                  </div>
                )}
              </Upload>
            </Spin>
          </Form.Item>

          {/* Footer Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100 mt-6">
            <Button onClick={onClose} disabled={isFormSubmitting}>
              Hủy
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={isFormSubmitting}
              className="bg-sky-500 hover:bg-sky-600 shadow-none font-medium"
            >
              Thêm mới
            </Button>
          </div>
        </Form>
      </Modal>

      {/* Component Xem trước Danh sách Ảnh Minh Chứng của Ant Design (PreviewGroup) */}
      <div className="hidden">
        <Image.PreviewGroup
          preview={{
            visible: previewOpen,
            current: previewIndex,
            onVisibleChange: (visible) => setPreviewOpen(visible),
            onChange: (current) => setPreviewIndex(current),
          }}
        >
          {fileList.map((file) => {
            let src = file.url || (file.preview as string);
            if (!src && file.originFileObj) {
              src = URL.createObjectURL(file.originFileObj as Blob);
            }
            return <Image key={file.uid} src={src} alt={file.name || 'Ảnh minh chứng'} />;
          })}
        </Image.PreviewGroup>
      </div>
    </>
  );
};

export default FormCreate;
