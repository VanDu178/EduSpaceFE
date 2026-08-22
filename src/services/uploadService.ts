import api from './api';

export interface UploadResponse {
  url: string;
  path: string;
  fileName: string;
}

/**
 * Upload 1 file lên server (Backend sẽ đẩy tiếp lên Supabase Storage)
 * 
 * @param file File cần upload
 * @param folder Thư mục trên Supabase Bucket (mặc định 'blogs')
 * @returns Đường dẫn URL công khai của file
 */
export async function uploadSingleFileApi(file: File, folder: string = 'blogs'): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('folder', folder);

  const response = await api.post('/upload/single', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data.data;
}

/**
 * Upload nhiều file lên server
 */
export async function uploadMultipleFilesApi(files: File[], folder: string = 'blogs'): Promise<UploadResponse[]> {
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

  return response.data.data;
}
