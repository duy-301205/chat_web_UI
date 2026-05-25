import React, { useState } from "react";

export default function AddMemberModal({ isOpen, onClose }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);

  const nonMemberFriends = [
    {
      id: 10,
      name: "Vô Diện (No Face)",
      avatar: "https://i.pravatar.cc/150?img=33",
      bio: "Thích bánh ngọt và trà tĩnh lặng.",
    },
    {
      id: 11,
      name: "Thần Sông",
      avatar: "https://i.pravatar.cc/150?img=12",
      bio: "Trông coi các dòng suối nhỏ.",
    },
    {
      id: 12,
      name: "Kanta",
      avatar: "https://i.pravatar.cc/150?img=60",
      bio: "Người bạn hay ngại ngùng thích giúp đỡ.",
    },
  ];

  if (!isOpen) return null;

  const filteredFriends = nonMemberFriends.filter((f) =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleToggleSelect = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (selectedIds.length === 0) return;
    alert(`Đã thêm thành công thành viên mới! 🌿`);
    setSelectedIds([]);
    setSearchQuery("");
    onClose();
  };

  return (
    /* CHUẨN XÁC: Dùng absolute inset-0 z-50 lấp đầy toàn bộ thẻ cha aside bên ngoài, p-4 tự thân để giữ khoảng cách nội dung */
    <div className="absolute inset-0 bg-[#fdfbf7] flex flex-col h-full w-full justify-between overflow-hidden animate-in slide-in-from-right duration-200 z-50 p-4">
      <div className="flex flex-col flex-1 overflow-hidden w-full">
        {/* Header riêng biệt của view Thêm thành viên vì đã đè lên header cũ */}
        <div className="h-[60px] flex items-center justify-between shrink-0 pb-2 border-b border-[#c3c8bd]/10 mb-3">
          <h3 className="text-xs font-bold text-[#1c1c18] uppercase tracking-wider flex items-center gap-1.5">
            <span className="material-symbols-outlined text-sm text-[#a8d5ba]">
              person_add
            </span>
            Thêm thành viên
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full flex items-center justify-center text-[#434840]/60 hover:bg-[#f0eee8] transition-colors"
          >
            <span className="material-symbols-outlined text-base">close</span>
          </button>
        </div>

        {/* Thanh tìm kiếm */}
        <div className="relative flex items-center w-full h-8 rounded-lg bg-[#f0eee8]/80 border border-[#c3c8bd]/30 px-2.5 text-[#1c1c18] focus-within:bg-white focus-within:border-[#a8d5ba]/50 transition-all shadow-sm shrink-0">
          <span className="material-symbols-outlined text-[#434840]/40 text-sm mr-1.5">
            search
          </span>
          <input
            type="text"
            placeholder="Tìm kiếm bạn bè..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent border-none text-xs outline-none focus:ring-0 placeholder:text-[#434840]/40 p-0 h-full"
          />
        </div>

        {/* Danh Sách Gợi Ý */}
        <div className="flex-1 overflow-y-auto my-3 space-y-1.5 pr-0.5">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#434840]/60 ml-1 pb-0.5">
            Gợi ý thành viên ({selectedIds.length})
          </p>

          <div className="flex flex-col gap-1">
            {filteredFriends.map((friend) => {
              const isChecked = selectedIds.includes(friend.id);
              return (
                <div
                  key={friend.id}
                  onClick={() => handleToggleSelect(friend.id)}
                  className={`flex items-center justify-between p-2 rounded-xl cursor-pointer transition-colors border border-transparent ${
                    isChecked
                      ? "bg-[#a8d5ba]/10 border-[#a8d5ba]/10"
                      : "hover:bg-[#f0eee8]/50"
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <img
                      src={friend.avatar}
                      className="w-7 h-7 rounded-full object-cover shrink-0 shadow-sm"
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
                    className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center transition-all shrink-0 ml-2 ${isChecked ? "bg-[#a8d5ba] border-[#a8d5ba] text-white" : "border-[#c3c8bd] bg-white"}`}
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
        </div>
      </div>

      {/* Cụm nút xác nhận chân trang */}
      <div className="flex gap-2 pt-2 border-t border-[#c3c8bd]/10 shrink-0 w-full bg-[#fdfbf7]">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 h-7 rounded-lg bg-[#f0eee8] text-[#434840] text-[11px] font-semibold hover:bg-[#ebe8e2] transition-colors"
        >
          Hủy bỏ
        </button>
        <button
          type="button"
          onClick={handleAddSubmit}
          disabled={selectedIds.length === 0}
          className="flex-1 h-7 rounded-lg bg-[#a8d5ba] text-white text-[11px] font-bold shadow-sm hover:bg-[#97c4a9] transition-colors disabled:opacity-50"
        >
          Thêm ({selectedIds.length})
        </button>
      </div>
    </div>
  );
}
