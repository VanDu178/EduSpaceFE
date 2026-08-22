# TradeVerse Frontend (TradeVerseFE)

Dự án Frontend cung cấp giao diện người dùng cho hệ thống **TradeVerse**. Giao diện được thiết kế hiện đại, tương thích tốt trên nhiều kích thước màn hình.

## 🛠 Công nghệ sử dụng
- **Framework:** React.js v19 (Vite làm công cụ đóng gói & phát triển siêu tốc)
- **Language:** TypeScript (đảm bảo an toàn kiểu dữ liệu)
- **State Management & Server Cache:** TanStack React Query v5
- **HTTP Client:** Axios (xử lý gọi các endpoint API backend)
- **Linter:** Oxlint (kiểm tra cú pháp và tối ưu hóa code cực nhanh)
- **Styling:** CSS/Tailwind CSS

## 📂 Cấu trúc thư mục chính
- `src/`: Thư mục mã nguồn chính của ứng dụng.
- `src/components/`: Chứa các React component dùng chung và tái sử dụng.
- `src/hooks/`: Chứa các custom hooks phục vụ việc gọi API và quản lý state.
- `src/pages/`: Các trang chính của ứng dụng.
- `public/`: Chứa các assets tĩnh như hình ảnh, biểu tượng.
- `vite.config.ts`: Cấu hình cho công cụ đóng gói Vite.

## 🚀 Hướng dẫn cài đặt và chạy thử

### 1. Cài đặt các thư viện cần thiết
Tại thư mục `EduSpaceFE`, chạy lệnh sau để cài đặt dependencies:
```bash
npm install
```

### 2. Cấu hình biến môi trường
Tạo file `.env` hoặc `.env.local` tại gốc dự án để kết nối API với backend:
```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Khởi chạy Development Server
Để khởi chạy giao diện ở môi trường phát triển cục bộ:
```bash
npm run dev
```

Giao diện sẽ chạy tại địa chỉ: `http://localhost:5173`.

### 4. Build sản phẩm đóng gói (Production build)
Để xây dựng bản phân phối chính thức cho môi trường Product:
```bash
npm run build
```
Mã nguồn sau khi build sẽ nằm trong thư mục `/dist`.
