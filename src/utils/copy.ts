import { toast } from './toastHelper';

/**
 * Sao chép chuỗi văn bản vào bộ nhớ tạm (clipboard) và hiển thị thông báo toast.
 * @param text Chuỗi văn bản cần sao chép
 * @param successMessage Thông báo hiển thị khi sao chép thành công (mặc định: 'Đã sao chép!')
 */
export const copyToClipboard = async (
  text?: string | null,
  successMessage: string = 'Đã sao chép!'
): Promise<boolean> => {
  if (!text) return false;

  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
    } else {
      // Fallback cho trình duyệt legacy/HTTP
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand('copy');
      textArea.remove();
    }

    toast.success(successMessage);
    return true;
  } catch (error) {
    console.error('Sao chép thất bại:', error);
    toast.error('Không thể sao chép văn bản!');
    return false;
  }
};
