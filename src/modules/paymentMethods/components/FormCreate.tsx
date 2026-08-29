import { useEffect } from 'react';
import { Drawer, Form, Input, InputNumber, Switch, Button, Select } from 'antd';
import type { CreatePaymentMethodDto, PaymentMethod } from '../types';
import { PAYMENT_METHODS, PAYMENT_ICON_OPTIONS } from '../constants';
import PaymentMethodIcon from './PaymentMethodIcon';

interface FormCreateProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: CreatePaymentMethodDto) => void;
  loading: boolean;
  existingMethods?: PaymentMethod[];
}

const FormCreate = ({ visible, onCancel, onSubmit, loading, existingMethods = [] }: FormCreateProps) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible) {
      form.resetFields();
    }
  }, [visible, form]);

  const handleSelectCode = (selectedCode: string) => {
    const item = PAYMENT_METHODS[selectedCode as keyof typeof PAYMENT_METHODS];
    if (item) {
      form.setFieldsValue({
        name: item.name,
        description: item.description,
        icon: item.icon,
        sortOrder: item.sortOrder,
        isActive: item.isActive,
      });
    }
  };

  const handleFinish = (values: any) => {
    onSubmit({
      code: String(values.code).toUpperCase(),
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

  const existingCodes = existingMethods.map((m) => m.code?.toUpperCase());
  const existingIcons = existingMethods.map((m) => m.icon);

  const paymentOptions = Object.values(PAYMENT_METHODS).map((item) => {
    const isCodeUsed = existingCodes.includes(item.code.toUpperCase());
    return {
      value: item.code,
      label: isCodeUsed ? `${item.name} (Đã tồn tại)` : item.name,
      disabled: isCodeUsed,
    };
  });

  const iconOptions = PAYMENT_ICON_OPTIONS.map((opt) => {
    const isIconUsed = existingIcons.includes(opt.value);
    return {
      value: opt.value,
      label: (
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center space-x-2">
            <PaymentMethodIcon iconName={opt.value} className="h-4 w-4 text-sky-600 shrink-0" />
            <span>{opt.label}</span>
          </div>
          {isIconUsed && <span className="text-xs italic text-slate-400 font-normal ml-2">(Đã sử dụng)</span>}
        </div>
      ),
      disabled: isIconUsed,
    };
  });

  return (
    <Drawer
      title={<span className="text-lg font-bold text-slate-800">Thêm mới</span>}
      placement="right"
      width={420}
      open={visible}
      onClose={handleClose}
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
          label={<span className="text-xs font-semibold text-slate-700">Mã phương thức</span>}
          name="code"
          rules={[{ required: true, message: 'Vui lòng chọn mã phương thức thanh toán' }]}
        >
          <Select
            placeholder="Chọn mã phương thức (VIETQR, CREDIT_CARD, E_WALLET...)"
            onChange={handleSelectCode}
            options={paymentOptions}
            className="w-full text-sm font-mono"
          />
        </Form.Item>

        <Form.Item
          label={<span className="text-xs font-semibold text-slate-700">Tên</span>}
          name="name"
          rules={[{ required: true, message: 'Vui lòng nhập tên' }]}
        >
          <Input placeholder="ví dụ: Chuyển khoản QR (VietQR)" className="rounded-xl py-2" />
        </Form.Item>

        <Form.Item label={<span className="text-xs font-semibold text-slate-700">Mô tả</span>} name="description">
          <Input.TextArea placeholder="Nhập mô tả phương thức thanh toán..." rows={3} className="rounded-xl" />
        </Form.Item>

        <Form.Item
          label={<span className="text-xs font-semibold text-slate-700">Icon</span>}
          name="icon"
          rules={[{ required: true, message: 'Vui lòng chọn icon' }]}
        >
          <Select
            placeholder="Chọn icon phương thức thanh toán"
            options={iconOptions}
            className="w-full text-sm"
          />
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
