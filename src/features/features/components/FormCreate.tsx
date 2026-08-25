import { useEffect } from 'react';
import { Drawer, Form, Input, InputNumber, Switch, Button } from 'antd';
import type { FeaturePayload } from '../types';

interface FormCreateProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (values: FeaturePayload) => Promise<boolean>;
  isLoading: boolean;
}

const FormCreate = ({ isOpen, onClose, onSave, isLoading }: FormCreateProps) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (isOpen) {
      form.resetFields();
      form.setFieldsValue({
        sortOrder: 0,
        isActive: true,
      });
    }
  }, [isOpen, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const success = await onSave(values);
      if (success) {
        onClose();
      }
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  return (
    <Drawer
      title={<span className="text-lg font-bold text-slate-800">Thêm mới</span>}
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
            Tạo mới
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
            { pattern: /^[A-Z0-9_]+$/, message: 'Mã tính năng chỉ gồm chữ in hoa, số và dấu gạch dưới (VD: READ_PREMIUM_BLOGS)' }
          ]}
          tooltip="Mã định danh duy nhất dùng để kiểm tra phân quyền trong code API."
        >
          <Input placeholder="Ví dụ: READ_PREMIUM_BLOGS, DOWNLOAD_DOCS..." className="rounded-xl py-2 uppercase font-mono" />
        </Form.Item>

        <Form.Item
          name="name"
          label={<span className="font-semibold text-slate-700">Tên</span>}
          rules={[{ required: true, message: 'Vui lòng nhập tên tính năng!' }]}
        >
          <Input placeholder="Ví dụ: Đọc bài viết Premium, Trợ lý AI 24/7..." className="rounded-xl py-2" />
        </Form.Item>

        <Form.Item
          name="description"
          label={<span className="font-semibold text-slate-700">Mô tả</span>}
        >
          <Input.TextArea
            rows={3}
            placeholder="Mô tả chi tiết về phạm vi và quyền lợi của tính năng này..."
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
          label={<span className="font-semibold text-slate-700">Kích hoạt ngay</span>}
        >
          <Switch className="bg-slate-300" />
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default FormCreate;
