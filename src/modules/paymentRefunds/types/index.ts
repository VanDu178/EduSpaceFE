export interface PaymentRefund {
  id: number;
  code: string;
  paymentTxId: number;
  amount: number;
  refundRef?: string | null;
  proofUrls?: string[] | null;
  notes?: string | null;
  refundedBy?: number | null;
  createdAt: string;
  updatedAt?: string;
  paymentTransaction?: {
    id: number;
    code: string;
    amount: number;
    paidAmount?: number;
    transferContent: string;
    user?: {
      id: number;
      name?: string;
      email: string;
    };
  };
  refundedByUser?: {
    id: number;
    code?: string;
    email: string;
    name?: string;
  } | null;
}

export interface ConfirmRefundParams {
  paymentTxId: number;
  amount: number;
  refundRef?: string;
  proofUrls?: string[];
  notes?: string;
}

export interface UpdateRefundParams {
  amount?: number;
  refundRef?: string;
  proofUrls?: string[];
  notes?: string;
}


export interface PaymentRefundParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface FetchPaymentRefundsResponse {
  items: PaymentRefund[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}
