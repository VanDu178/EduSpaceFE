/**
 * Chuyển đổi chuỗi văn bản (tiêu đề, tên) thành URL slug không dấu
 * @param text Chuỗi văn bản cần chuyển đổi (string)
 * @returns Chuỗi slug tương ứng (Ví dụ: "Lớp học Phân tích" -> "lop-hoc-phan-tich")
 */
export const generateSlug = (text: string): string => {
  if (!text) return '';
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'd')
    .replace(/([^0-9a-z-\s])/g, '')
    .replace(/(\s+)/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
};



/**
 * Helper tạo URL xem trước file video tải lên từ Supabase Storage
 * @param path Đường dẫn tương đối hoặc URL tuyệt đối của video
 */
export const getDirectVideoUrl = (path: string): string => {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;

  const rawBaseUrl =
    import.meta.env.VITE_SUPABASE_URL;

  const baseUrl = rawBaseUrl.replace(/\/+$/, '');
  const bucketName = import.meta.env.VITE_SUPABASE_BUCKET;
  const cleanPath = path.replace(/^\/+/, '');

  return `${baseUrl}/storage/v1/object/public/${bucketName}/${cleanPath}`;
};

import dayjs from 'dayjs';

/**
 * Tự động trích xuất thời lượng (tính bằng số giây) từ file Video tải lên
 * @param file Đối tượng File video đã chọn từ máy tính
 */
export const getVideoDurationFromFile = (file: File): Promise<number> => {
  return new Promise((resolve) => {
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.onloadedmetadata = () => {
      window.URL.revokeObjectURL(video.src);
      const duration = Math.round(video.duration);
      resolve(Number.isNaN(duration) ? 0 : duration);
    };
    video.onerror = () => {
      resolve(0);
    };
    video.src = URL.createObjectURL(file);
  });
};

/**
 * Chuyển đổi số giây thành đối tượng Dayjs (định dạng HH:mm:ss) cho TimePicker
 * @param seconds Số giây
 */
export const secondsToDayjs = (seconds?: number | null): dayjs.Dayjs | null => {
  if (!seconds || seconds <= 0) return null;
  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return dayjs().hour(hours).minute(mins).second(secs);
};

/**
 * Quy đổi thời gian chọn từ TimePicker (đối tượng Dayjs) thành tổng số giây
 * @param timeObj Đối tượng Dayjs từ TimePicker
 */
export const dayjsToSeconds = (timeObj?: any): number => {
  if (!timeObj) return 0;
  const t = dayjs(timeObj);
  if (!t.isValid()) return 0;
  return t.hour() * 3600 + t.minute() * 60 + t.second();
};


