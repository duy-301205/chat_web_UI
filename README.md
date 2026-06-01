# 💻 Real-time Chat Web Application - Frontend

Giao diện người dùng (Frontend) của ứng dụng nhắn tin thời gian thực, được xây dựng bằng **ReactJS** và **TailwindCSS**. Dự án được thiết kế theo cấu trúc Component hóa, tối ưu trải nghiệm người dùng trực quan và hiện đại.

> ⚠️ **Lưu ý:** Hiện tại kho mã nguồn này tập trung vào việc phát triển cấu trúc giao diện, các luồng giao tiếp (Pages/Modals Layout) và đang trong quá trình hoàn thiện tích hợp API hoàn chỉnh từ hệ thống Java Spring Boot Backend.

---

## 🚀 Tính năng giao diện (UI Features)

Dựa trên cấu trúc thiết kế hiện tại, hệ thống Frontend bao gồm các phân hệ giao diện:
* **Hệ thống Auth:** Trang Đăng ký (`Register`) và Đăng nhập (`Login`) chuẩn hóa form nhập liệu.
* **Không gian làm việc chính (`DashboardChat`):** Khu vực hiển thị nội dung cuộc trò chuyện, tích hợp thanh điều hướng bên cạnh (`SidebarChat`).
* **Quản lý hội nhóm (Group Modals):** Các cửa sổ tương tác nhanh hỗ trợ Tạo nhóm mới (`CreateGroupModel`), Thêm thành viên (`AddMemberModel`), và Xem danh sách thành viên trong nhóm (`ViewMembersModal`).
* **Trang cá nhân (`MyProfile`):** Giao diện hiển thị và tùy chỉnh thông tin tài liệu cá nhân của người dùng.

---

## 🛠️ Công nghệ sử dụng (Tech Stack)

* **Thư viện chính:** ReactJS (JSX)
* **Styling:** CSS / TailwindCSS (Thiết kế giao diện phản hồi - Responsive Layout)
* **Quản lý trạng thái & Định tuyến (Định hướng tích hợp):** React Router DOM, Context API / Redux (Sắp triển khai)
* **Công cụ phát triển:** Vite / Create React App, Node.js

---

## 📁 Cấu trúc thư mục cốt lõi (Folder Structure Overview)

Giao diện được phân bổ tập trung trong thư mục `/src/pages` để quản lý các màn hình và các cửa sổ pop-up (Modals) tương tác:

```text
src/
├── data/               # Dữ liệu mock phục vụ thiết kế layout ban đầu
└── pages/
    ├── Login.jsx             # Giao diện đăng nhập hệ thống
    ├── Register.jsx          # Giao diện đăng ký tài khoản mới
    ├── Home.jsx              # Trang chủ điều hướng chính
    ├── DashboardChat.jsx     # Khu vực màn hình chat realtime chính
    ├── SidebarChat.jsx       # Thanh bên chứa danh sách cuộc trò chuyện
    ├── MyProfile.jsx         # Trang quản lý thông tin cá nhân
    ├── CreateGroupModel.jsx  # Modal tạo phòng chat nhóm mới
    ├── AddMemberModel.jsx    # Modal thêm thành viên vào nhóm hiện tại
    ├── ViewMembersModal.jsx  # Modal xem danh sách thành viên nhóm
    └── FindSpirits.jsx       # Tính năng/Giao diện tìm kiếm bạn bè
```
Các bước triển khai

Bước 1: Clone dự án về máy local

Bước 2: Cài đặt các thư viện phụ thuộc (Dependencies)
  npm install
Bước 3: Chạy ứng dụng ở môi trường phát triển (Development Mode)
  npm run dev
Sau khi khởi chạy thành công, bạn có thể truy cập giao diện tại địa chỉ mặc định của local (Ví dụ: http://localhost:5173 hoặc http://localhost:3000).

