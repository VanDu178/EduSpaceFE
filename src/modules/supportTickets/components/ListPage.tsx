import { useEffect, useRef } from 'react';
import type { Ticket } from '../types';
import { TICKET_STATUS_LABELS, TICKET_CATEGORY_LABELS, TICKET_PRIORITY_LABELS } from '../constants';

interface ListPageProps {
  tickets: Ticket[];
  selectedTicket: Ticket | null;
  isLoadingTickets: boolean;
  onSelectTicket: (id: number) => void;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  onFetchNextPage?: () => void;
}

export const ListPage = ({
  tickets,
  selectedTicket,
  isLoadingTickets,
  onSelectTicket,
  hasNextPage,
  isFetchingNextPage,
  onFetchNextPage
}: ListPageProps) => {
  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loadMoreRef.current || !hasNextPage || isFetchingNextPage || !onFetchNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          onFetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    const currentRef = loadMoreRef.current;
    observer.observe(currentRef);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, onFetchNextPage]);

  return (
    <div className="flex-1 overflow-y-auto p-2 space-y-2 min-h-0">
      {isLoadingTickets && <div className="text-center py-6 text-slate-400 text-xs italic">Đang tải dữ liệu...</div>}
      {!isLoadingTickets && tickets.length === 0 && (
        <div className="text-center py-10 text-slate-400 text-xs italic">Không có dữ liệu</div>
      )}
      {tickets.map((t) => {
        const isUnread = (t.assigneeUnreadCount || 0) > 0;
        const statusInfo = TICKET_STATUS_LABELS[t.status];
        const categoryLabel = TICKET_CATEGORY_LABELS[t.category] || t.category;
        const priorityInfo = TICKET_PRIORITY_LABELS[t.priority];

        return (
          <div
            key={t.id}
            onClick={() => onSelectTicket(t.id)}
            className={`p-3 rounded-xl border cursor-pointer transition ${selectedTicket?.id === t.id
              ? 'bg-sky-50/80 border-sky-500 shadow-sm'
              : isUnread
                ? 'bg-sky-50/50 hover:bg-sky-50/90 border-sky-300 shadow-sm'
                : 'bg-white hover:bg-slate-50 border-slate-200/80'
              }`}
          >
            <div className="flex items-center justify-between text-xs mb-1.5">
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-sky-700 font-bold text-xs">#{t.code}</span>
                {isUnread && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-100 text-sky-700 border border-sky-300 animate-pulse">
                    Phản hồi mới
                  </span>
                )}
              </div>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${statusInfo ? `${statusInfo.bgClass} ${statusInfo.textClass}` : 'bg-slate-100 border-slate-200 text-slate-600'
                  }`}
              >
                {statusInfo?.label}
              </span>
            </div>

            <h4 className={`text-xs truncate mb-1.5 ${isUnread ? 'font-bold text-slate-900' : 'font-semibold text-slate-800'}`}>{t.title}</h4>
            <p className="text-[11px] text-slate-500 line-clamp-1 mb-1.5">
              Khách hàng: {t.creator?.name || <span className="italic text-slate-400">Khách vãng lai</span>}
            </p>
            {/* Category & Priority badges */}
            <div className="flex items-center gap-1.5 flex-wrap">
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

      {/* Sentinel element cho Infinite Scroll */}
      {hasNextPage && (
        <div ref={loadMoreRef} className="py-3 text-center">
          {isFetchingNextPage ? (
            <span className="text-[11px] text-sky-600 font-medium animate-pulse">Đang tải thêm danh sách...</span>
          ) : (
            <span className="text-[11px] text-slate-400">Cuộn xuống để xem thêm</span>
          )}
        </div>
      )}
    </div>
  );
};
