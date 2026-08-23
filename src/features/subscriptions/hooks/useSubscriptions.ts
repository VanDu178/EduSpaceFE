import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import {
  fetchSubscriptionsApi,
  fetchSubscriptionByIdApi,
  createSubscriptionApi,
  updateSubscriptionStatusApi,
} from '../api';
import type {
  UserSubscription,
  UserSubscriptionParams,
  CreateSubscriptionPayload,
  UpdateSubscriptionStatusPayload,
  SubscriptionPagination,
} from '../types';

export const useSubscriptions = (initialParams?: UserSubscriptionParams) => {
  const [items, setItems] = useState<UserSubscription[]>([]);
  const [pagination, setPagination] = useState<SubscriptionPagination>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [params, setParams] = useState<UserSubscriptionParams>({
    page: 1,
    limit: 10,
    status: 'all',
    search: '',
    ...initialParams,
  });

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchSubscriptionsApi(params);
      setItems(res.items || []);
      if (res.pagination) {
        setPagination(res.pagination);
      }
    } catch (err: any) {
      toast.error(err.message || 'Không thể tải danh sách đăng ký thanh toán');
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const updateFilters = (newParams: Partial<UserSubscriptionParams>) => {
    setParams(prev => ({
      ...prev,
      ...newParams,
      page: newParams.page !== undefined ? newParams.page : 1, // reset page về 1 nếu thay đổi lọc khác
    }));
  };

  const handlePageChange = (page: number, pageSize?: number) => {
    setParams(prev => ({
      ...prev,
      page,
      limit: pageSize || prev.limit || 10,
    }));
  };

  return {
    items,
    pagination,
    loading,
    params,
    updateFilters,
    handlePageChange,
    refetch: loadData,
  };
};

export const useSubscriptionDetail = (id: number | null) => {
  const [data, setData] = useState<UserSubscription | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchDetail = useCallback(async () => {
    if (!id) {
      setData(null);
      return;
    }
    setLoading(true);
    try {
      const result = await fetchSubscriptionByIdApi(id);
      setData(result);
    } catch (err: any) {
      toast.error(err.message || 'Không thể lấy thông tin chi tiết đơn');
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  return { data, loading, refetch: fetchDetail };
};

export const useCreateSubscription = (onSuccess?: () => void) => {
  const [submitting, setSubmitting] = useState<boolean>(false);

  const createItem = async (payload: CreateSubscriptionPayload) => {
    setSubmitting(true);
    try {
      const res = await createSubscriptionApi(payload);
      if (res.success) {
        toast.success(res.message || 'Cấp mới đơn đăng ký gói thành công');
        onSuccess?.();
        return true;
      } else {
        toast.error(res.message || 'Không thể đăng ký gói hội viên');
        return false;
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Đã có lỗi xảy ra';
      toast.error(msg);
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  return { createItem, submitting };
};

export const useUpdateSubscriptionStatus = (onSuccess?: () => void) => {
  const [submitting, setSubmitting] = useState<boolean>(false);

  const updateStatus = async (id: number, payload: UpdateSubscriptionStatusPayload) => {
    setSubmitting(true);
    try {
      const res = await updateSubscriptionStatusApi(id, payload);
      if (res.success) {
        toast.success(res.message || 'Cập nhật trạng thái thành công');
        onSuccess?.();
        return true;
      } else {
        toast.error(res.message || 'Không thể cập nhật trạng thái đơn');
        return false;
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Đã có lỗi xảy ra';
      toast.error(msg);
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  return { updateStatus, submitting };
};
