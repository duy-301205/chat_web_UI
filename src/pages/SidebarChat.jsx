import React, { useState } from "react";

export default function SidebarChat({
  view,
  setView,
  searchQuery,
  setSearchQuery,
  activeTab,
  setActiveTab,
  globalSearchCandidates,
  filteredChatList,
  activeChatId,
  setActiveChatId,
  userData,
  isNotificationOpen,
  setIsNotificationOpen,
  notifications,
  handleAddFriend,
  setIsCreateGroupOpen, // Nhận hàm thay đổi trạng thái từ file cha DashboardChat truyền xuống
}) {
  // Trạng thái cục bộ điều khiển việc đóng/mở Dropdown các mục khi click nút 3 gạch
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Trạng thái quản lý xem Sidebar đang hiển thị phần ruột nào: "cuoc_tro_chuyen" hoặc "ban_be"
  const [sidebarMenu, setSidebarMenu] = useState("cuoc_tro_chuyen");

  // Dữ liệu danh sách bạn bè mẫu có sẵn
  const friendList = [
    {
      id: 2,
      name: "Satsuki",
      avatar:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBbEnfWoJN0FdX8Q0Hq4yE8WQ3NjFAwW0TcMQACprWtM0VqxxbP1Sgw0eTqykmNfDZtFBy5ZvIH7SWwAmyOrrWEZ6SNR5scHsWMxBKtKscaJs0DiDoWB6sFt2FbPH_8rzfVPcOquHc9qOYVx_JaEDZHkEXwuv8Z_pJaZK0Mmat7-6orD3w26bB58PGA5o0wGsPr_7hi6gC5oxa1ObU1SEiwFjt8hNqMPeiirCHzBeMFigp_WK806igADIPMmBDV0oIF-KOC-QfcS0o",
      bio: "🌸 Okie, mình cảm ơn nhaa",
      isOnline: true,
    },
    {
      id: 3,
      name: "Mei",
      avatar:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDHOA6JzXhWkDkkk6txfQ34mARY-BslsFdLmm1Lu5E8mwn97qpLRXwJV6lVomfjtcUGMaWQLcAEJXIwDKhdQFX6SN8soBnkKirRUlSgD95DTGGlJGWenv-1Ir3_aRUXYxlLjMWbxnBM_Fei4TtozkR_eLjl5879HdbmB6qwh-5KAvWRU8YRRIo0j7K1ytBxrKtEH32fWqLYpb4MPHS1K3QFAVgXfDdfk-1PaGZryriCXL22S1gA-5cPbXxPvE0LYWycsCmUYFSHrKg",
      bio: "Nhìn xem em tìm thấy gì này!",
      isOnline: true,
    },
    {
      id: 5,
      name: "Chị Kusa",
      avatar:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDnc7JSk99vzS_o4UmNd1jwkafcH0cI43oXuD3htmyEiYbCOnHXbusaCbsr-nbDO7wR8PUvT7FZkaeeBdmFxvmMl2-tWaZHSyKMEwO8f2m7c0NKdZkoiapiAqRsqGnK7GEw-vpqPYJkcTYmNAOlJOl0Z6_SY7CaLenNtNpmCRUOsI8GjlJMCp4SqIv3vETUP_PfR2mKXzVHpVjwAHfvm2tQ81tNyyAG8spZEpu5H4Z_xJ2eG99f5c5BDsUgJe-Nn1eN2sIhLQx3dtw",
      bio: "Lịch dạo chơi đền cổ nhé.",
      isOnline: false,
    },
  ];

  // Lọc danh sách bạn bè dựa trên kí tự ô tìm kiếm
  const filteredFriendList = friendList.filter((friend) =>
    friend.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <aside className="w-[300px] flex-shrink-0 rounded-3xl bg-[rgba(253,251,247,0.9)] backdrop-blur-[12px] border border-white/60 shadow-[0_4px_20px_rgba(0,0,0,0.05)] flex flex-col h-full overflow-hidden relative z-20">
      {/* BRAND & HEADER - ĐÃ ĐƯỢC CHỈNH THẲNG HÀNG HOÀN HẢO TUYỆT ĐỐI BẰNG ITEMS-CENTER VÀ TEXT-BASE */}
      <div className="p-4 pt-5 pb-3 flex items-center justify-between relative">
        <div className="flex items-center gap-2">
          {/* NÚT 3 GẠCH CHUẨN */}
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className={`p-1 rounded-lg transition-colors text-[#434840] flex items-center justify-center ${isDropdownOpen ? "bg-[#f0eee8]" : "hover:bg-[#f0eee8]"}`}
          >
            <span className="material-symbols-outlined text-xl block">
              menu
            </span>
          </button>

          {/* Tiêu đề chữ - Đồng bộ tỷ lệ nhỏ gọn chữ text-base và thẳng hàng */}
          <h1 className="text-base font-bold text-[#a8d5ba] flex items-center">
            {sidebarMenu === "cuoc_tro_chuyen" ? "Chat Web" : "Bạn bè"}
          </h1>
        </div>

        {/* Cụm icon phụ bên phải tiêu đề nằm THẲNG HÀNG tuyệt đối với tiêu đề và nút 3 gạch */}
        <div className="flex items-center gap-1">
          {/* NÚT TẠO NHÓM CHAT MỚI KIỂU CHUẨN FACEBOOK */}
          <button
            onClick={() => setIsCreateGroupOpen(true)}
            className="w-7 h-7 rounded-full flex items-center justify-center text-[#434840] hover:bg-[#f0eee8] transition-colors"
            title="Tạo nhóm trò chuyện mới"
          >
            <span className="material-symbols-outlined text-lg">group_add</span>
          </button>

          {/* Nút Khám phá cũ */}
          <button
            onClick={() => setView(view === "spirits" ? "chat" : "spirits")}
            className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${view === "spirits" ? "bg-[#a8d5ba]/20 text-[#a8d5ba]" : "text-[#434840] hover:bg-[#f0eee8]"}`}
            title="Khám phá linh hồn mới (Lưới Card)"
          >
            <span className="material-symbols-outlined text-lg">
              wb_twilight
            </span>
          </button>
        </div>

        {/* GIAO DIỆN THANH CÁC MỤC THẢ XUỐNG (MENU DROPDOWN) */}
        {isDropdownOpen && (
          <div className="absolute top-12 left-4 w-[180px] rounded-xl bg-white border border-[#c3c8bd]/30 shadow-lg p-1.5 flex flex-col z-50 animate-in fade-in zoom-in-95 duration-100">
            <button
              onClick={() => {
                setSidebarMenu("cuoc_tro_chuyen");
                setView("chat"); // Trở lại view chat chính diện bên phải
                setIsDropdownOpen(false);
              }}
              className={`w-full h-8 px-2.5 rounded-lg flex items-center gap-2 text-xs font-semibold transition-colors ${sidebarMenu === "cuoc_tro_chuyen" ? "bg-[#b0e0f6]/10 text-[#b0e0f6]" : "text-[#434840] hover:bg-[#f0eee8]/50"}`}
            >
              <span className="material-symbols-outlined text-base">forum</span>
              Cuộc trò chuyện
            </button>
            <button
              onClick={() => {
                setSidebarMenu("ban_be");
                setIsDropdownOpen(false);
              }}
              className={`w-full h-8 px-2.5 rounded-lg flex items-center gap-2 text-xs font-semibold transition-colors ${sidebarMenu === "ban_be" ? "bg-[#b0e0f6]/10 text-[#b0e0f6]" : "text-[#434840] hover:bg-[#f0eee8]/50"}`}
            >
              <span className="material-symbols-outlined text-base">group</span>
              Bạn bè
            </button>
          </div>
        )}
      </div>

      {/* Search Input Box */}
      <div className="px-4 pb-3">
        <div className="relative flex items-center w-full h-8 rounded-full bg-[#f0eee8] border border-[#c3c8bd]/30 text-[#1c1c18] focus-within:bg-white focus-within:border-[#a8d5ba]/50 focus-within:ring-1 focus-within:ring-[#a8d5ba]/50 transition-all shadow-sm">
          <span className="material-symbols-outlined absolute left-3 text-[#434840]/60 text-base">
            search
          </span>
          <input
            className="w-full pl-9 pr-4 bg-transparent border-none focus:ring-0 text-xs placeholder:text-[#434840]/50 outline-none h-full"
            placeholder={
              sidebarMenu === "cuoc_tro_chuyen"
                ? "Tìm cuộc trò chuyện..."
                : "Tìm tên trong danh sách bạn bè..."
            }
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 text-[#434840]/40 hover:text-[#434840]"
            >
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          )}
        </div>
      </div>

      {/* Bộ lọc Tab */}
      {sidebarMenu === "cuoc_tro_chuyen" && (
        <div className="px-4 flex gap-1.5 pb-3 border-b border-[#c3c8bd]/10">
          {["all", "unread", "group"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-colors uppercase tracking-wider ${
                activeTab === tab
                  ? "bg-[#b0e0f6] text-white"
                  : "text-[#434840] hover:bg-[#f0eee8]"
              }`}
            >
              {tab === "all"
                ? "Tất cả"
                : tab === "unread"
                  ? "Chưa đọc"
                  : "Nhóm"}
            </button>
          ))}
        </div>
      )}

      {/* Vùng Render List động */}
      <nav className="flex-1 overflow-y-auto py-1">
        {globalSearchCandidates.length > 0 && (
          <div className="mb-3 border-b border-[#c3c8bd]/20 pb-1">
            <div className="px-4 py-0.5 text-[10px] font-bold text-[#a8d5ba] uppercase tracking-wider">
              Linh hồn mới (Tìm bạn mới)
            </div>
            {globalSearchCandidates.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between px-4 py-2 hover:bg-[#a8d5ba]/5 transition-colors"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <img
                    src={user.avatar}
                    className="w-8 h-8 rounded-full object-cover border border-white"
                    alt=""
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-[#1c1c18] truncate">
                      {user.name}
                    </p>
                    <p className="text-[10px] text-[#434840]/60 truncate">
                      {user.bio}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleAddFriend(user)}
                  className="h-6 px-2.5 bg-[#a8d5ba] text-white rounded-full text-[10px] font-bold shadow-sm hover:bg-[#97c4a9] transition-all flex items-center gap-1 shrink-0 ml-2"
                >
                  <span className="material-symbols-outlined text-xs">
                    person_add
                  </span>{" "}
                  Kết bạn
                </button>
              </div>
            ))}
          </div>
        )}

        {sidebarMenu === "cuoc_tro_chuyen" ? (
          <>
            {searchQuery && (
              <div className="px-4 py-0.5 text-[10px] font-bold text-[#434840]/40 uppercase tracking-wider">
                Cuộc trò chuyện
              </div>
            )}
            {filteredChatList.map((chat) => {
              const isItemActive = chat.id === activeChatId && view === "chat";
              return (
                <div
                  key={chat.id}
                  onClick={() => {
                    setActiveChatId(chat.id);
                    setView("chat");
                    setIsNotificationOpen(false);
                  }}
                  className={`flex items-center gap-2.5 px-4 py-2 cursor-pointer transition-colors relative ${
                    isItemActive ? "bg-[#b0e0f6]/10" : "hover:bg-[#f0eee8]/50"
                  }`}
                >
                  {isItemActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-8 bg-[#b0e0f6] rounded-r-full"></div>
                  )}
                  <div className="relative w-10 h-10 rounded-full overflow-hidden border border-white shrink-0">
                    <img
                      alt={chat.name}
                      className="w-full h-full object-cover"
                      src={chat.avatar}
                    />
                    {chat.isOnline && (
                      <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border border-white rounded-full"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-0.5">
                      <h3 className="text-xs font-bold text-[#1c1c18] truncate">
                        {chat.name}
                      </h3>
                      <span
                        className={`text-[10px] shrink-0 ml-2 ${isItemActive ? "text-[#b0e0f6] font-medium" : "text-[#434840]/60"}`}
                      >
                        {chat.time}
                      </span>
                    </div>
                    <p className="text-xs text-[#434840] truncate">
                      <span className="font-medium text-[#1c1c18]">
                        {chat.sender}{" "}
                      </span>
                      {chat.lastMessage}
                    </p>
                  </div>
                  {chat.unread > 0 && (
                    <div className="w-4 h-4 rounded-full bg-[#b0e0f6] text-white text-[9px] font-bold flex items-center justify-center shrink-0 ml-2">
                      {chat.unread}
                    </div>
                  )}
                </div>
              );
            })}
          </>
        ) : (
          <>
            <div className="px-4 py-0.5 text-[10px] font-bold text-[#434840]/40 uppercase tracking-wider">
              Bạn bè hiện tại ({filteredFriendList.length})
            </div>
            {filteredFriendList.map((friend) => (
              <div
                key={friend.id}
                onClick={() => {
                  const targetChat = filteredChatList.find(
                    (c) => c.name === friend.name,
                  );
                  if (targetChat) {
                    setActiveChatId(targetChat.id);
                    setSidebarMenu("cuoc_tro_chuyen");
                    setView("chat");
                  }
                }}
                className="flex items-center gap-2.5 px-4 py-2 hover:bg-[#f0eee8]/50 transition-colors cursor-pointer"
              >
                <div className="relative w-9 h-9 rounded-full overflow-hidden border border-white shrink-0">
                  <img
                    src={friend.avatar}
                    className="w-full h-full object-cover"
                    alt=""
                  />
                  {friend.isOnline && (
                    <div className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 border border-white rounded-full"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-[#1c1c18] truncate">
                    {friend.name}
                  </h4>
                  <p className="text-[11px] text-[#434840]/60 truncate">
                    {friend.bio}
                  </p>
                </div>
              </div>
            ))}
          </>
        )}
      </nav>

      {/* User Profile / Settings Bottom */}
      <div className="p-3 border-t border-[#c3c8bd]/10 flex items-center gap-1.5 bg-transparent relative">
        <div
          onClick={() => {
            setView("profile");
            setIsNotificationOpen(false);
            setIsDropdownOpen(false);
          }}
          className={`relative w-8 h-8 shrink-0 cursor-pointer rounded-full transition-transform active:scale-95 hover:ring-2 hover:ring-[#a8d5ba] ${view === "profile" ? "ring-2 ring-[#a8d5ba]" : ""}`}
        >
          <img
            alt="You"
            className="w-full h-full rounded-full object-cover border border-[#fdfbf7]"
            src={userData.avatar}
          />
          <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-[#fdfbf7] rounded-full"></div>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-xs font-bold text-[#1c1c18] truncate">
            {userData.name}
          </h3>
          <p className="text-[10px] text-[#434840]/60">Trực tuyến</p>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsNotificationOpen(!isNotificationOpen);
            setIsDropdownOpen(false);
          }}
          className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors relative ${isNotificationOpen ? "bg-[#a8d5ba]/20 text-[#a8d5ba]" : "text-[#434840] hover:bg-[#f0eee8]"}`}
        >
          <span className="material-symbols-outlined text-lg">
            notifications
          </span>
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full"></span>
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsNotificationOpen(false);
            setIsDropdownOpen(false);
          }}
          className="w-7 h-7 rounded-full flex items-center justify-center text-[#434840] hover:bg-[#f0eee8] rounded-full transition-colors"
        >
          <span className="material-symbols-outlined text-lg">settings</span>
        </button>

        {isNotificationOpen && (
          <div className="absolute bottom-14 right-2 w-[260px] rounded-2xl bg-[rgba(253,251,247,0.95)] backdrop-blur-xl border border-white shadow-[0_10px_30px_rgba(0,0,0,0.08)] flex flex-col overflow-hidden z-50">
            <div className="p-4 border-b border-[#c3c8bd]/20 flex items-center justify-between bg-white/40">
              <h4 className="text-xs font-bold text-[#1c1c18] uppercase tracking-wider flex items-center gap-1.5">
                <span
                  className="material-symbols-outlined text-sm text-[#a8d5ba]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  spa
                </span>
                Thông báo mới
              </h4>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
