# EduSpace FrontEnd Development Guidelines

Tài liệu này quy định các nguyên tắc thiết kế mã nguồn, giao diện và cấu trúc định tuyến cho dự án Frontend EduSpace. Agent bắt buộc phải đọc và tuân thủ các nguyên tắc này trong mọi tác vụ chỉnh sửa hoặc tạo mới code.

---

## 1. Nguyên Tắc Cú Pháp React & TypeScript

*   **Không sử dụng cú pháp `React.FC` hoặc `React.FunctionComponent`:**
    *   *Sai:* `const Sidebar: React.FC<SidebarProps> = ({ activeTab }) => { ... }`
    *   *Đúng:* `const Sidebar = ({ activeTab }: SidebarProps) => { ... }`
*   **Sử dụng Import Kiểu Dữ Liệu Tách Biệt (verbatimModuleSyntax):**
    *   Bắt buộc dùng `import type` khi nhập các interface hoặc type từ tệp tin khác.
    *   *Ví dụ:* `import type { User } from '../types';`

---

## 2. Nguyên Tắc Thiết Kế Giao Diện & UI Components

*   **Tận dụng tối đa Ant Design làm nền tảng:**
    *   Sử dụng `<Table />` của Ant Design cho tất cả các bảng hiển thị dữ liệu để tận dụng các cơ chế phân trang, sắp xếp và lọc.
    *   Sử dụng `<Form />`, `<Form.Item />` của Ant Design cho biểu mẫu để tự động hóa việc validate dữ liệu nhập vào (sử dụng thuộc tính `rules`), loại bỏ hoàn toàn việc viết validation thủ công bằng câu lệnh `if/else` hoặc alert thô.
    *   Sử dụng `<Button />`, `<Input />`, `<Select />`, `<Switch />` từ Ant Design.
*   **Tùy biến phong cách phẳng, trắng bằng Tailwind CSS:**
    *   Không tự viết lại các component giao diện thô từ thẻ HTML cơ bản. Hãy bọc các component của Ant Design bằng các class Tailwind (như `className="w-full rounded-xl..."`) để đồng bộ với ngôn ngữ thiết kế chung: **Sạch sẽ, phẳng, trắng tối giản, bo góc mềm mại, sang trọng.**

---

## 3. Nguyên Tắc Thiết Kế Định Tuyến (Routing)

*   **Sử dụng Định Tuyến Lồng Nhau (Nested Routes):**
    *   Không dùng biến trạng thái cục bộ (state như `activeTab`) để rẽ nhánh hiển thị nội dung trang quản trị trong `DashboardPage.tsx`.
    *   Bắt buộc cấu hình các phân hệ quản trị dưới dạng Route con (nested routes) trong `src/App.tsx` dưới route `/admin`.
    *   Sử dụng component `<Outlet />` từ `react-router-dom` bên trong layout chính để hiển thị nội dung động.
*   **Nhận diện Menu hoạt động từ URL:**
    *   Sidebar và Navbar phải sử dụng `useLocation()` từ `react-router-dom` để nhận biết đường dẫn hiện tại và tự động tô sáng menu tương ứng, đảm bảo trạng thái hoạt động vẫn chính xác khi người dùng tải lại trang.
