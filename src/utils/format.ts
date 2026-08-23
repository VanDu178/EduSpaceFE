/**
 * Định dạng số tiền sang chuỗi hiển thị đơn vị VND (Việt Nam Đồng)
 * @param amount Số tiền cần định dạng (number | null | undefined)
 * @returns Chuỗi tiền tệ đã định dạng (Ví dụ: "100.000 ₫" hoặc "0 ₫")
 */
export const formatCurrency = (amount: number | null | undefined): string => {
  if (amount === null || amount === undefined) return '0 ₫';
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};
