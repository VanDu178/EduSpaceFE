/**
 * Định dạng số tiền sang chuỗi hiển thị đơn vị VND
 * @param amount Số tiền cần định dạng (number | null | undefined)
 * @returns Chuỗi tiền tệ đã định dạng (Ví dụ: "100.000 đ" hoặc "0 đ")
 */
export const formatCurrency = (amount?: number | null): string => {
  if (amount === undefined || amount === null) return '0 đ';
  return `${Number(amount).toLocaleString('vi-VN')} đ`;
};

/**
 * Tùy chọn định dạng ngày tháng
 */
export interface FormatDateOptions {
  includeTime?: boolean;
  fallback?: string;
}

/**
 * Định dạng ngày/tháng sang chuỗi hiển thị theo chuẩn Việt Nam (vi-VN)
 * @param dateStr Chuỗi ngày ISO/Date string hoặc đối tượng Date (string | Date | null | undefined)
 * @param optionsOrIncludeTime boolean (true để bao gồm giờ:phút) hoặc object tùy chọn { includeTime, fallback }
 * @param fallbackValue Chuỗi thay thế khi dateStr không hợp lệ (mặc định 'Chưa xác định')
 * @returns Chuỗi ngày đã định dạng (Ví dụ: "23/08/2026" hoặc "15:42 23/08/2026")
 */
export const formatDate = (
  dateStr?: string | Date | null,
  optionsOrIncludeTime: boolean | FormatDateOptions = false,
  fallbackValue: string = 'Chưa xác định'
): string => {
  let includeTime = false;
  let fallback = fallbackValue;

  if (typeof optionsOrIncludeTime === 'boolean') {
    includeTime = optionsOrIncludeTime;
  } else if (optionsOrIncludeTime && typeof optionsOrIncludeTime === 'object') {
    includeTime = optionsOrIncludeTime.includeTime ?? false;
    fallback = optionsOrIncludeTime.fallback ?? fallbackValue;
  }

  if (!dateStr) return fallback;

  try {
    const date = dateStr instanceof Date ? dateStr : new Date(dateStr);
    if (isNaN(date.getTime())) return fallback;

    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      ...(includeTime && {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    return date.toLocaleString('vi-VN', options);
  } catch {
    return fallback;
  }
};

/**
 * Định dạng thời lượng từ giây sang phút:giây (Ví dụ: 125s -> "02:05")
 * @param seconds Số giây (number | undefined | null)
 * @returns Chuỗi thời lượng dạng "mm:ss" (Ví dụ: "00:00" hoặc "02:05")
 */
export const formatTime = (seconds?: number | null): string => {
  if (!seconds || seconds <= 0) return '00:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};





