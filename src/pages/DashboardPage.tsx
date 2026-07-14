import { useState, useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import type { User } from '../features/users/types';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { useLogoutMutation } from '../features/auth/hooks';

const DashboardPage = () => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  // Load thông tin người dùng từ localStorage khi khởi chạy
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error('Lỗi phân tích cú pháp thông tin User:', err);
      }
    }
  }, []);

  const logoutMutation = useLogoutMutation(() => {
    navigate('/login');
  });

  // Xử lý đăng xuất hệ thống
  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Sidebar bên trái (Tự động nhận biết active route qua URL) */}
      <Sidebar />

      {/* Vùng nội dung chính bên phải */}
      <div className="flex-1 pl-64 flex flex-col min-h-screen bg-slate-50/30">
        {/* Top Navbar */}
        <Navbar user={user} onLogout={handleLogout} />

        {/* Nội dung các phân hệ route con */}
        <main className="p-5 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
