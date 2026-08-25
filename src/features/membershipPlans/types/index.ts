import type { Feature } from '../../features/types';

export interface PlanFeatureItem {
  planId?: number;
  featureId: number;
  isAvailable: boolean;
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
  planFeatures?: { featureId: number; isAvailable: boolean }[];
  tierLevel?: number;
  isActive?: boolean;
}

export interface MembershipPlanParams {
  isActive?: 'all' | 'true' | 'false';
  keyword?: string;
}
