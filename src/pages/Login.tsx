import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Kiểm tra xem đã đăng nhập chưa
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      navigate('/admin');
    }
  }, [navigate]);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const response = await api.post('/auth/login', {
        email: values.email,
        password: values.password
      });

      if (response.data.success) {
        message.success('Đăng nhập hệ thống thành công!');
        
        // Lưu access token và thông tin user vào localStorage
        localStorage.setItem('accessToken', response.data.data.accessToken);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
        
        // Chuyển hướng đến trang quản trị
        navigate('/admin');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      const errMsg = error.response?.data?.message || 'Đã xảy ra lỗi, vui lòng thử lại sau!';
      message.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-radial from-[#1e293b] to-[#0f172a] px-4">
      {/* Background decoration elements */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob delay-2000"></div>

      <Card className="w-full max-w-md shadow-2xl border border-slate-700/50 bg-slate-900/80 backdrop-blur-md rounded-2xl text-slate-100">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400 tracking-tight">
            EduSpace Admin
          </h2>
          <p className="text-slate-400 mt-2 text-sm">Đăng nhập vào bảng điều khiển hệ thống quản trị</p>
        </div>

        <Form
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
              prefix={<MailOutlined className="text-slate-400" />} 
              placeholder="Email quản trị viên" 
              className="bg-slate-800/50 border-slate-700 text-slate-200 placeholder-slate-500 hover:border-blue-500 focus:border-blue-500 rounded-lg"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-slate-400" />}
              placeholder="Mật khẩu"
              className="bg-slate-800/50 border-slate-700 text-slate-200 placeholder-slate-500 hover:border-blue-500 focus:border-blue-500 rounded-lg"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className="w-full h-12 bg-gradient-to-r from-blue-500 to-indigo-600 border-none hover:from-blue-600 hover:to-indigo-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-indigo-500/30 transition-all duration-300"
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
