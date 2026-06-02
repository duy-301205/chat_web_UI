import React, { useState, useEffect } from "react";
// IMPORT CHUẨN XÁC: Đảm bảo file api.js của bạn đã export đầy đủ các hàm này
import {
  searchUsersApi,
  requestFriendApi,
  getPendingRequestsApi,
  acceptFriendRequest,
  removeFriend,
} from "../api/api";

export default function FindSpirits({ onAddFriend }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // STATE ĐÃ THÊM: Quản lý danh sách lời mời gửi đến và trạng thái đóng/mở khay danh sách
  const [pendingRequests, setPendingRequests] = useState([]);
  const [showRequestsPopover, setShowRequestsPopover] = useState(false);

  // Dữ liệu danh sách linh hồn mẫu ban đầu (Giữ nguyên vẹn 100%)
  const spiritCandidates = [
    {
      id: 1,
      name: "Satsuki",
      bio: "Lover of summer rain. Chasing the wind through camphor trees.",
      avatar:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBbEnfWoJN0FdX8Q0Hq4yE8WQ3NjFAwW0TcMQACprWtM0VqxxbP1Sgw0eTqykmNfDZtFBy5ZvIH7SWwAmyOrrWEZ6SNR5scHsWMxBKtKscaJs0DiDoWB6sFt2FbPH_8rzfVPcOquHc9qOYVx_JaEDZHkEXwuv8Z_pJaZK0Mmat7-6orD3w26bB58PGA5o0wGsPr_7hi6gC5oxa1ObU1SEiwFjt8hNqMPeiirCHzBeMFigp_WK806igADIPMmBDV0oIF-KOC-QfcS0o",
      statusIcon: "spa",
      statusText: "Đang hái hoa đền cổ",
      bgBadge: "bg-emerald-50 text-emerald-600 border-emerald-100",
      relationStatus: "NONE",
    },
    {
      id: 2,
      name: "Chihiro",
      bio: "Seeking the quiet moments. Wanderer of hidden bathhouses.",
      avatar: "https://i.pravatar.cc/150?img=32",
      statusIcon: "bedtime",
      statusText: "Tĩnh lặng ngắm sao",
      bgBadge: "bg-purple-50 text-purple-600 border-purple-100",
      relationStatus: "NONE",
    },
    {
      id: 3,
      name: "Haku",
      bio: "Following the river's song. Guardian of the amber waters.",
      avatar: "https://i.pravatar.cc/150?img=12",
      statusIcon: "tsunami",
      statusText: "Nương theo dòng suối",
      bgBadge: "bg-blue-50 text-blue-600 border-blue-100",
      relationStatus: "NONE",
    },
    {
      id: 4,
      name: "Mei",
      bio: "Chasing floating seeds. Looking for little forest spirits.",
      avatar:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDHOA6JzXhWkDkkk6txfQ34mARY-BslsFdLmm1Lu5E8mwn97qpLRXwJV6lVomfjtcUGMaWQLcAEJXIwDKhdQFX6SN8soBnkKirRUlSgD95DTGGlJGWenv-1Ir3_aRUXYxlLjMWbxnBM_Fei4TtozkR_eLjl5879HdbmB6qwh-5KAvWRU8YRRIo0j7K1ytBxrKtEH32fWqLYpb4MPHS1K3QFAVgXfDdfk-1PaGZryriCXL22S1gA-5cPbXxPvE0LYWycsCmUYFSHrKg",
      statusIcon: "cloud",
      statusText: "Đuổi theo hạt mầm",
      bgBadge: "bg-amber-50 text-amber-600 border-amber-100",
      relationStatus: "NONE",
    },
  ];

  // LOGIC ĐÃ THÊM: Tải danh sách lời mời kết bạn đang chờ (Pending) gửi đến mình
  const fetchPendingRequests = async () => {
    try {
      const response = await getPendingRequestsApi();
      if (response && response.code === 200) {
        setPendingRequests(response.data || []);
      }
    } catch (error) {
      console.error("Lấy danh sách lời mời kết bạn thất bại:", error.message);
    }
  };

  // Tự động gọi API lấy danh sách lời mời khi mở trang
  useEffect(() => {
    fetchPendingRequests();
  }, []);

  // TÍCH HỢP LOGIC API 1: Kích hoạt tự động tìm kiếm mỗi khi searchQuery thay đổi từ khóa
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (!searchQuery.trim()) {
        setSearchResults([]);
        return;
      }

      setLoading(true);
      try {
        const response = await searchUsersApi({ keyword: searchQuery.trim() });
        if (response && response.code === 200) {
          setSearchResults(response.data || []);
        }
      } catch (error) {
        console.error("Tìm kiếm người dùng thất bại:", error.message);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  // TÍCH HỢP LOGIC API 2: Xử lý hành động bấm nút Add Friend thật lên Backend
  const handleAddFriendClick = async (spirit) => {
    try {
      const response = await requestFriendApi(spirit.id);
      if (response) {
        setSearchResults((prev) =>
          prev.map((u) =>
            u.id === spirit.id ? { ...u, relationStatus: "PENDING" } : u,
          ),
        );

        if (onAddFriend) {
          onAddFriend({ name: spirit.username || spirit.name });
        }
      }
    } catch (error) {
      console.error("Gửi lời mời kết bạn thất bại:", error.message);
    }
  };

  // LOGIC ĐÃ THÊM: Xử lý Chấp nhận lời mời kết bạn từ khay danh sách
  const handleAcceptRequest = async (targetUserId) => {
    try {
      const response = await acceptFriendRequest(targetUserId);
      if (response) {
        // Xóa khỏi hàng đợi hiển thị ở Popover
        setPendingRequests((prev) =>
          prev.filter((req) => req.id !== targetUserId),
        );
        // Nếu người đó đang nằm trong danh sách tìm kiếm hiển thị bên dưới, đổi trạng thái thành ACCEPTED luôn
        setSearchResults((prev) =>
          prev.map((u) =>
            u.id === targetUserId ? { ...u, relationStatus: "ACCEPTED" } : u,
          ),
        );
      }
    } catch (error) {
      console.error("Chấp nhận kết bạn thất bại:", error.message);
    }
  };

  // LOGIC ĐÃ THÊM: Xử lý Từ chối / Hủy yêu cầu kết bạn từ khay danh sách
  const handleDeclineRequest = async (targetUserId) => {
    try {
      const response = await removeFriend(targetUserId);
      if (response) {
        setPendingRequests((prev) =>
          prev.filter((req) => req.id !== targetUserId),
        );
        setSearchResults((prev) =>
          prev.map((u) =>
            u.id === targetUserId ? { ...u, relationStatus: "NONE" } : u,
          ),
        );
      }
    } catch (error) {
      console.error("Từ chối lời mời thất bại:", error.message);
    }
  };

  // Định nghĩa mảng hiển thị khớp 100% với thuộc tính DTO Java mới của bạn
  const displaySpirits =
    searchQuery.trim() !== ""
      ? searchResults.map((u) => ({
          id: u.id,
          name: u.username,
          bio: u.email || "Sharing a quiet space in the sanctuary garden.",
          avatar: u.avatarUrl || "https://i.pravatar.cc/100",
          statusIcon: u.relationStatus === "ACCEPTED" ? "verified_user" : "spa",
          statusText:
            u.status ||
            (u.relationStatus === "ACCEPTED" ? "Đã là bạn bè" : "Linh hồn mới"),
          bgBadge:
            u.relationStatus === "ACCEPTED"
              ? "bg-blue-50 text-blue-600 border-blue-100"
              : "bg-emerald-50 text-emerald-600 border-emerald-100",
          relationStatus: u.relationStatus,
        }))
      : spiritCandidates;

  return (
    <div className="flex-1 rounded-3xl bg-[rgba(253,251,247,0.7)] backdrop-blur-[12px] border border-white/60 shadow-[0_4px_20px_rgba(0,0,0,0.05)] p-4 flex flex-col h-full overflow-hidden animate-in fade-in duration-300">
      {/* Khu vực Header tinh tế */}
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#c3c8bd]/10 pb-4 relative">
        <div>
          <h2 className="text-lg font-bold text-[#1c1c18] tracking-tight flex items-center gap-2">
            <span className="material-symbols-outlined text-[#a8d5ba] text-xl">
              wb_twilight
            </span>
            Find New Spirits
          </h2>
          <p className="text-[11px] text-[#434840]/60 mt-0.5">
            Discover companions sharing your serene space in the sanctuary.
          </p>
        </div>

        {/* Cụm công cụ bên phải gồm: Ô tìm kiếm + Nút mở danh sách lời mời kết bạn */}
        <div className="flex items-center gap-2 self-end sm:self-auto w-full sm:w-auto justify-end">
          {/* Thanh tìm kiếm */}
          <div className="w-full sm:w-64">
            <div className="relative flex items-center w-full h-8 rounded-full bg-[#f0eee8]/80 border border-[#c3c8bd]/30 px-3 text-[#1c1c18] focus-within:bg-white focus-within:border-[#a8d5ba]/50 focus-within:ring-1 focus-within:ring-[#a8d5ba]/50 transition-all shadow-sm">
              <span className="material-symbols-outlined text-[#434840]/50 text-base mr-1.5">
                search
              </span>
              <input
                type="text"
                placeholder="Seek a companion..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent border-none text-[11px] outline-none focus:ring-0 placeholder:text-[#434840]/40"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="text-[#434840]/40 hover:text-[#434840]"
                >
                  <span className="material-symbols-outlined text-xs">
                    close
                  </span>
                </button>
              )}
            </div>
          </div>

          {/* ĐÃ THÊM: Khối xử lý giao diện xem danh sách lời mời kết bạn gửi đến */}
          <div className="relative shrink-0">
            <button
              onClick={() => setShowRequestsPopover(!showRequestsPopover)}
              className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all relative ${
                showRequestsPopover
                  ? "bg-[#434840] text-white border-[#434840]"
                  : "bg-white/90 border-[#c3c8bd]/30 text-[#434840] hover:bg-[#f0eee8]"
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">
                person_add
              </span>
              {/* Chấm đỏ nhấp nháy báo hiệu khi có lời mời thực tế gửi đến */}
              {pendingRequests.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-rose-500 rounded-full border border-white animate-bounce" />
              )}
            </button>

            {/* KHAY THẢ POPOVER DANH SÁCH LỜI MỜI ĐANG CHỜ DUYỆT */}
            {showRequestsPopover && (
              <div className="absolute right-0 mt-2 w-72 bg-white/95 backdrop-blur-md border border-black/5 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.08)] p-3 flex flex-col gap-2.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="flex items-center justify-between border-b border-[#f0eee8] pb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#434840]/70">
                    Lời mời kết bạn ({pendingRequests.length})
                  </span>
                  <span className="material-symbols-outlined text-sm text-[#a8d5ba]">
                    spa
                  </span>
                </div>

                <div className="max-h-52 overflow-y-auto flex flex-col gap-1.5 pr-0.5">
                  {pendingRequests.length === 0 ? (
                    <div className="text-center py-6 flex flex-col items-center gap-1 text-[#434840]/40">
                      <span className="material-symbols-outlined text-xl text-[#434840]/20">
                        eco
                      </span>
                      <p className="text-[10px] italic">
                        Không có lời mời nào mới. 🍃
                      </p>
                    </div>
                  ) : (
                    pendingRequests.map((req) => (
                      <div
                        key={req.id}
                        className="flex items-center justify-between gap-2 p-1.5 rounded-xl hover:bg-[#f0eee8]/30 transition-colors border border-transparent hover:border-black/5"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <img
                            src={req.avatarUrl || "https://i.pravatar.cc/100"}
                            className="w-6 h-6 rounded-lg object-cover shrink-0 border border-black/5 shadow-sm"
                            alt=""
                          />
                          <span className="text-xs font-bold text-[#1c1c18] truncate">
                            {req.username}
                          </span>
                        </div>

                        {/* Cụm nút bấm phê duyệt cực kỳ gọn gàng */}
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => handleAcceptRequest(req.id)}
                            className="w-5 h-5 rounded-full bg-[#434840] text-white flex items-center justify-center hover:bg-[#333831] active:scale-90 transition-all shadow-sm"
                            title="Đồng ý kết bạn"
                          >
                            <span className="material-symbols-outlined text-[13px] font-bold">
                              check
                            </span>
                          </button>
                          <button
                            onClick={() => handleDeclineRequest(req.id)}
                            className="w-5 h-5 rounded-full bg-[#f0eee8] text-[#434840]/60 flex items-center justify-center hover:bg-rose-50 hover:text-rose-600 active:scale-90 transition-all border border-black/5"
                            title="Từ chối"
                          >
                            <span className="material-symbols-outlined text-[13px]">
                              close
                            </span>
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Danh sách các linh hồn dạng Card Dọc */}
      <div className="flex-1 overflow-y-auto pr-1">
        {loading ? (
          <div className="p-8 text-center text-[11px] text-[#434840]/50 italic flex flex-col items-center gap-1.5 pt-12">
            <span className="material-symbols-outlined text-2xl text-[#a8d5ba] animate-spin">
              progress_activity
            </span>
            Đang tìm kiếm các linh hồn song hành...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-[1100px] mx-auto pb-2">
            {displaySpirits.map((spirit) => (
              <div
                key={spirit.id}
                className="bg-white/90 rounded-2xl border border-white shadow-[0_2px_8px_rgba(0,0,0,0.02)] p-4 flex flex-col sm:flex-row items-center sm:items-start gap-3.5 hover:shadow-[0_4px_15px_rgba(0,0,0,0.04)] hover:-translate-y-0.5 transition-all duration-300"
              >
                {/* Avatar khối tròn nhỏ gọn */}
                <div className="relative w-14 h-14 shrink-0">
                  <img
                    src={spirit.avatar}
                    alt={spirit.name}
                    className="w-full h-full rounded-xl object-cover border border-[#f0eee8] shadow-sm"
                  />
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white rounded-full shadow-sm flex items-center justify-center text-[#a8d5ba] border border-[#f0eee8]">
                    <span className="material-symbols-outlined text-[10px] font-bold">
                      {spirit.statusIcon}
                    </span>
                  </div>
                </div>

                {/* Khu vực thông tin chi tiết */}
                <div className="flex-1 min-w-0 space-y-0.5 text-center sm:text-left">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1.5">
                    <h3 className="text-sm font-bold text-[#1c1c18] tracking-tight">
                      {spirit.name}
                    </h3>
                    <span
                      className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-medium border w-fit mx-auto sm:mx-0 ${spirit.bgBadge}`}
                    >
                      {spirit.statusText}
                    </span>
                  </div>

                  <p className="text-[11px] text-[#434840]/80 leading-normal font-sans line-clamp-2">
                    {spirit.bio}
                  </p>

                  {/* Hệ thống nút bấm phân rã luồng */}
                  <div className="flex items-center justify-center sm:justify-start gap-1.5 pt-2">
                    {/* TRƯỜNG HỢP A: ĐÃ LÀ BẠN BÈ */}
                    {spirit.relationStatus === "ACCEPTED" && (
                      <button
                        disabled
                        className="h-7 px-3 bg-blue-500/10 border border-blue-500/20 text-blue-600 rounded-full text-[10px] font-bold cursor-default flex items-center gap-1"
                      >
                        <span className="material-symbols-outlined text-xs">
                          done_all
                        </span>{" "}
                        Đã là bạn bè
                      </button>
                    )}

                    {/* TRƯỜNG HỢP B: ĐANG CHỜ CHẤP NHẬN */}
                    {spirit.relationStatus === "PENDING" && (
                      <button
                        disabled
                        className="h-7 px-3 bg-gray-400/10 border border-gray-400/20 text-gray-500 rounded-full text-[10px] font-bold cursor-default flex items-center gap-1"
                      >
                        <span className="material-symbols-outlined text-xs animate-pulse">
                          hourglass_top
                        </span>{" "}
                        Đang chờ...
                      </button>
                    )}

                    {/* TRƯỜNG HỢP C: CHƯA KẾT BẠN */}
                    {(spirit.relationStatus === "NONE" ||
                      !spirit.relationStatus) && (
                      <button
                        onClick={() => handleAddFriendClick(spirit)}
                        className="h-7 px-3 bg-[#434840] hover:bg-[#333831] text-white rounded-full text-[10px] font-bold shadow-sm active:scale-95 transition-all flex items-center gap-1"
                      >
                        <span className="material-symbols-outlined text-xs">
                          spa
                        </span>{" "}
                        Add Friend
                      </button>
                    )}

                    {/* Nút Whisper */}
                    <button className="h-7 px-3 bg-[#f0eee8]/60 hover:bg-[#ebe8e2] border border-[#c3c8bd]/20 text-[#434840] rounded-full text-[10px] font-semibold active:scale-95 transition-all flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs">
                        chat_bubble
                      </span>{" "}
                      Whisper
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Màn hình thông báo rỗng */}
        {!loading && displaySpirits.length === 0 && (
          <div className="p-8 text-center text-[11px] text-[#434840]/40 italic flex flex-col items-center gap-1.5">
            <span className="material-symbols-outlined text-3xl text-[#434840]/20">
              crane
            </span>
            Không tìm thấy linh hồn nào có tên khớp với từ khóa tìm kiếm.
          </div>
        )}
      </div>
    </div>
  );
}
