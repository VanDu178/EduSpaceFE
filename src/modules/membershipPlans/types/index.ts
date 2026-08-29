import type { Feature } from '../../features/types';
import type { FilterStatus } from '../constants';

export interface PlanFeatureItem {
  planId?: number;
  featureId: number;
  isAvailable: boolean;
  disabledAt?: string | null;
  feature?: Feature;
}

export interface MembershipPlan {
  id: number;
  code: string;
  name: string;
  tagLine: string | null;
  monthlyPrice: number;
  yearlyPrice: number;
  yearlyDiscountPercent: number;
  popularBadge: string | null;
  buttonText: string | null;
  tierLevel: number;
  isActive: boolean;
  hasSubscribers?: boolean;
  subscriberCount?: number;
  planFeatures?: PlanFeatureItem[];
  createdAt: string;
  updatedAt: string;
}

export interface MembershipPlanPayload {
  name: string;
  tagLine?: string | null;
  monthlyPrice?: number;
  yearlyPrice?: number;
  yearlyDiscountPercent?: number;
  popularBadge?: string | null;
  buttonText?: string | null;
  planFeatures?: {
    featureId: number;
    isAvailable: boolean;
    disabledAt?: string | null;
    compensateDays?: number;
    notifyReason?: string;
  }[];
  tierLevel?: number;
  isActive?: boolean;
}

export interface MembershipPlanParams {
  isActive?: FilterStatus;
  keyword?: string;
}
