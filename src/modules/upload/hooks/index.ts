import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import {
  uploadSingleSupabase,
  uploadSingleBunnyStream,
  deleteBunnyVideoApi,
  uploadSingleFileApi,
  uploadMultipleFilesApi,
  deleteFileApi,
} from '../services';
import { FOLDER_NAME } from '../constants';
import { useUploadStore } from '../store/uploadStore';
import { VIDEO_UPLOAD_TASK_STATUS } from '../constants';

// Set lưu các task đang thực thi trong memory để tránh chạy lặp lại
const activeExecutions = new Set<string>();

/**
 * Universal Custom Hook cho phép bất kỳ component nào trong dự án upload file video Bunny Stream & ảnh Supabase Storage
 * và kết nối trực tiếp với Zustand Store toàn cục (Hỗ trợ Hàng chờ Upload song song tối đa 3 video)
 */
export function useUpload() {
  const [uploadingThumb, setUploadingThumb] = useState<boolean>(false);

  const tasks = useUploadStore((state) => state.tasks);
  const activeTask = useUploadStore((state) => state.activeTask);
  const addUploadTask = useUploadStore((state) => state.addUploadTask);
  const setTaskProgress = useUploadStore((state) => state.setTaskProgress);
  const setTaskStatus = useUploadStore((state) => state.setTaskStatus);
  const updateTask = useUploadStore((state) => state.updateTask);
  const cancelTaskStore = useUploadStore((state) => state.cancelTask);
  const removeTaskStore = useUploadStore((state) => state.removeTask);
  const clearCompletedTasks = useUploadStore((state) => state.clearCompletedTasks);

  const activeUploadingTasks = tasks.filter((t) => t.status === VIDEO_UPLOAD_TASK_STATUS.UPLOADING);
  const queuedTasks = tasks.filter((t) => t.status === VIDEO_UPLOAD_TASK_STATUS.QUEUED);
  const uploadingVideo = activeUploadingTasks.length > 0;
  const uploadProgress = activeTask?.progress || 0;

  // Tự động kích hoạt upload khi task chuyển trạng thái sang 'uploading' (ví dụ do processQueue đẩy lên)
  useEffect(() => {
    tasks.forEach((task) => {
      if (task.status === VIDEO_UPLOAD_TASK_STATUS.UPLOADING && !activeExecutions.has(task.id) && task.abortController) {
        executeUploadTask(task.id, task.file, task.abortController, task.onSuccessCallback);
      }
    });
  }, [tasks]);

  /**
   * Upload Video trực tiếp lên Bunny Stream VOD Platform (Chạy ngầm toàn cục qua Zustand Store Hàng chờ)
   */
  const handleUploadVideoFile = async (
    file: File,
    onSuccess?: (storagePath: string) => void,
  ): Promise<string | null> => {
    const { taskId, abortController, initialStatus } = addUploadTask(file, onSuccess);

    if (initialStatus === VIDEO_UPLOAD_TASK_STATUS.UPLOADING) {
      return executeUploadTask(taskId, file, abortController, onSuccess);
    }

    return null;
  };

  const executeUploadTask = async (
    taskId: string,
    file: File,
    abortController: AbortController,
    onSuccess?: (storagePath: string) => void
  ): Promise<string | null> => {
    if (activeExecutions.has(taskId)) return null;
    activeExecutions.add(taskId);

    let createdBunnyVideoId: string | null = null;

    try {
      // Upload trực tiếp sang Bunny Stream Platform
      const res = await uploadSingleBunnyStream(file, {
        signal: abortController.signal,
        onSessionInit: (session) => {
          createdBunnyVideoId = session.videoId;
          updateTask(taskId, {
            uploadId: session.videoId,
            key: `bunny://${session.videoId}`,
            fileUrl: session.fileUrl,
          });
        },
        onProgress: (percent) => {
          setTaskProgress(taskId, percent);
        },
      });

      const storagePath = res.fileUrl || res.key;
      setTaskStatus(taskId, VIDEO_UPLOAD_TASK_STATUS.COMPLETED);
      updateTask(taskId, { fileUrl: storagePath, key: res.key });
      // Thực thi callback lưu dữ liệu vào DB (Có cơ chế Rollback tự động dọn dẹp nếu DB save lỗi)
      if (onSuccess) {
        try {
          await onSuccess(storagePath);
        } catch (dbErr: any) {
          if (createdBunnyVideoId) {
            await deleteBunnyVideoApi(createdBunnyVideoId);
          }
          return null;
        }
      }
      return storagePath;
    } catch (err: any) {
      if (err?.name === 'AbortError' || err?.message?.includes('hủy')) {
        setTaskStatus(taskId, VIDEO_UPLOAD_TASK_STATUS.IDLE);
        return null;
      }
      setTaskStatus(taskId, VIDEO_UPLOAD_TASK_STATUS.ERROR, err?.message || `Tải video "${file.name}" thất bại!`);
      return null;
    } finally {
      activeExecutions.delete(taskId);
    }
  };

  /**
   * Upload Thumbnail lên Supabase Storage
   */
  const handleUploadThumbnail = async (
    file: File,
    folderName: string = FOLDER_NAME.THUMBNAIL_VIDEO,
    onSuccess?: (thumbnailUrl: string) => void
  ): Promise<string | null> => {
    setUploadingThumb(true);

    try {
      const res = await uploadSingleSupabase(file, folderName);
      const thumbnailUrl = res.url;
      if (onSuccess) {
        onSuccess(thumbnailUrl);
      }
      return thumbnailUrl;
    } catch (err: any) {
      return null;
    } finally {
      setUploadingThumb(false);
    }
  };

  /**
   * Upload Single File / Ảnh lên Supabase Storage với Toast notification
   */
  const handleUploadSingleFile = async (
    file: File,
    folder: string = FOLDER_NAME.BLOGS
  ) => {
    setUploadingThumb(true);
    try {
      const res = await uploadSingleFileApi(file, folder);
      toast.success('Tải ảnh/tệp lên thành công!');
      return res;
    } catch (err: any) {
      console.error('Upload single file error:', err);
      toast.error(err?.response?.data?.message || err?.message || 'Tải ảnh/tệp lên thất bại!');
      return null;
    } finally {
      setUploadingThumb(false);
    }
  };

  /**
   * Upload Multiple Files / Ảnh lên Supabase Storage với Toast notification
   */
  const handleUploadMultipleFiles = async (
    files: File[],
    folder: string = FOLDER_NAME.BLOGS
  ) => {
    setUploadingThumb(true);
    try {
      const results = await uploadMultipleFilesApi(files, folder);
      toast.success(`Tải ${results.length} tệp lên thành công!`);
      return results;
    } catch (err: any) {
      console.error('Upload multiple files error:', err);
      toast.error(err?.response?.data?.message || err?.message || 'Tải tệp lên thất bại!');
      return [];
    } finally {
      setUploadingThumb(false);
    }
  };

  /**
   * Xóa file khỏi kho lưu trữ Supabase Storage
   */
  const handleDeleteFile = async (urlOrPath: string) => {
    try {
      const success = await deleteFileApi(urlOrPath);
      if (success) {
        toast.success('Đã xóa tệp khỏi kho lưu trữ!');
      } else {
        toast.error('Không thể xóa tệp!');
      }
      return success;
    } catch (err: any) {
      console.error('Delete file error:', err);
      toast.error('Xóa tệp thất bại!');
      return false;
    }
  };

  return {
    tasks,
    activeTask,
    uploadingVideo,
    uploadingThumb,
    uploadProgress,
    activeUploadingCount: activeUploadingTasks.length,
    queuedCount: queuedTasks.length,
    handleUploadVideoFile,
    handleUploadThumbnail,
    handleUploadSingleFile,
    handleUploadMultipleFiles,
    handleDeleteFile,
    cancelUpload: cancelTaskStore,
    removeTask: removeTaskStore,
    clearCompletedTasks,
  };
}

export { useUpload as useR2Upload };
