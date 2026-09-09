import { useState } from 'react';
import { Table, Button, Select, Switch, Popconfirm, Tooltip, Empty, Spin } from 'antd';
import {
  PlayIcon,
  PencilSquareIcon,
  TrashIcon,
  VideoCameraIcon,
  EyeIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';
import type { ColumnsType } from 'antd/es/table';
import type { Video, VideoType } from '../types';
import {
  STATUS_OPTIONS,
  SOURCE_TYPE_LABELS,
  SOURCE_TYPE_COLOR_MAP,
  VIDEO_STATUS_COLOR_MAP,
  VIDEO_PROCESS_STATUS,
  VIDEO_PROCESS_STATUS_CONFIG,
  PROCESSING_EDIT_DISABLED_TOOLTIP,
  PROCESSING_DELETE_DISABLED_TOOLTIP,
  getVideoTypeColors,
} from '../constants';
import { ModalAccess } from './ModalAccess';
import CopyButton from '../../../components/CopyButton';
import { formatTime } from '../../../utils/format';

interface ListPageProps {
  videos: Video[];
  isLoading: boolean;
  page: number;
  limit: number;
  total: number;
  disabled?: boolean;
  onPageChange: (page: number, limit: number) => void;
  onPreview: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, newStatus: string) => void;
  onAccessChange: (id: string, isPremium: boolean, teaserDuration?: number) => void;
  onSyncStatus?: (id: string) => void;
}

