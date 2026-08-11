/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

// --- UI Components Helper ---
const FormInput = ({
  icon: Icon,
  label,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  rightIcon: RightIcon,
  onRightIconClick,
}: any) => (
  <div className="space-y-2">
    <label className="text-[11px] font-bold text-[#233982] uppercase tracking-wider ml-1">
      {label}
    </label>
    <div className="relative group">
      <Icon
        className="absolute left-4 top-1/2 -translate-y-1/2 text-[#C4C4C4] group-focus-within:text-[#FCC200] transition-colors duration-300"
        size={18}
      />
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full bg-[#FFFFFF] text-[#1B1B1B] border-2 border-[#e1e2e2] rounded-2xl py-3.5 pl-12 ${
          RightIcon ? "pr-12" : "pr-4"
        } text-sm font-medium 
                   focus:bg-[#FFFEF5] focus:border-[#FCC200] focus:ring-4 focus:ring-[#FCC200]/10 outline-none transition-all duration-300 placeholder:text-[#C4C4C4]`}
      />
      {RightIcon && (
        <button
          type="button"
          onClick={onRightIconClick}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-[#C4C4C4] hover:text-[#233982] transition-colors duration-300 focus:outline-none"
          tabIndex={-1}
        >
          <RightIcon size={18} />
        </button>
      )}
    </div>
  </div>
);

// --- Main Component ---
const App = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validasi sederhana di FE dengan Toast
    if (!formData.email || !formData.password) {
      toast.error("Email dan password wajib diisi");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        // Jika email belum terverifikasi, redirect ke halaman OTP
        if (data.needVerification && data.email) {
          router.push(`/otp?email=${encodeURIComponent(data.email)}`);
          return;
        }
        throw new Error(data.error || "Login gagal");
      }

      // Login berhasil: Tampilkan toast
      toast.success("Berhasil masuk! Mengalihkan...");

      // Simpan data user ke localStorage
      localStorage.setItem("user", JSON.stringify(data.user));

      // <-- BARU: Logika Redirect Berdasarkan Role
      const userRole = data.user.role;
      let redirectPath = "/"; // Default fallback untuk MEMBER atau role tidak dikenal

      if (userRole === "ADMIN") {
        redirectPath = "/admin/dashboard"; // Ubah ke "/admin/dashboard" jika folder Anda bernama demikian
      } else if (userRole === "JURNALIS") {
        redirectPath = "/jurnalis/dashboard"; // Ubah ke "/jurnalis/dashboard" jika perlu
      } else if (userRole === "KOL") {
        redirectPath = "/kol/dashboard"; // Atau "/jurnalis" jika KOL menggunakan dashboard yang sama
      } else if (userRole === "MEMBER") {
        redirectPath = "/";
      }

      // Redirect setelah 1 detik agar toast sempat terlihat
      setTimeout(() => {
        router.push(redirectPath);
      }, 1000);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFFEF5] via-[#FFFFFF] to-[#F0F4FF] flex items-center justify-center p-4 sm:p-6 font-sans overflow-hidden relative">
      {/* Background Ornaments */}
      <div className="absolute top-[-10%] right-[-5%] w-[400px] h-[400px] sm:w-[500px] sm:h-[500px] bg-[#FCC200]/10 rounded-full blur-[100px] sm:blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] bg-[#4F619B]/5 rounded-full blur-[80px] sm:blur-[100px] pointer-events-none" />

      {/* Main Centered Card */}
      <div className="w-full max-w-[460px] bg-[#FFFFFF]/95 backdrop-blur-xl rounded-[2rem] sm:rounded-[2.5rem] shadow-[0_30px_80px_-20px_rgba(35,57,130,0.12)] border border-[#FFFFFF] flex flex-col overflow-hidden relative z-10">
        <div className="p-6 sm:p-10 flex-1 flex flex-col">
          {/* Branding Header (Centered, No Background) */}
          <div className="flex flex-col items-center mb-6 sm:mb-8">
            <img
              src="/logomedpel.png"
              alt="MedPel Logo"
              className="w-16 h-16 sm:w-20 sm:h-20 object-contain drop-shadow-sm"
            />
            <h1 className="text-[#233982] font-black text-2xl sm:text-3xl tracking-tight">
              Media <span className="text-[#FCC200]">Pelajar</span>
            </h1>
          </div>

          {/* Content Area */}
          <div className="flex-1 relative min-h-[420px] sm:min-h-[440px]">
            <motion.form
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              onSubmit={handleSubmit}
              className="absolute inset-0 flex flex-col"
            >
              <div className="mb-6 sm:mb-8 text-center">
                <h3 className="text-xl sm:text-2xl font-black text-[#1B1B1B] tracking-tight mb-2">
                  Selamat Datang Kembali
                </h3>
                <p className="text-[#6B7280] text-xs sm:text-sm">
                  Silakan masukkan detail akun Anda untuk melanjutkan.
                </p>
              </div>

              <div className="space-y-3 sm:space-y-4 flex-1">
                <FormInput
                  icon={Mail}
                  label="Email"
                  name="email"
                  type="email"
                  placeholder="Masukan Email"
                  value={formData.email}
                  onChange={handleInputChange}
                />

                {/* Input Password dengan Fitur Show/Hide */}
                <FormInput
                  icon={Lock}
                  label="Kata Sandi"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Masukkan kata sandi Anda"
                  value={formData.password}
                  onChange={handleInputChange}
                  rightIcon={showPassword ? EyeOff : Eye}
                  onRightIconClick={() => setShowPassword(!showPassword)}
                />

                {/* Forgot Password Link */}
                <div className="flex justify-end pt-1">
                  <a
                    href="/lupa-password"
                    className="text-xs font-bold text-[#4F619B] hover:text-[#233982] transition-colors"
                  >
                    Lupa kata sandi?
                  </a>
                </div>
              </div>

              <div className="pt-4 sm:pt-6 space-y-3">
                {/* Primary Login Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-[#233982] to-[#4F619B] hover:from-[#4F619B] hover:to-[#7281AF] text-[#FFFFFF] font-bold py-3.5 rounded-2xl shadow-lg shadow-[#233982]/20 transition-all flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Memproses..." : "Masuk Sekarang"}
                </button>
              </div>
            </motion.form>
          </div>

          {/* Footer */}
          <div className="relative z-20 mt-6 sm:mt-5 text-center border-t border-[#F8FAF9] pt-6">
            <p className="text-xs text-[#6B7280] font-bold">
              Belum punya akun?{" "}
              <a
                href="/register"
                className="text-[#FCC200] hover:text-[#233982] hover:underline underline-offset-4 transition-colors font-bold"
              >
                Daftar di sini
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
