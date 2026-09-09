import { VIDEO_UPLOAD_TASK_STATUS } from '../constants';

export type UploadTaskStatus = typeof VIDEO_UPLOAD_TASK_STATUS[keyof typeof VIDEO_UPLOAD_TASK_STATUS];

export interface UploadOptions {
  /** Thư mục lưu trữ (ví dụ: 'videos', 'thumbnails', 'blogs', 'avatars') */
  folderType: string;

  /** Kích thước file tối đa cho phép (tính bằng bytes). Nếu vượt quá sẽ throw Error */
  maxSizeBytes?: number;

  /** Kích thước mỗi chunk (mặc định 10MB) */
  chunkSizeBytes?: number;

  /** Số lượng kết nối PUT song song tối đa (mặc định 3 luồng) */
  concurrency?: number;

  /** Signal để hủy request upload giữa chừng */
  signal?: AbortSignal;

  /** Hàm callback kiểm tra file hợp lệ trước khi upload (ví dụ: check Magic Bytes) */
  validateFn?: (file: File) => Promise<{ isValid: boolean; message?: string }>;

  /** Callback cập nhật % tiến độ upload (0 - 100) */
  onProgress?: (percent: number, completedCount?: number, totalParts?: number) => void;

  /** Callback kích hoạt khi đã khởi tạo xong Upload Session */
  onSessionInit?: (session: { uploadId?: string; key?: string; fileUrl?: string; videoId?: string }) => void;
}

export interface UploadResult {
  /** URL công khai xem tệp */
  fileUrl: string;

  /** Đường dẫn Key / Identifier của tệp */
  key: string;
}

export interface PartETag {
  PartNumber: number;
  ETag: string;
}

export interface ActiveUploadTask {
  id: string;
  file: File;
  fileName: string;
  fileSize: number;
  progress: number;
  status: UploadTaskStatus;
  completedParts: PartETag[];
  totalParts: number;
  uploadId?: string;
  key?: string;
  fileUrl?: string;
  error?: string;
  isResumed?: boolean;
  abortController?: AbortController;
  videoFormData?: any;
  onSuccessCallback?: (uploadedPath: string) => void;
}