export const ListPage = ({
  videos,
  isLoading,
  page,
  limit,
  total,
  disabled = false,
  onPageChange,
  onPreview,
  onEdit,
  onDelete,
  onStatusChange,
  onAccessChange,
  onSyncStatus,
}: ListPageProps) => {
  // Modal state cho việc chuyển quyền truy cập trả phí và cài thời lượng xem thử
  const [selectedVideoForAccess, setSelectedVideoForAccess] = useState<Video | null>(null);
  const [isTeaserModalOpen, setIsTeaserModalOpen] = useState<boolean>(false);

  // Đóng Modal thời lượng xem thử
  const handleTeaserClose = () => {
    setIsTeaserModalOpen(false);
    setSelectedVideoForAccess(null);
  };

  // Submit Modal cập nhật thời lượng xem thử khi chuyển lên Trả phí
  const handleTeaserSubmit = (teaserDuration: number) => {
    if (selectedVideoForAccess) {
      onAccessChange(selectedVideoForAccess.id, true, teaserDuration);
    }
  };

  // Cấu hình các cột của Bảng Admin
  const columns: ColumnsType<Video> = [
    {
      title: 'Mã video',
      dataIndex: 'code',
      key: 'code',
      width: 140,
      align: 'left',
      fixed: 'left',
      render: (code: string) => (
        code ? (
          <div className="flex items-center gap-1 font-mono text-xs font-semibold text-slate-700">
            <span>{code}</span>
            <CopyButton text={code} tooltipText='Sao chép mã video' successMessage='Đã copy mã video!' />
          </div>
        ) : (
          <span className="text-slate-400 text-xs italic">—</span>
        )
      ),
    },
    {
      title: 'Thumbnail',
      dataIndex: 'thumbnailUrl',
      key: 'thumbnailUrl',
      width: 120,
      align: 'center',
      render: (thumb: string, record: Video) => (
        <div
          className={`relative w-14 h-9 rounded overflow-hidden bg-slate-900 border border-slate-200/80 group flex items-center justify-center mx-auto ${disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
            }`}
          onClick={() => !disabled && onPreview(record.id)}
        >
          {thumb ? (
            <img src={thumb} alt={record.title} className="w-full h-full object-cover group-hover:opacity-80 transition-opacity" />
          ) : (
            <VideoCameraIcon className="w-4 h-4 text-slate-500" />
          )}
          {!disabled && (
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
              <PlayIcon className="w-3.5 h-3.5 text-white fill-white" />
            </div>
          )}
        </div>
      ),
    },
    {
      title: 'Tiêu đề/Slug',
      dataIndex: 'title',
      key: 'title',
      width: 250,
      render: (title: string, record: Video) => (
        <div className="space-y-0.5">
          <div className="font-semibold text-slate-800 line-clamp-1 flex items-center gap-1.5">
            <span>{title}</span>
          </div>
          <div className="text-xs text-slate-400 truncate max-w-[220px]">
            /{record.slug}
          </div>
        </div>
      ),
    },
    {
      title: 'Loại video',
      dataIndex: 'videoType',
      key: 'videoType',
      width: 150,
      render: (vt: VideoType) => (
        vt?.name ? (
          <span className={`font-semibold text-xs ${getVideoTypeColors(vt?.code).textColor}`}>
            {vt.name}
          </span>
        ) : (
          <span className="text-slate-400 text-xs italic">Chưa phân loại</span>
        )
      ),
    },
    {
      title: 'Nguồn Video',
      dataIndex: 'sourceType',
      key: 'sourceType',
      width: 140,
      render: (source: 'direct_upload' | 'youtube') => (
        <span className={`font-semibold text-xs ${SOURCE_TYPE_COLOR_MAP[source]?.textColor || 'text-slate-600'}`}>
          {SOURCE_TYPE_LABELS[source] || source}
        </span>
      ),
    },
    {
      title: 'Thời lượng video & xem thử',
      key: 'duration',
      width: 200,
      render: (_: any, record: Video) => (
        <div className="text-xs space-y-0.5">
          <div className="text-slate-700 font-medium">
            Tổng: {formatTime(record.duration)}
          </div>
          {record.teaserDuration > 0 ? (
            <div className="text-amber-700 inline-block font-medium">
              Xem thử: {formatTime(record.teaserDuration)}
            </div>
          ) : (
            <span className="text-slate-400 text-xs italic">Không được phép xem thử</span>
          )}
        </div>
      ),
    },
    {
      title: 'Quyền truy cập',
      dataIndex: 'isPremium',
      key: 'isPremium',
      width: 150,
      align: 'center',
      render: (isPremium: boolean, record: Video) => {
        const isProcessing = record.processStatus === VIDEO_PROCESS_STATUS.PROCESSING;
        const isSwitchDisabled = disabled || isProcessing;
        return (
          <div className="flex items-center justify-center !space-x-2">
            <Switch
              size="small"
              checked={isPremium}
              disabled={isSwitchDisabled}
              onChange={(checked) => {
                if (checked) {
                  // Từ Free lên Trả phí -> Mở Modal chọn thời lượng xem thử
                  setSelectedVideoForAccess(record);
                  setIsTeaserModalOpen(true);
                } else {
                  // Từ Trả phí về Free -> Cập nhật trực tiếp không qua Modal
                  onAccessChange(record.id, false);
                }
              }}
            />
            <span className={`text-xs ${isPremium ? 'font-semibold text-amber-600' : 'font-medium text-slate-500'}`}>
              {isPremium ? 'Trả phí' : 'Miễn phí'}
            </span>
          </div>
        );
      },
    },
    {
      title: 'Trạng thái hiển thị',
      dataIndex: 'status',
      key: 'status',
      width: 140,
      align: 'center',
      render: (status: 'draft' | 'published' | 'archived', record: Video) => {
        const isProcessing = record.processStatus === VIDEO_PROCESS_STATUS.PROCESSING;
        const isSelectDisabled = disabled || isProcessing;
        return (
          <Select
            size="small"
            value={status}
            disabled={isSelectDisabled}
            onChange={(val) => onStatusChange(record.id, val)}
            className="w-full text-xs"
            variant="borderless"
            popupMatchSelectWidth={false}
            options={STATUS_OPTIONS.map((opt) => ({
              value: opt.value,
              label: (
                <span className={`font-semibold text-xs ${VIDEO_STATUS_COLOR_MAP[opt.value]?.textColor || opt.textColor}`}>
                  {opt.label}
                </span>
              ),
            }))}
          />
        );
      },
    },
    {
      title: 'Xử lý Media',
      dataIndex: 'processStatus',
      key: 'processStatus',
      width: 150,
      align: 'center',
      render: (pStatus: 'processing' | 'ready' | 'failed' | undefined, record: Video) => {
        if (record.sourceType === 'youtube') {
          return <span className="text-xs font-semibold text-rose-600">YouTube</span>;
        }
        const config = VIDEO_PROCESS_STATUS_CONFIG[pStatus || 'ready'] || VIDEO_PROCESS_STATUS_CONFIG.ready;
        return (
          <div className="flex items-center justify-center gap-1.5">
            {pStatus === 'processing' && <Spin size="small" />}
            <span className={`font-semibold text-xs ${config.textColor}`}>
              {config.label}
            </span>
            {onSyncStatus && (
              <Tooltip title="Kiểm tra & đồng bộ trạng thái">
                <Button
                  type="text"
                  size="small"
                  disabled={disabled}
                  icon={<ArrowPathIcon className="h-3.5 w-3.5 text-slate-400 hover:text-sky-600 transition-colors" />}
                  onClick={() => onSyncStatus(record.id)}
                  className="p-0.5 h-auto flex items-center justify-center border-none"
                />
              </Tooltip>
            )}
          </div>
        );
      },
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 180,
      fixed: 'right',
      align: 'center',
      render: (_: any, record: Video) => {
        const isProcessing = record.processStatus === VIDEO_PROCESS_STATUS.PROCESSING;
        const isEditDisabled = disabled || isProcessing;
        return (
          <div className="flex items-center justify-center space-x-2">
            <Tooltip title="Xem chi tiết">
              <Button
                type="text"
                disabled={disabled}
                icon={<EyeIcon className="h-4 w-4 text-sky-600" />}
                onClick={() => onPreview(record.id)}
                className="hover:bg-sky-50 flex items-center justify-center"
              />
            </Tooltip>

            <Tooltip title={isProcessing ? PROCESSING_EDIT_DISABLED_TOOLTIP : 'Cập nhật'}>
              <Button
                type="text"
                disabled={isEditDisabled}
                icon={<PencilSquareIcon className={`h-4 w-4 ${isEditDisabled ? 'text-slate-300' : 'text-amber-600'}`} />}
                onClick={() => onEdit(record.id)}
                className="hover:bg-amber-50 flex items-center justify-center disabled:opacity-50"
              />
            </Tooltip>

            <Popconfirm
              title="Xác nhận xóa"
              description="Bạn có chắc chắn muốn xóa bản ghi này?"
              onConfirm={() => onDelete(record.id)}
              disabled={disabled || isProcessing}
              okText="Đồng ý"
              cancelText="Hủy"
              okButtonProps={{ danger: true }}
            >
              <Tooltip title={isProcessing ? PROCESSING_DELETE_DISABLED_TOOLTIP : 'Xóa'}>
                <Button
                  type="text"
                  disabled={disabled || isProcessing}
                  icon={<TrashIcon className={`h-4 w-4 ${disabled || isProcessing ? 'text-slate-300' : 'text-rose-600'}`} />}
                  className="hover:bg-rose-50 flex items-center justify-center disabled:opacity-50"
                />
              </Tooltip>
            </Popconfirm>
          </div>
        );
      },
    },
  ];

  return (
    <div className="bg-white overflow-hidden flex flex-col flex-1">
      {!isLoading && videos.length === 0 ? (
        <div className="py-16 flex items-center justify-center flex-1">
          <Empty description="Không có video nào" />
        </div>
      ) : (
        <Table
          columns={columns}
          dataSource={videos}
          rowKey="id"
          loading={isLoading}
          size="small"
          scroll={{ y: 'calc(100vh - 316px)' }}
          pagination={{
            current: page,
            pageSize: limit,
            total,
            onChange: onPageChange,
            showSizeChanger: true,
            pageSizeOptions: ['5', '10', '20', '50'],
            showTotal: (totalCount) => `Tổng cộng: ${totalCount} dòng dữ liệu`,
            style: { marginBottom: 0 },
          }}
        />
      )}

      {/* Popup Modal cập nhật thời lượng xem thử khi chuyển từ Free lên Trả phí */}
      <ModalAccess
        open={isTeaserModalOpen}
        video={selectedVideoForAccess}
        onSubmit={handleTeaserSubmit}
        onClose={handleTeaserClose}
      />
    </div>
  );
};

