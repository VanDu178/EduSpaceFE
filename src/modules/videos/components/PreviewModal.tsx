import { useEffect, useRef, useState } from 'react';
import { Drawer, Switch, Button, Tooltip } from 'antd';
import { PlayIcon, ClockIcon, LockClosedIcon, PencilSquareIcon } from '@heroicons/react/24/outline';
import type { Video } from '../types';
import { SOURCE_TYPE_LABELS, VIDEO_STATUS_COLOR_MAP, VIDEO_STATUS_LABELS, getVideoTypeColors } from '../constants';
import { getDirectVideoUrl } from '../utils';
import { formatTime } from '../../../utils/format';
import CopyButton from '../../../components/CopyButton';
import { ModalAccess } from './ModalAccess';

interface PreviewModalProps {
  video: Video | null;
  open: boolean;
  onClose: () => void;
  onEdit?: (video: Video) => void;
  onAccessChange?: (id: string, isPremium: boolean, teaserDuration?: number) => void;
}

export const PreviewModal = ({
  video,
  open,
  onClose,
  onEdit,
  onAccessChange,
}: PreviewModalProps) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isTeaserLimitReached, setIsTeaserLimitReached] = useState(false);
  const [isTeaserMode, setIsTeaserMode] = useState(true);
  const [isAccessModalOpen, setIsAccessModalOpen] = useState(false);

  // Khởi tạo trạng thái xem thử/chặn màn hình khi mở Drawer hoặc thay đổi video
  useEffect(() => {
    if (open && video?.isPremium) {
      setIsTeaserMode(true);
      if (!video.teaserDuration || video.teaserDuration <= 0) {
        setIsTeaserLimitReached(true);
        if (videoRef.current) {
          videoRef.current.pause();
        }
      } else {
        setIsTeaserLimitReached(false);
      }
    } else {
      setIsTeaserLimitReached(false);
    }
  }, [open, video]);

  if (!video) return null;

  // Xử lý kiểm tra thời gian phát nếu có thiết lập Teaser Duration
  const handleTimeUpdate = () => {
    if (isTeaserMode && video.isPremium && videoRef.current) {
      if (!video.teaserDuration || video.teaserDuration <= 0) {
        videoRef.current.pause();
        setIsTeaserLimitReached(true);
      } else if (videoRef.current.currentTime >= video.teaserDuration) {
        videoRef.current.pause();
        setIsTeaserLimitReached(true);
      }
    }
  };

  const handleModalClose = () => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
    setIsTeaserLimitReached(false);
    setIsTeaserMode(true);
    onClose();
  };

  return (
    <Drawer
      title={
        <div className="flex items-center justify-between pr-4">
          <span className="font-bold text-slate-800 text-base">Xem trước video</span>

          <div className="flex items-center gap-3">
            {video.isPremium && (
              <div className="flex items-center gap-2 bg-slate-100/80 px-3 py-1.5 rounded-xl border border-slate-200/80">
                <span className="text-slate-600 font-medium text-xs">Chế độ xem:</span>
                <Switch
                  size="small"
                  checked={isTeaserMode}
                  onChange={(checked) => {
                    setIsTeaserMode(checked);
                    if (!checked) {
                      setIsTeaserLimitReached(false);
                    } else {
                      if (!video.teaserDuration || video.teaserDuration <= 0) {
                        if (videoRef.current) videoRef.current.pause();
                        setIsTeaserLimitReached(true);
                      } else if (videoRef.current && videoRef.current.currentTime >= video.teaserDuration) {
                        if (videoRef.current) videoRef.current.pause();
                        setIsTeaserLimitReached(true);
                      }
                    }
                  }}
                />
                <span
                  className={`text-xs font-semibold px-2 py-0.5 rounded-md ${isTeaserMode
                    ? 'bg-amber-100 text-amber-700 border border-amber-200/80'
                    : 'bg-emerald-100 text-emerald-700 border border-emerald-200/80'
                    }`}
                >
                  {isTeaserMode ? 'Xem thử (Teaser)' : 'Xem đầy đủ (Full)'}
                </span>
                |

                {onAccessChange && (
                  <Tooltip title="Chỉnh sửa thời gian xem thử">
                    <Button
                      type="text"
                      size="small"
                      icon={<PencilSquareIcon className="w-3.5 h-3.5 text-amber-600" />}
                      onClick={() => setIsAccessModalOpen(true)}
                      className="flex items-center justify-center hover:bg-amber-100/80 rounded-lg text-amber-700 text-xs px-2 h-6 font-medium border border-amber-200/60"
                    >
                      <span>Sửa mốc xem thử</span>
                    </Button>
                  </Tooltip>
                )}
              </div>
            )}

            {onEdit && (
              <Button
                type="default"
                icon={<PencilSquareIcon className="w-4 h-4 text-amber-600" />}
                onClick={() => {
                  handleModalClose();
                  onEdit(video);
                }}
                className="rounded-xl border-slate-200 text-slate-700 hover:text-amber-600 hover:border-amber-300 font-semibold text-xs h-9 px-4 flex items-center gap-1.5 cursor-pointer"
              >
                Cập nhật
              </Button>
            )}
          </div>
        </div>
      }
      open={open}
      onClose={handleModalClose}
      destroyOnHidden
      placement="right"
      width="calc(100vw - 256px)"
      styles={{
        body: {
          paddingTop: 10,
        },
      }}
    >
      <div className="max-w-4xl mx-auto space-y-4">
        {/* Khung Trình phát Video Cinema Vibe */}
        <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-950 flex items-center justify-center border border-slate-800">
          {video.sourceType === 'youtube' && video.youtubeVideoId ? (
            <iframe
              className="w-full h-full border-0"
              src={`https://www.youtube.com/embed/${video.youtubeVideoId}?autoplay=1&rel=0`}
              title={video.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : video.storagePath ? (
            <div className="relative w-full h-full">
              <video
                ref={videoRef}
                src={getDirectVideoUrl(video.storagePath)}
                controls
                autoPlay
                onTimeUpdate={handleTimeUpdate}
                className="w-full h-full object-contain"
                poster={video.thumbnailUrl || undefined}
              />
            </div>
          ) : (
            <div className="text-slate-400 text-sm flex flex-col items-center gap-2 py-12">
              <PlayIcon className="w-10 h-10 text-slate-600 stroke-1" />
              <span className="text-slate-400 italic text-xs">Chưa có nguồn file video được tải lên</span>
            </div>
          )}

          {/* Overlay khóa màn hình khi phát hết mốc Teaser hoặc khi teaserDuration = 0 ở chế độ xem thử */}
          {isTeaserLimitReached && (
            <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center text-white p-6 text-center z-20">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-3">
                <LockClosedIcon className="w-6 h-6 text-amber-400" />
              </div>
              <h4 className="text-base font-bold text-white mb-1">
                {video.teaserDuration && video.teaserDuration > 0
                  ? 'Đã hết thời gian xem thử Teaser'
                  : 'Nội dung Video Premium trả phí'}
              </h4>
              <p className="text-xs text-slate-300 max-w-md mb-4 leading-relaxed">
                {video.teaserDuration && video.teaserDuration > 0 ? (
                  <>
                    Bạn vừa xem hết <span className="font-semibold text-amber-400">{formatTime(video.teaserDuration)}</span> nội dung xem thử.
                  </>
                ) : (
                  'Video này chưa thiết lập thời lượng xem thử (0s). Vui lòng chuyển sang Chế độ xem đầy đủ để phát nội dung.'
                )}
              </p>
              {video.teaserDuration && video.teaserDuration > 0 ? (
                <button
                  type="button"
                  onClick={() => {
                    if (videoRef.current) {
                      videoRef.current.currentTime = 0;
                      setIsTeaserLimitReached(false);
                      videoRef.current.play();
                    }
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-sky-500 to-cyan-600 text-white font-medium text-xs rounded-xl hover:opacity-90 transition-opacity cursor-pointer border-none"
                >
                  Xem lại từ đầu
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setIsTeaserMode(false);
                    setIsTeaserLimitReached(false);
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-sky-500 to-cyan-600 text-white font-medium text-xs rounded-xl hover:opacity-90 transition-opacity cursor-pointer border-none"
                >
                  Chuyển sang Xem đầy đủ (Full)
                </button>
              )}
            </div>
          )}
        </div>

        {/* Khối Tiêu đề & Thông tin Video chuẩn YouTube gọn gàng, hạn chế box */}
        <div className="space-y-3 pt-1">
          {/* Tiêu đề Video đặt ngay bên dưới Trình phát */}
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug tracking-tight">
            {video.title}
          </h3>

          {/* Thanh Thông số (Metadata Line) */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs sm:text-sm text-slate-600">
            {/* Mã Video (Video Code) */}
            <div className="flex items-center gap-1 font-mono">
              <span className="text-slate-500 font-medium">Mã:</span>
              <span className="font-semibold text-slate-800">{video.code}</span>
              <CopyButton text={video.code} tooltipText="Sao chép mã video" />
            </div>

            <span className="text-slate-300">•</span>

            {/* Phân loại (Video Type) */}
            {video.videoType?.name ? (
              <span className={`font-semibold ${getVideoTypeColors(video.videoType?.code).textColor}`}>
                {video.videoType.name}
              </span>
            ) : (
              <span className="text-slate-400 italic">Chưa phân loại</span>
            )}

            <span className="text-slate-300">•</span>

            {/* Nguồn Video */}
            <span className="text-slate-600">{SOURCE_TYPE_LABELS[video.sourceType] || video.sourceType}</span>

            <span className="text-slate-300">•</span>

            {/* Trạng thái */}
            <span className={`font-medium ${VIDEO_STATUS_COLOR_MAP[video.status]?.textColor || 'text-slate-600'}`}>
              {VIDEO_STATUS_LABELS[video.status] || video.status}
            </span>

            {/* Thẻ Premium và Thời gian xem thử */}
            {video.isPremium && (
              <>
                <span className="text-slate-300">•</span>
                <span className="inline-flex items-center gap-1 text-amber-600 font-semibold rounded-md">
                  Trả phí
                </span>
                {video.teaserDuration > 0 && (
                  <div className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 px-2 py-0.5 rounded-md text-xs font-semibold border border-amber-200/60">
                    <span>Thời lượng xem thử: {formatTime(video.teaserDuration)}</span>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Mô tả Video - Khung nền nhạt đơn giản phong cách YouTube */}
          <div className="bg-slate-100/70 p-4 rounded-xl text-xs sm:text-sm text-slate-700 leading-relaxed">
            {video.slug && (
              <div className="text-[11px] font-mono text-slate-400 mb-1">
                /{video.slug}
              </div>
            )}
            {video.description ? (
              <p className="whitespace-pre-wrap font-normal text-slate-700">
                {video.description}
              </p>
            ) : (
              <span className="text-slate-400 italic block">Không có mô tả</span>
            )}
          </div>
        </div>
      </div>

      {/* Modal chỉnh sửa nhanh thời lượng xem thử */}
      <ModalAccess
        open={isAccessModalOpen}
        video={video}
        onSubmit={(teaserDuration) => {
          if (video && onAccessChange) {
            onAccessChange(video.id, true, teaserDuration);
          }
          setIsAccessModalOpen(false);
        }}
        onClose={() => setIsAccessModalOpen(false)}
      />
    </Drawer>
  );
};




