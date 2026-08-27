import { useEffect } from 'react';
import { Drawer, Form, Input, InputNumber, Switch, Button } from 'antd';
import type { CreatePaymentMethodDto } from '../types';

interface FormCreateProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: CreatePaymentMethodDto) => void;
  loading: boolean;
}

const FormCreate = ({ visible, onCancel, onSubmit, loading }: FormCreateProps) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible) {
      form.resetFields();
    }
  }, [visible, form]);

  const handleFinish = (values: any) => {
    onSubmit({
      code: values.code,
      name: values.name,
      description: values.description,
      icon: values.icon,
      sortOrder: values.sortOrder || 0,
      isActive: values.isActive ?? true,
    });
    form.resetFields();
  };

  const handleClose = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Drawer
      title={<span className="text-lg font-bold text-slate-800">Thêm mới</span>}
      placement="right"
      width={420}
      open={visible}
      onClose={handleClose}
      destroyOnClose
      footer={
        <div className="flex justify-end space-x-3 py-2 px-2">
          <Button onClick={handleClose} className="rounded-xl border-slate-200 text-sm font-medium">
            Hủy
          </Button>
          <Button
            type="primary"
            onClick={() => form.submit()}
            loading={loading}
            className="bg-sky-500 hover:bg-sky-600 border-none rounded-xl text-sm font-semibold py-1.5 px-4"
          >
            Thêm mới
          </Button>
        </div>
      }
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={{
          sortOrder: 0,
          isActive: true,
        }}
        className="space-y-4"
      >
        <Form.Item
          label={<span className="text-xs font-semibold text-slate-700">Mã</span>}
          name="code"
          rules={[
            { required: true, message: 'Vui lòng nhập mã phương thức thanh toán' },
            { pattern: /^[a-z0-9_]+$/, message: 'Mã chỉ bao gồm chữ cái thường, số và dấu gạch dưới' },
          ]}
        >
          <Input placeholder="ví dụ: vietqr, credit_card, e_wallet" className="rounded-xl py-2" />
        </Form.Item>

        <Form.Item
          label={<span className="text-xs font-semibold text-slate-700">Tên hiển thị</span>}
          name="name"
          rules={[{ required: true, message: 'Vui lòng nhập tên hiển thị' }]}
        >
          <Input placeholder="ví dụ: Chuyển khoản QR (VietQR)" className="rounded-xl py-2" />
        </Form.Item>

        <Form.Item label={<span className="text-xs font-semibold text-slate-700">Mô tả</span>} name="description">
          <Input.TextArea placeholder="Nhập mô tả phương thức thanh toán..." rows={3} className="rounded-xl" />
        </Form.Item>

        <Form.Item
          label={<span className="text-xs font-semibold text-slate-700">Icon</span>}
          name="icon"
          rules={[{ required: true, message: 'Vui lòng nhập tên icon' }]}
          tooltip="Tên icon từ thư viện Heroicons v2 (vd: QrCodeIcon, CreditCardIcon, WalletIcon)"
        >
          <Input placeholder="ví dụ: QrCodeIcon" className="rounded-xl py-2" />
        </Form.Item>

        <div className="flex items-center justify-between pt-2">
          <Form.Item label={<span className="text-xs font-semibold text-slate-700">Thứ tự sắp xếp</span>} name="sortOrder" className="mb-0">
            <InputNumber min={0} className="w-32 rounded-xl" />
          </Form.Item>

          <Form.Item label={<span className="text-xs font-semibold text-slate-700">Trạng thái</span>} name="isActive" valuePropName="checked" className="mb-0">
            <Switch />
          </Form.Item>
        </div>
      </Form>
    </Drawer>
  );
};

export default FormCreate;
