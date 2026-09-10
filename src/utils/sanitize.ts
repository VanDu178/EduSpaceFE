/**
 * Lọc và làm sạch nội dung HTML nhằm ngăn chặn lỗ hổng bảo mật Cross-Site Scripting (XSS)
 * Sử dụng API DOMParser chuẩn của trình duyệt (không sử dụng thư viện bên ngoài).
 */
export const sanitizeHtml = (html?: string | null): string => {
  if (!html) return '';
  if (typeof window === 'undefined' || typeof DOMParser === 'undefined') {
    return html;
  }

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    // 1. Loại bỏ các thẻ độc hại có thể thực thi mã Javascript hoặc nhúng tài nguyên bên ngoài
    const dangerousTags = doc.querySelectorAll(
      'script, iframe, object, embed, style, link, meta, base'
    );
    dangerousTags.forEach((tag) => tag.remove());

    // 2. Duyệt qua tất cả phần tử để xóa thuộc tính sự kiện (on*) và link chứa javascript:
    const allElements = doc.body.querySelectorAll('*');
    allElements.forEach((el) => {
      Array.from(el.attributes).forEach((attr) => {
        const attrName = attr.name.toLowerCase();
        const attrVal = attr.value.trim().toLowerCase();

        // Xóa tất cả các event handler (onclick, onerror, onload, onmouseover, ...)
        if (attrName.startsWith('on')) {
          el.removeAttribute(attr.name);
        }

        // Xóa link nguy hiểm chứa javascript: hoặc data:text/html
        if (
          (attrName === 'href' || attrName === 'src' || attrName === 'action') &&
          (attrVal.startsWith('javascript:') || attrVal.startsWith('data:text/html'))
        ) {
          el.removeAttribute(attr.name);
        }
      });
    });

    return doc.body.innerHTML;
  } catch {
    return html;
  }
};
