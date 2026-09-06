
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
*   **Quy chuẩn Giải nén (Destructuring) React Query Mutations:**
    *   Khi destructure thuộc tính `mutate` thành một tên hàm (ví dụ: `const { isPending: isPendingAddComment, mutate: addTicketCommentMutation } = useAddTicketCommentMutation();`), biến `addTicketCommentMutation` chính là **hàm mutate** (Function), KHÔNG phải là đối tượng mutation object.
    *   *Đúng:* Gọi trực tiếp `addTicketCommentMutation(data, options)` và sử dụng trực tiếp biến boolean `isPendingAddComment`.
    *   *Sai:* Gọi `addTicketCommentMutation.mutate(...)` hoặc truy cập `addTicketCommentMutation.isPending` (gây lỗi `undefined` ở runtime do `addTicketCommentMutation` đã là hàm `mutate`).
*   **Quy chuẩn Quản lý Hằng số & Select Options (Constants & Options Management):**
    *   Tất cả các hằng số, danh sách tùy chọn Dropdown/Select (ví dụ: `STATUS_OPTIONS`, `CATEGORY_OPTIONS`, `URGENCY_OPTIONS`...), mảng ánh xạ nhãn/màu sắc, cấu hình tĩnh, và **các giá trị khởi tạo mặc định (default values như `DEFAULT_VIDEO_FORM_VALUES`, `DEFAULT_SOURCE_TYPE`, `DEFAULT_STATUS`, giới hạn file...)** BẮT BUỘC phải đưa vào tệp `constants/index.ts` của phân hệ (module) hoặc `src/constants/` đối với dữ liệu dùng chung toàn ứng dụng.
    *   Tuyệt đối KHÔNG khai báo cứng (hardcode) các mảng options, enum value, chuỗi mặc định hoặc mảng dữ liệu tĩnh trực tiếp bên trong các file Component, Form, Modal hay Page `.tsx`.
    *   Khi cần bổ sung, chỉnh sửa nhãn (label), giá trị (value), giá trị mặc định hoặc màu sắc đại diện, chỉ thực hiện sửa đổi tại duy nhất 1 vị trí tệp `constants` để đảm bảo quản lý tập trung và tránh phải tìm kiếm sửa đổi rải rác.
*   **Quy chuẩn Cấu trúc Thư mục Module & Custom Hooks (React Query Hooks):**
    *   Mỗi phân hệ (module) BẮT BUỘC phải có một thư mục `hooks/` riêng (ví dụ: `src/modules/<module-name>/hooks/`).
    *   Tất cả các custom hook liên quan đến gọi dữ liệu (React Query `useQuery`, `useMutation`), xử lý logic state hoặc lắng nghe sự kiện của phân hệ BẮT BUỘC phải được định nghĩa tách biệt bên trong thư mục `hooks/` này (ví dụ: `src/modules/<module-name>/hooks/index.ts`).
    *   Tuyệt đối KHÔNG viết trực tiếp logic `useQuery`, `useMutation` hoặc gọi hàm API trực tiếp rải rác bên trong các file Component, Form, Modal hay Page `.tsx`.

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
*   **Đặt tên nhãn (labels), tiêu đề nút bấm và biểu mẫu ở dạng chung (generic):**
    *   Để giao diện nhất quán, sạch sẽ và dễ dàng tái sử dụng mã nguồn (copy-paste module), hãy đặt các tiêu đề nút, tiêu đề biểu mẫu, tiêu đề bảng ở dạng chung, không lồng tên module vào.
    *   *Ví dụ:* Sử dụng nút "Thêm mới", "Cập nhật", không dùng "Thêm bài viết", "Cập nhật học viên". Tiêu đề của Form/Modal chỉ nên ghi ngắn gọn "Thêm mới" hoặc "Cập nhật" thay vì "Thêm mới lớp học", "Cập nhật thông tin giáo viên". Tiêu đề cột thao tác trong bảng nên là "Thao tác" hoặc "Hành động" thay vì "Thao tác bài viết".
