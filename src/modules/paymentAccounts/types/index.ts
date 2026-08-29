import type { VietqrBank } from '../../vietqrBanks/types';

export interface PaymentAccount {
  id: number;
  bankCode: string;
  bank?: VietqrBank | null;
  accountNo: string;
  accountHolder: string;
  qrCodeUrl?: string | null;
  isDefault: boolean;
  note?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePaymentAccountDto {
  bankCode: string;
  accountNo: string;
  accountHolder: string;
  qrCodeUrl?: string | null;
  isDefault?: boolean;
  note?: string | null;
}

export interface UpdatePaymentAccountDto {
  bankCode?: string;
  accountNo?: string;
  accountHolder?: string;
  qrCodeUrl?: string | null;
  isDefault?: boolean;
  note?: string | null;
}

export interface PaymentAccountQueryParams {
  keyword?: string;
}
