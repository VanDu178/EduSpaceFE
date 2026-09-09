export interface VideoType {
  id: number;
  code: string;
  name: string;
  description?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface VideoCreator {
  id: number;
  name: string | null;
  email: string;
  avatarUrl?: string | null;
}

export interface Video {
  id: string;
  code: string;
  title: string;
  slug: string;
  description?: string | null;
  sourceType: 'direct_upload' | 'youtube';
  youtubeVideoId?: string | null;
  storagePath?: string | null;
  duration: number; // Tính bằng giây
  teaserDuration: number; // Tính bằng giây (0 = không giới hạn)
  thumbnailUrl?: string | null;
  isPremium: boolean;
  status: 'draft' | 'published' | 'archived';
  processStatus?: 'processing' | 'ready' | 'failed';
  videoTypeId: number;
  videoType?: VideoType;
  creator?: VideoCreator | null;
  createdAt: string;
  updatedAt: string;
}

export interface VideoPayload {
  title: string;
  code?: string;
  slug?: string;
  description?: string | null;
  sourceType: 'direct_upload' | 'youtube';
  youtubeVideoId?: string | null;
  storagePath?: string | null;
  duration?: number;
  teaserDuration?: number; // Số giây hoặc chuyển đổi từ phút
  thumbnailUrl?: string | null;
  isPremium?: boolean;
  status?: 'draft' | 'published' | 'archived';
  processStatus?: 'processing' | 'ready' | 'failed';
  videoTypeId: number;
}

export interface VideoQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  videoTypeId?: number;
  sourceType?: 'direct_upload' | 'youtube';
  status?: 'draft' | 'published' | 'archived';
  processStatus?: 'processing' | 'ready' | 'failed';
  isPremium?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
