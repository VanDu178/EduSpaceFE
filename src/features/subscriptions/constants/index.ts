import type { SubscriptionStatus, BillingCycle } from '../types';
import { PAYMENT_METHOD_CODES } from '../../paymentMethods/constants';

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
  { value: PAYMENT_METHOD_CODES.VIETQR, label: 'Chuyển khoản QR (VietQR)' },
  { value: PAYMENT_METHOD_CODES.CREDIT_CARD, label: 'Thẻ quốc tế / Ghi nợ' },
  { value: PAYMENT_METHOD_CODES.E_WALLET, label: 'Ví điện tử' },
];

export const PAYMENT_METHOD_LABELS: Record<string, string> = {
  [PAYMENT_METHOD_CODES.VIETQR]: 'Chuyển khoản QR (VietQR)',
  [PAYMENT_METHOD_CODES.CREDIT_CARD]: 'Thẻ quốc tế / Ghi nợ',
  [PAYMENT_METHOD_CODES.E_WALLET]: 'Ví điện tử',
};
