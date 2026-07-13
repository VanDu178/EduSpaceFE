import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './index.css'
import App from './App.tsx'

// Khởi tạo QueryClient để quản lý cache và các truy vấn dữ liệu từ API.
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Tắt tự động tải lại dữ liệu khi người dùng focus lại trình duyệt
      retry: 1,                    // Thử lại 1 lần nếu yêu cầu bị lỗi trước khi báo lỗi cho giao diện
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
)
