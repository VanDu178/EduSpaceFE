import type { Ticket } from '../types';
import { TICKET_STATUS_LABELS, TICKET_CATEGORY_LABELS, TICKET_PRIORITY_LABELS } from '../constants';

interface ListPageProps {
  tickets: Ticket[];
  selectedTicket: Ticket | null;
  isLoadingTickets: boolean;
  onSelectTicket: (id: number) => void;
}

export const ListPage = ({
  tickets,
  selectedTicket,
  isLoadingTickets,
  onSelectTicket
}: ListPageProps) => {
  return (
    <div className="flex-1 overflow-y-auto p-2 space-y-2 min-h-0">
      {isLoadingTickets && <div className="text-center py-6 text-slate-400 text-xs italic">Đang tải dữ liệu...</div>}
      {!isLoadingTickets && tickets.length === 0 && (
        <div className="text-center py-10 text-slate-400 text-xs italic">Không có dữ liệu</div>
      )}
      {tickets.map((t) => {
        const statusInfo = TICKET_STATUS_LABELS[t.status];
        const categoryLabel = TICKET_CATEGORY_LABELS[t.category] || t.category;
        const priorityInfo = TICKET_PRIORITY_LABELS[t.priority];

        return (
          <div
            key={t.id}
            onClick={() => onSelectTicket(t.id)}
            className={`p-3 rounded-xl border cursor-pointer transition ${selectedTicket?.id === t.id ? 'bg-sky-50/80 border-sky-500' : 'bg-white hover:bg-slate-50 border-slate-200/80'
              }`}
          >
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-mono text-sky-700 font-bold text-xs">#{t.code}</span>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${statusInfo ? `${statusInfo.bgClass} ${statusInfo.textClass}` : 'bg-slate-100 border-slate-200 text-slate-600'
                  }`}
              >
                {statusInfo?.label}
              </span>
            </div>


            <h4 className="text-xs font-semibold text-slate-900 truncate mb-1.5">{t.title}</h4>
            <p className="text-[11px] text-slate-500 line-clamp-1">
              Khách hàng: {t.creator?.name || < span className="italic text-slate-400">Khách vãn lai</span>}
            </p>
            {/* Category & Priority badges */}
            <div className="flex items-center gap-1.5 flex-wrap mb-1.5">
              <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-medium border border-slate-200/60 truncate max-w-[160px]">
                {categoryLabel}
              </span>
              <span
                className={`px-2 py-0.5 rounded-md text-[10px] font-semibold ${priorityInfo?.color || 'bg-slate-100 text-slate-700'
                  }`}
              >
                {priorityInfo?.label || t.priority}
              </span>
            </div>
          </div>
        );
      })}
    </div >
  );
};
