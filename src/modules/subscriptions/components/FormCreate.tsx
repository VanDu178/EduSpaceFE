import { useEffect, useState } from 'react';
import { Modal, Form, Select, Input, Switch, Button } from 'antd';
import type { CreateSubscriptionPayload, BillingCycle, SubscriptionStatus } from '../types';
import { PAYMENT_METHOD_OPTIONS } from '../constants';
import { PAYMENT_METHOD_CODES } from '../../paymentMethods/constants';
import { fetchUsersApi } from '../../users/api';
import { fetchMembershipPlansApi } from '../../membershipPlans/api';
import type { User } from '../../users/types';
import type { MembershipPlan } from '../../membershipPlans/types';
import { formatCurrency } from '../../../utils/format';

interface FormCreateProps {
  open: boolean;
  submitting: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateSubscriptionPayload) => Promise<boolean>;
}

const FormCreate = ({ open, submitting, onClose, onSubmit }: FormCreateProps) => {
  const [form] = Form.useForm();
  const [users, setUsers] = useState<User[]>([]);
  const [plans, setPlans] = useState<MembershipPlan[]>([]);
  const [loadingData, setLoadingData] = useState<boolean>(false);

  useEffect(() => {
    if (open) {
      form.resetFields();

      // Load danh sách người dùng và danh sách gói hội viên để hiển thị Dropdown
      const loadOptions = async () => {
        setLoadingData(true);
        try {
          const [usersRes, plansRes] = await Promise.all([
            fetchUsersApi({ page: 1, limit: 100 }),
            fetchMembershipPlansApi({ isActive: 'true' }),
          ]);

          if (usersRes?.users) {
            setUsers(usersRes.users);
          }
          if (Array.isArray(plansRes)) {
            setPlans(plansRes);
          }
        } catch (err) {
          console.error('Lỗi tải danh sách người dùng / gói hội viên:', err);
        } finally {
          setLoadingData(false);
        }
      };

      loadOptions();
    }
  }, [open, form]);

  const handleFinish = async (values: any) => {
    const payload: CreateSubscriptionPayload = {
      userId: values.userId ? Number(values.userId) : undefined,
      planId: Number(values.planId),
      billingCycle: values.billingCycle as BillingCycle,
      paymentMethod: values.paymentMethod,
      paymentRef: values.paymentRef ? String(values.paymentRef).trim() : undefined,
      status: values.status as SubscriptionStatus,
      autoRenew: Boolean(values.autoRenew),
    };

    const success = await onSubmit(payload);
    if (success) {
      onClose();
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      title={<span className="text-base font-semibold text-slate-800">Thêm mới</span>}
      width={560}
      className="top-8"
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={{
          billingCycle: 'monthly',
          paymentMethod: PAYMENT_METHOD_CODES.VIETQR,
          status: 'active',
          autoRenew: false,
        }}
        className="pt-3"
        requiredMark="optional"
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
              label: `${p.name} - Thường: ${formatCurrency(p.monthlyPrice)} / Năm: ${formatCurrency(p.yearlyPrice)}`,
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
                { value: 'yearly', label: 'Hàng năm (Ưu đãi)' },
              ]}
            />
          </Form.Item>

          {/* Trạng thái ban đầu */}
          <Form.Item
            name="status"
            label={<span className="text-xs font-semibold text-slate-700">Trạng thái ban đầu</span>}
            rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
          >
            <Select
              options={[
                { value: 'active', label: 'Hoạt động (Kích hoạt ngay)' },
                { value: 'pending_payment', label: 'Chờ thanh toán' },
              ]}
            />
          </Form.Item>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Phương thức thanh toán */}
          <Form.Item
            name="paymentMethod"
            label={<span className="text-xs font-semibold text-slate-700">Phương thức thanh toán</span>}
          >
            <Select options={PAYMENT_METHOD_OPTIONS} />
          </Form.Item>

          {/* Mã tham chiếu / giao dịch */}
          <Form.Item
            name="paymentRef"
            label={<span className="text-xs font-semibold text-slate-700">Mã giao dịch (Nếu có)</span>}
          >
            <Input placeholder="Ví dụ: FT2308239912..." />
          </Form.Item>
        </div>

        {/* Tự động gia hạn */}
        <Form.Item
          name="autoRenew"
          valuePropName="checked"
          className="mb-4"
        >
          <div className="flex items-center space-x-3 bg-slate-50 border border-slate-100 p-3 rounded-lg">
            <Switch id="autoRenewSwitch" />
            <label htmlFor="autoRenewSwitch" className="text-xs text-slate-600 font-medium cursor-pointer">
              Tự động gia hạn khi hết hạn gói
            </label>
          </div>
        </Form.Item>

        {/* Footer Actions */}
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
            Thêm mới
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default FormCreate;
