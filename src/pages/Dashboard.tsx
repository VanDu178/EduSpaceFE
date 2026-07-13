import React, { useState, useEffect } from 'react';
import { Layout, Menu, Table, Button, Modal, Form, Input, Switch, Card, Space, message, Tag, Popconfirm } from 'antd';
import { 
  LogoutOutlined, 
  PlusOutlined, 
  FileTextOutlined, 
  DashboardOutlined, 
  DeleteOutlined, 
  UserOutlined 
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const { Header, Content, Sider } = Layout;

interface Post {
  id: number;
  title: string;
  content: string | null;
  published: boolean;
  createdAt: string;
  postType: {
    name: string;
    code: string;
  };
}

const Dashboard: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  // Load user info và danh sách bài viết khi component mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const response = await api.get('/posts');
      if (response.data.success) {
        setPosts(response.data.data.posts);
      }
    } catch (error: any) {
      console.error('Fetch posts error:', error);
      message.error('Không thể lấy danh sách bài viết từ server.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async (values: any) => {
    try {
      const response = await api.post('/posts', {
        title: values.title,
        content: values.content,
        published: values.published || false
      });

      if (response.data.success) {
        message.success('Tạo bài viết mới thành công!');
        setIsModalVisible(false);
        form.resetFields();
        fetchPosts(); // Reload list
      }
    } catch (error: any) {
      console.error('Create post error:', error);
      message.error('Không thể tạo bài viết mới.');
    }
  };

  const handleDeletePost = async (id: number) => {
    try {
      const response = await api.delete(`/posts/${id}`);
      if (response.data.success) {
        message.success('Xóa bài viết thành công!');
        fetchPosts(); // Reload list
      }
    } catch (error: any) {
      console.error('Delete post error:', error);
      message.error('Không thể xóa bài viết.');
    }
  };

  const handleLogout = async () => {
    try {
      // Gọi API logout để xóa refresh token ở DB và Cookie phía Backend
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      // Bất kể API thành công hay thất bại, đều dọn dẹp localStorage và đưa về Login
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      message.success('Đăng xuất thành công!');
      navigate('/login');
    }
  };

  // Cấu hình các cột hiển thị trong Bảng bài viết
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: 'Tiêu đề bài viết',
      dataIndex: 'title',
      key: 'title',
      render: (text: string) => <span className="font-semibold text-slate-700">{text}</span>
    },
    {
      title: 'Danh mục',
      dataIndex: ['postType', 'name'],
      key: 'postTypeName',
      render: (name: string) => <Tag color="blue">{name || 'Chung'}</Tag>
    },
    {
      title: 'Nội dung tóm tắt',
      dataIndex: 'content',
      key: 'content',
      render: (content: string | null) => (
        <span className="text-slate-500">
          {content && content.length > 50 ? `${content.substring(0, 50)}...` : content || 'Không có nội dung'}
        </span>
      )
    },
    {
      title: 'Trạng thái',
      dataIndex: 'published',
      key: 'published',
      render: (published: boolean) => (
        <Tag color={published ? 'green' : 'orange'}>
          {published ? 'Đã xuất bản' : 'Bản nháp'}
        </Tag>
      )
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (dateStr: string) => new Date(dateStr).toLocaleDateString('vi-VN')
    },
    {
      title: 'Hành động',
      key: 'action',
      width: 120,
      render: (_: any, record: Post) => (
        <Popconfirm
          title="Bạn có chắc chắn muốn xóa bài đăng này?"
          onConfirm={() => handleDeletePost(record.id)}
          okText="Có"
          cancelText="Không"
          okButtonProps={{ danger: true }}
        >
          <Button 
            type="text" 
            danger 
            icon={<DeleteOutlined />} 
            className="hover:bg-red-50 rounded-md"
          >
            Xóa
          </Button>
        </Popconfirm>
      )
    }
  ];

  return (
    <Layout className="min-h-screen bg-slate-100">
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        className="shadow-xl bg-slate-900 border-r border-slate-800"
        width={240}
        theme="dark"
      >
        <div className="h-16 flex items-center justify-center border-b border-slate-800 px-4">
          <span className="text-xl font-bold text-white tracking-wide">
            EduSpace Panel
          </span>
        </div>
        
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['posts']}
          className="bg-slate-900 mt-4 text-slate-300"
          items={[
            {
              key: 'dashboard',
              icon: <DashboardOutlined />,
              label: 'Tổng quan',
            },
            {
              key: 'posts',
              icon: <FileTextOutlined />,
              label: 'Quản lý Bài đăng',
            }
          ]}
        />

        <div className="absolute bottom-4 left-0 right-0 px-4">
          <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700 flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2 overflow-hidden">
              <UserOutlined className="text-slate-400 text-lg flex-shrink-0" />
              <div className="text-left text-xs overflow-hidden">
                <p className="text-slate-200 font-medium truncate">{user?.name || 'Admin'}</p>
                <p className="text-slate-400 truncate">{user?.email || 'admin@eduspace.vn'}</p>
              </div>
            </div>
          </div>
          <Button 
            type="primary" 
            danger 
            icon={<LogoutOutlined />} 
            onClick={handleLogout}
            className="w-full flex items-center justify-center h-10 rounded-lg"
          >
            Đăng Xuất
          </Button>
        </div>
      </Sider>

      <Layout className="bg-slate-50">
        <Header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-6 shadow-sm">
          <h1 className="text-lg font-bold text-slate-800">Danh Sách Bài Đăng</h1>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsModalVisible(true)}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 border-none hover:from-blue-600 hover:to-indigo-700 font-semibold rounded-lg shadow-md hover:shadow-indigo-500/20"
          >
            Tạo bài đăng mới
          </Button>
        </Header>

        <Content className="p-6">
          <Card className="shadow-md border-slate-200/60 rounded-xl overflow-hidden">
            <Table
              dataSource={posts}
              columns={columns}
              rowKey="id"
              loading={loading}
              pagination={{ pageSize: 8 }}
              className="text-slate-600"
            />
          </Card>
        </Content>
      </Layout>

      {/* Modal tạo bài đăng mới */}
      <Modal
        title={<span className="text-lg font-bold text-slate-800">Thêm Bài Viết Mới</span>}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
        }}
        footer={null}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreatePost}
          className="mt-4 space-y-4"
        >
          <Form.Item
            name="title"
            label="Tiêu đề"
            rules={[{ required: true, message: 'Vui lòng nhập tiêu đề bài viết!' }]}
          >
            <Input placeholder="Nhập tiêu đề" className="rounded-lg" />
          </Form.Item>

          <Form.Item
            name="content"
            label="Nội dung"
          >
            <Input.TextArea rows={4} placeholder="Nhập nội dung bài viết..." className="rounded-lg" />
          </Form.Item>

          <Form.Item
            name="published"
            label="Xuất bản ngay"
            valuePropName="checked"
            initialValue={false}
          >
            <Switch />
          </Form.Item>

          <Form.Item className="text-right mb-0">
            <Space>
              <Button onClick={() => setIsModalVisible(false)} className="rounded-lg">Hủy</Button>
              <Button type="primary" htmlType="submit" className="rounded-lg bg-blue-600">
                Tạo mới
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
};

export default Dashboard;
