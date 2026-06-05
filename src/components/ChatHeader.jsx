import React from "react";

export default function ChatHeader({
  currentActiveChat,
  memberCount,
  onToggleSidebar,
}) {
  return (
    <header className="h-[60px] w-full flex items-center justify-between px-4 border-b border-[#c3c8bd]/10 bg-white/50 backdrop-blur-md z-10 shrink-0">
      <div
        className="flex items-center gap-3 cursor-pointer"
        onClick={onToggleSidebar}
      >
        <div className="flex -space-x-2.5">
          <img
            alt=""
            className="w-8 h-8 rounded-full border-2 border-white object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBbEnfWoJN0FdX8Q0Hq4yE8WQ3NjFAwW0TcMQACprWtM0VqxxbP1Sgw0eTqykmNfDZtFBy5ZvIH7SWwAmyOrrWEZ6SNR5scHsWMxBKtKscaJs0DiDoWB6sFt2FbPH_8rzfVPcOquHc9qOYVx_JaEDZHkEXwuv8Z_pJaZK0Mmat7-6orD3w26bB58PGA5o0wGsPr_7hi6gC5oxa1ObU1SEiwFjt8hNqMPeiirCHzBeMFigp_WK806igADIPMmBDV0oIF-KOC-QfcS0o"
          />
          <img
            alt=""
            className="w-8 h-8 rounded-full border-2 border-white object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDHOA6JzXhWkDkkk6txfQ34mARY-BslsFdLmm1Lu5E8mwn97qpLRXwJV6lVomfjtcUGMaWQLcAEJXIwDKhdQFX6SN8soBnkKirRUlSgD95DTGGlJGWenv-1Ir3_aRUXYxlLjMWbxnBM_Fei4TtozkR_eLjl5879HdbmB6qwh-5KAvWRU8YRRIo0j7K1ytBxrKtEH32fWqLYpb4MPHS1K3QFAVgXfDdfk-1PaGZryriCXL22S1gA-5cPbXxPvE0LYWycsCmUYFSHrKg"
          />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <h2 className="text-sm font-bold text-[#1c1c18] truncate max-w-[150px]">
              {currentActiveChat?.name}
            </h2>
            <span
              className="material-symbols-outlined text-[#f9d5c5] text-xs"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              star
            </span>
          </div>
          <p className="text-[11px] text-[#434840]">{memberCount} thành viên</p>
        </div>
      </div>
      <div className="flex items-center gap-0.5 text-[#b0e0f6]">
        <button className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#b0e0f6]/10 transition-colors">
          <span className="material-symbols-outlined text-[20px] font-light">
            search
          </span>
        </button>
        <button className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#b0e0f6]/10 transition-colors">
          <span className="material-symbols-outlined text-[20px] font-light">
            call
          </span>
        </button>
        <button className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#b0e0f6]/10 transition-colors">
          <span className="material-symbols-outlined text-[20px] font-light">
            videocam
          </span>
        </button>
        <button className="w-8 h-8 rounded-full flex items-center justify-center text-[#434840] hover:bg-[#f0eee8] transition-colors ml-1">
          <span className="material-symbols-outlined text-[20px]">
            more_vert
          </span>
        </button>
      </div>
    </header>
  );
}
