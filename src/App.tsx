import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './features/auth/pages/Login';
import Register from './features/auth/pages/Register';
import DashboardPage from './pages/DashboardPage';
import PostManagementPage from './features/posts/pages/PostManagementPage';
import PostCreatePage from './features/posts/pages/PostCreatePage';
import PostEditPage from './features/posts/pages/PostEditPage';
import PostDetailPage from './features/posts/pages/PostDetailPage';
import UserManagementPage from './features/users/pages/UserManagementPage';
import PrivateRoute from './components/PrivateRoute';
import './App.css';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Route đăng nhập công khai */}
        <Route path="/login" element={<Login />} />
        
        {/* Route đăng ký công khai */}
        <Route path="/register" element={<Register />} />
        
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
          <Route path="posts" element={<PostManagementPage />} />
          <Route path="posts/create" element={<PostCreatePage />} />
          <Route path="posts/:id" element={<PostDetailPage />} />
          <Route path="posts/:id/edit" element={<PostEditPage />} />
          
          {/* Phân hệ route con quản lý người dùng */}
          <Route path="users" element={<UserManagementPage />} />
        </Route>

        {/* Redirect mặc định về /admin nếu gõ sai route */}
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
