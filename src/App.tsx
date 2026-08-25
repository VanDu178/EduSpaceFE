import { Toaster } from 'react-hot-toast';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import Login from './features/auth/pages/Login';
import DashboardPage from './pages/DashboardPage';
import ListPage from './features/blogs/pages';
import CreatePage from './features/blogs/pages/CreatePage';
import UpdatePage from './features/blogs/pages/UpdatePage';
import DetailPage from './features/blogs/pages/DetailPage';
import UserListPage from './features/users/pages';
import { MembershipPlanListPage } from './features/membershipPlans';
import { FeatureListPage } from './features/features';
import { SubscriptionListPage } from './features/subscriptions';
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
            {/* Mặc định chuyển hướng sang /admin/blogs */}
            <Route index element={<Navigate to="blogs" replace />} />

            {/* Điều hướng bài blog */}
            <Route path="blogs" element={<ListPage />} />
            <Route path="blogs/create" element={<CreatePage />} />
            <Route path="blogs/:id" element={<DetailPage />} />
            <Route path="blogs/:id/edit" element={<UpdatePage />} />

            {/* Fallback route cũ /admin/posts chuyển sang /admin/blogs */}
            <Route path="posts/*" element={<Navigate to="/admin/blogs" replace />} />

            {/* Phân hệ route con quản lý người dùng */}
            <Route path="users" element={<UserListPage />} />

            {/* Phân hệ route con quản lý gói hội viên */}
            <Route path="membership-plans" element={<MembershipPlanListPage />} />

            {/* Phân hệ route con quản lý tính năng */}
            <Route path="features" element={<FeatureListPage />} />

            {/* Phân hệ route con quản lý lịch sử thanh toán */}
            <Route path="subscriptions" element={<SubscriptionListPage />} />
          </Route>

          {/* Redirect mặc định về /admin nếu gõ sai route */}
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  );
};

export default App;

