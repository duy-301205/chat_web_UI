import React, { useState, useEffect } from "react";
import { getFriendsApi, createConversationApi } from "../api/api";

export default function CreateGroupModal({ isOpen, onClose, onGroupCreated }) {
  const [groupName, setGroupName] = useState("");

  // State quản lý từ khóa tìm kiếm thành viên
  const [memberSearchQuery, setMemberSearchQuery] = useState("");

  // STATE ĐÃ CẬP NHẬT: Quản lý danh sách bạn bè thật bốc từ API
  const [friendList, setFriendList] = useState([]);
  const [selectedMemberIds, setSelectedMemberIds] = useState([]);
  const [loadingFriends, setLoadingFriends] = useState(false);

  // STATE THÊM MỚI THEO YÊU CẦU: Quản lý ẩn hiện box thông báo thành công
  const [isSuccess, setIsSuccess] = useState(false);

  // LOGIC ĐÃ THÊM: Tự động triệu hồi danh sách bạn bè thật khi Modal mở lên
  useEffect(() => {
    if (!isOpen) return;
    setIsSuccess(false); // Reset trạng thái thông báo khi mở lại modal

    const fetchFriends = async () => {
      setLoadingFriends(true);
      try {
        const response = await getFriendsApi();
        if (response && response.code === 200) {
          setFriendList(response.data || []);
        }
      } catch (error) {
        console.error(
          "Không thể lấy danh sách bạn bè để tạo nhóm:",
          error.message,
        );
      } finally {
        setLoadingFriends(false);
      }
    };

    fetchFriends();
  }, [isOpen]);

  if (!isOpen) return null;

  // Lọc danh sách bạn bè dựa trên kí tự ô tìm kiếm thành viên (Đọc theo username/nickName thật từ DB)
  const filteredFriendsToInvite = friendList.filter((f) => {
    const nameToSearch = f.nickName || f.username || "";
    return nameToSearch.toLowerCase().includes(memberSearchQuery.toLowerCase());
  });

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

  // Lấy danh sách object các bạn bè đã được chọn để làm hàng Preview ngang
  const selectedFriendsPreview = friendList.filter((f) =>
    selectedMemberIds.includes(f.id),
  );

  // TÍCH HỢP LOGIC API: Xử lý hành động gửi Form tạo nhóm thật lên Spring Boot
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!groupName.trim()) return;

    const groupPayload = {
      type: "GROUP",
      name: groupName.trim(),
      participantIds: selectedMemberIds,
    };

    try {
      const response = await createConversationApi(groupPayload);

      if (response && response.code === 200 && response.data) {
        let newGroupData = response.data;

        newGroupData.lastMessage = {
          content: `Bạn đã khởi tạo nhóm "${groupName.trim()}" thành công 🌿`,
          type: "SYSTEM",
          createdAt: new Date().toISOString(),
        };
        newGroupData.lastMessageAt = new Date().toISOString();

        // 3. THÊM THEO YÊU CẦU: Bật thông báo tạo thành công trước khi đóng modal
        setIsSuccess(true);

        setTimeout(() => {
          if (onGroupCreated) {
            onGroupCreated(newGroupData);
          }
          // Làm sạch Form và đóng hẳn Modal sau khi hiện thông báo xong
          setGroupName("");
          setMemberSearchQuery("");
          setSelectedMemberIds([]);
          setIsSuccess(false);
          onClose();
        }, 2000);
      }
    } catch (error) {
      console.error("Khởi tạo phòng chat nhóm thất bại:", error.message);
    }
  };

  return (
    /* LỚP NỀN BAO QUANH NGOÀI CÙNG - GIỮ NGUYÊN VẸN */
    <div className="absolute inset-0 rounded-3xl bg-[rgba(253,251,247,0.3)] backdrop-blur-[4px] flex items-center justify-center p-6 z-50 animate-in fade-in duration-200">
      {/* THÊM MỚI THEO YÊU CẦU: Hộp thoại (box) hiện ra thông báo thành công phủ lên trên */}
      {isSuccess && (
        <div className="absolute inset-0 m-auto w-full max-w-sm h-fit bg-white/95 backdrop-blur-md border border-[#a8d5ba]/40 rounded-[24px] shadow-[0_10px_30px_rgba(0,0,0,0.08)] p-5 flex flex-col items-center justify-center text-center gap-2.5 z-50 animate-in zoom-in-95 duration-200">
          <div className="w-10 h-10 rounded-full bg-[#a8d5ba]/10 text-[#a8d5ba] flex items-center justify-center animate-bounce">
            <span className="material-symbols-outlined text-xl font-bold">
              spa
            </span>
          </div>
          <div>
            <h4 className="text-xs font-bold text-[#1c1c18]">
              Tạo nhóm thành công
            </h4>
            <p className="text-[11px] text-[#434840]/70 mt-1">
              Nhóm{" "}
              <span className="font-bold text-[#1c1c18]">"{groupName}"</span> đã
              được khởi tạo thành công!
            </p>
          </div>
        </div>
      )}

      {/* KHUNG BOX TRUNG TÂM GỐC - GIỮ NGUYÊN 100% GIAO DIỆN CŨ CỦA BẠN */}
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

          {/* Ô Input Nhập Tên Nhóm */}
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
                    src={friend.avatarUrl || "https://i.pravatar.cc/100"}
                    className="w-3.5 h-3.5 rounded-full object-cover"
                    alt=""
                  />
                  <span>{friend.nickName || friend.username}</span>
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
              {loadingFriends ? (
                <div className="text-center py-6 text-[11px] text-[#434840]/40 italic flex items-center justify-center gap-1.5">
                  <span className="material-symbols-outlined text-sm animate-spin text-[#a8d5ba]">
                    progress_activity
                  </span>
                  Đang tải danh bạ...
                </div>
              ) : filteredFriendsToInvite.length === 0 ? (
                <p className="text-xs text-[#434840]/40 text-center italic pt-4">
                  Không tìm thấy linh hồn nào phù hợp từ khóa.
                </p>
              ) : (
                filteredFriendsToInvite.map((friend) => {
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
                          src={friend.avatarUrl || "https://i.pravatar.cc/100"}
                          className="w-7 h-7 rounded-full object-cover border border-white shrink-0 shadow-sm"
                          alt=""
                        />
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-[#1c1c18] truncate">
                            {friend.nickName || friend.username}
                          </p>
                          <p className="text-[10px] text-[#434840]/50 truncate">
                            {friend.online ? "Đang trực tuyến" : "Ngoại tuyến"}
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
                })
              )}
            </div>
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
