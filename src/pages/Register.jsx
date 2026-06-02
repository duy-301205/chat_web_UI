import React, { useState } from "react";
// 1. Import Link từ react-router-dom để kích hoạt tính năng chuyển trang siêu tốc
import { Link, useNavigate } from "react-router-dom";
import ghibliBg from "../assets/login2.png";
import { registerApi } from "../api/api";

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    try {
      const result = await registerApi(data);

      console.log("Đăng ký thành công:", result);

      if (result.code === 200) {
        setSuccess("Đăng ký thành công!");
        navigate("/login");
      }
    } catch (error) {
      console.error("Đăng ký thất bại:", error.message);
      setError(error.message || "Đăng ký thất bại!");
    }
  };

  return (
    <div className="min-h-screen font-body-md text-on-surface relative overflow-hidden flex items-center justify-center p-4">
      {/* Background Image Layer */}
      <div className="absolute inset-0 z-0">
        <img
          alt="Ghibli Tree Background"
          className="w-full h-full object-fill object-center opacity-90"
          src={ghibliBg}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-surface/20"></div>
      </div>

      {/* Registration Card */}
      <div
        className="w-full max-w-[440px] rounded-xl p-8 sm:p-10 relative z-10 flex flex-col items-center"
        style={{
          backgroundColor: "rgba(252, 249, 243, 0.85)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          border: "1px solid rgba(255, 255, 255, 0.5)",
          boxShadow: "0 20px 40px rgba(74, 101, 69, 0.08)",
        }}
      >
        {/* Header */}
        <div className="flex items-center gap-2 mb-2">
          <span
            className="material-symbols-outlined notranslate text-primary text-3xl"
            translate="no"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            eco
          </span>
          <h1 className="font-headline-lg text-headline-lg text-primary text-center">
            Komorebi
          </h1>
        </div>
        <p className="font-body-md text-body-md text-on-surface-variant text-center mb-8">
          Create your Spirit
        </p>

        {/* Form */}
        <form className="w-full space-y-5" onSubmit={handleSubmit}>
          {/* Username Input */}
          <div className="space-y-1">
            <label
              className="font-label-md text-label-md text-on-surface-variant sr-only"
              htmlFor="username"
            >
              Username
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <span
                  className="material-symbols-outlined notranslate text-outline-variant"
                  translate="no"
                >
                  person
                </span>
              </div>
              <input
                className="w-full pl-11 pr-4 py-3 bg-surface/50 border border-outline-variant/30 rounded-full text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-shadow font-body-md text-body-md"
                id="username"
                name="username"
                placeholder="Enter your username"
                type="text"
                required
              />
            </div>
          </div>

          {/* Email Input */}
          <div className="space-y-1">
            <label
              className="font-label-md text-label-md text-on-surface-variant sr-only"
              htmlFor="email"
            >
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <span
                  className="material-symbols-outlined notranslate text-outline-variant"
                  translate="no"
                >
                  mail
                </span>
              </div>
              <input
                className="w-full pl-11 pr-4 py-3 bg-surface/50 border border-outline-variant/30 rounded-full text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-shadow font-body-md text-body-md"
                id="email"
                name="email"
                placeholder="Enter your email"
                type="email"
                required
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1">
            <label
              className="font-label-md text-label-md text-on-surface-variant sr-only"
              htmlFor="password"
            >
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <span
                  className="material-symbols-outlined notranslate text-outline-variant"
                  translate="no"
                >
                  lock
                </span>
              </div>
              <input
                className="w-full pl-11 pr-11 py-3 bg-surface/50 border border-outline-variant/30 rounded-full text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-shadow font-body-md text-body-md"
                id="password"
                name="password"
                placeholder="Enter your password"
                type={showPassword ? "text" : "password"}
                required
              />
              <button
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-outline-variant hover:text-primary transition-colors"
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

          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}

          {success && (
            <div className="text-green-600 text-sm text-center">{success}</div>
          )}

          {/* CTA Button */}
          <button
            className="w-full py-3 mt-4 bg-primary text-on-primary rounded-full font-label-md text-label-md hover:bg-surface-tint hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex justify-center items-center gap-2"
            type="submit"
          >
            Begin your Journey
            <span
              className="material-symbols-outlined notranslate text-[18px]"
              translate="no"
            >
              arrow_forward
            </span>
          </button>
        </form>

        {/* Footer Link */}
        <div className="mt-6 text-center">
          {/* 2. Thay đổi thẻ <a> bằng <Link> và dùng thuộc tính "to" thay thế cho "href" */}
          <Link
            className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors underline decoration-outline-variant/50 underline-offset-4"
            to="/login"
          >
            Already have a account? Login
          </Link>
        </div>
      </div>
    </div>
  );
}
