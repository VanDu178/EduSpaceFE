export const FOLDER_NAME = {
    VIDEO: 'temp/videos',
    FINAL_VIDEO: 'videos',
    THUMBNAIL_VIDEO: 'thumbnails-video',
    BLOGS: 'blogs',
    SUBSCRIPTION_PROOFS: 'subscription-proofs',
    REFUND_PROOFS: 'refund-proofs',
    SUPPORT_CHAT: 'support-chat',
    SUPPORT_TICKETS: 'support-tickets',
} as const;

export const MAX_SIZE_UPLOAD = {
    VIDEO: 1024 * 1024 * 1024,
    THUMBNAIL_VIDEO: 1024 * 1024 * 10,
} as const;

// ChunkSize của video dùng cho việc chia nhỏ video thành các phần nhỏ để upload
export const CHUNK_SIZE = {
    VIDEO: 20 * 1024 * 1024, // 20MB per chunk cho tốc độ tối ưu
} as const;

// Số luồng upload chunk song song cho 1 video
export const PARALLEL_CHUNKS_PER_VIDEO = 3;

// Số luồng upload song song các video khác nhau
export const CONCURRENCY_UPLOAD_VIDEO = 3;
export const MAX_CONCURRENT_UPLOADS = CONCURRENCY_UPLOAD_VIDEO;

export const DISPLAY_SIZE_TEXT_UPLOAD = {
    VIDEO: '1GB',
    THUMBNAIL_VIDEO: '10MB',
} as const;

export const VIDEO_UPLOAD_TASK_STATUS = {
    IDLE: 'idle',
    QUEUED: 'queued',
    UPLOADING: 'uploading',
    PAUSED: 'paused',
    CANCEL: 'cancel',
    COMPLETED: 'completed',
    ERROR: 'error',
} as const;

// Cấu hình mặc định cho Upload Ảnh (Dùng làm fallback nếu vị trí cụ thể không khai báo)
export const DEFAULT_IMAGE_UPLOAD_CONFIG = {
    MAX_SIZE_MB: 5,
    MAX_COUNT: 1,
    ACCEPTED_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'],
    ACCEPT_STRING: 'image/jpeg,image/jpg,image/png,image/webp,image/gif',
    FORMATS_TEXT: 'JPG, PNG, WEBP, GIF',
    HINT_TEXT: 'Tối đa 1 ảnh (JPG, PNG, WEBP, GIF), dung lượng tối đa 5MB.',
} as const;

// Cấu hình mặc định cho Upload Video
export const DEFAULT_VIDEO_UPLOAD_CONFIG = {
    MAX_SIZE_MB: 1024,
    DISPLAY_SIZE_TEXT: '1GB',
    MAX_COUNT: 1,
    ACCEPTED_TYPES: ['video/mp4', 'video/webm', 'video/quicktime'],
    ACCEPT_STRING: 'video/mp4,video/webm,video/quicktime',
    FORMATS_TEXT: 'MP4, WEBM, MOV',
    HINT_TEXT: 'Tối đa 1 video (MP4, WEBM, MOV), dung lượng tối đa 1GB.',
} as const;

// --- CẤU HÌNH CỤ THỂ TỪNG VỊ TRÍ (Kế thừa từ Default) ---
export const IMAGE_UPLOAD_CONFIG = DEFAULT_IMAGE_UPLOAD_CONFIG;

export const THUMBNAIL_UPLOAD_CONFIG = {
    ...DEFAULT_IMAGE_UPLOAD_CONFIG,
    HINT_TEXT: 'Tối đa 1 ảnh đại diện (JPG, PNG, WEBP, GIF), dung lượng tối đa 5MB.',
} as const;

export const BLOG_BANNER_UPLOAD_CONFIG = {
    ...DEFAULT_IMAGE_UPLOAD_CONFIG,
    HINT_TEXT: 'Tối đa 1 ảnh bìa bài viết (JPG, PNG, WEBP, GIF), dung lượng tối đa 5MB.',
} as const;

export const VIDEO_UPLOAD_CONFIG = DEFAULT_VIDEO_UPLOAD_CONFIG;

export const PROOFS_UPLOAD_CONFIG = {
    ...DEFAULT_IMAGE_UPLOAD_CONFIG,
    MAX_COUNT: 5,
    ACCEPTED_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'application/pdf'],
    ACCEPT_STRING: 'image/jpeg,image/jpg,image/png,image/webp,application/pdf',
    FORMATS_TEXT: 'JPG, PNG, WEBP, PDF',
    HINT_TEXT: 'Tối đa 5 file minh chứng (JPG, PNG, WEBP, PDF), dung lượng tối đa 5MB mỗi file.',
} as const;

export const IMAGE_VALIDATION_MESSAGES = {
    FILE_NOT_FOUND: 'Tệp không tồn tại',
    SIZE_EXCEEDED: (maxMb: number) => `Dung lượng tệp phải nhỏ hơn ${maxMb}MB!`,
    INVALID_TYPE: (formats: string) => `Định dạng tệp không hợp lệ. Chỉ chấp nhận các định dạng: ${formats}!`,
    MAGIC_BYTES_INVALID: 'Nội dung tệp tải lên không khớp với định dạng tệp, kiểm tra lại tệp của bạn!',
} as const;




