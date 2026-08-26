import { useEffect, useState } from 'react';
import { Drawer, Form, Input, InputNumber, Switch, Button, Select } from 'antd';
import type { FeaturePayload, SystemFeatureCode } from '../types';
import { fetchSystemFeatureCodesApi } from '../api';

interface FormCreateProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (values: FeaturePayload) => Promise<boolean>;
  isLoading: boolean;
}

const FormCreate = ({ isOpen, onClose, onSave, isLoading }: FormCreateProps) => {
  const [form] = Form.useForm();
  const [systemCodes, setSystemCodes] = useState<SystemFeatureCode[]>([]);
  const [loadingCodes, setLoadingCodes] = useState(false);

  useEffect(() => {
    if (isOpen) {
      form.resetFields();
      form.setFieldsValue({
        sortOrder: 0,
        isActive: true,
      });

      // Fetch system feature codes when opening the drawer
      const loadSystemCodes = async () => {
        try {
          setLoadingCodes(true);
          const codes = await fetchSystemFeatureCodesApi();
          setSystemCodes(codes);
        } catch (error) {
          console.error('Không thể lấy danh sách mã hệ thống:', error);
        } finally {
          setLoadingCodes(false);
        }
      };

      loadSystemCodes();
    }
  }, [isOpen, form]);

  const handleCodeSelect = (selectedCode: string) => {
    const matched = systemCodes.find((item) => item.code === selectedCode);
    if (matched) {
      form.setFieldsValue({
        name: matched.name,
        description: matched.description,
      });
    }
  };

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
          label={<span className="font-semibold text-slate-700">Mã tính năng (System Key)</span>}
          rules={[
            { required: true, message: 'Vui lòng chọn hoặc nhập mã tính năng!' },
          ]}
          tooltip="Mã định danh hệ thống chuẩn dùng để kiểm tra phân quyền trong Backend (VD: blog:read_premium)."
        >
          <Select
            showSearch
            loading={loadingCodes}
            placeholder="Chọn hoặc gõ mã tính năng (VD: blog:read_premium)"
            className="rounded-xl font-mono"
            onChange={handleCodeSelect}
            options={systemCodes.map((sc) => ({
              label: `${sc.code} - ${sc.name}${sc.isCreated ? ' (Đã tạo)' : ''}`,
              value: sc.code,
              disabled: sc.isCreated,
            }))}
          />
        </Form.Item>

        <Form.Item
          name="name"
          label={<span className="font-semibold text-slate-700">Tên hiển thị</span>}
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