*   **Quy chuẩn Nút/Icon Sao chép (Copy Action):**
    *   Tất cả các thao tác sao chép văn bản, mã (code), email trên toàn bộ các trang (pages/components) BẮT BUỘC phải dùng hàm helper `copyToClipboard` từ `src/utils/copy.ts` hoặc component `CopyButton` từ `src/components/CopyButton.tsx`.
    *   Icon sao chép BẮT BUỘC phải dùng `DocumentDuplicateIcon` từ `@heroicons/react/24/outline`.
    *   Kích thước icon copy BẮT BUỘC là `h-4 w-4` (class Tailwind `h-4 w-4`).
*   **Quy chuẩn Hiển thị Văn bản Thay thế / Trống (Empty / Fallback Text):**
    *   Tất cả văn bản đại diện cho dữ liệu rỗng/chưa có (ví dụ: "Không có mô tả", "Chưa cập nhật", "Chưa xác định", "N/A", "—", v.v.) trong giao diện Admin Frontend BẮT BUỘC phải định dạng bằng chữ in nghiêng (`italic`) và có màu xám nhạt (`text-slate-400`).
    *   *Ví dụ:* `<span className="text-slate-400 text-xs italic">Không có mô tả</span>` hoặc `<span className="text-slate-400 italic">Chưa cập nhật</span>`.
*   **Quy chuẩn Bố Cục Trang Quản Trị Phân Hệ (Page Header & Main Layout):**
    *   *Khung chứa trang (Page Container):* BẮT BUỘC sử dụng `<div className="space-y-6 flex flex-col flex-1 h-full overflow-hidden">` để đảm bảo khoảng cách lề dọc chuẩn (`space-y-6`) và không bị trượt cuộn ngoài mong muốn.
    *   *Phần Header (Page Header Section):* BẮT BUỘC thiết kế dạng flexbox nằm ngang 2 bên (`flex items-center justify-between mb-2 shrink-0`):
        *   Bên trái: Tiêu đề phân hệ dùng thẻ `<h2>` với class `text-xl font-bold text-slate-800` (ví dụ: *"Danh sách người dùng"*, *"Danh sách bài viết"*).
        *   Bên phải: Nút hành động chính duy nhất của phân hệ (như *"Thêm mới"*), định dạng nút Gradient Sky-Cyan nổi bật (`bg-gradient-to-r from-sky-500 to-cyan-600 border-none text-sm font-semibold rounded-xl px-5 h-10 flex items-center justify-center cursor-pointer`). TUYỆT ĐỐI không đặt nút hành động chính của trang lồng bên trong thanh FilterBar.
*   **Quy chuẩn Thiết kế Thanh Lọc & Tìm Kiếm (FilterBar):**
    *   *Bố cục chính (Layout & Responsiveness):* BẮT BUỘC thiết kế dạng flexbox dàn ngang 2 lề (`<div className="flex flex-wrap items-center justify-between gap-3">`), bọc ngoài bằng thẻ `<div className="shrink-0">` khi đứng trong trang chính. Tuyệt đối không dùng bóng đổ (`shadow`).
    *   *Phần bên trái (Filter Label):* Nhãn bộ lọc chung gồm icon `FunnelIcon` và chữ "Bộ lọc":
        `<span className="h-11 rounded-xl flex gap-2 items-center justify-center border-slate-200 text-slate-500" title="Bộ lọc"><FunnelIcon className="h-5 w-5" /><span>Bộ lọc</span></span>`
    *   *Phần bên phải (Filters & Search Input Group):* Nhóm các ô lọc `<Select />` và ô tìm kiếm `<Input />` nằm sát lề phải (`<div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">`):
        *   Ô lọc Select: Bọc trong `<div className="w-full sm:w-[180px]">`, dùng `<Select className="w-full" />` Ant Design. Đặt nhãn mặc định generic (ví dụ: *"Tất cả trạng thái"*).
        *   Ô tìm kiếm Search Input: Bọc trong `<div className="w-full sm:w-[280px]">`, dùng `<Input />` Ant Design kết hợp icon `MagnifyingGlassIcon` (`h-5 w-5 text-slate-400 mr-1.5`). Class tiêu chuẩn: `className="w-full px-4 border-slate-200 focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 text-slate-700 text-sm"`. Đặt placeholder dạng generic (ví dụ: *"Tìm theo tên hoặc email người dùng..."*, *"Tìm kiếm..."*).
