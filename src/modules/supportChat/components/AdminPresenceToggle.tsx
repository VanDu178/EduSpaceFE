interface AdminPresenceToggleProps {
  isAdminOnline: boolean;
}

export const AdminPresenceToggle = ({ isAdminOnline }: AdminPresenceToggleProps) => {
  return (
    <div className="flex items-center space-x-2 bg-white border border-slate-200/80 px-3 py-1.5 rounded-xl text-xs">
      <span className={`w-2 h-2 rounded-full ${isAdminOnline ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`}></span>
      <span className="font-medium text-slate-700">
        Trạng thái CSKH:{' '}
        <span className={isAdminOnline ? 'text-emerald-600 font-bold' : 'text-slate-500 font-bold'}>
          {isAdminOnline ? 'ONLINE (Đang trực)' : 'OFFLINE (Tự động)'}
        </span>
      </span>
    </div>
  );
};
