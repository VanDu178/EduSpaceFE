export type PaymentTransactionStatus = 'pending' | 'completed' | 'expired' | 'cancelled';

export interface PaymentTransaction {
  id: number;
  code: string;
  userId: number;
  planId: number;
  paymentAccountId?: number | null;
  billingCycle: 'monthly' | 'yearly';
  amount: number;
  paymentMethod: string;
  transferContent: string;
  status: PaymentTransactionStatus;
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
}

export interface PaymentTransactionParams {
  page?: number;
  limit?: number;
  status?: string;
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
