
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
*   **Không sử dụng bóng đổ (box-shadow/shadow classes):**
    *   Tuyệt đối không sử dụng thuộc tính `box-shadow` hoặc các class shadow của Tailwind (như `shadow`, `shadow-sm`, `shadow-md`, `shadow-lg`, `shadow-xl`, `shadow-2xl`, v.v.) trên các component và container. Thiết kế phải tuân thủ phong cách phẳng (flat design), sử dụng các đường viền mờ (`border-slate-100`, `border-slate-200/80`, v.v.) để phân định không gian hiển thị và các layer giao diện.

---

## 3. Nguyên Tắc Thiết Kế Định Tuyến (Routing)

*   **Sử dụng Định Tuyến Lồng Nhau (Nested Routes):**
    *   Không dùng biến trạng thái cục bộ (state như `activeTab`) để rẽ nhánh hiển thị nội dung trang quản trị trong `DashboardPage.tsx`.
    *   Bắt buộc cấu hình các phân hệ quản trị dưới dạng Route con (nested routes) trong `src/App.tsx` dưới route `/admin`.
    *   Sử dụng component `<Outlet />` từ `react-router-dom` bên trong layout chính để hiển thị nội dung động.
*   **Nhận diện Menu hoạt động từ URL:**
    *   Sidebar và Navbar phải sử dụng `useLocation()` từ `react-router-dom` để nhận biết đường dẫn hiện tại và tự động tô sáng menu tương ứng, đảm bảo trạng thái hoạt động vẫn chính xác khi người dùng tải lại trang.

# CẤU TRÚC WORKSPACE (MULTIPLE FOLDERS CONTEXT)
- Dự án hiện tại là một ứng dụng Full-stack được quản lý tập trung bao gồm:
  1. Thư mục Backend: ./EduSpaceBE/
  2. Thư mục Frontend: ./EduSpaceFE/

# BỘ QUY TẮC TRIỂN KHAI (WORKFLOW)
- Khi nhận bất kỳ yêu cầu nào về tính năng mới hoặc sửa lỗi:
  * Bước 1: Hãy luôn sử dụng Chain of Thought (### Thought Process) để phân tích cấu trúc backend (schema, API) và giao diện frontend tương ứng trước khi sửa đổi.
  * Bước 2: Đưa ra kế hoạch triển khai chi tiết từng bước cho người dùng duyệt. TUYỆT ĐỐI không tự ý chỉnh sửa code khi chưa được đồng ý.
  * Bước 3: Đảm bảo sự đồng bộ dữ liệu giữa API được viết ở folder Backend và các hàm gọi dịch vụ (services/components) ở folder Frontend.

# TIÊU CHUẨN CHẤT LƯỢNG CODE
- Mã nguồn sinh ra phải sạch sẽ, tuân thủ kiến trúc hiện tại của từng thư mục dự án.
- Không tự ý cài đặt thêm các thư viện bên ngoài (dependencies) khi chưa hỏi ý kiến người dùng.

## SKILL: Naming Conventions & Code Style Enforcement
- Trước khi viết hoặc sửa đổi bất kỳ mã nguồn nào, Agent PHẦI tuân thủ nghiêm ngặt quy chuẩn đặt tên sau của dự án:
  1. Tên File: 
     - Đối với Backend (EduSpaceBE): Sử dụng kiểu snake_case (ví dụ: `user_controller.py`) hoặc camelCase tùy theo framework hiện tại.
     - Đối với Frontend (EduSpaceFE): Các file component phải đặt theo kiểu PascalCase (ví dụ: `UserForm.tsx`), các file helper/service đặt theo kiểu camelCase (ví dụ: `authService.ts`).
     - Quy tắc đặt tên file trong module: Tránh đặt tên file cụ thể theo tên thực thể (ví dụ: không đặt `CreateUserModal.tsx`, `UpdateUserModal.tsx`), mà hãy đặt tên chung như `FormCreate.tsx`, `FormUpdate.tsx`. Điều này giúp dễ dàng sao chép (clone) nguyên thư mục module cho các tính năng khác mà không cần sửa tên file bên trong.
  2. Tên Biến và Hàm:
     - Biến và hàm thông thường: Luôn sử dụng camelCase (ví dụ: `userId`, `getUserData`).
     - Hằng số (Constants): Luôn viết hoa toàn bộ và phân tách bằng dấu gạch dưới (ví dụ: `API_URL`, `MAX_RETRY`).
     - Class/Interface: Luôn sử dụng PascalCase (ví dụ: `UserService`).
- Tuyệt đối không tự ý bịa ra phong cách đặt tên mới lệch pha với các file code hiện tại trong codebase.


## SKILL: Long-term Session Logging (Duy trì trí nhớ dài hạn)
- Bản chất: Giúp Agent không bị mất trí nhớ hoặc "ngáo" khi đoạn hội thoại quá dài gây loãng context .
- Quy tắc thực thi:
  1. Sau khi hoàn thành một tính năng hoặc một luồng xử lý logic lớn, Agent phải tự động tạo hoặc cập nhật một file nhật ký tại thư mục tuyệt đối: `D:\Learning\Side Project\EduSpace\session_log\[DATE_YEAR_SESSION.md]` .
  2. Nội dung file nhật ký phải ghi nhận rõ: các file đã sửa/thêm mới, các lỗi hệ thống đã gặp, cách đã xử lý thành công, và trạng thái hiện tại của codebase .
  3. Khi bắt đầu một phiên làm việc mới nếu người dùng yêu cầu, Agent phải đọc file log gần nhất này để khôi phục ngữ cảnh ngay lập tức .


## SKILL: Architecture-First Scanning (Quét kiến trúc & Chống đoán mò)
- Bản chất: Ép Agent phải luôn làm việc dựa trên thực tế cấu trúc codebase có sẵn, chấm dứt việc tự bịa file .
- Quy tắc thực thi:
  1. Khi nhận một yêu cầu tính năng mới, Agent không được viết code ngay . Trước tiên, Agent phải dùng công cụ quét cấu trúc thư mục của cả `./EduSpaceBE/` và `./EduSpaceFE/` để định vị đúng các file liên quan .
  2. Agent phải ưu tiên đọc các file hướng dẫn cốt lõi như `README.md` hoặc `ARCHITECTURE.md` (nếu có) trong từng thư mục để hiểu rõ design pattern đang dùng (ví dụ: MVC, Clean Architecture, Repository Pattern) trước khi đề xuất giải pháp .


## SKILL: Self-Healing & Automated Testing (Tự động gỡ lỗi)
- Bản chất: Giúp Agent tự chạy thử nghiệm và tự sửa lỗi mà không cần làm phiền người dùng .
- Quy tắc thực thi:
  1. Sau khi chỉnh sửa hoặc tạo mới mã nguồn, Agent PHẢI tự động chạy lệnh kiểm thử phù hợp với framework của thư mục đó (ví dụ: `npm run test` hoặc lệnh test tương đương) .
  2. Nếu terminal trả về mã lỗi hoặc test fail, Agent không được dừng lại hỏi người dùng . Agent phải tự đọc log lỗi, phân tích nguyên nhân, chỉnh sửa lại mã nguồn và chạy lại lệnh kiểm thử (tối đa 3 lần thử lại) cho đến khi pass .

