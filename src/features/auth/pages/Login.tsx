import { useEffect } from 'react';
import { Form, Input, Button, Card } from 'antd';
import { EnvelopeIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import { useNavigate, Link } from 'react-router-dom';
import { useLoginMutation } from '../hooks';
import type { LoginPayload } from '../types';
import { handleApiError } from '../../../utils/errorHandler';

const Login = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  // Kiểm tra xem đã đăng nhập chưa
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      navigate('/admin');
    }
  }, [navigate]);

  // Khởi tạo login mutation hook
  const loginMutation = useLoginMutation(
    () => {
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
    <div className="min-h-screen flex items-center justify-center bg-radial from-[#1e293b] to-[#0f172a] px-4">
      {/* Background decoration elements */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob delay-2000"></div>

      <Card className="w-full max-w-md border border-slate-700/50 bg-slate-900/80 backdrop-blur-md rounded-2xl text-slate-100">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400 tracking-tight">
            EduSpace Admin
          </h2>
          <p className="text-slate-400 mt-2 text-sm">Đăng nhập vào bảng điều khiển hệ thống quản trị</p>
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
              placeholder="Email quản trị viên"
              className="bg-slate-800/50 border-slate-700 text-slate-200 placeholder-slate-500 hover:border-blue-500 focus:border-blue-500 rounded-lg"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
          >
            <Input.Password
              prefix={<LockClosedIcon className="h-5 w-5 text-slate-400" />}
              placeholder="Mật khẩu"
              className="bg-slate-800/50 border-slate-700 text-slate-200 placeholder-slate-500 hover:border-blue-500 focus:border-blue-500 rounded-lg"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loginMutation.isPending}
              className="w-full h-12 bg-gradient-to-r from-blue-500 to-indigo-600 border-none hover:from-blue-600 hover:to-indigo-700 text-white font-semibold rounded-lg transition-all duration-300"
            >
              Đăng Nhập
            </Button>
          </Form.Item>
        </Form>

        <div className="text-center mt-6 text-slate-400 text-sm">
          Chưa có tài khoản quản trị?{' '}
          <Link to="/register" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
            Đăng ký ngay
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default Login;
