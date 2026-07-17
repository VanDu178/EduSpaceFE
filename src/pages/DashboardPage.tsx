import { useState, useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import type { User } from '../features/users/types';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { useLogoutMutation } from '../features/auth/hooks';

const DashboardPage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(() => {
    return localStorage.getItem('sidebar_collapsed') === 'true';
  });
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

  const handleToggleSidebar = () => {
    setIsSidebarCollapsed(prev => {
      const nextVal = !prev;
      localStorage.setItem('sidebar_collapsed', String(nextVal));
      return nextVal;
    });
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Sidebar bên trái (Tự động nhận biết active route qua URL) */}
      <Sidebar isCollapsed={isSidebarCollapsed} onToggle={handleToggleSidebar} />

      {/* Vùng nội dung chính bên phải */}
      <div className={`flex-1 ${isSidebarCollapsed ? 'pl-20' : 'pl-64'} flex flex-col min-h-screen bg-slate-50/30 transition-all duration-300 overflow-hidden`}>
        {/* Top Navbar */}
        <Navbar user={user} onLogout={handleLogout} />

        {/* Nội dung các phân hệ route con */}
        <main className="p-5 flex-1  overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
