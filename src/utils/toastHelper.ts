import { toast as hotToast } from 'react-hot-toast';

interface ApiErrorResponse {
  success: boolean;
  statusCode?: number;
  message?: string;
  errors?: string[] | Record<string, string[] | string> | any;
}

export const toast = {
  success: (content: string) => {
    hotToast.success(content, {
      duration: 3000,
      style: {
        borderRadius: '12px',
        background: '#f0fdf4',
        color: '#166534',
        border: '1px solid #bbf7d0',
        fontWeight: 500,
      },
    });
  },

  error: (content: string) => {
    hotToast.error(content, {
      duration: 4000,
      style: {
        borderRadius: '12px',
        background: '#fef2f2',
        color: '#991b1b',
        border: '1px solid #fecaca',
        fontWeight: 500,
      },
    });
  },

  warning: (content: string) => {
    hotToast(content, {
      duration: 4000,
      icon: '⚠️',
      style: {
        borderRadius: '12px',
        background: '#fffbeb',
        color: '#92400e',
        border: '1px solid #fef3c7',
        fontWeight: 500,
      },
    });
  },

  info: (content: string) => {
    hotToast(content, {
      duration: 3000,
      icon: 'ℹ️',
      style: {
        borderRadius: '12px',
        background: '#eff6ff',
        color: '#1e40af',
        border: '1px solid #bfdbfe',
        fontWeight: 500,
      },
    });
  },

  apiError: (error: any) => {
    let mainMessage = 'Đã có lỗi xảy ra. Vui lòng thử lại sau.';
    let detailedErrors: string[] = [];

    if (error.response?.data) {
      const apiData = error.response.data as ApiErrorResponse;

      if (apiData.message) {
        mainMessage = apiData.message;
      }

      if (apiData.errors) {
        if (Array.isArray(apiData.errors)) {
          detailedErrors = apiData.errors.map((err) =>
            typeof err === 'string' ? err : JSON.stringify(err)
          );
        } else if (typeof apiData.errors === 'object') {
          detailedErrors = Object.entries(apiData.errors).map(
            ([field, errs]) => {
              const fieldMsg = Array.isArray(errs) ? errs.join(', ') : String(errs);
              return `${field}: ${fieldMsg}`;
            }
          );
        }
      }
    } else if (error.message) {
      mainMessage = error.message;
    }

    if (detailedErrors.length > 0) {
      // Hiển thị Toast Custom JSX chứa thông tin lỗi chi tiết
      hotToast.error(
        () => {
          // Trả về một ReactElement chứa cấu trúc thông báo lỗi
          // Dùng hàm React.createElement hoặc JSX để tương thích với cấu hình biên dịch
          const listItems = detailedErrors.map((err, idx) =>
            // @ts-ignore
            React.createElement('li', { key: idx }, err)
          );
          // @ts-ignore
          const list = React.createElement('ul', {
            style: { margin: 0, paddingLeft: '16px', fontSize: '12px', opacity: 0.9, marginTop: '4px' }
          }, listItems);

          // @ts-ignore
          const header = React.createElement('span', { style: { fontWeight: 600 } }, mainMessage);

          // @ts-ignore
          return React.createElement('div', {
            style: { display: 'flex', flexDirection: 'column', gap: '2px' }
          }, header, list);
        },
        {
          duration: 6000,
          style: {
            borderRadius: '12px',
            background: '#fef2f2',
            color: '#991b1b',
            border: '1px solid #fecaca',
            maxWidth: '350px',
          },
        }
      );
    } else {
      hotToast.error(mainMessage, {
        duration: 4000,
        style: {
          borderRadius: '12px',
          background: '#fef2f2',
          color: '#991b1b',
          border: '1px solid #fecaca',
          fontWeight: 500,
        },
      });
    }
  },
};

// Cần import React cho việc tạo component thông qua React.createElement
import React from 'react';
