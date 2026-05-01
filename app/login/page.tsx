"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  ChevronLeft,
  Sparkles,
  Globe,
} from "lucide-react";

const COLORS = {
  primary: "#12a44d", // Hijau Utama
  secondary: "#d7dd21", // Kuning Lemon
  navy: "#2b529b", // Navy
  navyDeep: "#2c5298", // Navy Deep
  bg: "#fefefe", // Putih Bersih
  accent: "#b76979", // Accent Pinkish/Muted
};

const App = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleLogin = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulasi loading proses login
    setTimeout(() => setIsLoading(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#fefefe] flex items-center justify-center p-6 font-sans overflow-hidden relative">
      {/* Background Ornaments */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#12a44d]/5 rounded-full blur-[100px]" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#d7dd21]/10 rounded-full blur-[100px]" />

      {/* Floating Elements for Aesthetic */}
      {/* <motion.div
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute top-20 left-20 text-[#12a44d]/20 hidden lg:block"
      >
        <Sparkles size={40} />
      </motion.div> */}

      <div className="w-full max-w-[1100px] bg-white rounded-[2.5rem] shadow-[0_20px_80px_rgba(0,0,0,0.06)] border border-gray-50 flex overflow-hidden relative z-10 min-h-[650px]">
        {/* Left Side: Visual & Branding */}
        <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-[#12a44d] via-[#11a44c] to-[#2b529b] p-12 flex-col justify-between relative overflow-hidden">
          {/* Abstract Pattern Overlay */}
          <div className="absolute inset-0 opacity-10">
            <div
              className="absolute top-0 left-0 w-full h-full"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
                backgroundSize: "40px 40px",
              }}
            />
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-8">
              {/* <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-[#12a44d] font-black text-xl">M</span>
              </div> */}
              <h1 className="text-white font-bold text-2xl tracking-tight">
                MedPel <span className="text-[#d7dd21]">News</span>
              </h1>
            </div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-4xl font-black text-white leading-tight mb-4">
                Suara Pendidikan,
                <br />
                <span className="text-[#d7dd21]">Masa Depan</span> Bangsa.
              </h2>
              <p className="text-white/80 text-sm leading-relaxed max-w-sm">
                Masuk ke ekosistem jurnalisme sekolah paling canggih. Kelola
                konten, kolaborasi, dan publikasi dalam satu pintu.
              </p>
            </motion.div>
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-4 p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
              <div className="w-10 h-10 rounded-full bg-[#d7dd21] flex items-center justify-center text-gray-900">
                <ShieldCheck size={20} />
              </div>
              <div>
                <p className="text-white text-xs font-bold">Secure Access</p>
                <p className="text-white/60 text-[10px]">
                  Enkripsi data standar industri jurnalisme.
                </p>
              </div>
            </div>
          </div>

          {/* Decorative Circle */}
          <div className="absolute bottom-[-100px] right-[-50px] w-64 h-64 border-[40px] border-white/5 rounded-full" />
        </div>

        {/* Right Side: Login Form */}
        <div className="w-full lg:w-1/2 p-8 lg:p-16 flex flex-col justify-center bg-white">
          <div className="mb-10 text-center lg:text-left">
            <div className="lg:hidden flex justify-center mb-6">
              <div className="w-12 h-12 bg-[#12a44d] rounded-2xl flex items-center justify-center shadow-lg shadow-green-100">
                <span className="text-white font-black text-2xl">M</span>
              </div>
            </div>
            <h3 className="text-2xl font-black text-gray-800 mb-2">
              Selamat Datang Kembali
            </h3>
            <p className="text-gray-400 text-sm">
              Silakan masuk dengan kredensial MedPel Anda.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                Alamat Email
              </label>
              <div className="relative group">
                <Mail
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#12a44d] transition-colors"
                  size={18}
                />
                <input
                  type="email"
                  required
                  placeholder="name@school.com"
                  className="w-full bg-gray-50 text-black border-2 border-gray-50 rounded-2xl py-4 pl-12 pr-4 text-sm focus:bg-white focus:border-[#12a44d]/20 focus:ring-4 focus:ring-[#12a44d]/5 outline-none transition-all"
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  Kata Sandi
                </label>
                <a
                  href="#"
                  className="text-[10px] font-bold text-[#2b529b] hover:underline"
                >
                  Lupa Sandi?
                </a>
              </div>
              <div className="relative group">
                <Lock
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#12a44d] transition-colors"
                  size={18}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  className="w-full bg-gray-50 text-black border-2 border-gray-50 rounded-2xl py-4 pl-12 pr-12 text-sm focus:bg-white focus:border-[#12a44d]/20 focus:ring-4 focus:ring-[#12a44d]/5 outline-none transition-all"
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <label className="flex items-center gap-3 cursor-pointer group w-fit">
              <div className="relative flex items-center justify-center">
                <input
                  type="checkbox"
                  className="peer appearance-none w-5 h-5 border-2 border-gray-200 rounded-md checked:bg-[#12a44d] checked:border-[#12a44d] transition-all cursor-pointer"
                />
                <ShieldCheck
                  className="absolute text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none"
                  size={12}
                />
              </div>
              <span className="text-xs font-bold text-gray-500 group-hover:text-gray-700 transition-colors">
                Tetap masuk di perangkat ini
              </span>
            </label>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#12a44d] text-white font-black py-4 rounded-2xl shadow-lg shadow-green-100 hover:translate-y-[-2px] hover:shadow-green-200 active:scale-[0.98] transition-all flex items-center justify-center gap-2 overflow-hidden relative group"
            >
              <AnimatePresence mode="wait">
                {isLoading ? (
                  <motion.div
                    key="loader"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"
                  />
                ) : (
                  <motion.div
                    key="text"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2"
                  >
                    MASUK SEKARANG{" "}
                    <ArrowRight
                      size={18}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </form>

          {/* Social / Other Options */}
          {/* <div className="mt-10">
            <div className="relative flex items-center justify-center mb-8">
              <div className="absolute w-full h-[1px] bg-gray-100" />
              <span className="relative bg-white px-4 text-[10px] font-black text-gray-300 uppercase tracking-widest">
                Atau masuk dengan
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center gap-3 py-3 border-2 border-gray-50 rounded-2xl hover:bg-gray-50 hover:border-gray-100 transition-all font-bold text-xs text-gray-600">
                <Globe size={16} className="text-[#2b529b]" /> Google
              </button>
              <button className="flex items-center justify-center gap-3 py-3 border-2 border-gray-50 rounded-2xl hover:bg-gray-50 hover:border-gray-100 transition-all font-bold text-xs text-gray-600">
                <Lock size={16} className="text-[#b76979]" /> SSO Sekolah
              </button>
            </div>
          </div> */}

          <div className="mt-auto pt-8 text-center">
            <p className="text-xs text-gray-400 font-bold">
              Belum punya akun?{" "}
              <a href="/register" className="text-[#12a44d] hover:underline">
                Daftar Jurnalis
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Language Switcher Footer */}
      <div className="absolute bottom-6 flex gap-6 text-[10px] font-black text-gray-300 uppercase tracking-[0.2em]">
        <button className="hover:text-[#12a44d] transition-colors">
          Indonesia
        </button>
        {/* <button className="hover:text-[#12a44d] transition-colors">
          English
        </button> */}
        <span className="text-gray-100">|</span>
        <span className="cursor-default">
          © 2024 MedPel Forum OSIS Jawa Barat
        </span>
      </div>
    </div>
  );
};

export default App;
