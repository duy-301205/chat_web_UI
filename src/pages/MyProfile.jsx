import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getMyProfileApi } from "../api/api";

export default function MyProfile({ userData, onBack }) {
  const navigate = useNavigate();
  const defaultUser = {
    name: "Komorebi",
    email: "komorebi@forest.sanctuary",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAKO3NcUUT9Ts-_ErM6wnIUd1MxKV9fXhf30YSdR24XNeEhzDXtKj3sRAPhqA68KvV-NrSYwYF4P_uOpGfwOhtCposCmVuOG1dcY0nAAflmt8FhHcHVZd5dQljb4xgVdsCyLa6a9wuqsLn7Z_UKHrnyFzvKekyrt-8bc0QAr1qiapbtparkDdbrdro6Rj3yYMZ87sXY5VrRoh7rBWqpTzlHMSpz8nJnFaTCZCB8XQZbROIldnpskTIpwiQgqo8xnbshULTcTfJg2MQ",
  };

  const [spiritName, setSpiritName] = useState(defaultUser.name);
  const [emailText, setEmailText] = useState(defaultUser.email);
  const [avatarUrl, setAvatarUrl] = useState(defaultUser.avatar);
  const [presence, setPresence] = useState("Awake"); // Ánh xạ trạng thái thực tế từ API (Awake, Hibernating, Do Not Disturb)

  // Giữ nguyên các State phục vụ cho cột bên phải của bạn
  const [currentMood, setCurrentMood] = useState(
    "Brewing tea under the camphor tree",
  );
  const [enableWhispers, setEnableWhispers] = useState(true);
  const [environment, setEnvironment] = useState("Daylight"); // Daylight, Moonlight

  // --- LOGIC GỌI API LẤY THÔNG TIN THỰC TẾ ---
  useEffect(() => {
    // Nếu component cha DashboardChat có truyền sẵn dữ liệu thô qua prop userData, dùng luôn
    if (userData) {
      setSpiritName(userData.username || defaultUser.name);
      setEmailText(userData.email || defaultUser.email);
      setAvatarUrl(userData.avatarUrl || defaultUser.avatar);
      if (userData.status) setPresence(mapBackendStatusToUI(userData.status));
      return;
    }

    // Nếu không có prop, tiến hành gọi API từ Server Backend
    const loadProfileData = async () => {
      try {
        const result = await getMyProfileApi();
        if (result && result.code === 200 && result.data) {
          const profile = result.data;
          setSpiritName(profile.username || defaultUser.name);
          setEmailText(profile.email || defaultUser.email);
          setAvatarUrl(profile.avatarUrl || defaultUser.avatar);

          // Ánh xạ chuỗi trạng thái (ONLINE, OFFLINE...) từ DB sang text hiển thị tương ứng trên UI của bạn
          if (profile.status) {
            setPresence(mapBackendStatusToUI(profile.status));
          }
        }
      } catch (error) {
        console.error("Lỗi khi tải thông tin hồ sơ cá nhân:", error);
      }
    };

    loadProfileData();
  }, [userData]);

  // Hàm phụ trợ hỗ trợ đồng bộ trạng thái giữa DB Backend và UI Preferences của bạn
  const mapBackendStatusToUI = (status) => {
    if (status === "ONLINE" || status === "AWAKE") return "Awake";
    if (status === "OFFLINE" || status === "HIBERNATING") return "Hibernating";
    if (status === "BUSY" || status === "DND") return "Do Not Disturb";
    return "Awake";
  };
  // --------------------------------------------

  const handleLeaveSanctuary = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");

    navigate("/login");
  };

  return (
    <main className="flex-1 rounded-3xl bg-[rgba(253,251,247,0.8)] backdrop-blur-[20px] border border-white/60 shadow-xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-300 h-full">
      <div className="h-[60px] px-4 border-b border-[#c3c8bd]/10 flex items-center justify-between bg-white/30 backdrop-blur-md shrink-0">
        <button
          onClick={onBack}
          className="w-8 h-8 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center shadow-sm hover:bg-white active:scale-95 transition-all text-[#1c1c18]"
        >
          <span className="material-symbols-outlined text-[18px]">
            arrow_back
          </span>
        </button>
        <h2 className="text-sm font-bold text-[#1c1c18]">Cài đặt Sanctuary</h2>
        <div className="w-8 h-8"></div>
      </div>

      {/* CHỈ SỬA TẠI ĐÂY: Thêm style ẩn thanh cuộn của các trình duyệt để mất con lăn mắt nhìn */}
      <div
        className="flex-1 overflow-y-auto p-5"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {/* Nhúng đoạn style CSS nhỏ này vào để ép trình duyệt Webkit (Chrome/Safari) ẩn con lăn */}
        <style>{`
          div::-webkit-scrollbar {
            display: none;
          }
        `}</style>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 max-w-[1200px] mx-auto">
          {/* CỘT TRÁI */}
          <div className="lg:col-span-2 bg-[rgba(253,251,247,0.4)] border border-white/40 rounded-3xl p-5 flex flex-col items-center relative">
            <h3 className="text-base font-bold text-[#434840]/90 mb-4 text-center w-full">
              Your Sanctuary
            </h3>

            <div className="relative w-24 h-24 mb-6 group">
              <img
                src={avatarUrl}
                className="w-full h-full rounded-full object-cover border-2 border-white shadow-[0_2px_10px_rgba(0,0,0,0.06)]"
                alt="Avatar"
              />
              <div
                className={`absolute bottom-0.5 right-0.5 w-5 h-5 border-2 border-white rounded-full ${presence === "Awake" ? "bg-green-500" : presence === "Hibernating" ? "bg-amber-600/70" : "bg-red-500"}`}
              ></div>
            </div>

            <div className="w-full space-y-1 mb-4">
              <label className="text-[11px] font-semibold text-[#434840]/60 ml-1">
                Spirit Name
              </label>
              <div className="relative flex items-center w-full h-10 rounded-xl bg-white/60 border border-[#c3c8bd]/30 px-3 text-[#1c1c18]">
                <input
                  type="text"
                  value={spiritName}
                  readOnly
                  className="w-full bg-transparent border-none focus:ring-0 text-xs outline-none font-medium p-0 cursor-default"
                />
                <span className="material-symbols-outlined text-[#434840]/40 text-base">
                  person
                </span>
              </div>
            </div>

            <div className="w-full space-y-1 mb-4">
              <label className="text-[11px] font-semibold text-[#434840]/60 ml-1">
                Sanctuary Email
              </label>
              <div className="relative flex items-center w-full h-10 rounded-xl bg-white/60 border border-[#c3c8bd]/30 px-3 text-[#1c1c18]">
                <input
                  type="text"
                  value={emailText}
                  readOnly
                  className="w-full bg-transparent border-none focus:ring-0 text-xs outline-none font-medium p-0 cursor-default"
                />
                <span className="material-symbols-outlined text-[#434840]/40 text-base">
                  lock
                </span>
              </div>
            </div>

            <div className="w-full space-y-2 mb-4">
              <label className="text-[11px] font-semibold text-[#434840]/60 ml-1">
                Presence Status
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  disabled
                  className={`px-3 py-1.5 rounded-full text-[11px] font-medium border flex items-center gap-1.5 transition-all cursor-default ${presence === "Awake" ? "bg-[#a8d5ba]/20 border-[#a8d5ba] text-[#1c1c18]" : "bg-white/40 border-black/5 text-[#434840]/40"}`}
                >
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>{" "}
                  Awake
                </button>
                <button
                  type="button"
                  disabled
                  className={`px-3 py-1.5 rounded-full text-[11px] font-medium border flex items-center gap-1.5 transition-all cursor-default ${presence === "Hibernating" ? "bg-[#b0e0f6]/20 border-[#b0e0f6] text-[#1c1c18]" : "bg-white/40 border-black/5 text-[#434840]/40"}`}
                >
                  <span className="w-1.5 h-1.5 bg-amber-600/70 rounded-full"></span>{" "}
                  Hibernating
                </button>
                <button
                  type="button"
                  disabled
                  className={`px-3 py-1.5 rounded-full text-[11px] font-medium border flex items-center gap-1.5 transition-all cursor-default ${presence === "Do Not Disturb" ? "bg-red-500/10 border-red-400 text-[#1c1c18]" : "bg-white/40 border-black/5 text-[#434840]/40"}`}
                >
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>{" "}
                  Do Not Disturb
                </button>
              </div>
            </div>
          </div>

          {/* CỘT PHẢI */}
          <div className="space-y-4">
            <div className="bg-[rgba(253,251,247,0.2)] border border-white/20 rounded-3xl p-4 flex flex-col h-full">
              <h3 className="text-sm font-bold text-[#434840]/90 mb-4">
                Preferences
              </h3>

              {/* WHISPERS SECTION */}
              <div className="space-y-2 mb-4">
                <span className="text-[9px] font-bold uppercase tracking-wider text-[#434840]/50 block ml-1">
                  Whispers
                </span>

                <div className="w-full h-10 rounded-xl bg-white/60 border border-white/40 px-3 flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-2 text-[#1c1c18] text-xs font-medium">
                    <span className="material-symbols-outlined text-base text-[#434840]/70">
                      notifications
                    </span>
                    Enable Whispers
                  </div>
                  <button
                    type="button"
                    onClick={() => setEnableWhispers(!enableWhispers)}
                    className={`w-8 h-5 flex items-center rounded-full p-0.5 transition-all duration-300 ${enableWhispers ? "bg-[#a8d5ba]" : "bg-[#c3c8bd]/40"}`}
                  >
                    <div
                      className={`bg-white w-4 h-4 rounded-full shadow-sm transform transition-all duration-300 ${enableWhispers ? "translate-x-3" : "translate-x-0"}`}
                    />
                  </button>
                </div>

                <button
                  type="button"
                  className="w-full h-10 rounded-xl bg-white/60 border border-white/40 px-3 flex items-center justify-between shadow-sm hover:bg-white transition-all text-left"
                >
                  <div className="flex items-center gap-2 text-[#1c1c18] text-xs font-medium">
                    <span className="material-symbols-outlined text-base text-[#434840]/70">
                      volume_up
                    </span>
                    Sound (Wind Chimes)
                  </div>
                  <span className="material-symbols-outlined text-base text-[#434840]/40">
                    chevron_right
                  </span>
                </button>
              </div>

              {/* ENVIRONMENT SECTION */}
              <div className="space-y-2 mb-4">
                <span className="text-[9px] font-bold uppercase tracking-wider text-[#434840]/50 block ml-1">
                  Environment
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setEnvironment("Daylight")}
                    className={`h-12 rounded-xl border flex flex-col items-center justify-center gap-0.5 transition-all shadow-sm ${environment === "Daylight" ? "bg-[#a8d5ba]/40 border-[#a8d5ba] text-[#1c1c18]" : "bg-white/60 border-white/40 text-[#434840]/70 hover:bg-white"}`}
                  >
                    <span className="material-symbols-outlined text-base">
                      light_mode
                    </span>
                    <span className="text-[9px] font-medium">Daylight</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setEnvironment("Moonlight")}
                    className={`h-12 rounded-xl border flex flex-col items-center justify-center gap-0.5 transition-all shadow-sm ${environment === "Moonlight" ? "bg-[#b0e0f6]/30 border-[#b0e0f6] text-[#1c1c18]" : "bg-white/60 border-white/40 text-[#434840]/70 hover:bg-white"}`}
                  >
                    <span className="material-symbols-outlined text-base">
                      dark_mode
                    </span>
                    <span className="text-[9px] font-medium">Moonlight</span>
                  </button>
                </div>
              </div>

              {/* TONGUE SECTION (Language) */}
              <div className="space-y-2 mb-6">
                <span className="text-[9px] font-bold uppercase tracking-wider text-[#434840]/50 block ml-1">
                  Tongue
                </span>
                <div className="w-full h-10 rounded-xl bg-white/60 border border-white/40 px-3 flex items-center justify-between shadow-sm cursor-pointer hover:bg-white transition-all">
                  <div className="flex items-center gap-2 text-[#1c1c18] text-xs font-medium">
                    <span className="material-symbols-outlined text-base text-[#434840]/70">
                      language
                    </span>
                    English (Sylvan)
                  </div>
                  <span className="material-symbols-outlined text-base text-[#434840]/40">
                    keyboard_arrow_down
                  </span>
                </div>
              </div>

              <div className="mt-auto pt-4 border-t border-[#c3c8bd]/10">
                <button
                  type="button"
                  onClick={handleLeaveSanctuary}
                  className="w-full h-10 rounded-xl border border-red-200 bg-red-50/30 text-red-500 font-semibold text-xs flex items-center justify-center gap-1.5 hover:bg-red-50 active:scale-[0.98] transition-all"
                >
                  <span className="material-symbols-outlined text-base">
                    logout
                  </span>
                  Leave Sanctuary
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
