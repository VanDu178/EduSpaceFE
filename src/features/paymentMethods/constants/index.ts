export interface PaymentMethodMetadata {
  code: string;
  name: string;
  description: string;
  icon: string;
  sortOrder: number;
  isActive: boolean;
}

/**
 * HẰNG SỐ DUY NHẤT QUẢN LÝ TOÀN BỘ MÃ PHƯƠNG THỨC THANH TOÁN DẠNG IN HOA (UPPERCASE)
 */
export const PAYMENT_METHOD_CODES = {
  VIETQR: 'VIETQR',
  CREDIT_CARD: 'CREDIT_CARD',
  E_WALLET: 'E_WALLET',
} as const;

export type PaymentMethodCode = keyof typeof PAYMENT_METHOD_CODES;

/**
 * DANH SÁCH OPTION ICON CHUẨN DÙNG CHUNG CHO FORM CREATE & FORM UPDATE
 */
export const PAYMENT_ICON_OPTIONS = [
  { value: 'QrCodeIcon', label: 'Quét mã QR (QrCodeIcon)' },
  { value: 'CreditCardIcon', label: 'Thẻ thanh toán (CreditCardIcon)' },
  { value: 'WalletIcon', label: 'Ví điện tử (WalletIcon)' },
  { value: 'BanknotesIcon', label: 'Tiền mặt (BanknotesIcon)' },
  { value: 'BuildingLibraryIcon', label: 'Ngân hàng (BuildingLibraryIcon)' },
] as const;



/**
 * Cấu hình chi tiết hiển thị mặc định của các phương thức thanh toán
 */
export const PAYMENT_METHODS = {
  VIETQR: {
    code: PAYMENT_METHOD_CODES.VIETQR,
    name: 'Chuyển khoản QR (VietQR)',
    description: 'Thanh toán quét mã QR qua ứng dụng ngân hàng tự động duyệt nhanh chóng.',
    icon: 'QrCodeIcon',
    sortOrder: 1,
    isActive: true,
  },
  CREDIT_CARD: {
    code: PAYMENT_METHOD_CODES.CREDIT_CARD,
    name: 'Thẻ quốc tế / Ghi nợ',
    description: 'Thanh toán trực tiếp qua thẻ Visa, Mastercard, JCB.',
    icon: 'CreditCardIcon',
    sortOrder: 2,
    isActive: true,
  },
  E_WALLET: {
    code: PAYMENT_METHOD_CODES.E_WALLET,
    name: 'Ví điện tử',
    description: 'Thanh toán nhanh qua các ví điện tử MoMo, ZaloPay, VNPay.',
    icon: 'WalletIcon',
    sortOrder: 3,
    isActive: true,
  },
} as const;