*   **Quy chuẩn Thiết kế Bảng & Danh Sách Dữ Liệu (ListPage / Table):**
    *   *Bọc Bảng (Table Wrapper):* Sử dụng container phẳng `<div className="bg-white overflow-hidden flex flex-col flex-1">` chứa `<Table />` Ant Design với `rowKey="id"`.
    *   *Xử lý Trạng thái Trống (Empty State):* Khi danh sách trống (`!isLoading && users.length === 0`), trả về ngay component `<div className="py-16 flex items-center justify-center flex-1"><Empty description="Không có người dùng nào" /></div>`.
    *   *Cuộn Dọc & Phân Trang (Scroll & Pagination):*
        *   Cấu hình chiều cao cuộn dọc cho bảng: `scroll={{ y: 'calc(100vh - 316px)' }}`.
        *   Phân trang Antd (`pagination`): Cấu hình `showSizeChanger: true`, `pageSizeOptions: ['5', '10', '20', '50']`, `showTotal: (total) => \`Tổng cộng: ${total} dòng dữ liệu\``, `style: { marginBottom: 0 }`.
    *   *Căn lề & Định dạng Cột (Column Alignment):*
        *   Cột Mã / Định danh: Căn trái (`align: 'left'`), phông chữ đơn cách `font-mono text-xs font-semibold text-slate-700`, width `140px`, kết hợp `CopyButton`. Nếu rỗng hiển thị `<span className="text-slate-400 text-xs italic">—</span>`.
        *   Cột Họ tên & Avatar đại diện: Tên `font-semibold text-slate-800`, kèm Avatar chữ cái đầu dạng tròn `w-8 h-8 rounded-full bg-yellow-300 text-yellow-800 border border-slate-200/80 font-bold text-xs flex items-center justify-center` (fallback: `<span className="text-slate-400 italic">Người dùng ẩn danh</span>`).
        *   Cột Email / Thông tin liên hệ: `text-slate-500 font-medium` kết hợp `CopyButton`.
        *   Cột Vai trò / Trạng thái: Dùng màu chữ trực tiếp `font-semibold text-sky-600` / `text-slate-600` hoặc `text-emerald-600` / `text-rose-600`.
        *   Cột Thao tác / Hành động: Căn giữa (`align: 'center'`), cố định bên phải `fixed: 'right'`, width `180px`, tiêu đề chung (`"Hành động"` hoặc `"Thao tác"`). Sắp xếp `flex items-center justify-center space-x-2`, dùng `<Button type="text" />` icon `h-4 w-4` có background hover tương ứng (`hover:bg-sky-50`, `hover:bg-amber-50`, `hover:bg-red-50`), bọc trong `<Tooltip>` và `<Popconfirm>` (`okText="Đồng ý"`, `cancelText="Hủy"`).

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


## SKILL: Socket Event Constants Enforcement (FE Admin)
- **Bắt buộc tập trung hóa tất cả Tên Socket Event vào tệp Constants:**
  - Mọi hook lắng nghe Socket (`useSocketEvent(...)`) hoặc phát Socket (`socket.emit(...)`) trong toàn bộ phân hệ FE Admin BẮT BUỘC phải sử dụng hằng số xuất ra từ tệp `constants` của module/phân hệ đó hoặc `src/config/socket/socketEvents.ts` (ví dụ: `TICKET_SOCKET_EVENTS.COMMENT_ADDED`).
  - TUYỆT ĐỐI KHÔNG hardcode chuỗi tên event Socket trực tiếp trong các file hook, component hay page `.tsx`.


