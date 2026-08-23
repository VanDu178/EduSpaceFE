export interface MembershipPlan {
  id: number;
  code: string;
  name: string;
  tagLine: string | null;
  monthlyPrice: number;
  yearlyPrice: number;
  popularBadge: string | null;
  buttonText: string | null;
  features: string[] | null;
  unavailableFeatures: string[] | null;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MembershipPlanPayload {
  name: string;
  tagLine?: string | null;
  monthlyPrice?: number;
  yearlyPrice?: number;
  popularBadge?: string | null;
  buttonText?: string | null;
  features?: string[] | null;
  unavailableFeatures?: string[] | null;
  sortOrder?: number;
  isActive?: boolean;
}

export interface MembershipPlanParams {
  isActive?: 'all' | 'true' | 'false';
  keyword?: string;
}
