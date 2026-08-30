export type SubscriptionCreatedType = 'system' | 'admin';

export interface UserSubscription {
  id: number;
  code: string;
  userId: number;
  planId: number;
  billingCycle: BillingCycle;
  startDate: string;
  endDate: string;
  status: SubscriptionStatus;
  pricePaid: number;
  paymentMethod: string | null;
  paymentRef: string | null;
  cancelledAt: string | null;
  cancelReason: string | null;
  createdType?: SubscriptionCreatedType;
  createdBy?: number | null;
  notes?: string | null;
  proofUrls?: string[] | null;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: number;
    code?: string | null;
    email: string;
    name?: string | null;
    avatarUrl?: string | null;
  };
  createdByUser?: {
    id: number;
    code?: string | null;
    email: string;
    name?: string | null;
    avatarUrl?: string | null;
  };
  plan?: {
    id: number;
    code: string;
    name: string;
    monthlyPrice: number;
    yearlyPrice: number;
    popularBadge?: string | null;
  };
}

export interface UserSubscriptionParams {
  page?: number;
  limit?: number;
  userId?: number;
  status?: SubscriptionStatus | 'all';
  search?: string;
}

export interface CreateSubscriptionPayload {
  userId?: number;
  planId: number;
  billingCycle?: BillingCycle;
  paymentMethod?: string;
  paymentRef?: string;
  status?: SubscriptionStatus;
  notes?: string;
  proofUrls?: string[];
  startDate?: string;
  endDate?: string;
}

export interface UpdateSubscriptionStatusPayload {
  status?: SubscriptionStatus;
  cancelReason?: string;
  endDate?: string;
  notes?: string;
  proofUrls?: string[];
}

export interface SubscriptionPagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

export interface FetchSubscriptionsResponse {
  items: UserSubscription[];
  pagination: SubscriptionPagination;
}
