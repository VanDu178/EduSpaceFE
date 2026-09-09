import { useEffect } from 'react';
import { useUploadStore } from '../store/uploadStore';
import { VIDEO_UPLOAD_TASK_STATUS, CONCURRENCY_UPLOAD_VIDEO } from '../constants';
import {
  CloudArrowUpIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  XMarkIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
  ClockIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import { Progress } from 'antd';

export const FloatingUploadProgress = () => {
  const {
    tasks,
    isMinimized,
    toggleMinimize,
    cancelTask,
    removeTask,
    clearCompletedTasks,
  } = useUploadStore();

  // Bổ sung listener lắng nghe khi người dùng bấm tắt Tab hoặc Reload trình duyệt (beforeunload)
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      const isUploading = tasks.some((t) => t.status === VIDEO_UPLOAD_TASK_STATUS.UPLOADING);
      if (isUploading) {
        e.preventDefault();
        e.returnValue = 'Có video đang được tải lên hệ thống. Bạn có chắc chắn muốn rời đi?';
        return 'Có video đang được tải lên hệ thống. Bạn có chắc chắn muốn rời đi?';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [tasks]);

  if (!tasks || tasks.length === 0) return null;

  const uploadingTasks = tasks.filter((t) => t.status === VIDEO_UPLOAD_TASK_STATUS.UPLOADING);
  const queuedTasks = tasks.filter((t) => t.status === VIDEO_UPLOAD_TASK_STATUS.QUEUED);
  const completedTasks = tasks.filter((t) => t.status === VIDEO_UPLOAD_TASK_STATUS.COMPLETED);
  const errorTasks = tasks.filter((t) => t.status === VIDEO_UPLOAD_TASK_STATUS.ERROR);

  // Tính tiến độ trung bình của các task đang chạy
  const averageProgress =
    uploadingTasks.length > 0
      ? Math.round(uploadingTasks.reduce((acc, t) => acc + t.progress, 0) / uploadingTasks.length)
      : 100;

  // WIDGET THU NHỎ (MINIMIZED)
  if (isMinimized) {
    return (
      <div className="fixed bottom-5 right-5 z-50">
        <button
          type="button"
          onClick={toggleMinimize}
          className="flex items-center gap-2.5 bg-slate-900/90 hover:bg-slate-900 text-white px-4 py-2.5 rounded-2xl shadow-xl backdrop-blur-md border border-slate-700/60 transition-all cursor-pointer group"
        >
          <div className="relative flex items-center justify-center">
            {uploadingTasks.length > 0 ? (
              <CloudArrowUpIcon className="w-5 h-5 text-sky-400 animate-pulse" />
            ) : errorTasks.length > 0 ? (
              <ExclamationTriangleIcon className="w-5 h-5 text-rose-400" />
            ) : (
              <CheckCircleIcon className="w-5 h-5 text-emerald-400" />
            )}
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
            <span>
              {uploadingTasks.length > 0
                ? `Đang tải ${uploadingTasks.length} tệp`
                : queuedTasks.length > 0
                  ? `Đang chờ ${queuedTasks.length} tệp`
                  : 'Tải lên hoàn tất'}
            </span>
            {uploadingTasks.length > 0 && (
              <span className="font-bold text-sky-400 font-mono">
                {averageProgress}%
              </span>
            )}
          </div>

          <ChevronUpIcon className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
        </button>
      </div>
    );
  }

  // WIDGET MỞ RỘNG (EXPANDED MULTI-TASK QUEUE)
  return (
    <div className="fixed bottom-5 right-5 z-50 w-80 sm:w-[420px] max-h-[500px] bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-200/80 flex flex-col overflow-hidden transition-all duration-300">
      {/* Header Widget */}
      <div className="bg-slate-900 text-white px-4 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <CloudArrowUpIcon className="w-5 h-5 text-sky-400" />
          <div>
            <h4 className="text-xs font-bold text-slate-100 m-0 tracking-wide">
              Tiến trình tải lên ({tasks.length} tệp)
            </h4>
            <div className="flex items-center gap-2 mt-0.5 text-[10px] text-slate-400">
              {uploadingTasks.length > 0 && (
                <span className="text-sky-400 font-medium">
                  {uploadingTasks.length}/{CONCURRENCY_UPLOAD_VIDEO} đang tải
                </span>
              )}
              {queuedTasks.length > 0 && (
                <span className="text-amber-400 font-medium">
                  {queuedTasks.length} đang chờ tải lên
                </span>
              )}
              {completedTasks.length > 0 && (
                <span className="text-emerald-400 font-medium">
                  {completedTasks.length} đã xong
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {completedTasks.length > 0 && (
            <button
              type="button"
              onClick={clearCompletedTasks}
              className="p-1 hover:bg-slate-800 text-slate-400 hover:text-emerald-400 rounded-lg transition-colors cursor-pointer"
              title="Dọn dẹp tệp đã hoàn tất"
            >
              <TrashIcon className="w-4 h-4" />
            </button>
          )}

          <button
            type="button"
            onClick={toggleMinimize}
            className="p-1 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
            title="Thu nhỏ"
          >
            <ChevronDownIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Body: Danh sách Tasks Scrollable */}
      <div className="p-3 overflow-y-auto space-y-2.5 max-h-[380px] divide-y divide-slate-100">
        {tasks.map((task) => {
          const { id, fileName, progress, status, error } = task;

          return (
            <div key={id} className="pt-2 first:pt-0 space-y-2">
              {/* Tên tệp & Dung lượng & Badge Trạng Thái */}
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-slate-800 m-0 truncate" title={fileName}>
                    {fileName}
                  </p>
                </div>

                <div className="flex items-center gap-1.5">
                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md ${status === VIDEO_UPLOAD_TASK_STATUS.COMPLETED
                      ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                      : status === VIDEO_UPLOAD_TASK_STATUS.ERROR
                        ? 'bg-rose-50 text-rose-600 border border-rose-200'
                        : status === VIDEO_UPLOAD_TASK_STATUS.QUEUED
                          ? 'bg-amber-50 text-amber-600 border border-amber-200'
                          : 'bg-sky-50 text-sky-600 border border-sky-200'
                      }`}
                  >
                    {status === VIDEO_UPLOAD_TASK_STATUS.QUEUED ? 'Đang chờ' : `${progress}%`}
                  </span>

                  <button
                    type="button"
                    onClick={() => {
                      if (status === VIDEO_UPLOAD_TASK_STATUS.UPLOADING || status === VIDEO_UPLOAD_TASK_STATUS.QUEUED) {
                        cancelTask(id);
                      } else {
                        removeTask(id);
                      }
                    }}
                    className="p-1 text-slate-400 hover:text-rose-500 rounded transition-colors cursor-pointer"
                    title={status === VIDEO_UPLOAD_TASK_STATUS.UPLOADING ? 'Hủy tải lên' : 'Xóa khỏi danh sách'}
                  >
                    <XMarkIcon className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Progress bar cho task đang tải */}
              {status !== VIDEO_UPLOAD_TASK_STATUS.QUEUED && (
                <Progress
                  percent={progress}
                  showInfo={false}
                  strokeColor={
                    status === VIDEO_UPLOAD_TASK_STATUS.COMPLETED
                      ? '#10b981'
                      : status === VIDEO_UPLOAD_TASK_STATUS.ERROR
                        ? '#f43f5e'
                        : { '0%': '#0284c7', '100%': '#06b6d4' }
                  }
                  className="m-0"
                />
              )}

              {/* Message Trạng thái chi tiết */}
              <div className="flex items-center justify-between text-[11px] text-slate-500">
                {status === VIDEO_UPLOAD_TASK_STATUS.UPLOADING && (
                  <div className="flex items-center gap-1.5 text-sky-600 font-medium">
                    <ArrowPathIcon className="w-3.5 h-3.5 animate-spin" />
                    <span>Đang tải lên...</span>
                  </div>
                )}

                {status === VIDEO_UPLOAD_TASK_STATUS.QUEUED && (
                  <div className="flex items-center gap-1.5 text-amber-600 font-medium">
                    <ClockIcon className="w-3.5 h-3.5" />
                    <span>Đang chờ tải...</span>
                  </div>
                )}

                {status === VIDEO_UPLOAD_TASK_STATUS.COMPLETED && (
                  <div className="flex items-center gap-1.5 text-emerald-600 font-semibold">
                    <CheckCircleIcon className="w-3.5 h-3.5" />
                    <span>Hoàn tất tải lên kho lưu trữ!</span>
                  </div>
                )}

                {status === VIDEO_UPLOAD_TASK_STATUS.ERROR && (
                  <div className="flex items-center gap-1.5 text-rose-600 font-medium truncate">
                    <ExclamationTriangleIcon className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate" title={error}>{error || 'Thất bại'}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

