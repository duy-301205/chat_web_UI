import React from "react";
import { Link as RouterLink } from "react-router-dom";
import ghibliBg from "../assets/home3.png";

export default function Home() {
  return (
    <div
      className="h-screen w-full overflow-hidden relative font-sans antialiased bg-[length:100%_100%] bg-center bg-no-repeat flex flex-col px-6 pt-4 pb-6 md:px-8 lg:px-10 selection:bg-[#a8d5ba]/20 notranslate"
      translate="no"
      style={{ backgroundImage: `url(${ghibliBg})` }}
    >
      {/* Overlay giúp chữ nổi trên nền */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-white/25 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-transparent to-black/5 pointer-events-none" />

      {/* NAVBAR */}
      <header className="w-full max-w-[1340px] mx-auto h-[7vh] min-h-[52px] flex items-center justify-between relative z-10 shrink-0">
        <div className="flex items-center gap-2 cursor-pointer">
          <span className="material-symbols-outlined text-white text-2xl drop-shadow-md">
            chat_bubble
          </span>
          <span className="text-xl font-black text-white tracking-wide drop-shadow-md">
            ChatWeb
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-white/95 text-sm font-semibold drop-shadow-md">
          <a
            href="#features"
            className="hover:text-[#1e3a8a] transition-colors"
          >
            Tính năng
          </a>
          <a
            href="#security"
            className="hover:text-[#1e3a8a] transition-colors"
          >
            Bảo mật
          </a>
          <a href="#pricing" className="hover:text-[#1e3a8a] transition-colors">
            Giá cả
          </a>
          <a href="#blog" className="hover:text-[#1e3a8a] transition-colors">
            Blog
          </a>
          <a href="#contact" className="hover:text-[#1e3a8a] transition-colors">
            Liên hệ
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <RouterLink
            to="/login"
            className="px-5 py-2 text-sm font-bold text-white bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full transition-all border border-white/30"
          >
            Đăng nhập
          </RouterLink>

          <RouterLink
            to="/register"
            className="px-5 py-2 text-sm font-black text-white bg-[#4f46e5] hover:bg-[#4338ca] shadow-[0_4px_14px_rgba(79,70,229,0.35)] rounded-full transition-all active:scale-95"
          >
            Đăng ký
          </RouterLink>
        </div>
      </header>

      {/* HERO */}
      <main className="w-full max-w-[1340px] mx-auto flex-1 flex items-center relative z-10 overflow-hidden">
        {/* LEFT CONTENT */}
        <section className="flex flex-col justify-center h-full max-w-[650px]">
          {" "}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/30 backdrop-blur-md rounded-full text-xs font-bold text-[#4f46e5] w-fit mb-4 border border-white/40 shadow-sm">
            <span>🌱</span>
            Kết nối dễ dàng
            <span>🌱</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-[58px] font-black text-[#142850] leading-[1.08] tracking-tight mb-4 drop-shadow-sm">
            Trò chuyện mọi lúc, <br />
            <span className="text-[#4f46e5]">mọi nơi.</span>
          </h1>
          <p className="text-sm md:text-[15px] font-semibold text-[#374151] leading-relaxed max-w-[440px] mb-7">
            ChatWeb là nơi bạn và đồng đội, bạn bè kết nối, chia sẻ và làm việc
            hiệu quả trong một không gian trò chuyện hiện đại, bảo mật và thân
            thiện.
          </p>
          <RouterLink
            to="/register"
            className="w-fit px-7 h-11 bg-[#4f46e5] text-white text-sm font-bold rounded-xl shadow-[0_8px_24px_rgba(79,70,229,0.4)] hover:bg-[#4338ca] transition-all flex items-center justify-center gap-2 group active:scale-95"
          >
            <span className="material-symbols-outlined text-sm group-hover:translate-x-0.5 transition-transform">
              send
            </span>
            Bắt đầu ngay
          </RouterLink>
        </section>
      </main>

      {/* FEATURE CARDS */}
      <footer
        id="features"
        className="w-full max-w-[1340px] mx-auto h-[11vh] min-h-[72px] flex flex-wrap md:flex-nowrap gap-3 relative z-10 shrink-0 items-center justify-start"
      >
        <FeatureCard
          icon="verified_user"
          title="Bảo mật"
          desc="Dữ liệu mã hóa."
        />
        <FeatureCard icon="bolt" title="Tốc độ" desc="Tức thì, không trễ." />
        <FeatureCard
          icon="group_add"
          title="Kết nối"
          desc="Lập nhóm dễ dàng."
        />
      </footer>
    </div>
  );
}

function ChatBubble({ avatar, name, time, message, className = "" }) {
  return (
    <div
      className={`bg-white/85 backdrop-blur-md border border-white/70 p-3 rounded-2xl shadow-[0_10px_28px_rgba(30,58,138,0.12)] flex gap-2.5 transition-all duration-300 hover:rotate-0 hover:scale-[1.02] ${className}`}
    >
      <img
        className="w-8 h-8 rounded-full object-cover shrink-0 shadow-sm border border-white"
        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${avatar}`}
        alt={name}
      />

      <div className="flex flex-col flex-1 min-w-0">
        <div className="flex justify-between items-center mb-1">
          <span className="text-[11px] font-extrabold text-[#111827]">
            {name}
          </span>
          <span className="text-[9px] text-[#6b7280]">{time}</span>
        </div>

        <p className="text-[11px] text-[#374151] leading-normal font-semibold">
          {message}
        </p>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <div className="bg-white/45 backdrop-blur-md border border-white/40 px-4 py-2.5 rounded-xl shadow-sm flex items-center gap-2.5 hover:bg-white/65 transition-all min-w-[190px]">
      <span className="material-symbols-outlined text-lg font-bold text-[#4f46e5]">
        {icon}
      </span>

      <div>
        <h4 className="text-[12px] font-extrabold text-[#111827]">{title}</h4>
        <p className="text-[10px] text-[#4b5563] font-medium">{desc}</p>
      </div>
    </div>
  );
}
