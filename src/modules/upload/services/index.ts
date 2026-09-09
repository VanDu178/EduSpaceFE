import * as tus from 'tus-js-client';
import api from '../../../services/api';
import type { UploadResult } from '../types';
import { CHUNK_SIZE, PARALLEL_CHUNKS_PER_VIDEO, FOLDER_NAME } from '../constants';

export interface UploadResponse {
  url: string;
  path: string;
  fileName: string;
}

export interface BunnyUploadOptions {
  signal?: AbortSignal;
  onProgress?: (percent: number) => void;
  onSessionInit?: (session: { videoId: string; uploadUrl: string; fileUrl: string }) => void;
}


/**
 * Service upload 1 file đơn lẻ lên Supabase Storage (thông qua API Backend /upload/single)
 */
export async function uploadSingleFileApi(
  file: File,
  folder: string = FOLDER_NAME.BLOGS
): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('folder', folder);

  const response = await api.post('/upload/single', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  if (response.data?.success === false) {
    throw new Error(response.data?.message || 'Upload file thất bại!');
  }

  return response.data.data;
}

/** Alias cho uploadSingleFileApi tương thích mã nguồn cũ */
export const uploadSingleSupabase = uploadSingleFileApi;

/**
 * Service upload nhiều file cùng lúc lên Supabase Storage (/upload/multiple)
 */
export async function uploadMultipleFilesApi(
  files: File[],
  folder: string = FOLDER_NAME.BLOGS
): Promise<UploadResponse[]> {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append('files', file);
  });
  formData.append('folder', folder);

  const response = await api.post('/upload/multiple', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  if (response.data?.success === false) {
    throw new Error(response.data?.message || 'Upload nhiều file thất bại!');
  }

  return response.data.data;
}

/**
 * Service xóa file khỏi Supabase Storage qua API Backend (/upload)
 */
export async function deleteFileApi(urlOrPath: string): Promise<boolean> {
  const response = await api.delete('/upload', {
    data: { url: urlOrPath },
  });

  return response.data?.success ?? false;
}

/**
 * Service upload video trực tiếp từ Trình duyệt sang Bunny Stream VOD Platform sử dụng TUS Protocol
 * Hỗ trợ chia nhỏ khối dữ liệu (5MB chunking), tự khôi phục khi mất kết nối, theo dõi tiến trình (0% - 100%), và tín hiệu hủy (AbortSignal)
 */
export async function uploadSingleBunnyStream(
  file: File,
  options: BunnyUploadOptions = {}
): Promise<UploadResult> {
  const { signal, onProgress, onSessionInit } = options;

  // 1. Khởi tạo phiên upload trên Backend (Backend gọi Bunny Stream API cấp Video ID & TUS Token Signature)
  const sessionRes = await api.post('/upload/bunny/create-session', { title: file.name }, { signal });

  if (!sessionRes.data?.success) {
    throw new Error(sessionRes.data?.message || 'Khởi tạo phiên upload thất bại!');
  }

  const { videoId, libraryId, apiKey, cdnHostname, signature, expirationTime } = sessionRes.data.data;
  const fileUrl = `https://${cdnHostname}/${videoId}/playlist.m3u8`;

  if (onSessionInit) {
    onSessionInit({ videoId, uploadUrl: 'https://video.bunnycdn.com/tusupload', fileUrl });
  }

  // 2. Tải file video lên Bunny Stream qua TUS Protocol (Sử dụng AuthorizationSignature SHA256 để bảo mật)
  return new Promise((resolve, reject) => {
    const uploadHeaders: Record<string, string> = {
      VideoId: videoId,
      LibraryId: String(libraryId),
    };

    if (signature && expirationTime) {
      uploadHeaders.AuthorizationSignature = signature;
      uploadHeaders.AuthorizationExpire = String(expirationTime);
    } else {
      uploadHeaders.AccessKey = apiKey;
    }

    const upload = new tus.Upload(file, {
      endpoint: 'https://video.bunnycdn.com/tusupload',
      retryDelays: [0, 3000, 5000, 10000],
      headers: uploadHeaders,
      chunkSize: CHUNK_SIZE.VIDEO, // Khối dữ liệu xé nhỏ cho TUS upload
      parallelUploads: PARALLEL_CHUNKS_PER_VIDEO, // Tải song song các chunks của 1 video cùng lúc
      metadata: {
        filetype: file.type,
        title: file.name,
      },
      onError: (error) => {
        reject(error);
      },
      onProgress: (bytesUploaded, bytesTotal) => {
        if (bytesTotal && onProgress) {
          const percent = Math.round((bytesUploaded * 100) / bytesTotal);
          onProgress(percent);
        }
      },
      onSuccess: () => {
        resolve({
          fileUrl,
          key: `bunny://${videoId}`,
        });
      },
    });

    // Lắng hệ tín hiệu AbortSignal hủy upload
    if (signal) {
      if (signal.aborted) {
        upload.abort();
        reject(new Error('Upload đã bị hủy'));
        return;
      }
      signal.addEventListener('abort', () => {
        upload.abort();
        reject(new Error('Upload đã bị hủy'));
      });
    }

    upload.start();
  });
}

/**
 * Service xóa tệp video trên Bunny Stream qua Backend khi xảy ra lỗi lưu Database (Rollback)
 */
export async function deleteBunnyVideoApi(videoId: string): Promise<boolean> {
  try {
    const res = await api.delete(`/upload/bunny/${videoId}`);
    return res.data?.success ?? false;
  } catch (error) {
    console.warn(`[UPLOAD ROLLBACK] Không thể xóa video mồ côi ${videoId} trên Bunny Stream:`, error);
    return false;
  }
}


