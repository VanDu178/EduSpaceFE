import type { SubscriptionStatus, BillingCycle } from '../types';

export const STATUS_CONFIG: Record<
  SubscriptionStatus,
  { label: string; color: string; badgeStatus: 'success' | 'warning' | 'error' | 'default'; textColor: string }
> = {
  active: {
    label: 'Hoạt động',
    color: 'emerald',
    badgeStatus: 'success',
    textColor: 'text-emerald-600',
  },
  pending_payment: {
    label: 'Chờ thanh toán',
    color: 'amber',
    badgeStatus: 'warning',
    textColor: 'text-amber-600',
  },
  cancelled: {
    label: 'Đã hủy',
    color: 'rose',
    badgeStatus: 'error',
    textColor: 'text-rose-600',
  },
  expired: {
    label: 'Hết hạn',
    color: 'slate',
    badgeStatus: 'default',
    textColor: 'text-slate-500',
  },
};

export const BILLING_CYCLE_LABELS: Record<BillingCycle, string> = {
  monthly: 'Hàng tháng',
  yearly: 'Hàng năm',
};

export const PAYMENT_METHOD_OPTIONS = [
  { value: 'bank_transfer', label: 'Chuyển khoản ngân hàng' },
  { value: 'momo', label: 'Ví MoMo' },
  { value: 'vnpay', label: 'Cổng VNPay' },
  { value: 'credit_card', label: 'Thẻ tín dụng / Ghi nợ' },
  { value: 'cash', label: 'Tiền mặt' },
  { value: 'free', label: 'Miễn phí / Quà tặng' },
];

export const PAYMENT_METHOD_LABELS: Record<string, string> = {
  vietqr: 'Chuyển khoản QR (VietQR)',
  qr_banking: 'Chuyển khoản QR (VietQR)',
  bank_transfer: 'Chuyển khoản ngân hàng',
  credit_card: 'Thẻ tín dụng / Ghi nợ',
  e_wallet: 'Ví điện tử',
  momo: 'Ví MoMo',
  vnpay: 'Cổng VNPay',
  cash: 'Tiền mặt',
  free: 'Miễn phí',
};
