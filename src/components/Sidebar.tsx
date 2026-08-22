import { Link, useLocation } from 'react-router-dom';
import { DocumentTextIcon, UsersIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { Tooltip } from 'antd';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const Sidebar = ({ isCollapsed, onToggle }: SidebarProps) => {
  const location = useLocation();

  // Xác định active menu dựa trên đường dẫn URL hiện tại
  const isPostsActive = location.pathname.includes('/admin/posts');
  const isUsersActive = location.pathname.includes('/admin/users');

  return (
    <aside className={`${isCollapsed ? 'w-20' : 'w-64'} bg-white border-r border-slate-200/80 text-slate-500 flex flex-col h-screen fixed left-0 top-0 z-20 transition-all duration-300`}>
      {/* Toggle button - floating on the border */}
      <button
        onClick={onToggle}
        className="absolute -right-3.5 top-20 w-7 h-7 bg-white border border-slate-200/80 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-50 cursor-pointer z-50 transition-all duration-200 active:scale-95"
        title={isCollapsed ? 'Mở rộng menu' : 'Thu nhỏ menu'}
      >
        {isCollapsed ? (
          <ChevronRightIcon className="h-3.5 w-3.5" />
        ) : (
          <ChevronLeftIcon className="h-3.5 w-3.5" />
        )}
      </button>

      {/* Brand logo section */}
      <div className={`h-16 flex items-center ${isCollapsed ? 'justify-center px-0' : 'px-6'} border-b border-slate-100 bg-white transition-all duration-300`}>
        <div className="flex items-center space-x-3 overflow-hidden">
          <img src="/logo.png" alt="TradeVerse Logo" className="w-15 h-15 object-contain shrink-0" />
          <div className={`flex flex-col transition-all duration-300 ${isCollapsed ? 'w-0 opacity-0 overflow-hidden' : 'w-auto opacity-100'}`}>
            <h1 className="text-lg font-bold text-slate-800 tracking-wide whitespace-nowrap">TradeVerse</h1>
            <p className="text-[10px] text-sky-600 font-bold tracking-wider uppercase whitespace-nowrap">Trang quản trị</p>
          </div>
        </div>
      </div>

      {/* Navigation menu */}
      <nav className={`flex-1 ${isCollapsed ? 'px-2' : 'px-4'} py-6 space-y-1.5 overflow-y-auto transition-all duration-300`}>
        <Tooltip title={isCollapsed ? "Bài viết" : ""} placement="right">
          <Link
            to="/admin/posts"
            className={`flex items-center transition-all duration-200 group relative ${isCollapsed
              ? `justify-center w-12 h-12 mx-auto rounded-xl ${isPostsActive ? 'bg-sky-50/70 text-sky-600' : 'hover:bg-slate-50 hover:text-slate-800'}`
              : `space-x-3 px-4 py-3 rounded-xl border-l-4 ${isPostsActive
                ? 'bg-sky-50/70 text-sky-600 border-sky-500 pl-3 font-semibold'
                : 'hover:bg-slate-50 hover:text-slate-800 border-transparent pl-4'
              }`
              }`}
          >
            <DocumentTextIcon
              className={`h-5 w-5 transition-transform duration-200 group-hover:scale-105 shrink-0 ${isPostsActive ? 'text-sky-600' : 'text-slate-400 group-hover:text-slate-600'
                }`}
            />
            <span className={`whitespace-nowrap transition-all duration-300 ${isCollapsed ? 'w-0 opacity-0 overflow-hidden' : 'w-auto opacity-100'}`}>
              Bài viết
            </span>
          </Link>
        </Tooltip>

        <Tooltip title={isCollapsed ? "Danh sách người dùng" : ""} placement="right">
          <Link
            to="/admin/users"
            className={`flex items-center transition-all duration-200 group relative ${isCollapsed
              ? `justify-center w-12 h-12 mx-auto rounded-xl ${isUsersActive ? 'bg-sky-50/70 text-sky-600' : 'hover:bg-slate-50 hover:text-slate-800'}`
              : `space-x-3 px-4 py-3 rounded-xl border-l-4 ${isUsersActive
                ? 'bg-sky-50/70 text-sky-600 border-sky-500 pl-3 font-semibold'
                : 'hover:bg-slate-50 hover:text-slate-800 border-transparent pl-4'
              }`
              }`}
          >
            <UsersIcon
              className={`h-5 w-5 transition-transform duration-200 group-hover:scale-105 shrink-0 ${isUsersActive ? 'text-sky-600' : 'text-slate-400 group-hover:text-slate-600'
                }`}
            />
            <span className={`whitespace-nowrap transition-all duration-300 ${isCollapsed ? 'w-0 opacity-0 overflow-hidden' : 'w-auto opacity-100'}`}>
              Danh sách người dùng
            </span>
          </Link>
        </Tooltip>
      </nav>
    </aside>
  );
};

export default Sidebar;
