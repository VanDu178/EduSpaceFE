import { useEffect, useState } from 'react';
import { Modal, Form, Select, Input, DatePicker, Button } from 'antd';
import dayjs from 'dayjs';
import type { UserSubscription, UpdateSubscriptionStatusPayload, SubscriptionStatus } from '../types';

interface FormUpdateStatusProps {
  open: boolean;
  data: UserSubscription | null;
  submitting: boolean;
  onClose: () => void;
  onSubmit: (id: number, payload: UpdateSubscriptionStatusPayload) => Promise<boolean>;
}

const FormUpdateStatus = ({
  open,
  data,
  submitting,
  onClose,
  onSubmit,
}: FormUpdateStatusProps) => {
  const [form] = Form.useForm();
  const [currentStatus, setCurrentStatus] = useState<SubscriptionStatus>('active');

  useEffect(() => {
    if (open && data) {
      setCurrentStatus(data.status);
      form.setFieldsValue({
        status: data.status,
        cancelReason: data.cancelReason || '',
        endDate: data.endDate ? dayjs(data.endDate) : null,
      });
    }
  }, [open, data, form]);

  const handleStatusChange = (val: SubscriptionStatus) => {
    setCurrentStatus(val);
  };

  const handleFinish = async (values: any) => {
    if (!data) return;

    const payload: UpdateSubscriptionStatusPayload = {
      status: values.status as SubscriptionStatus,
    };

    if (values.status === 'cancelled') {
      payload.cancelReason = values.cancelReason ? String(values.cancelReason).trim() : 'Admin hủy gói';
    }

    if (values.endDate) {
      payload.endDate = values.endDate.toISOString();
    }

    const success = await onSubmit(data.id, payload);
    if (success) {
      onClose();
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      title={<span className="text-base font-semibold text-slate-800">Cập nhật</span>}
      width={480}
      className="top-8"
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        className="pt-3"
        requiredMark="optional"
      >
        {/* Mã đơn hiển thị tham chiếu */}
        <div className="bg-slate-50 border border-slate-100 p-3 rounded-lg mb-4 flex items-center justify-between text-xs">
          <span className="text-slate-500 font-medium">Mã đơn đăng ký:</span>
          <span className="font-mono font-semibold text-slate-800">{data?.code}</span>
        </div>

        {/* Trạng thái đơn */}
        <Form.Item
          name="status"
          label={<span className="text-xs font-semibold text-slate-700">Trạng thái mới</span>}
          rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
        >
          <Select
            onChange={handleStatusChange}
            options={[
              { value: 'active', label: 'Hoạt động (Kích hoạt)' },
              { value: 'pending_payment', label: 'Chờ thanh toán' },
              { value: 'cancelled', label: 'Hủy đơn đăng ký' },
              { value: 'expired', label: 'Hết hạn gói' },
            ]}
          />
        </Form.Item>

        {/* Lý do hủy nếu chọn trạng thái 'cancelled' */}
        {currentStatus === 'cancelled' && (
          <Form.Item
            name="cancelReason"
            label={<span className="text-xs font-semibold text-slate-700">Lý do hủy</span>}
            rules={[{ required: true, message: 'Vui lòng nhập lý do hủy' }]}
          >
            <Input.TextArea
              rows={3}
              placeholder="Nhập lý do hủy gói hội viên..."
              className="rounded-lg"
            />
          </Form.Item>
        )}

        {/* Thay đổi ngày hết hạn (Gia hạn/điều chỉnh) */}
        <Form.Item
          name="endDate"
          label={<span className="text-xs font-semibold text-slate-700">Ngày hết hạn gói</span>}
        >
          <DatePicker
            showTime
            format="DD/MM/YYYY HH:mm"
            className="w-full rounded-lg"
            placeholder="Chọn ngày hết hạn..."
          />
        </Form.Item>

        {/* Actions */}
        <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100 mt-6">
          <Button onClick={onClose} disabled={submitting}>
            Hủy
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={submitting}
            className="bg-sky-500 hover:bg-sky-600 shadow-none font-medium"
          >
            Cập nhật
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default FormUpdateStatus;
