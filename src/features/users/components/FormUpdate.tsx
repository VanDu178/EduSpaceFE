import { useEffect } from 'react';
import { Modal, Form, Input, Select, Button } from 'antd';
import type { User } from '../types';

interface FormUpdateProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (values: any) => void;
  isLoading: boolean;
  user: User | null;
}

const FormUpdate = ({
  isOpen,
  onClose,
  onSave,
  isLoading,
  user,
}: FormUpdateProps) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (isOpen && user) {
      form.setFieldsValue({
        name: user?.name,
        email: user?.email,
        role: user?.role || 'client',
      });
    }
  }, [isOpen, user, form]);

  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        onSave(values);
      })
      .catch((info) => {
        console.warn('Validation Failed:', info);
      });
  };

  return (
    <Modal
      open={isOpen}
      title={<span className="text-lg font-bold text-slate-800">Cập nhật</span>}
      onCancel={onClose}
      footer={[
        <Button
          key="cancel"
          onClick={onClose}
          className="rounded-lg border-slate-200 hover:border-slate-300 text-slate-600 font-medium"
        >
          Hủy
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={isLoading}
          onClick={handleSubmit}
          className="rounded-lg bg-sky-600 hover:bg-sky-700 font-medium border-none"
        >
          Cập nhật
        </Button>,
      ]}
      className="max-w-md"
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        name="updateUserForm"
        className="pt-4 space-y-4"
      >
        <Form.Item
          name="name"
          label={"Họ và Tên"}
          rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}
        >
          <Input
            placeholder="Ví dụ: Nguyễn Văn A"
            className="rounded-lg py-2 border-slate-200 focus:border-sky-500 hover:border-slate-300 text-slate-800"
          />
        </Form.Item>

        <Form.Item
          name="email"
          label={"Email Đăng Ký"}
          rules={[
            { required: true, message: 'Vui lòng nhập email đăng ký!' },
            { type: 'email', message: 'Email không đúng định dạng!' },
          ]}
        >
          <Input
            placeholder="email@example.com"
            disabled
            className="rounded-lg py-2 border-slate-200 focus:border-sky-500 hover:border-slate-300 text-slate-800 disabled:bg-slate-50 disabled:text-slate-400"
          />
        </Form.Item>

        <Form.Item
          name="role"
          label={"Vai trò hệ thống"}
          rules={[{ required: true, message: 'Vui lòng chọn vai trò!' }]}
        >
          <Select
            placeholder="Chọn vai trò"
            className="w-full rounded-lg"
            options={[
              { value: 'admin', label: 'Quản trị viên' },
              { value: 'client', label: 'Khách hàng' },
            ]}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default FormUpdate;
