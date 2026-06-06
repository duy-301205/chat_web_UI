import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ghibliBg from "../assets/login2.png";
import { loginApi } from "../api/api";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    try {
      const result = await loginApi(data);
      console.log("Đăng nhập thành công:", result);

      if (result && result.code === 200) {
        localStorage.setItem("userId", result.data.userId);
        localStorage.setItem("accessToken", result.data.accessToken);
        localStorage.setItem("refreshToken", result.data.refreshToken);

        navigate("/chat");
      } else {
        setError(result.message || "Đăng nhập thất bại. Vui lòng thử lại!");
        setIsLoading(false); // Tắt hiệu ứng chờ nếu có thông điệp lỗi cấu trúc
      }
    } catch (err) {
      console.error("Đăng nhập thất bại:", err.message);
      setError(
        err.message === "API_ERROR"
          ? "Email hoặc mật khẩu không chính xác!"
          : err.message,
      );
      setIsLoading(false); // Tắt hiệu ứng chờ khi bắt được ngoại lệ ngoại mạng/hệ thống
    }
  };

  return (
    <div className="min-h-screen text-slate-800 relative overflow-hidden flex items-center justify-center p-4">
      {/* Background Image Layer */}
      <div className="absolute inset-0 z-0">
        <img
          alt="Ghibli Tree Background"
          className="w-full h-full object-cover object-center opacity-90"
          src={ghibliBg}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/10"></div>
      </div>

      {/* Login Card */}
      <div
        className="w-full max-w-[440px] rounded-2xl p-8 sm:p-10 relative z-10 flex flex-col items-center"
        style={{
          backgroundColor: "rgba(252, 249, 243, 0.85)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          border: "1px solid rgba(255, 255, 255, 0.5)",
          boxShadow: "0 20px 40px rgba(74, 101, 69, 0.12)",
        }}
      >
        {/* Header */}
        <div className="flex items-center gap-2 mb-2">
          <span
            className="material-symbols-outlined notranslate text-[#4a6545] text-3xl"
            translate="no"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            eco
          </span>
          <h1 className="text-3xl font-black text-[#4a6545] text-center tracking-tight">
            Komorebi
          </h1>
        </div>
        <p className="text-sm font-medium text-slate-500 text-center mb-8">
          Welcome back, Spirit
        </p>

        {/* Form */}
        <form className="w-full space-y-5" onSubmit={handleLogin}>
          {/* Ô nhập Email */}
          <div className="space-y-1">
            <label className="sr-only" htmlFor="email">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <span
                  className="material-symbols-outlined notranslate text-slate-400 text-[20px]"
                  translate="no"
                >
                  mail
                </span>
              </div>
              <input
                className="w-full pl-11 pr-4 bg-white/40 border border-slate-300/50 rounded-full text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#4a6545]/40 focus:bg-white transition-all text-sm h-11"
                id="email"
                name="email"
                placeholder="Enter your email"
                type="email"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Ô nhập Password */}
          <div className="space-y-1">
            <label className="sr-only" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <span
                  className="material-symbols-outlined notranslate text-slate-400 text-[20px]"
                  translate="no"
                >
                  lock
                </span>
              </div>
              <input
                className="w-full pl-11 pr-11 py-3 bg-white/40 border border-slate-300/50 rounded-full text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#4a6545]/40 focus:bg-white transition-all text-sm h-11"
                id="password"
                name="password"
                placeholder="Enter your password"
                type={showPassword ? "text" : "password"}
                required
                disabled={isLoading}
              />
              <button
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-[#4a6545] transition-colors cursor-pointer"
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                <span
                  className="material-symbols-outlined notranslate text-[20px]"
                  translate="no"
                >
                  {showPassword ? "visibility" : "visibility_off"}
                </span>
              </button>
            </div>
          </div>

          {/* Quên mật khẩu link */}
          <div className="text-right px-2">
            <a
              href="#"
              className="text-xs text-slate-500 hover:text-[#4a6545] transition-colors underline underline-offset-2"
            >
              Forgot Path?
            </a>
          </div>

          {/* Khối thông báo lỗi tĩnh - Ngăn lỗi xung đột gỡ bỏ Node */}
          <div className="error-container w-full min-h-[40px] empty:hidden">
            {error ? (
              <div
                key="err-display"
                className="text-red-500 text-xs font-semibold text-center bg-red-500/10 py-2 px-4 rounded-xl border border-red-500/20"
              >
                {error}
              </div>
            ) : null}
          </div>

          {/* CTA Button */}
          <button
            key={isLoading ? "btn-loading" : "btn-active"} // Khóa key cố định tránh tính toán sai lệch DOM ảo
            className={`w-full h-11 mt-2 bg-[#4a6545] text-white rounded-full font-bold text-sm shadow-md hover:bg-[#3b5237] hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex justify-center items-center gap-2 ${
              isLoading ? "opacity-75 cursor-not-allowed" : "cursor-pointer"
            }`}
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center gap-2 animate-none">
                {/* Cô lập class xoay chỉ nằm duy nhất trong thẻ icon này */}
                <span className="material-symbols-outlined animate-spin text-[18px] inline-block">
                  progress_activity
                </span>
                {/* Bọc chữ vào thẻ span độc lập để cố định không bị xoay theo */}
                <span className="inline-block">Summoning Spirit...</span>
              </div>
            ) : (
              <>
                Enter the Forest
                <span
                  className="material-symbols-outlined notranslate text-[18px]"
                  translate="no"
                >
                  login
                </span>
              </>
            )}
          </button>
        </form>

        {/* Footer Link */}
        <div className="mt-6 text-center">
          <Link
            className="text-xs font-medium text-slate-500 hover:text-[#4a6545] transition-colors underline underline-offset-4"
            to="/register"
          >
            New to the woods? Create a spirit
          </Link>
        </div>
      </div>
    </div>
  );
}
