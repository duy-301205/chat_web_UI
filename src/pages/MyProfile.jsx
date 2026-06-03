import React, { useState } from "react";

export default function MyProfile({ userData, onBack }) {
  // Bộ dữ liệu mẫu dự phòng
  const defaultUser = {
    name: "Komorebi",
    title: "Người bảo vệ rừng xanh",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAKO3NcUUT9Ts-_ErM6wnIUd1MxKV9fXhf30YSdR24XNeEhzDXtKj3sRAPhqA68KvV-NrSYwYF4P_uOpGfwOhtCposCmVuOG1dcY0nAAflmt8FhHcHVZd5dQljb4xgVdsCyLa6a9wuqsLn7Z_UKHrnyFzvKekyrt-8bc0QAr1qiapbtparkDdbrdro6Rj3yYMZ87sXY5VrRoh7rBWqpTzlHMSpz8nJnFaTCZCB8XQZbROIldnpskTIpwiQgqo8xnbshULTcTfJg2MQ",
    cover:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCXksRxTWMdPMdx7gh9O5fyoQeyi1ZZulJyHjxujKXxeAT3iW3Apm_o5BF9VUt2QtF4jdewl9fxDLNEP9mKjnV10c41PyrK9JkzTRyQtKLzbhO3qcaMxSQn9luFAfT62pc-DTjNgRCisl6ygSVK7KGw6H56pwAUOA-URWHjR2UibwGREVdhuTNOS8FxNaCL8BywAm3RwkSf-8trTRN56ZdCJ9S38sKhlTbs6ZtVLDQoKj0omJo8tbX4xedfsiRzdoavrdd9iI77Tq0",
    email: "komorebi@forest.sanctuary",
    bio: "Wanderer of quiet forests. Lover of rainy afternoons and warm matcha.",
    location: "Khu vườn bí mật",
  };

  const user = userData || defaultUser;

  const [spiritName, setSpiritName] = useState(user.name);
  const [currentMood, setCurrentMood] = useState(
    "Brewing tea under the camphor tree",
  );
  const [bioText, setBioText] = useState(user.bio);
  const [presence, setPresence] = useState("Awake"); // Awake, Hibernating, Do Not Disturb
  const [enableWhispers, setEnableWhispers] = useState(true);
  const [environment, setEnvironment] = useState("Daylight"); // Daylight, Moonlight

  const handleLeaveSanctuary = () => {
    window.location.href = "/login";
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

      <div className="flex-1 overflow-y-auto p-5">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 max-w-[1200px] mx-auto">
          <div className="lg:col-span-2 bg-[rgba(253,251,247,0.4)] border border-white/40 rounded-3xl p-5 flex flex-col items-center relative">
            <h3 className="text-base font-bold text-[#434840]/90 mb-4 text-center w-full">
              Your Sanctuary
            </h3>

            <div className="relative w-24 h-24 mb-6 group">
              <img
                src={user.avatar}
                className="w-full h-full rounded-full object-cover border-2 border-white shadow-[0_2px_10px_rgba(0,0,0,0.06)]"
                alt="Avatar"
              />
              <div className="absolute bottom-0.5 right-0.5 w-5 h-5 bg-green-500 border-2 border-white rounded-full"></div>
            </div>

            <div className="w-full space-y-1 mb-4">
              <label className="text-[11px] font-semibold text-[#434840]/60 ml-1">
                Spirit Name
              </label>
              <div className="relative flex items-center w-full h-10 rounded-xl bg-[#f0eee8]/80 border border-[#c3c8bd]/30 px-3 text-[#1c1c18] focus-within:bg-white focus-within:border-[#a8d5ba]/50 transition-all">
                <input
                  type="text"
                  value={spiritName}
                  onChange={(e) => setSpiritName(e.target.value)}
                  className="w-full bg-transparent border-none focus:ring-0 text-xs outline-none font-medium p-0"
                />
                <span className="material-symbols-outlined text-[#434840]/40 text-base cursor-pointer hover:text-[#a8d5ba]">
                  edit
                </span>
              </div>
            </div>

            <div className="w-full space-y-1 mb-4">
              <label className="text-[11px] font-semibold text-[#434840]/60 ml-1">
                Current Mood
              </label>
              <div className="relative flex items-center w-full h-10 rounded-xl bg-[#f0eee8]/80 border border-[#c3c8bd]/30 px-3 text-[#1c1c18] focus-within:bg-white focus-within:border-[#a8d5ba]/50 transition-all">
                <input
                  type="text"
                  value={currentMood}
                  onChange={(e) => setCurrentMood(e.target.value)}
                  className="w-full bg-transparent border-none focus:ring-0 text-xs outline-none text-[#434840] p-0"
                />
                <span className="material-symbols-outlined text-[#434840]/40 text-lg cursor-pointer hover:text-[#a8d5ba]">
                  sentiment_satisfied
                </span>
              </div>
            </div>

            <div className="w-full space-y-1 mb-4">
              <label className="text-[11px] font-semibold text-[#434840]/60 ml-1">
                Personal Flourish
              </label>
              <textarea
                rows="2"
                value={bioText}
                onChange={(e) => setBioText(e.target.value)}
                className="w-full rounded-xl bg-[#f0eee8]/80 border border-[#c3c8bd]/30 p-3 text-[#1c1c18] text-xs focus:bg-white focus:border-[#a8d5ba]/50 focus:ring-0 outline-none transition-all resize-none text-[#434840] leading-normal"
              />
            </div>

            <div className="w-full space-y-2">
              <label className="text-[11px] font-semibold text-[#434840]/60 ml-1">
                Presence
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setPresence("Awake")}
                  className={`px-3 py-1.5 rounded-full text-[11px] font-medium border flex items-center gap-1.5 transition-all ${presence === "Awake" ? "bg-[#a8d5ba]/20 border-[#a8d5ba] text-[#1c1c18]" : "bg-white/40 border-black/5 text-[#434840]/70 hover:bg-white/80"}`}
                >
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>{" "}
                  Awake
                </button>
                <button
                  type="button"
                  onClick={() => setPresence("Hibernating")}
                  className={`px-3 py-1.5 rounded-full text-[11px] font-medium border flex items-center gap-1.5 transition-all ${presence === "Hibernating" ? "bg-[#b0e0f6]/20 border-[#b0e0f6] text-[#1c1c18]" : "bg-white/40 border-black/5 text-[#434840]/70 hover:bg-white/80"}`}
                >
                  <span className="w-1.5 h-1.5 bg-amber-600/70 rounded-full"></span>{" "}
                  Hibernating
                </button>
                <button
                  type="button"
                  onClick={() => setPresence("Do Not Disturb")}
                  className={`px-3 py-1.5 rounded-full text-[11px] font-medium border flex items-center gap-1.5 transition-all ${presence === "Do Not Disturb" ? "bg-red-500/10 border-red-400 text-[#1c1c18]" : "bg-white/40 border-black/5 text-[#434840]/70 hover:bg-white/80"}`}
                >
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>{" "}
                  Do Not Disturb
                </button>
              </div>
            </div>

            <div className="w-full flex justify-end mt-5 border-t border-[#c3c8bd]/10 pt-3">
              <button
                type="button"
                className="px-4 py-1.5 bg-[#a8d5ba] hover:bg-[#97c4a9] text-white font-bold rounded-lg shadow-sm transition-all text-xs active:scale-95"
              >
                Save Changes
              </button>
            </div>
          </div>

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
