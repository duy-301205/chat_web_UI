import React, { useState } from "react";

export default function CreateGroupModal({ isOpen, onClose }) {
  const [groupName, setGroupName] = useState("");

  // State quản lý từ khóa tìm kiếm thành viên
  const [memberSearchQuery, setMemberSearchQuery] = useState("");

  // Mảng lưu ID của những thành viên được tích chọn tham gia nhóm
  const [selectedMemberIds, setSelectedMemberIds] = useState([]);

  // Danh sách bạn bè add cứng dùng để tích chọn tạo nhóm
  const friendList = [
    {
      id: 2,
      name: "Satsuki",
      avatar:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBbEnfWoJN0FdX8Q0Hq4yE8WQ3NjFAwW0TcMQACprWtM0VqxxbP1Sgw0eTqykmNfDZtFBy5ZvIH7SWwAmyOrrWEZ6SNR5scHsWMxBKtKscaJs0DiDoWB6sFt2FbPH_8rzfVPcOquHc9qOYVx_JaEDZHkEXwuv8Z_pJaZK0Mmat7-6orD3w26bB58PGA5o0wGsPr_7hi6gC5oxa1ObU1SEiwFjt8hNqMPeiirCHzBeMFigp_WK806igADIPMmBDV0oIF-KOC-QfcS0o",
      bio: "🌸 Người yêu cơn mưa mùa hạ",
    },
    {
      id: 3,
      name: "Mei",
      avatar:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDHOA6JzXhWkDkkk6txfQ34mARY-BslsFdLmm1Lu5E8mwn97qpLRXwJV6lVomfjtcUGMaWQLcAEJXIwDKhdQFX6SN8soBnkKirRUlSgD95DTGGlJGWenv-1Ir3_aRUXYxlLjMWbxnBM_Fei4TtozkR_eLjl5879HdbmB6qwh-5KAvWRU8YRRIo0j7K1ytBxrKtEH32fWqLYpb4MPHS1K3QFAVgXfDdfk-1PaGZryriCXL22S1gA-5cPbXxPvE0LYWycsCmUYFSHrKg",
      bio: "Đuổi theo hạt mầm rừng xanh",
    },
    {
      id: 5,
      name: "Chị Kusa",
      avatar:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDnc7JSk99vzS_o4UmNd1jwkafcH0cI43oXuD3htmyEiYbCOnHXbusaCbsr-nbDO7wR8PUvT7FZkaeeBdmFxvmMl2-tWaZHSyKMEwO8f2m7c0NKdZkoiapiAqRsqGnK7GEw-vpqPYJkcTYmNAOlJOl0Z6_SY7CaLenNtNpmCRUOsI8GjlJMCp4SqIv3vETUP_PfR2mKXzVHpVjwAHfvm2tQ81tNyyAG8spZEpu5H4Z_xJ2eG99f5c5BDsUgJe-Nn1eN2sIhLQx3dtw",
      bio: "Tĩnh lặng ngắm sao",
    },
  ];

  if (!isOpen) return null;

  // Lọc danh sách bạn bè dựa trên kí tự ô tìm kiếm thành viên
  const filteredFriendsToInvite = friendList.filter((f) =>
    f.name.toLowerCase().includes(memberSearchQuery.toLowerCase()),
  );

  // Xử lý khi click chọn/hủy chọn thành viên
  const handleToggleMember = (id) => {
    if (selectedMemberIds.includes(id)) {
      setSelectedMemberIds(
        selectedMemberIds.filter((memberId) => memberId !== id),
      );
    } else {
      setSelectedMemberIds([...selectedMemberIds, id]);
    }
  };

  // Lấy danh sách object các bạn bè đã được chọn để làm hàng Preview
  const selectedFriendsPreview = friendList.filter((f) =>
    selectedMemberIds.includes(f.id),
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!groupName.trim()) return;

    const selectedNames = selectedFriendsPreview.map((f) => f.name);

    alert(
      `Khởi tạo nhóm: "${groupName}"\nThành viên gồm: Bạn, ${
        selectedNames.length > 0
          ? selectedNames.join(", ")
          : "Chưa có thành viên"
      } 🌿`,
    );

    setGroupName("");
    setMemberSearchQuery("");
    setSelectedMemberIds([]);
    onClose();
  };

  return (
    /* LỚP NỀN BAO QUANH NGOÀI CÙNG: Chiếm 100% diện tích phân vùng bên phải */
    <div className="absolute inset-0 rounded-3xl bg-[rgba(253,251,247,0.3)] backdrop-blur-[4px] flex items-center justify-center p-6 z-50 animate-in fade-in duration-200">
      {/* KHUNG BOX TRUNG TÂM: Bọc gọn nội dung, mờ kính dày hơn, bo góc tròn sâu */}
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-xl h-full max-h-[500px] bg-[rgba(253,251,247,0.9)] backdrop-blur-[16px] border border-white rounded-[32px] shadow-[0_12px_40px_rgba(0,0,0,0.06)] p-6 flex flex-col justify-between overflow-hidden animate-in zoom-in-95 duration-200"
      >
        {/* Khối nội dung cuộn phía trên */}
        <div className="flex flex-col flex-1 overflow-hidden w-full">
          {/* Header nhóm */}
          <div className="flex items-center justify-between shrink-0 pb-2.5 border-b border-[#c3c8bd]/10">
            <h4 className="text-xs font-bold text-[#434840] uppercase tracking-wider flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sm text-[#a8d5ba]">
                group_add
              </span>
              Tạo nhóm mới
            </h4>
            <button
              type="button"
              onClick={onClose}
              className="w-7 h-7 rounded-full flex items-center justify-center text-[#434840]/60 hover:bg-[#f0eee8] transition-colors"
            >
              <span className="material-symbols-outlined text-base">close</span>
            </button>
          </div>

          {/* Ô Input Nhập Tên Nhóm - Đã đẩy lên đầu thay thế chỗ cho phần chọn ảnh cũ */}
          <div className="space-y-1 pt-3 shrink-0">
            <label className="text-[10px] font-bold uppercase tracking-wider text-[#434840]/60 ml-1">
              Tên nhóm trò chuyện
            </label>
            <input
              type="text"
              placeholder="Nhập tên nhóm rừng xanh..."
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="w-full h-8 rounded-lg bg-[#f0eee8]/80 border border-[#c3c8bd]/30 px-2.5 text-xs outline-none focus:bg-white focus:border-[#a8d5ba]/50 transition-all placeholder:text-[#434840]/40 text-[#1c1c18]"
              autoFocus
            />
          </div>

          {/* Ô Tìm Kiếm Thành Viên */}
          <div className="space-y-1 pt-3 shrink-0">
            <label className="text-[10px] font-bold uppercase tracking-wider text-[#434840]/60 ml-1">
              Thêm thành viên vào nhóm
            </label>
            <div className="relative flex items-center w-full h-8 rounded-lg bg-[#f0eee8]/80 border border-[#c3c8bd]/30 px-2.5 text-[#1c1c18] focus-within:bg-white focus-within:border-[#a8d5ba]/50 transition-all">
              <span className="material-symbols-outlined text-[#434840]/40 text-sm mr-1.5">
                search
              </span>
              <input
                type="text"
                placeholder="Nhập tên để tìm kiếm nhanh..."
                value={memberSearchQuery}
                onChange={(e) => setMemberSearchQuery(e.target.value)}
                className="w-full bg-transparent border-none text-xs outline-none focus:ring-0 placeholder:text-[#434840]/40 p-0 h-full"
              />
              {memberSearchQuery && (
                <button
                  type="button"
                  onClick={() => setMemberSearchQuery("")}
                  className="text-[#434840]/40 hover:text-[#434840]"
                >
                  <span className="material-symbols-outlined text-xs">
                    close
                  </span>
                </button>
              )}
            </div>
          </div>

          {/* Hàng ngang hiển thị các thành viên đã chọn nhanh */}
          {selectedFriendsPreview.length > 0 && (
            <div className="flex items-center gap-1.5 pt-2 shrink-0 overflow-x-auto pb-1 scrollbar-none">
              {selectedFriendsPreview.map((friend) => (
                <div
                  key={friend.id}
                  onClick={() => handleToggleMember(friend.id)}
                  className="flex items-center gap-1 bg-[#a8d5ba]/10 border border-[#a8d5ba]/20 pl-1.5 pr-1 py-0.5 rounded-lg text-[10px] font-bold text-[#434840] shrink-0 hover:bg-red-50 hover:text-red-500 hover:border-red-200 group transition-all"
                >
                  <img
                    src={friend.avatar}
                    className="w-3.5 h-3.5 rounded-full object-cover"
                    alt=""
                  />
                  <span>{friend.name}</span>
                  <span className="material-symbols-outlined text-xs text-[#434840]/40 group-hover:text-red-500 flex items-center">
                    close
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Danh Sách Thành Viên Để Tích Chọn */}
          <div className="flex-1 overflow-y-auto my-3 space-y-1.5 pr-0.5">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#434840]/60 ml-1 pb-0.5">
              Gợi ý thành viên ({selectedMemberIds.length})
            </p>

            <div className="grid grid-cols-1 gap-1.5">
              {filteredFriendsToInvite.map((friend) => {
                const isChecked = selectedMemberIds.includes(friend.id);
                return (
                  <div
                    key={friend.id}
                    onClick={() => handleToggleMember(friend.id)}
                    className={`flex items-center justify-between p-2 rounded-xl border border-transparent cursor-pointer transition-colors ${
                      isChecked
                        ? "bg-[#a8d5ba]/10 border-[#a8d5ba]/20"
                        : "bg-white/50 hover:bg-white border-white/40 shadow-sm"
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <img
                        src={friend.avatar}
                        className="w-7 h-7 rounded-full object-cover border border-white shrink-0 shadow-sm"
                        alt=""
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-[#1c1c18] truncate">
                          {friend.name}
                        </p>
                        <p className="text-[10px] text-[#434840]/50 truncate">
                          {friend.bio}
                        </p>
                      </div>
                    </div>

                    <div
                      className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center transition-all shrink-0 ml-2 ${
                        isChecked
                          ? "bg-[#a8d5ba] border-[#a8d5ba] text-white"
                          : "border-[#c3c8bd] bg-white"
                      }`}
                    >
                      {isChecked && (
                        <span className="material-symbols-outlined text-[9px] font-bold">
                          check
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredFriendsToInvite.length === 0 && (
              <p className="text-xs text-[#434840]/40 text-center italic pt-4">
                Không tìm thấy linh hồn nào phù hợp từ khóa.
              </p>
            )}
          </div>
        </div>

        {/* Cụm Nút Hành Động Dưới Đáy Khung */}
        <div className="flex gap-2 pt-2 border-t border-[#c3c8bd]/10 shrink-0 w-full">
          <button
            type="button"
            onClick={() => {
              setGroupName("");
              setMemberSearchQuery("");
              setSelectedMemberIds([]);
              onClose();
            }}
            className="flex-1 h-7 rounded-lg bg-[#f0eee8] text-[#434840] text-[11px] font-semibold hover:bg-[#ebe8e2] transition-colors"
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={!groupName.trim()}
            className="flex-1 h-7 rounded-lg bg-[#a8d5ba] text-white text-[11px] font-bold shadow-sm hover:bg-[#97c4a9] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Khởi tạo nhóm
          </button>
        </div>
      </form>
    </div>
  );
}
