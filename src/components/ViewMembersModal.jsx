import React, { useState } from "react";

export default function ViewMembersModal({
  isOpen,
  mode = "VIEW", // Nhận "VIEW" hoặc "EDIT" từ RightSidebar
  onClose,
  membersList = [],
  conversationId, // Nhận thêm ID phòng chat từ RightSidebar
  onUpdateNickname, // Nhận thêm hàm update từ DashboardChat
}) {
  const [searchQuery, setSearchQuery] = useState("");

  // State quản lý thành viên nào đang được click sửa biệt danh
  const [editingUserId, setEditingUserId] = useState(null);
  const [tempNickname, setTempNickname] = useState("");

  if (!isOpen) return null;

  // ĐÃ SỬA: Đưa logic lọc mảng này lên TRÊN để khởi tạo biến trước
  const filteredMembers = membersList.filter((m) => {
    const currentNickname = m.nickName || m.nickname || "";
    const nameToSearch = currentNickname || m.username || "";
    return nameToSearch.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // ĐÃ SỬA: Hạ đoạn log xuống DƯỚI để không gây lỗi crash 'before initialization'
  console.log("-----------------------------------------");
  console.log("MÔ TẢ DATA MÀ MODAL NHẬN ĐƯỢC:");
  console.log("Tổng số phần tử:", filteredMembers.length);
  if (filteredMembers.length > 0) {
    console.log("Cấu trúc CHI TIẾT của phần tử đầu tiên:", filteredMembers[0]);
    console.log("Thử đọc member.username:", filteredMembers[0].username);
    console.log("Thử đọc member.nickname:", filteredMembers[0].nickname);
    console.log("Thử đọc member.nickName:", filteredMembers[0].nickName);
  }
  console.log("-----------------------------------------");

  // Bật chế độ chỉnh sửa biệt danh cho một thành viên
  const startEditing = (userId, currentNickname, username) => {
    setEditingUserId(userId);
    setTempNickname(currentNickname || username || "");
  };

  // Gửi dữ liệu biệt danh mới lên hàm xử lý để gọi API
  const saveNickname = async (userId) => {
    if (onUpdateNickname) {
      await onUpdateNickname(conversationId, userId, tempNickname);
    }
    setEditingUserId(null);
  };

  // Bấm Enter để lưu nhanh, Escape để hủy sửa
  const handleKeyDown = (e, userId) => {
    if (e.key === "Enter") {
      saveNickname(userId);
    } else if (e.key === "Escape") {
      setEditingUserId(null);
    }
  };

  return (
    /* DÙNG ABSOLUTE INSET-0 Z-50: Lấp đầy toàn bộ khung aside bên ngoài, đè qua header cũ */
    <div className="absolute inset-0 bg-[#fdfbf7] flex flex-col h-full w-full justify-between overflow-hidden animate-in slide-in-from-right duration-200 z-50 p-4">
      <div className="flex flex-col flex-1 overflow-hidden w-full">
        {/* Header riêng biệt của view - ĐÃ FIX gộp hàng dấu ngoặc đơn tránh vỡ layout render */}
        <div className="h-[60px] flex items-center justify-between shrink-0 pb-2 border-b border-b-[#c3c8bd]/10 mb-3">
          <h4 className="text-xs font-bold text-[#1c1c18] uppercase tracking-wider flex items-center gap-1.5">
            <span className="material-symbols-outlined text-sm text-[#a8d5ba]">
              {mode === "EDIT" ? "badge" : "groups"}
            </span>
            {mode === "EDIT" ? "Quản lý biệt danh" : "Thành viên nhóm"} (
            {membersList.length})
          </h4>
          <button
            type="button"
            onClick={() => {
              setEditingUserId(null);
              onClose();
            }}
            className="w-7 h-7 rounded-full flex items-center justify-center text-[#434840]/60 hover:bg-[#f0eee8] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">close</span>
          </button>
        </div>

        {/* Thanh tìm kiếm nội bộ */}
        <div className="relative flex items-center w-full h-8 rounded-lg bg-[#f0eee8]/80 border border-[#c3c8bd]/30 px-2.5 text-[#1c1c18] focus-within:bg-white focus-within:border-[#a8d5ba]/50 transition-all shadow-sm shrink-0 mb-3">
          <span className="material-symbols-outlined absolute left-2.5 text-[#434840]/40 text-sm">
            search
          </span>
          <input
            type="text"
            placeholder="Tìm kiếm thành viên..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent border-none text-xs outline-none focus:ring-0 placeholder:text-[#434840]/40 p-0 h-full pl-6"
          />
        </div>

        {/* Danh sách thành viên */}
        <div className="flex-1 overflow-y-auto space-y-1.5 pr-0.5 scrollbar-none">
          <div className="flex flex-col gap-1.5">
            {filteredMembers.map((member) => {
              // Trích xuất ID an toàn đề phòng sai lệch kiểu dữ liệu từ DTO
              const targetUserId = member.userId || member.id;
              const currentNickname = member.nickName || member.nickname;

              return (
                <div
                  key={targetUserId}
                  className="flex items-center justify-between p-2 rounded-xl bg-white/50 border border-[#c3c8bd]/5 hover:bg-white transition-colors gap-2"
                >
                  {/* Khối Avatar & Thông tin tên */}
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <div className="relative w-8 h-8 shrink-0">
                      <img
                        src={member.avatarUrl || "https://i.pravatar.cc/100"}
                        className="w-full h-full rounded-full object-cover border border-white shadow-sm"
                        alt=""
                      />
                      {member.online && (
                        <div className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 border border-white rounded-full"></div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      {/* ================= CHẾ ĐỘ 1: XEM TẤT CẢ (MODE VIEW) ================= */}
                      {mode === "VIEW" && (
                        <>
                          <p className="text-xs font-bold text-[#1c1c18] truncate flex items-center flex-wrap gap-x-1">
                            <span>{member.username}</span>
                            {currentNickname &&
                              currentNickname !== member.username && (
                                <span className="text-[#434840]/60 font-medium text-[11px]">
                                  ({currentNickname})
                                </span>
                              )}
                            {member.isYou && (
                              <span className="text-[#434840]/40 font-normal text-[10px]">
                                (Bạn)
                              </span>
                            )}
                          </p>
                          <p className="text-[10px] text-[#434840]/50 truncate">
                            {member.online ? "Đang hoạt động" : "Ngoại tuyến"}
                          </p>
                        </>
                      )}

                      {/* ================= CHẾ ĐỘ 2: BIỆT DANH (MODE EDIT) ================= */}
                      {mode === "EDIT" && (
                        <>
                          <p className="text-xs font-bold text-[#1c1c18] truncate flex items-center gap-1">
                            {member.username}
                            {member.isYou && (
                              <span className="text-[#434840]/60 font-normal text-[10px]">
                                (Bạn)
                              </span>
                            )}
                          </p>

                          {/* Ô nhập input sửa đổi hoặc dòng text biệt danh */}
                          {editingUserId === targetUserId ? (
                            <div className="flex items-center gap-1 mt-0.5 w-full">
                              <input
                                type="text"
                                value={tempNickname}
                                onChange={(e) =>
                                  setTempNickname(e.target.value)
                                }
                                onKeyDown={(e) =>
                                  handleKeyDown(e, targetUserId)
                                }
                                className="w-full h-6 px-1.5 text-[10px] bg-[#f0eee8] border border-[#a8d5ba]/40 rounded outline-none focus:bg-white text-[#1c1c18]"
                                autoFocus
                                placeholder="Nhập biệt danh..."
                              />
                              <button
                                type="button"
                                onClick={() => saveNickname(targetUserId)}
                                className="w-5 h-5 bg-[#a8d5ba] text-white rounded flex items-center justify-center cursor-pointer hover:bg-[#97c4a9]"
                              >
                                <span className="material-symbols-outlined text-[12px] font-bold">
                                  check
                                </span>
                              </button>
                            </div>
                          ) : (
                            <p
                              onClick={() =>
                                startEditing(
                                  targetUserId,
                                  currentNickname,
                                  member.username,
                                )
                              }
                              className="text-[10px] text-[#434840]/50 truncate mt-0.5 cursor-pointer hover:text-[#b0e0f6] flex items-center gap-0.5 group/text"
                              title="Click để đổi biệt danh nhanh"
                            >
                              <span className="truncate">
                                {currentNickname || "Chưa đặt 🍃"}
                              </span>
                              <span className="material-symbols-outlined text-[10px] opacity-0 group-hover/text:opacity-100 transition-opacity">
                                edit
                              </span>
                            </p>
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  {/* Phía bên phải: Vai trò hoặc Nút sửa nhanh */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    {mode === "EDIT" && editingUserId !== targetUserId && (
                      <button
                        type="button"
                        onClick={() =>
                          startEditing(
                            targetUserId,
                            currentNickname,
                            member.username,
                          )
                        }
                        className="w-6 h-6 rounded-full flex items-center justify-center text-[#434840]/40 hover:bg-[#f0eee8] hover:text-[#b0e0f6] transition-colors cursor-pointer"
                        title="Đổi biệt danh"
                      >
                        <span className="material-symbols-outlined text-sm">
                          edit_note
                        </span>
                      </button>
                    )}
                    {member.role && (
                      <span className="text-[9px] font-bold bg-[#a8d5ba]/20 text-[#a8d5ba] px-2 py-0.5 rounded-md min-w-[45px] text-center">
                        {member.role === "ADMIN" ? "ADMIN" : member.role}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Nút đóng quay lại nằm dưới đáy */}
      <div className="pt-2 border-t border-[#c3c8bd]/10 shrink-0 w-full bg-[#fdfbf7]">
        <button
          type="button"
          onClick={() => {
            setEditingUserId(null);
            onClose();
          }}
          className="w-full h-7 rounded-lg bg-[#f0eee8] text-[#434840] text-[11px] font-semibold hover:bg-[#ebe8e2] transition-colors cursor-pointer"
        >
          Quay lại thông tin nhóm
        </button>
      </div>
    </div>
  );
}
