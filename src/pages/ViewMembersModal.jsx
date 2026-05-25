import React, { useState } from "react";

export default function ViewMembersModal({
  isOpen,
  onClose,
  membersList = [],
}) {
  const [searchQuery, setSearchQuery] = useState("");

  if (!isOpen) return null;

  // CẬP NHẬT CHUẨN XÁC: Lấy nickName hoặc username, phòng ngừa giá trị null trước khi toLowerCase()
  const filteredMembers = membersList.filter((m) => {
    const nameToSearch = m.nickName || m.username || "";
    return nameToSearch.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    /* CHUẨN XÁC: Dùng absolute inset-0 z-50 lấp đầy toàn bộ thẻ cha aside bên ngoài, đè qua cả header thông tin cũ */
    <div className="absolute inset-0 bg-[#fdfbf7] flex flex-col h-full w-full justify-between overflow-hidden animate-in slide-in-from-right duration-200 z-50 p-4">
      <div className="flex flex-col flex-1 overflow-hidden w-full">
        {/* Header riêng biệt của view Xem tất cả thành viên */}
        <div className="h-[60px] flex items-center justify-between shrink-0 pb-2 border-b border-[#c3c8bd]/10 mb-3">
          <h4 className="text-xs font-bold text-[#1c1c18] uppercase tracking-wider flex items-center gap-1.5">
            <span className="material-symbols-outlined text-sm text-[#a8d5ba]">
              groups
            </span>
            Thành viên ({membersList.length})
          </h4>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full flex items-center justify-center text-[#434840]/60 hover:bg-[#f0eee8] transition-colors"
          >
            <span className="material-symbols-outlined text-base">close</span>
          </button>
        </div>

        {/* Thanh tìm kiếm nội bộ */}
        <div className="relative flex items-center w-full h-8 rounded-lg bg-[#f0eee8]/80 border border-[#c3c8bd]/30 px-2.5 text-[#1c1c18] focus-within:bg-white focus-within:border-[#a8d5ba]/50 transition-all shadow-sm shrink-0">
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
        <div className="flex-1 overflow-y-auto my-3 space-y-1.5 pr-0.5">
          <div className="flex flex-col gap-1">
            {filteredMembers.map((member, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2 rounded-xl bg-white/50 border border-[#c3c8bd]/5 hover:bg-white transition-colors"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="relative w-8 h-8 shrink-0">
                    {/* CẬP NHẬT: Đổi thành member.avatarUrl theo dữ liệu API */}
                    <img
                      src={member.avatarUrl || "https://i.pravatar.cc/100"}
                      className="w-full h-full rounded-full object-cover border border-white shadow-sm"
                      alt=""
                    />
                    {/* CẬP NHẬT: Hiển thị chấm xanh dựa trên trường member.online thực tế */}
                    {member.online && (
                      <div className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 border border-white rounded-full"></div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-[#1c1c18] truncate">
                      {/* CẬP NHẬT: Đồng bộ hiển thị nickName hoặc username từ API */}
                      {member.nickName || member.username}
                      {member.isYou && (
                        <span className="text-[#434840]/60 font-normal text-[10px] ml-1">
                          (Bạn)
                        </span>
                      )}
                    </p>
                    <p className="text-[10px] text-[#434840]/50 truncate">
                      {/* CẬP NHẬT: Thay đổi nhãn trạng thái theo trường m.online thực tế */}
                      {member.online ? "Đang hoạt động" : "Ngoại tuyến"}
                    </p>
                  </div>
                </div>
                {member.role && (
                  <span className="text-[9px] font-bold bg-[#a8d5ba]/20 text-[#a8d5ba] px-2 py-0.5 rounded-md">
                    {member.role}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Nút đóng quay lại nằm dưới đáy */}
      <div className="pt-2 border-t border-[#c3c8bd]/10 shrink-0 w-full bg-[#fdfbf7]">
        <button
          type="button"
          onClick={onClose}
          className="w-full h-7 rounded-lg bg-[#f0eee8] text-[#434840] text-[11px] font-semibold hover:bg-[#ebe8e2] transition-colors"
        >
          Quay lại thông tin nhóm
        </button>
      </div>
    </div>
  );
}
