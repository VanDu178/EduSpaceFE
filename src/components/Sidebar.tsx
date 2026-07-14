import { Link, useLocation } from 'react-router-dom';

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
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
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
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-5 w-5 transition-transform duration-200 group-hover:scale-105 ${
              isPostsActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
          </svg>
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
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-5 w-5 transition-transform duration-200 group-hover:scale-105 ${
              isUsersActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <span>Danh sách người dùng</span>
        </Link>
      </nav>
    </aside>
  );
};

export default Sidebar;
