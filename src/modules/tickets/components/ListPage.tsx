import React from 'react';
import type { Ticket } from '../types';

interface ListPageProps {
  tickets: Ticket[];
  selectedTicket: Ticket | null;
  isLoadingTickets: boolean;
  onSelectTicket: (id: number) => void;
}

export const ListPage: React.FC<ListPageProps> = ({
  tickets,
  selectedTicket,
  isLoadingTickets,
  onSelectTicket
}) => {
  return (
    <div className="flex-1 overflow-y-auto p-2 space-y-2 min-h-0">
      {isLoadingTickets && <div className="text-center py-6 text-slate-500 text-xs">Đang tải Ticket...</div>}
      {!isLoadingTickets && tickets.length === 0 && (
        <div className="text-center py-10 text-slate-500 text-xs">Không có Ticket nào phù hợp.</div>
      )}
      {tickets.map((t) => (
        <div
          key={t.id}
          onClick={() => onSelectTicket(t.id)}
          className={`p-3 rounded-lg border cursor-pointer transition ${
            selectedTicket?.id === t.id ? 'bg-sky-50/80 border-sky-500' : 'bg-slate-50/60 hover:bg-slate-100 border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="font-mono text-sky-700 font-semibold">#{t.code}</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                t.status === 'OPEN'
                  ? 'bg-amber-100 text-amber-800 border border-amber-300'
                  : t.status === 'IN_PROGRESS'
                  ? 'bg-sky-100 text-sky-800 border border-sky-300'
                  : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
              }`}
            >
              {t.status}
            </span>
          </div>
          <h4 className="text-xs font-semibold text-slate-900 truncate">{t.title}</h4>
          <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">Khách: {t.creator?.name || t.creator?.email}</p>
        </div>
      ))}
    </div>
  );
};
