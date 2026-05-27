import React, { useState, useEffect, useMemo } from "react";
// Import hàm search từ file api của bạn
import { getFriendsApi } from "../api/api";

export default function AddMemberModal({
  isOpen,
  onClose,
  onAddMember,
  currentMembers = [], // Danh sách thành viên HIỆN TẠI của nhóm
  allFriends = [], // Danh sách bạn bè gốc ban đầu để lấy ngẫu nhiên
}) {
  // --- KHU VỰC KHAI BÁO HOOKS (Bắt buộc phải nằm trên cùng của Component) ---
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);

  // 1. Gợi ý ban đầu: Lọc lấy danh sách bạn bè CHƯA vào nhóm từ database tĩnh
  const friendsNotInGroup = useMemo(() => {
    if (!allFriends) return [];
    return allFriends.filter((friend) => {
      return !currentMembers.some((m) => {
        // CHỈNH SỬA TẠI ĐÂY: Đối chiếu friend.id (User ID gốc) với m.userId (trường mới thêm ở Backend)
        const friendId = String(friend.id || friend.userId || "");
        const memberUserId = String(m.userId || "");
        return friendId === memberUserId && friendId !== "";
      });
    });
  }, [allFriends, currentMembers]);

  // 2. Lấy ngẫu nhiên 3 người bạn bất kỳ từ danh sách chưa vào nhóm làm gợi ý mặc định
  const initialRandomSuggestions = useMemo(() => {
    if (friendsNotInGroup.length === 0) return [];
    return [...friendsNotInGroup].sort(() => 0.5 - Math.random()).slice(0, 3);
  }, [isOpen, friendsNotInGroup]);

  // 3. Logic xử lý gọi API kết hợp bộ lọc bọc lót theo ký tự khớp tên cho Backend
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    // Debounce 300ms tránh spam request liên server khi người dùng đang gõ dở
    const delayDebounceFn = setTimeout(async () => {
      try {
        const result = await getFriendsApi(searchQuery);
        if (result && result.code === 200) {
          const rawServerData = result.data || [];

          // SỬA TẠI ĐÂY: Chỉ lọc những người thực sự khớp với ký tự gõ ô tìm kiếm
          const matchedResults = rawServerData.filter((friend) => {
            const friendName =
              friend.name || friend.nickName || friend.username || "";
            return friendName.toLowerCase().includes(searchQuery.toLowerCase());
          });

          setSearchResults(matchedResults);
        }
      } catch (error) {
        console.error("Tìm kiếm bạn bè thất bại:", error.message);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  // --- KHU VỰC KIỂM TRA ĐIỀU KIỆN RENDER (Đặt dưới toàn bộ Hook để tránh lỗi Rules of Hooks) ---
  if (!isOpen) return null;

  // 4. Xác định danh sách nạp vào vòng lặp hiển thị giao diện
  const displayFriends =
    searchQuery.trim() === "" ? initialRandomSuggestions : searchResults;

  const handleToggleSelect = (id, isAlreadyMember) => {
    // Nếu đã ở trong nhóm rồi thì không cho kích hoạt chọn hoặc bỏ chọn
    if (isAlreadyMember) return;

    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleAddSubmit = async (e) => {
    if (e) e.preventDefault();
    if (selectedIds.length === 0) return;

    if (onAddMember) {
      await onAddMember({
        userIds: selectedIds,
      });
    }

    setSelectedIds([]);
    setSearchQuery("");
  };

  return (
    <div className="absolute inset-0 bg-[#fdfbf7] flex flex-col h-full w-full justify-between overflow-hidden animate-in slide-in-from-right duration-200 z-50 p-4">
      <div className="flex flex-col flex-1 overflow-hidden w-full">
        {/* Header */}
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

        {/* Danh Sách Gợi Ý / Kết quả */}
        <div className="flex-1 overflow-y-auto my-3 space-y-1.5 pr-0.5">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#434840]/60 ml-1 pb-0.5">
            {searchQuery.trim() === ""
              ? `Gợi ý thành viên (${selectedIds.length})`
              : `Kết quả tìm kiếm phù hợp (${displayFriends.length})`}
          </p>

          <div className="flex flex-col gap-1">
            {isLoading ? (
              <p className="text-xs text-[#434840]/50 italic text-center pt-4">
                Đang tìm kiếm linh hồn...
              </p>
            ) : displayFriends.length > 0 ? (
              displayFriends.map((friend) => {
                const isChecked = selectedIds.includes(friend.id);

                // CHỈNH SỬA TẠI ĐÂY: Đối chiếu friend.id (User ID gốc từ API) với m.userId (Mã người dùng trong nhóm từ Backend)
                const isAlreadyMember = currentMembers.some((m) => {
                  const friendId = String(friend.id || friend.userId || "");
                  const memberUserId = String(m.userId || "");
                  return friendId === memberUserId && friendId !== "";
                });

                return (
                  <div
                    key={friend.id}
                    onClick={() =>
                      handleToggleSelect(friend.id, isAlreadyMember)
                    }
                    className={`flex items-center justify-between p-2 rounded-xl transition-colors border border-transparent ${
                      isAlreadyMember
                        ? "opacity-60 cursor-not-allowed bg-[#f0eee8]/20"
                        : isChecked
                          ? "bg-[#a8d5ba]/10 border-[#a8d5ba]/10 cursor-pointer"
                          : "hover:bg-[#f0eee8]/50 cursor-pointer"
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <img
                        src={
                          friend.avatarUrl ||
                          friend.avatar ||
                          "https://i.pravatar.cc/100"
                        }
                        className="w-7 h-7 rounded-full object-cover shrink-0 shadow-sm"
                        alt=""
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-[#1c1c18] truncate">
                          {friend.name || friend.nickName || friend.username}
                        </p>
                        <p
                          className={`text-[10px] truncate ${isAlreadyMember ? "text-[#a8d5ba] font-medium" : "text-[#434840]/50"}`}
                        >
                          {isAlreadyMember
                            ? "Đã ở trong nhóm"
                            : friend.bio || "Linh hồn rừng xanh hoang dã."}
                        </p>
                      </div>
                    </div>

                    {/* Ô tròn tích chọn trạng thái */}
                    <div
                      className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center transition-all shrink-0 ml-2 ${
                        isAlreadyMember
                          ? "border-[#c3c8bd]/40 bg-[#f0eee8]/50 text-transparent"
                          : isChecked
                            ? "bg-[#a8d5ba] border-[#a8d5ba] text-white"
                            : "border-[#c3c8bd] bg-white"
                      }`}
                    >
                      {isChecked && !isAlreadyMember && (
                        <span className="material-symbols-outlined text-[9px] font-bold">
                          check
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-xs text-[#434840]/50 italic text-center pt-4">
                Không tìm thấy bạn bè nào khớp từ khóa
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Cụm nút xác nhận */}
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
          disabled={selectedIds.length === 0 || isLoading}
          className="flex-1 h-7 rounded-lg bg-[#a8d5ba] text-white text-[11px] font-bold shadow-sm hover:bg-[#97c4a9] transition-colors disabled:opacity-50"
        >
          Thêm ({selectedIds.length})
        </button>
      </div>
    </div>
  );
}
