import { useState, useCallback, useEffect } from 'react';
import toast from 'react-hot-toast';
import type { Feature, FeaturePayload } from '../types';
import {
  fetchFeaturesApi,
  createFeatureApi,
  updateFeatureApi,
  updateFeatureSortOrderApi,
  toggleFeatureStatusApi,
  deleteFeatureApi,
} from '../api';

export const useFeatures = () => {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [keyword, setKeyword] = useState<string>('');
  const [status, setStatus] = useState<string>('ALL');

  const fetchFeatures = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await fetchFeaturesApi({ keyword, status });
      setFeatures(data);
    } catch (error: any) {
      toast.error(error.message || 'Không thể tải danh sách tính năng');
    } finally {
      setIsLoading(false);
    }
  }, [keyword, status]);

  useEffect(() => {
    fetchFeatures();
  }, [fetchFeatures]);

  const handleCreate = async (payload: FeaturePayload): Promise<boolean> => {
    try {
      setIsSubmitting(true);
      const res = await createFeatureApi(payload);
      if (res?.success) {
        toast.success('Tạo tính năng mới thành công!');
        fetchFeatures();
        return true;
      }
      toast.error(res?.message || 'Không thể tạo tính năng mới');
      return false;
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error?.message || 'Đã xảy ra lỗi khi tạo tính năng');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (id: number, payload: FeaturePayload): Promise<boolean> => {
    try {
      setIsSubmitting(true);
      const res = await updateFeatureApi(id, payload);
      if (res?.success) {
        toast.success('Cập nhật tính năng thành công!');
        fetchFeatures();
        return true;
      }
      toast.error(res?.message || 'Không thể cập nhật tính năng');
      return false;
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error?.message || 'Đã xảy ra lỗi khi cập nhật tính năng');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateSortOrder = async (id: number, sortOrder: number): Promise<boolean> => {
    try {
      const res = await updateFeatureSortOrderApi(id, sortOrder);
      if (res?.success) {
        toast.success('Cập nhật thứ tự thành công!');
        fetchFeatures();
        return true;
      }
      toast.error(res?.message || 'Không thể cập nhật thứ tự');
      return false;
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error?.message || 'Lỗi khi cập nhật thứ tự');
      return false;
    }
  };

  const handleToggleStatus = async (id: number): Promise<boolean> => {
    try {
      const res = await toggleFeatureStatusApi(id);
      if (res?.success) {
        toast.success(res.message || 'Cập nhật trạng thái thành công');
        fetchFeatures();
        return true;
      }
      toast.error(res?.message || 'Không thể cập nhật trạng thái');
      return false;
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error?.message || 'Lỗi khi cập nhật trạng thái');
      return false;
    }
  };

  const handleDelete = async (id: number): Promise<boolean> => {
    try {
      const res = await deleteFeatureApi(id);
      if (res?.success) {
        toast.success('Xóa tính năng thành công!');
        fetchFeatures();
        return true;
      }
      toast.error(res?.message || 'Không thể xóa tính năng');
      return false;
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error?.message || 'Lỗi khi xóa tính năng');
      return false;
    }
  };

  return {
    features,
    isLoading,
    isSubmitting,
    keyword,
    setKeyword,
    status,
    setStatus,
    fetchFeatures,
    handleCreate,
    handleUpdate,
    handleUpdateSortOrder,
    handleToggleStatus,
    handleDelete,
  };
};
