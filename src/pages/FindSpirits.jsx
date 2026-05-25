import React, { useState } from "react";

export default function FindSpirits({ onAddFriend }) {
  const [searchQuery, setSearchQuery] = useState("");

  // Dữ liệu danh sách linh hồn được tinh chỉnh chuẩn hóa theo style mới
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
    },
    {
      id: 2,
      name: "Chihiro",
      bio: "Seeking the quiet moments. Wanderer of hidden bathhouses.",
      avatar: "https://i.pravatar.cc/150?img=32",
      statusIcon: "bedtime",
      statusText: "Tĩnh lặng ngắm sao",
      bgBadge: "bg-purple-50 text-purple-600 border-purple-100",
    },
    {
      id: 3,
      name: "Haku",
      bio: "Following the river's song. Guardian of the amber waters.",
      avatar: "https://i.pravatar.cc/150?img=12",
      statusIcon: "tsunami",
      statusText: "Nương theo dòng suối",
      bgBadge: "bg-blue-50 text-blue-600 border-blue-100",
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
    },
  ];

  const filteredSpirits = spiritCandidates.filter((spirit) =>
    spirit.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="flex-1 rounded-3xl bg-[rgba(253,251,247,0.7)] backdrop-blur-[12px] border border-white/60 shadow-[0_4px_20px_rgba(0,0,0,0.05)] p-4 flex flex-col h-full overflow-hidden animate-in fade-in duration-300">
      {/* Khu vực Header tinh tế - Đã thu nhỏ padding và khoảng cách */}
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#c3c8bd]/10 pb-4">
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

        {/* Thanh tìm kiếm nhộng bo tròn nhỏ gọn đặt gọn gàng góc phải (h-8 thay vì h-10) */}
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
                <span className="material-symbols-outlined text-xs">close</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Danh sách các linh hồn dạng Card Dọc mượt mà tối ưu không gian */}
      <div className="flex-1 overflow-y-auto pr-1">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-[1100px] mx-auto pb-2">
          {filteredSpirits.map((spirit) => (
            <div
              key={spirit.id}
              className="bg-white/90 rounded-2xl border border-white shadow-[0_2px_8px_rgba(0,0,0,0.02)] p-4 flex flex-col sm:flex-row items-center sm:items-start gap-3.5 hover:shadow-[0_4px_15px_rgba(0,0,0,0.04)] hover:-translate-y-0.5 transition-all duration-300"
            >
              {/* Avatar khối tròn nhỏ gọn hơn (w-14 h-14 thay vì w-20 h-20) */}
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

              {/* Khu vực thông tin chi tiết được làm nhỏ chữ */}
              <div className="flex-1 min-w-0 space-y-0.5 text-center sm:text-left">
                <div className="flex flex-col sm:flex-row sm:items-center gap-1.5">
                  <h3 className="text-sm font-bold text-[#1c1c18] tracking-tight">
                    {spirit.name}
                  </h3>
                  {/* Badge trạng thái nhỏ nhắn đồng bộ */}
                  <span
                    className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-medium border w-fit mx-auto sm:mx-0 ${spirit.bgBadge}`}
                  >
                    {spirit.statusText}
                  </span>
                </div>

                <p className="text-[11px] text-[#434840]/80 leading-normal font-sans line-clamp-2">
                  {spirit.bio}
                </p>

                {/* Các nút bấm hành động thu gọn chiều cao (h-7 thay vì h-8) */}
                <div className="flex items-center justify-center sm:justify-start gap-1.5 pt-2">
                  <button
                    onClick={() => onAddFriend(spirit)}
                    className="h-7 px-3 bg-[#434840] hover:bg-[#333831] text-white rounded-full text-[10px] font-bold shadow-sm active:scale-95 transition-all flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-xs">
                      spa
                    </span>{" "}
                    Add Friend
                  </button>
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

        {/* Màn hình thông báo rỗng khi không tìm ra kết quả */}
        {filteredSpirits.length === 0 && (
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
