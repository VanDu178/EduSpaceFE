import { useNavigate, useLocation } from 'react-router-dom';

const MembershipSubNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isPlansActive = location.pathname.includes('/admin/membership-plans');
  const isFeaturesActive = location.pathname.includes('/admin/features');

  return (
    <div className="flex items-center space-x-6 border-b border-slate-200/80 mb-2">
      <button
        type="button"
        onClick={() => navigate('/admin/membership-plans')}
        className={`pb-3 text-sm font-semibold transition-colors cursor-pointer bg-transparent border-b-2 -mb-px ${
          isPlansActive
            ? 'border-sky-600 text-sky-600 font-bold'
            : 'border-transparent text-slate-500 hover:text-slate-700'
        }`}
      >
        Gói hội viên
      </button>

      <button
        type="button"
        onClick={() => navigate('/admin/features')}
        className={`pb-3 text-sm font-semibold transition-colors cursor-pointer bg-transparent border-b-2 -mb-px ${
          isFeaturesActive
            ? 'border-sky-600 text-sky-600 font-bold'
            : 'border-transparent text-slate-500 hover:text-slate-700'
        }`}
      >
        Danh sách tính năng
      </button>
    </div>
  );
};

export default MembershipSubNav;
