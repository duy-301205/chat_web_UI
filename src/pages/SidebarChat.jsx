import React, { useState, useEffect } from "react";
import { getFriendsApi, getOrCreatePrivateChatApi } from "../api/api";

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
  setIsCreateGroupOpen,
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [sidebarMenu, setSidebarMenu] = useState("cuoc_tro_chuyen");
  const [friendList, setFriendList] = useState([]);
  const [loadingFriends, setLoadingFriends] = useState(false);

  useEffect(() => {
    if (sidebarMenu !== "ban_be") return;

    const fetchFriendsData = async () => {
      setLoadingFriends(true);
      try {
        const response = await getFriendsApi();
        if (response && response.code === 200) {
          setFriendList(response.data || []);
        }
      } catch (error) {
        console.error(
          "Lấy danh sách bạn bè từ Server thất bại:",
          error.message,
        );
      } finally {
        setLoadingFriends(false);
      }
    };

    fetchFriendsData();
  }, [sidebarMenu]);

  const filteredFriendList = friendList.filter((friend) => {
    const nameToSearch = friend.nickName || friend.username || "";
    return nameToSearch.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <aside className="w-[300px] flex-shrink-0 rounded-3xl bg-[rgba(253,251,247,0.9)] backdrop-blur-[12px] border border-white/60 shadow-[0_4px_20px_rgba(0,0,0,0.05)] flex flex-col h-full overflow-hidden relative z-20">
      <div className="p-4 pt-5 pb-3 flex items-center justify-between relative">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className={`p-1 rounded-lg transition-colors text-[#434840] flex items-center justify-center cursor-pointer ${isDropdownOpen ? "bg-[#f0eee8]" : "hover:bg-[#f0eee8]"}`}
          >
            <span className="material-symbols-outlined text-xl block">
              menu
            </span>
          </button>
          <h1 className="text-base font-bold text-[#a8d5ba] flex items-center">
            {sidebarMenu === "cuoc_tro_chuyen" ? "Chat Web" : "Bạn bè"}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsCreateGroupOpen(true)}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#434840] hover:bg-[#f0eee8] transition-colors relative cursor-pointer"
            title="Tạo nhóm trò chuyện mới"
          >
            <span className="material-symbols-outlined text-[22px] w-5 h-5 flex items-center justify-center">
              groups
            </span>
            <span className="absolute top-1 right-1 text-[9px] font-black text-[#434840] leading-none select-none">
              +
            </span>
          </button>

          <button
            onClick={() => setView(view === "spirits" ? "chat" : "spirits")}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
              view === "spirits"
                ? "bg-[#a8d5ba]/20 text-[#a8d5ba]"
                : "text-[#434840] hover:bg-[#f0eee8]"
            }`}
            title="Tìm kiếm bạn bè mới"
          >
            <span className="material-symbols-outlined text-[20px] w-5 h-5 flex items-center justify-center">
              person_add
            </span>
          </button>
        </div>

        {isDropdownOpen && (
          <div className="absolute top-12 left-4 w-[180px] rounded-xl bg-white border border-[#c3c8bd]/30 shadow-lg p-1.5 flex flex-col z-50 animate-in fade-in zoom-in-95 duration-100">
            <button
              onClick={() => {
                setSidebarMenu("cuoc_tro_chuyen");
                setView("chat");
                setIsDropdownOpen(false);
              }}
              className={`w-full h-8 px-2.5 rounded-lg flex items-center gap-2 text-xs font-semibold transition-colors cursor-pointer ${sidebarMenu === "cuoc_tro_chuyen" ? "bg-[#b0e0f6]/10 text-[#b0e0f6]" : "text-[#434840] hover:bg-[#f0eee8]/50"}`}
            >
              <span className="material-symbols-outlined text-base">forum</span>
              Cuộc trò chuyện
            </button>
            <button
              onClick={() => {
                setSidebarMenu("ban_be");
                setIsDropdownOpen(false);
              }}
              className={`w-full h-8 px-2.5 rounded-lg flex items-center gap-2 text-xs font-semibold transition-colors cursor-pointer ${sidebarMenu === "ban_be" ? "bg-[#b0e0f6]/10 text-[#b0e0f6]" : "text-[#434840] hover:bg-[#f0eee8]/50"}`}
            >
              <span className="material-symbols-outlined text-base">group</span>
              Bạn bè
            </button>
          </div>
        )}
      </div>

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
              className="absolute right-3 text-[#434840]/40 hover:text-[#434840] cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          )}
        </div>
      </div>

      {sidebarMenu === "cuoc_tro_chuyen" && (
        <div className="px-4 flex gap-1.5 pb-3 border-b border-[#c3c8bd]/10">
          {["all", "unread", "group"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-colors uppercase tracking-wider cursor-pointer ${activeTab === tab ? "bg-[#b0e0f6] text-white" : "text-[#434840] hover:bg-[#f0eee8]"}`}
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
                  className="h-6 px-2.5 bg-[#a8d5ba] text-white rounded-full text-[10px] font-bold shadow-sm hover:bg-[#97c4a9] transition-all flex items-center gap-1 shrink-0 ml-2 cursor-pointer"
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
                  className={`flex items-center gap-2.5 px-4 py-2 cursor-pointer transition-colors relative ${isItemActive ? "bg-[#b0e0f6]/10" : "hover:bg-[#f0eee8]/50"}`}
                >
                  {isItemActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-8 bg-[#b0e0f6] rounded-r-full"></div>
                  )}
                  <div className="relative w-10 h-10 rounded-full overflow-hidden border border-white shrink-0">
                    <img
                      alt={chat.name}
                      className="w-full h-full object-cover"
                      src={chat.avatarUrl || chat.avatar}
                    />
                    {chat.isOnline && (
                      <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border border-white rounded-full"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-0.5">
                      {/* 🎯 ĐÃ SỬA: Tên cuộc hội thoại tự động bôi đậm đậm hơn nếu chưa đọc (unreadCount > 0) */}
                      <h3
                        className={`text-xs truncate ${chat.unreadCount > 0 ? "font-black text-[#1c1c18]" : "font-bold text-[#1c1c18]/80"}`}
                      >
                        {chat.name}
                      </h3>
                      <span
                        className={`text-[10px] shrink-0 ml-2 ${isItemActive ? "text-[#b0e0f6] font-medium" : "text-[#434840]/60"}`}
                      >
                        {chat.time}
                      </span>
                    </div>
                    <p
                      className={`text-xs truncate ${chat.unreadCount > 0 ? "font-bold text-[#1c1c18]" : "text-[#434840]/70"}`}
                    >
                      {chat.lastMessageSenderName && (
                        <span className="font-semibold text-[#1c1c18]/80 mr-1">
                          {chat.lastMessageSenderName === "You"
                            ? "Bạn: "
                            : `${chat.lastMessageSenderName}: `}
                        </span>
                      )}
                      {chat.lastMessage || "Chưa có tin nhắn nào... 🍃"}
                    </p>
                  </div>

                  {chat.unreadCount > 0 && (
                    <div className="w-4 h-4 rounded-full bg-[#b0e0f6] text-white text-[9px] font-bold flex items-center justify-center shrink-0 ml-2 animate-pulse">
                      {chat.unreadCount > 99 ? "99+" : chat.unreadCount}
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

            {loadingFriends ? (
              <div className="px-4 py-6 text-center text-[11px] text-[#434840]/40 italic flex items-center justify-center gap-1.5">
                <span className="material-symbols-outlined text-sm animate-spin text-[#a8d5ba]">
                  progress_activity
                </span>
                Đang triệu hồi danh sách linh hồn...
              </div>
            ) : filteredFriendList.length === 0 ? (
              <div className="px-4 py-6 text-center text-[11px] text-[#434840]/40 italic">
                Danh sách bạn bè trống. 🍃
              </div>
            ) : (
              filteredFriendList.map((friend) => (
                <div
                  key={friend.id}
                  onClick={async () => {
                    try {
                      const response = await getOrCreatePrivateChatApi(
                        friend.id,
                      );
                      if (response && response.code === 200 && response.data) {
                        const conversationId = response.data;
                        setActiveChatId(conversationId);
                        setSidebarMenu("cuoc_tro_chuyen");
                        setView("chat");
                        setIsNotificationOpen(false);
                      }
                    } catch (error) {
                      console.error(
                        "Không thể mở cuộc hội thoại với người này:",
                        error.message,
                      );
                    }
                  }}
                  className="flex items-center gap-2.5 px-4 py-2 hover:bg-[#f0eee8]/50 transition-colors cursor-pointer animate-in fade-in duration-150"
                >
                  <div className="relative w-9 h-9 rounded-full overflow-hidden border border-white shrink-0">
                    <img
                      src={friend.avatarUrl || "https://i.pravatar.cc/100"}
                      className="w-full h-full object-cover"
                      alt=""
                    />
                    {friend.online && (
                      <div className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 border border-white rounded-full"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-[#1c1c18] truncate">
                      {friend.nickName || friend.username}
                    </h4>
                    <p className="text-[11px] text-[#434840]/60 truncate">
                      {friend.online ? "Đang hoạt động" : "Ngoại tuyến"}
                    </p>
                  </div>
                </div>
              ))
            )}
          </>
        )}
      </nav>

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
          className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors relative cursor-pointer ${isNotificationOpen ? "bg-[#a8d5ba]/20 text-[#a8d5ba]" : "text-[#434840] hover:bg-[#f0eee8]"}`}
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
          className="w-7 h-7 rounded-full flex items-center justify-center text-[#434840] hover:bg-[#f0eee8] transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-lg">settings</span>
        </button>

        {isNotificationOpen && (
          <div className="absolute bottom-14 right-2 w-[260px] rounded-2xl bg-[rgba(253,251,247,0.95)] backdrop-blur-[12px] border border-white shadow-[0_10px_30px_rgba(0,0,0,0.08)] flex flex-col overflow-hidden z-50">
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
