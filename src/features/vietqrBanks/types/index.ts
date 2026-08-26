export interface VietqrBank {
  id: number;
  name: string;
  shortName: string;
  code: string;
  bin: string;
  logo: string | null;
  transferSupported: number;
  lookupSupported: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface VietqrBankQueryParams {
  keyword?: string;
  status?: string; // 'ALL' | 'active' | 'inactive'
}

export interface SyncBankResultDto {
  totalFetched: number;
  totalSupported: number;
  createdCount: number;
  updatedCount: number;
}
