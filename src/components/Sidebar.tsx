import { Link, useLocation } from 'react-router-dom';
import { BookOpenIcon, DocumentTextIcon, UsersIcon } from '@heroicons/react/24/outline';

const Sidebar = () => {
  const location = useLocation();
  
  // Xác định active menu dựa trên đường dẫn URL hiện tại
  const isPostsActive = location.pathname.includes('/admin/posts');
  const isUsersActive = location.pathname.includes('/admin/users');

  return (
    <aside className="w-64 bg-white border-r border-slate-200/80 text-slate-500 flex flex-col h-screen fixed left-0 top-0 z-20 transition-all duration-300">
      {/* Brand logo section */}
      <div className="h-16 flex items-center px-6 border-b border-slate-100 bg-white">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-500/10">
            <BookOpenIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-800 tracking-wide">EduSpace</h1>
            <p className="text-[10px] text-blue-600 font-bold tracking-wider uppercase">Management</p>
          </div>
        </div>
      </div>

      {/* Navigation menu */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        <Link
          to="/admin/posts"
          className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group relative ${
            isPostsActive
              ? 'bg-blue-50/70 text-blue-600 border-l-4 border-blue-500 pl-3 font-semibold'
              : 'hover:bg-slate-50 hover:text-slate-800 pl-4 border-l-4 border-transparent'
          }`}
        >
          <DocumentTextIcon
            className={`h-5 w-5 transition-transform duration-200 group-hover:scale-105 ${
              isPostsActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'
            }`}
          />
          <span>Bài viết</span>
        </Link>

        <Link
          to="/admin/users"
          className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group relative ${
            isUsersActive
              ? 'bg-blue-50/70 text-blue-600 border-l-4 border-blue-500 pl-3 font-semibold'
              : 'hover:bg-slate-50 hover:text-slate-800 pl-4 border-l-4 border-transparent'
          }`}
        >
          <UsersIcon
            className={`h-5 w-5 transition-transform duration-200 group-hover:scale-105 ${
              isUsersActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'
            }`}
          />
          <span>Danh sách người dùng</span>
        </Link>
      </nav>
    </aside>
  );
};

export default Sidebar;
