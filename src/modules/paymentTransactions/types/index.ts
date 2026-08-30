import type { PaymentRefund, ConfirmRefundParams } from '../../paymentRefunds';

export type PaymentTransactionStatus = 'pending' | 'partially_paid' | 'completed' | 'overpaid' | 'expired' | 'cancelled';
export type RefundStatus = 'none' | 'unrefunded' | 'partially_refunded' | 'fully_refunded';

export type { PaymentRefund, ConfirmRefundParams };

export interface PaymentTransaction {
  id: number;
  code: string;
  userId: number;
  planId: number;
  paymentAccountId?: number | null;
  billingCycle: 'monthly' | 'yearly';
  amount: number;
  paidAmount?: number;
  overpaidAmount?: number;
  remainingAmount?: number;
  totalRefundedAmount?: number;
  notes?: string | null;
  paymentMethod: string;
  transferContent: string;
  status: PaymentTransactionStatus;
  refundStatus?: RefundStatus;
  approvalType?: 'auto' | 'manual';
  approvedBy?: number | null;
  bankCode?: string | null;
  accountNo?: string | null;
  accountHolder?: string | null;
  qrCodeUrl?: string | null;
  paymentRef?: string | null;
  expiredAt: string;
  paidAt?: string | null;
  createdAt: string;
  updatedAt: string;

  user?: {
    id: number;
    code?: string;
    email: string;
    name?: string;
    avatarUrl?: string;
  };
  approvedByUser?: {
    id: number;
    code?: string;
    email: string;
    name?: string;
    avatarUrl?: string;
  } | null;
  plan?: {
    id: number;
    code: string;
    name: string;
  };
  paymentAccount?: {
    id: number;
    bankCode: string;
    accountNo: string;
    accountHolder: string;
    bank?: {
      name: string;
      shortName: string;
      logo?: string;
    };
  };
  refunds?: PaymentRefund[];
}

export interface PaymentTransactionParams {
  page?: number;
  limit?: number;
  status?: string;
  refundStatus?: string;
  search?: string;
}

export interface FetchPaymentTransactionsResponse {
  items: PaymentTransaction[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}
