import { Toaster } from 'react-hot-toast';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import Login from './features/auth/pages/Login';
import DashboardPage from './pages/DashboardPage';
import ListPage from './features/posts/pages';
import CreatePage from './features/posts/pages/CreatePage';
import UpdatePage from './features/posts/pages/UpdatePage';
import DetailPage from './features/posts/pages/DetailPage';
import UserListPage from './features/users/pages';
import PrivateRoute from './components/PrivateRoute';

const App = () => {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#0ea5e9',
          colorLink: '#0284c7',
          colorLinkHover: '#0ea5e9',
          borderRadius: 8,
        },
      }}
    >
      <Toaster position="top-right" reverseOrder={false} />
      <BrowserRouter>
        <Routes>
          {/* Route đăng nhập công khai */}
          <Route path="/login" element={<Login />} />
          {/* Route quản trị được bảo vệ dạng lồng nhau (Nested Routes) */}
          <Route
            path="/admin"
            element={
              <PrivateRoute>
                <DashboardPage />
              </PrivateRoute>
            }
          >
            {/* Mặc định chuyển hướng sang /admin/posts */}
            <Route index element={<Navigate to="posts" replace />} />

            {/* Các phân hệ route con quản lý bài viết */}
            <Route path="posts" element={<ListPage />} />
            <Route path="posts/create" element={<CreatePage />} />
            <Route path="posts/:id" element={<DetailPage />} />
            <Route path="posts/:id/edit" element={<UpdatePage />} />

            {/* Phân hệ route con quản lý người dùng */}
            <Route path="users" element={<UserListPage />} />
          </Route>

          {/* Redirect mặc định về /admin nếu gõ sai route */}
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  );
};

export default App;
