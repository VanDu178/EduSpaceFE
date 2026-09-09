import { create } from 'zustand';
import type { ActiveUploadTask, UploadTaskStatus } from '../types';
import { VIDEO_UPLOAD_TASK_STATUS, MAX_CONCURRENT_UPLOADS } from '../constants';

export { MAX_CONCURRENT_UPLOADS };

interface UploadStoreState {
  tasks: ActiveUploadTask[];
  activeTask: ActiveUploadTask | null; // Giữ tương thích ngược cho UI hiển thị task mới nhất
  isMinimized: boolean;

  // Actions quản lý đa Task (Multiple Upload Tasks)
  addUploadTask: (
    file: File,
    videoFormData?: any,
    onSuccessCallback?: (uploadedPath: string) => void
  ) => { taskId: string; abortController: AbortController; initialStatus: UploadTaskStatus };
  updateTask: (taskId: string, updates: Partial<ActiveUploadTask>) => void;
  setTaskProgress: (taskId: string, progress: number, completedPartsCount?: number, totalParts?: number) => void;
  setTaskStatus: (taskId: string, status: UploadTaskStatus, error?: string) => void;
  cancelTask: (taskId: string) => void;
  removeTask: (taskId: string) => void;
  clearCompletedTasks: () => void;
  processQueue: () => void;

  // Actions tương thích ngược (Backward compatibility)
  startUploadTask: (file: File, videoFormData?: any) => AbortController;
  updateActiveTask: (updates: Partial<ActiveUploadTask>) => void;
  setProgress: (progress: number, completedPartsCount?: number, totalParts?: number) => void;
  setStatus: (status: UploadTaskStatus, error?: string) => void;
  cancelUpload: () => void;
  clearTask: () => void;

  // Modal & UI State
  toggleMinimize: () => void;
  setMinimized: (minimized: boolean) => void;
}

