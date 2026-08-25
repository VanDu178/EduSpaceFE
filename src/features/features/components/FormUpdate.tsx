import { useEffect } from 'react';
import { Drawer, Form, Input, InputNumber, Switch, Button } from 'antd';
import type { Feature, FeaturePayload } from '../types';

interface FormUpdateProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: number, values: FeaturePayload) => Promise<boolean>;
  isLoading: boolean;
  feature: Feature | null;
}

const FormUpdate = ({ isOpen, onClose, onSave, isLoading, feature }: FormUpdateProps) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (isOpen && feature) {
      form.setFieldsValue({
        code: feature.code,
        name: feature.name,
        description: feature.description || '',
        sortOrder: feature.sortOrder ?? 0,
        isActive: feature.isActive,
      });
    } else {
      form.resetFields();
    }
  }, [isOpen, feature, form]);

  const handleSubmit = async () => {
    try {
      if (!feature) return;
      const values = await form.validateFields();
      const success = await onSave(feature.id, values);
      if (success) {
        onClose();
      }
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  return (
    <Drawer
      title={<span className="text-lg font-bold text-slate-800">Cập nhật</span>}
      placement="right"
      width={480}
      open={isOpen}
      onClose={onClose}
      destroyOnClose
      footer={
        <div className="flex justify-end space-x-3 py-2 px-2">
          <Button onClick={onClose} className="rounded-xl">
            Hủy
          </Button>
          <Button
            type="primary"
            onClick={handleSubmit}
            loading={isLoading}
            className="bg-sky-500 hover:bg-sky-600 border-none rounded-xl font-medium"
          >
            Cập nhật
          </Button>
        </div>
      }
    >
      <Form
        form={form}
        layout="vertical"
        className="space-y-4"
      >
        <Form.Item
          name="code"
          label={<span className="font-semibold text-slate-700">Mã</span>}
          rules={[
            { required: true, message: 'Vui lòng nhập mã tính năng!' },
            { pattern: /^[A-Z0-9_]+$/, message: 'Mã tính năng chỉ gồm chữ in hoa, số và dấu gạch dưới' }
          ]}
        >
          <Input placeholder="READ_PREMIUM_BLOGS..." className="rounded-xl py-2 uppercase font-mono" />
        </Form.Item>

        <Form.Item
          name="name"
          label={<span className="font-semibold text-slate-700">Tên</span>}
          rules={[{ required: true, message: 'Vui lòng nhập tên tính năng!' }]}
        >
          <Input placeholder="Tên tính năng..." className="rounded-xl py-2" />
        </Form.Item>

        <Form.Item
          name="description"
          label={<span className="font-semibold text-slate-700">Mô tả</span>}
        >
          <Input.TextArea
            rows={3}
            placeholder="Mô tả chi tiết tính năng..."
            className="rounded-xl py-2"
          />
        </Form.Item>

        <Form.Item
          name="sortOrder"
          label={<span className="font-semibold text-slate-700">Thứ tự sắp xếp</span>}
          rules={[{ required: true, message: 'Vui lòng nhập thứ tự sắp xếp!' }]}
          tooltip="Thứ tự hiển thị (số nhỏ hơn đứng trước)."
        >
          <InputNumber min={0} className="w-full rounded-xl py-1" placeholder="0" />
        </Form.Item>

        <Form.Item
          name="isActive"
          valuePropName="checked"
          label={<span className="font-semibold text-slate-700">Trạng thái kích hoạt</span>}
        >
          <Switch className="bg-slate-300" />
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default FormUpdate;
