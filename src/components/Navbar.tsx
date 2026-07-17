import { useState, useEffect, useRef } from 'react';
import type { User } from '../features/users/types';
import { BellIcon, ChevronDownIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';

interface NavbarProps {
  user: User | null;
  onLogout: () => void;
}

const Navbar = ({ user, onLogout }: NavbarProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const getRoleLabel = (role?: string) => {
    switch (role?.toLowerCase()) {
      case 'admin':
        return 'Quản trị viên';
    }
  };

  // Đóng dropdown khi click ra ngoài vùng dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="h-16 bg-white border-b border-slate-200/80 px-8 flex items-center justify-between sticky top-0 z-30">
      <div className="flex-1"></div>

      <div className="flex items-center space-x-4">
        {/* Nút thông báo */}
        <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors duration-200 relative">
          <BellIcon className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full"></span>
        </button>

        {/* Dropdown thông tin tài khoản */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center space-x-2.5 p-1.5 hover:bg-slate-50 rounded-xl transition-all duration-200 cursor-pointer focus:outline-none"
          >
            <div className="text-right hidden sm:block">
              <p className="text-xs font-semibold text-slate-700">Chào, {user?.name || 'Quản trị viên'}</p>
              <p className="text-[10px] text-slate-400 font-medium">Hệ thống EduSpace</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm select-none shadow-sm">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
            </div>
            <ChevronDownIcon className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Floating Dropdown Card */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-100 rounded-2xl shadow-xl z-50 py-2.5 animate-in fade-in slide-in-from-top-3 duration-200">
              {/* Profile Details */}
              <div className="px-4 py-2">
                <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Tài khoản</p>
                <p className="text-sm font-bold text-slate-800 truncate mt-0.5">{user?.name || 'Quản trị viên'}</p>
                <p className="text-[11px] text-slate-500 truncate mt-0.5">{user?.email || 'admin@eduspace.vn'}</p>
                <span className="inline-flex items-center mt-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-600 border border-blue-100/50">
                  {getRoleLabel(user?.role)}
                </span>
              </div>

              <hr className="border-slate-100 my-2" />

              {/* Logout Button */}
              <div className="px-2">
                <button
                  onClick={() => {
                    setIsDropdownOpen(false);
                    onLogout();
                  }}
                  className="w-full flex items-center space-x-2 px-3 py-2 rounded-xl text-left text-sm text-red-600 hover:bg-red-50 hover:text-red-700 font-semibold transition-colors duration-150 cursor-pointer"
                >
                  <ArrowRightOnRectangleIcon className="h-4.5 w-4.5" />
                  <span>Đăng xuất</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
