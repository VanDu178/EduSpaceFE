import { Form, Input, Button, Card } from 'antd';
import { EnvelopeIcon, LockClosedIcon, UserIcon } from '@heroicons/react/24/outline';
import { useNavigate, Link } from 'react-router-dom';
import { useRegisterMutation } from '../hooks';
import type { RegisterPayload } from '../types';
import { handleApiError } from '../../../utils/errorHandler';

interface RegisterFormValues extends RegisterPayload {
  confirmPassword?: string;
}

const Register = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  // Khởi tạo register mutation hook
  const registerMutation = useRegisterMutation(
    () => {
      navigate('/login');
    },
    (err) => {
      handleApiError(err, { form });
    }
  );

  const onFinish = (values: RegisterFormValues) => {
    registerMutation.mutate({
      email: values?.email,
      password: values?.password,
      name: values?.name
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
            Tạo Tài Khoản
          </h2>
          <p className="text-slate-400 mt-2 text-sm">Đăng ký tài khoản quản trị viên mới cho EduSpace</p>
        </div>

        <Form
          form={form}
          name="register_form"
          layout="vertical"
          onFinish={onFinish}
          size="large"
          className="space-y-4"
        >
          <Form.Item
            name="name"
            rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}
          >
            <Input
              prefix={<UserIcon className="h-5 w-5 text-slate-400" />}
              placeholder="Họ và tên"
              className="bg-slate-800/50 border-slate-700 text-slate-200 placeholder-slate-500 hover:border-blue-500 focus:border-blue-500 rounded-lg"
            />
          </Form.Item>

          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Vui lòng nhập Email!' },
              { type: 'email', message: 'Email không hợp lệ!' }
            ]}
          >
            <Input
              prefix={<EnvelopeIcon className="h-5 w-5 text-slate-400" />}
              placeholder="Email quản trị"
              className="bg-slate-800/50 border-slate-700 text-slate-200 placeholder-slate-500 hover:border-blue-500 focus:border-blue-500 rounded-lg"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: 'Vui lòng nhập mật khẩu!' },
              { min: 6, message: 'Mật khẩu phải chứa ít nhất 6 ký tự!' }
            ]}
          >
            <Input.Password
              prefix={<LockClosedIcon className="h-5 w-5 text-slate-400" />}
              placeholder="Mật khẩu"
              className="bg-slate-800/50 border-slate-700 text-slate-200 placeholder-slate-500 hover:border-blue-500 focus:border-blue-500 rounded-lg"
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            dependencies={['password']}
            rules={[
              { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockClosedIcon className="h-5 w-5 text-slate-400" />}
              placeholder="Xác nhận mật khẩu"
              className="bg-slate-800/50 border-slate-700 text-slate-200 placeholder-slate-500 hover:border-blue-500 focus:border-blue-500 rounded-lg"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={registerMutation.isPending}
              className="w-full h-12 bg-gradient-to-r from-blue-500 to-indigo-600 border-none hover:from-blue-600 hover:to-indigo-700 text-white font-semibold rounded-lg transition-all duration-300"
            >
              Đăng Ký Tài Khoản
            </Button>
          </Form.Item>
        </Form>

        <div className="text-center mt-6 text-slate-400 text-sm">
          Đã có tài khoản quản trị?{' '}
          <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
            Đăng nhập
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default Register;
