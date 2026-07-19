import { useEffect } from 'react';
import { Modal, Form, Input, Select, Button } from 'antd';

interface FormCreateProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (values: any) => void;
  isLoading: boolean;
}

const FormCreate = ({
  isOpen,
  onClose,
  onSave,
  isLoading,
}: FormCreateProps) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (isOpen) {
      form.resetFields();
    }
  }, [isOpen, form]);

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
      title={<span className="text-lg font-bold text-slate-800">Thêm mới</span>}
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
          className="rounded-lg bg-blue-600 hover:bg-blue-700 font-medium border-none"
        >
          Thêm mới
        </Button>,
      ]}
      className="max-w-md"
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        name="createUserForm"
        className="pt-4 space-y-4"
        initialValues={{ role: 'client' }}
      >
        <Form.Item
          name="name"
          label={<span className="font-semibold text-slate-700 text-xs">Họ và Tên</span>}
          rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}
        >
          <Input
            placeholder="Ví dụ: Nguyễn Văn A"
            className="rounded-lg py-2 border-slate-200 focus:border-blue-500 hover:border-slate-300 text-slate-800"
          />
        </Form.Item>

        <Form.Item
          name="email"
          label={<span className="font-semibold text-slate-700 text-xs">Email Đăng Ký</span>}
          rules={[
            { required: true, message: 'Vui lòng nhập email đăng ký!' },
            { type: 'email', message: 'Email không đúng định dạng!' },
          ]}
        >
          <Input
            placeholder="email@example.com"
            className="rounded-lg py-2 border-slate-200 focus:border-blue-500 hover:border-slate-300 text-slate-800"
          />
        </Form.Item>

        <Form.Item
          name="password"
          label={<span className="font-semibold text-slate-700 text-xs">Mật khẩu</span>}
          rules={[
            { required: true, message: 'Vui lòng nhập mật khẩu đăng nhập!' },
            { min: 6, message: 'Mật khẩu phải dài ít nhất 6 ký tự!' },
          ]}
        >
          <Input.Password
            placeholder="Nhập ít nhất 6 ký tự"
            className="rounded-lg py-2 border-slate-200 focus:border-blue-500 hover:border-slate-300 text-slate-800"
          />
        </Form.Item>

        <Form.Item
          name="role"
          label={<span className="font-semibold text-slate-700 text-xs">Vai trò hệ thống</span>}
          rules={[{ required: true, message: 'Vui lòng chọn vai trò!' }]}
        >
          <Select
            placeholder="Chọn vai trò"
            className="w-full rounded-lg"
            options={[
              { value: 'client', label: 'Khách hàng (Client)' },
              { value: 'admin', label: 'Quản trị viên (Admin)' },
            ]}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default FormCreate;
