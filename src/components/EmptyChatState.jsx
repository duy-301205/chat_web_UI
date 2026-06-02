import React from "react";

export default function EmptyChatState() {
  return (
    <main className="flex-1 rounded-3xl bg-[rgba(253,251,247,0.7)] backdrop-blur-[12px] border border-white/60 shadow-[0_4px_20px_rgba(0,0,0,0.05)] flex flex-col items-center justify-center text-center p-6 z-10">
      <span
        className="material-symbols-outlined text-6xl text-[#a8d5ba]/60 mb-3 animate-bounce"
        style={{ fontVariationSettings: "'FILL' 1" }}
      >
        spa
      </span>
      <h2 className="text-xl font-bold text-[#1c1c18] mb-1.5">
        Chào mừng bạn đến với Komorebi Sanctuary!
      </h2>
      <p className="text-xs text-[#434840] max-w-[360px]">
        Hãy chọn một cuộc trò chuyện từ danh sách bên trái để bắt đầu chia sẻ
        câu chuyện cùng các linh hồn rừng xanh nhé. 🌿
      </p>
    </main>
  );
}
