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
          className="rounded-lg bg-sky-600 hover:bg-sky-700 font-medium border-none"
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
            className="rounded-lg py-2 border-slate-200 focus:border-sky-500 hover:border-slate-300 text-slate-800"
          />
        </Form.Item>

        <Form.Item
          name="password"
          label={"Mật khẩu"}
          rules={[
            { required: true, message: 'Vui lòng nhập mật khẩu đăng nhập!' },
            { min: 8, message: 'Mật khẩu phải dài ít nhất 8 ký tự!' },
          ]}
        >
          <Input.Password
            placeholder="Nhập ít nhất 8 ký tự"
            className="rounded-lg py-2 border-slate-200 focus:border-sky-500 hover:border-slate-300 text-slate-800"
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
    </Modal >
  );
};

export default FormCreate;
