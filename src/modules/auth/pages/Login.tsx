import { useEffect } from 'react';
import { Form, Input, Button } from 'antd';
import { EnvelopeIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import { useLoginMutation } from '../hooks';
import type { LoginPayload } from '../types';
import { handleApiError } from '../../../utils/errorHandler';
import toast from 'react-hot-toast';
import { useSocket } from '../../../config/socket/SocketContext';

const Login = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { connectSocket } = useSocket();

  // Kiểm tra xem đã đăng nhập chưa
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      navigate('/admin');
    }
  }, [navigate]);

  // Khởi tạo login mutation hook
  const loginMutation = useLoginMutation(
    (message) => {
      connectSocket();
      toast.success(message || 'Đăng nhập thành công!');
      navigate('/admin');
    },
    (err) => {
      handleApiError(err, { form });
    }
  );

  const onFinish = (values: LoginPayload) => {
    loginMutation.mutate({
      email: values.email,
      password: values.password
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 relative overflow-hidden px-4">
      {/* Ambient background decoration elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-sky-200/40 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-200/40 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob delay-2000"></div>

      <div className="w-full max-w-md bg-white border border-slate-200/80 rounded-2xl p-8 relative z-10">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
            Trade<span className="text-sky-600">Verse</span>
          </h2>
          <p className="text-slate-500 mt-1.5 text-sm">Đăng nhập vào hệ thống quản trị</p>
        </div>

        <Form
          form={form}
          name="login_form"
          layout="vertical"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          size="large"
          className="space-y-4"
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Vui lòng nhập Email!' },
              { type: 'email', message: 'Email không hợp lệ!' }
            ]}
          >
            <Input
              prefix={<EnvelopeIcon className="h-5 w-5 text-slate-400" />}
              placeholder="Email"
              className="bg-slate-50/50 border-slate-200/80 text-slate-800 placeholder-slate-400 hover:border-sky-500 focus:border-sky-500 rounded-xl py-2.5"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
          >
            <Input.Password
              prefix={<LockClosedIcon className="h-5 w-5 text-slate-400" />}
              placeholder="Mật khẩu"
              className="bg-slate-50/50 border-slate-200/80 text-slate-800 placeholder-slate-400 hover:border-sky-500 focus:border-sky-500 rounded-xl py-2.5"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loginMutation.isPending}
              className="w-full h-11 bg-sky-600 hover:bg-sky-700 border-none text-white font-semibold rounded-xl transition-all duration-200 text-sm"
            >
              Đăng Nhập
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Login;
