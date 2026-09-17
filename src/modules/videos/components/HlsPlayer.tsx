import { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import { Cog6ToothIcon, ArrowPathIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import type { Video } from '../types';
import { VIDEO_PROCESS_STATUS } from '../constants';

interface HlsQualityLevel {
  index: number;
  height: number;
  bitrate: number;
  label: string;
}

interface HlsPlayerProps {
  video: Video;
  src: string;
  poster?: string;
  autoPlay?: boolean;
  onTimeUpdate?: () => void;
  onEnded?: () => void;
  videoRefOut?: React.MutableRefObject<HTMLVideoElement | null>;
  showQualitySelector?: boolean;
}

export const HlsPlayer = ({
  video,
  src,
  poster,
  autoPlay = true,
  onTimeUpdate,
  onEnded,
  videoRefOut,
  showQualitySelector = true,
}: HlsPlayerProps) => {
  const internalVideoRef = useRef<HTMLVideoElement | null>(null);
  const videoRef = videoRefOut || internalVideoRef;
  const hlsRef = useRef<Hls | null>(null);

  const [levels, setLevels] = useState<HlsQualityLevel[]>([]);
  const [currentLevel, setCurrentLevel] = useState<number>(-1); // -1 là Auto
  const [isGearOpen, setIsGearOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isProcessing = video.processStatus === VIDEO_PROCESS_STATUS.PROCESSING;
  const isFailed = video.processStatus === VIDEO_PROCESS_STATUS.FAILED;

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement || isProcessing || isFailed || !src) return;

    setErrorMessage(null);

    // Xóa HLS instance cũ nếu có
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    // Kiểm tra trình duyệt hỗ trợ Hls.js
    if (Hls.isSupported()) {
      const hls = new Hls({
        maxBufferLength: 30, // Chỉ buffer trước 30 giây để tối ưu băng thông phát video
        maxMaxBufferLength: 60,
        enableWorker: true,
        // xhrSetup: (xhr: XMLHttpRequest, url: string) => {
        // const token = localStorage.getItem('accessToken');
        // const bunnyCdnHost = import.meta.env.VITE_BUNNY_CDN_HOSTNAME;
        // const isExternalCdn =
        //   url.includes('b-cdn.net') ||
        //   url.includes('bunnycdn') ||
        //   (bunnyCdnHost && url.includes(bunnyCdnHost));
        // if (token && !isExternalCdn) {
        //   xhr.setRequestHeader('Authorization', `Bearer ${token}`);
        // }
        // },
      });

      hlsRef.current = hls;
      hls.attachMedia(videoElement);

      hls.on(Hls.Events.MEDIA_ATTACHED, () => {
        hls.loadSource(src);
      });

      hls.on(Hls.Events.MANIFEST_PARSED, (_, data) => {
        // Trích xuất danh sách dải độ phân giải (360p, 480p, 720p, 1080p)
        const extractedLevels: HlsQualityLevel[] = data.levels.map((level, index) => ({
          index,
          height: level.height,
          bitrate: level.bitrate,
          label: `${level.height}p`,
        }));

        // Sắp xếp thứ tự độ phân giải giảm dần (1080p -> 360p)
        extractedLevels.sort((a, b) => b.height - a.height);
        setLevels(extractedLevels);

        if (autoPlay) {
          videoElement.play().catch(() => {
            // Tự động phát bị trình duyệt chặn nếu chưa có tương tác
          });
        }
      });

      hls.on(Hls.Events.ERROR, (_, data) => {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR: {
              const responseCode = data.response?.code;
              const responseData = data.response?.data as any;
              if (responseCode === 400 && responseData?.errorCode === 'VIDEO_PROCESSING') {
                setErrorMessage('Video đang được hệ thống xử lý (Vui lòng thử lại sau 1-2 phút)');
              } else {
                setErrorMessage('Lỗi kết nối tải dữ liệu luồng phát video');
                hls.startLoad();
              }
              break;
            }
            case Hls.ErrorTypes.MEDIA_ERROR:
              hls.recoverMediaError();
              break;
            default:
              hls.destroy();
              setErrorMessage('Không thể phát luồng video HLS');
              break;
          }
        }
      });
    } else if (videoElement.canPlayType('application/vnd.apple.mpegurl')) {
      // Hỗ trợ Safari Native HLS
      videoElement.src = src;
      videoElement.addEventListener('loadedmetadata', () => {
        if (autoPlay) videoElement.play().catch(() => { });
      });
    } else {
      setErrorMessage('Trình duyệt của bạn không hỗ trợ công nghệ phát video HLS');
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [src, isProcessing, isFailed, autoPlay]);

  // Đổi chất lượng video thủ công hoặc Auto
  const handleQualityChange = (levelIndex: number) => {
    setCurrentLevel(levelIndex);
    if (hlsRef.current) {
      hlsRef.current.currentLevel = levelIndex;
    }
    setIsGearOpen(false);
  };

  return (
    <div className="relative w-full h-full bg-slate-950 flex items-center justify-center overflow-hidden">
      {/* 1. Màn hình chờ khi Video ở trạng thái PROCESSING */}
      {isProcessing && (
        <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center text-white p-6 text-center z-30">
          <div className="w-14 h-14 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center mb-4 animate-pulse">
            <ArrowPathIcon className="w-8 h-8 text-sky-400 animate-spin" />
          </div>
          <h4 className="text-base font-bold text-white mb-1">
            Video đang được xử lý
          </h4>
          <p className="text-xs text-slate-300 max-w-md leading-relaxed">
            Hệ thống đang tối ưu hóa video sang các dải độ phân giải 360p – 1080p để đảm bảo phát mượt mượt không giật lag. Vui lòng quay lại sau 1-2 phút.
          </p>
        </div>
      )}

      {/* 2. Màn hình báo lỗi khi Video FAILED hoặc Lỗi Mạng */}
      {(isFailed || errorMessage) && !isProcessing && (
        <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center text-white p-6 text-center z-30">
          <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mb-4">
            <ExclamationTriangleIcon className="w-8 h-8 text-rose-400" />
          </div>
          <h4 className="text-base font-bold text-white mb-1">
            Không thể phát video
          </h4>
          <p className="text-xs text-slate-300 max-w-md leading-relaxed">
            {errorMessage || 'Quá trình transcode HLS gặp sự cố. Vui lòng tải lại trang hoặc liên hệ quản trị viên.'}
          </p>
        </div>
      )}

      {/* 3. HTML5 Video Element */}
      <video
        ref={videoRef}
        poster={poster}
        controls
        onTimeUpdate={onTimeUpdate}
        onEnded={onEnded}
        className="w-full h-full object-contain"
      />

      {/* 4. Menu Chuyển Đổi Độ Phân Giải (Quality Switcher Gear Menu) */}
      {showQualitySelector && !isProcessing && !isFailed && !errorMessage && levels.length > 0 && (
        <div className="absolute top-4 right-4 z-20">
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsGearOpen(!isGearOpen)}
              className="flex items-center gap-1.5 bg-slate-900/80 hover:bg-slate-800 backdrop-blur-md text-white text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-700/80 transition-all cursor-pointer shadow-lg"
              title="Cài đặt chất lượng video"
            >
              <Cog6ToothIcon className="w-4 h-4 text-sky-400" />
              <span>{currentLevel === -1 ? 'Auto' : `${levels.find((l) => l.index === currentLevel)?.height || ''}p`}</span>
            </button>

            {/* Modal/Dropdown Chọn Chất Lượng */}
            {isGearOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-slate-900/95 backdrop-blur-xl border border-slate-700/80 rounded-xl shadow-2xl py-2 text-xs text-slate-200 z-30 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800 mb-1">
                  Độ phân giải
                </div>

                <button
                  type="button"
                  onClick={() => handleQualityChange(-1)}
                  className={`w-full text-left px-3 py-1.5 hover:bg-sky-500/20 flex items-center justify-between transition-colors cursor-pointer ${currentLevel === -1 ? 'text-sky-400 font-bold bg-sky-500/10' : 'text-slate-200'
                    }`}
                >
                  <span>Auto (Tự động ABR)</span>
                  {currentLevel === -1 && <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />}
                </button>

                {levels.map((lvl) => (
                  <button
                    key={lvl.index}
                    type="button"
                    onClick={() => handleQualityChange(lvl.index)}
                    className={`w-full text-left px-3 py-1.5 hover:bg-sky-500/20 flex items-center justify-between transition-colors cursor-pointer ${currentLevel === lvl.index ? 'text-sky-400 font-bold bg-sky-500/10' : 'text-slate-200'
                      }`}
                  >
                    <span>{lvl.label}</span>
                    {currentLevel === lvl.index && <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
