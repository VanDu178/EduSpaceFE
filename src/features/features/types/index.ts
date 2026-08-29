export interface Feature {
  id: number;
  code: string;
  name: string;
  description: string | null;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PlanFeatureItem {
  featureId: number;
  isAvailable: boolean;
  feature?: Feature;
}

export interface FeaturePayload {
  code: string;
  name: string;
  description?: string | null;
  sortOrder?: number;
  isActive?: boolean;
}

export interface SystemFeatureCode {
  code: string;
  name: string;
  description: string;
  isCreated: boolean;
}

export interface FeatureQueryParams {
  keyword?: string;
  status?: string;
}
