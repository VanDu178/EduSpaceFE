// src/config/queryClient.ts
import { QueryClient, QueryCache } from '@tanstack/react-query';
import { notification } from 'antd'; // Ví dụ dùng Ant Design để báo lỗi toàn cục

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            // refetchOnWindowFocus: false,
            retry: 1,
            staleTime: 1000 * 60 * 5, // Dữ liệu mặc định được coi là "mới" trong 5 phút
        },
    },
    // Xử lý lỗi tập trung cho toàn bộ ứng dụng
    queryCache: new QueryCache({
        onError: (error) => {
            // Tự động hiển thị thông báo lỗi khi bất kỳ query nào bị lỗi
            notification.error({
                message: 'Lỗi tải dữ liệu',
                description: error.message || 'Đã xảy ra lỗi, vui lòng thử lại sau.',
            });
        },
    }),
});