export const useUploadStore = create<UploadStoreState>((set, get) => ({
  tasks: [],
  activeTask: null,
  isMinimized: false,

  addUploadTask: (file: File, videoFormData?: any, onSuccessCallback?: (uploadedPath: string) => void) => {
    const abortController = new AbortController();
    const taskId = `${file.name}_${Date.now()}`;

    const currentTasks = get().tasks;
    const activeUploadingCount = currentTasks.filter((t) => t.status === VIDEO_UPLOAD_TASK_STATUS.UPLOADING).length;
    const initialStatus: UploadTaskStatus = activeUploadingCount < MAX_CONCURRENT_UPLOADS ? VIDEO_UPLOAD_TASK_STATUS.UPLOADING : VIDEO_UPLOAD_TASK_STATUS.QUEUED;

    const newTask: ActiveUploadTask = {
      id: taskId,
      file,
      fileName: file.name,
      fileSize: file.size,
      progress: 0,
      status: initialStatus,
      completedParts: [],
      totalParts: 0,
      abortController,
      videoFormData,
      onSuccessCallback,
    };

    set((state) => ({
      tasks: [...state.tasks, newTask],
      activeTask: newTask,
      isMinimized: false,
    }));

    return { taskId, abortController, initialStatus };
  },

  updateTask: (taskId: string, updates: Partial<ActiveUploadTask>) => {
    set((state) => {
      const updatedTasks = state.tasks.map((task) => (task.id === taskId ? { ...task, ...updates } : task));
      const updatedActiveTask = state.activeTask?.id === taskId ? { ...state.activeTask, ...updates } : state.activeTask;

      return {
        tasks: updatedTasks,
        activeTask: updatedActiveTask,
      };
    });
  },

  setTaskProgress: (taskId: string, progress: number, totalParts?: number) => {
    set((state) => {
      const clampedProgress = Math.min(100, Math.max(0, progress));
      const updatedTasks = state.tasks.map((task) => {
        if (task.id !== taskId) return task;
        return {
          ...task,
          progress: clampedProgress,
          ...(totalParts !== undefined ? { totalParts } : {}),
        };
      });

      const updatedActiveTask =
        state.activeTask?.id === taskId
          ? {
            ...state.activeTask,
            progress: clampedProgress,
            ...(totalParts !== undefined ? { totalParts } : {}),
          }
          : state.activeTask;

      return {
        tasks: updatedTasks,
        activeTask: updatedActiveTask,
      };
    });
  },

  setTaskStatus: (taskId: string, status: UploadTaskStatus, error?: string) => {
    set((state) => {
      const updatedTasks = state.tasks.map((task) => {
        if (task.id !== taskId) return task;
        return {
          ...task,
          status,
          ...(error !== undefined ? { error } : {}),
        };
      });

      const updatedActiveTask =
        state.activeTask?.id === taskId
          ? {
            ...state.activeTask,
            status,
            ...(error !== undefined ? { error } : {}),
          }
          : state.activeTask;

      return {
        tasks: updatedTasks,
        activeTask: updatedActiveTask,
      };
    });

    if (status === VIDEO_UPLOAD_TASK_STATUS.COMPLETED || status === VIDEO_UPLOAD_TASK_STATUS.ERROR) {
      get().processQueue();
    }
  },

  cancelTask: (taskId: string) => {
    const task = get().tasks.find((t) => t.id === taskId);
    if (task) {
      if (task.abortController) {
        task.abortController.abort();
      }
    }

    set((state) => {
      const updatedTasks = state.tasks.map((t) => (t.id === taskId ? { ...t, status: VIDEO_UPLOAD_TASK_STATUS.IDLE, progress: 0 } : t));
      const updatedActiveTask = state.activeTask?.id === taskId ? { ...state.activeTask, status: VIDEO_UPLOAD_TASK_STATUS.IDLE, progress: 0 } : state.activeTask;
      return {
        tasks: updatedTasks,
        activeTask: updatedActiveTask,
      };
    });

    get().processQueue();
  },

  removeTask: (taskId: string) => {
    const task = get().tasks.find((t) => t.id === taskId);
    if (task) {
      if (task.abortController) {
        task.abortController.abort();
      }
    }

    set((state) => {
      const filteredTasks = state.tasks.filter((t) => t.id !== taskId);
      const newActiveTask = state.activeTask?.id === taskId ? (filteredTasks.length > 0 ? filteredTasks[filteredTasks.length - 1] : null) : state.activeTask;
      return {
        tasks: filteredTasks,
        activeTask: newActiveTask,
      };
    });

    get().processQueue();
  },

  clearCompletedTasks: () => {
    set((state) => {
      const remainingTasks = state.tasks.filter((t) => t.status !== VIDEO_UPLOAD_TASK_STATUS.COMPLETED && t.status !== VIDEO_UPLOAD_TASK_STATUS.ERROR);
      return {
        tasks: remainingTasks,
        activeTask: remainingTasks.length > 0 ? remainingTasks[remainingTasks.length - 1] : null,
      };
    });
  },

  processQueue: () => {
    const { tasks } = get();
    const uploadingCount = tasks.filter((t) => t.status === VIDEO_UPLOAD_TASK_STATUS.UPLOADING).length;

    if (uploadingCount < MAX_CONCURRENT_UPLOADS) {
      const queuedTask = tasks.find((t) => t.status === VIDEO_UPLOAD_TASK_STATUS.QUEUED);
      if (queuedTask) {
        get().setTaskStatus(queuedTask.id, VIDEO_UPLOAD_TASK_STATUS.UPLOADING);
      }
    }
  },

  // BACKWARD COMPATIBILITY
  startUploadTask: (file: File, videoFormData?: any) => {
    const { abortController } = get().addUploadTask(file, videoFormData);
    return abortController;
  },

  updateActiveTask: (updates) => {
    const active = get().activeTask;
    if (active) {
      get().updateTask(active.id, updates);
    }
  },

  setProgress: (progress, completedPartsCount, totalParts) => {
    const active = get().activeTask;
    if (active) {
      get().setTaskProgress(active.id, progress, completedPartsCount, totalParts);
    }
  },

  setStatus: (status, error) => {
    const active = get().activeTask;
    if (active) {
      get().setTaskStatus(active.id, status, error);
    }
  },

  cancelUpload: () => {
    const active = get().activeTask;
    if (active) {
      get().cancelTask(active.id);
    }
  },

  clearTask: () => {
    const active = get().activeTask;
    if (active) {
      get().removeTask(active.id);
    }
  },

  toggleMinimize: () => {
    set((state) => ({ isMinimized: !state.isMinimized }));
  },

  setMinimized: (isMinimized) => {
    set({ isMinimized });
  },
}));
