/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Mail,
  Lock,
  CheckCircle2,
  BookOpen,
  PenTool,
  ArrowRight,
  Megaphone,
  ArrowLeft,
} from "lucide-react";

// --- UI Components Helper ---
const FormInput = ({
  icon: Icon,
  label,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
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
        className="w-full bg-[#FFFFFF] text-[#1B1B1B] border-2 border-[#e1e2e2] rounded-2xl py-3.5 pl-12 pr-4 text-sm font-medium 
                   focus:bg-[#FFFEF5] focus:border-[#FCC200] focus:ring-4 focus:ring-[#FCC200]/10 outline-none transition-all duration-300 placeholder:text-[#C4C4C4]"
      />
    </div>
  </div>
);

// --- Main Component ---
const App = () => {
  const [roleSelection, setRoleSelection] = useState<
    "user" | "jurnalis" | "kol" | null
  >(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRoleSelect = (role: "user" | "jurnalis" | "kol") => {
    setRoleSelection(role);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFFEF5] via-[#FFFFFF] to-[#F0F4FF] flex items-center justify-center p-4 sm:p-6 font-sans overflow-hidden relative">
      {/* Background Ornaments */}
      <div className="absolute top-[-10%] right-[-5%] w-[400px] h-[400px] sm:w-[500px] sm:h-[500px] bg-[#FCC200]/10 rounded-full blur-[100px] sm:blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] bg-[#4F619B]/5 rounded-full blur-[80px] sm:blur-[100px] pointer-events-none" />

      {/* Main Centered Card */}
      <div className="w-full max-w-[460px] bg-[#FFFFFF]/95 backdrop-blur-xl rounded-[2rem] sm:rounded-[2.5rem] shadow-[0_30px_80px_-20px_rgba(35,57,130,0.12)] border border-[#FFFFFF] flex flex-col overflow-hidden relative z-10">
        <div className="p-6  sm:p-10 flex-1 flex flex-col">
          {/* Branding Header (Centered, No Background) */}
          <div className="flex flex-col  items-center mb-6 sm:mb-8">
            <img
              src="/logomedpel.png"
              alt="MedPel Logo"
              className="w-16 h-16 sm:w-20 sm:h-20 object-contain drop-shadow-sm"
            />
            <h1 className="text-[#233982] font-black text-2xl sm:text-3xl tracking-tight">
              Media <span className="text-[#FCC200]">Pelajar</span>
            </h1>
          </div>

          {/* Content Area with Safe Min-Height for Smooth Transitions */}
          <div className="flex-1 relative min-h-[420px] sm:min-h-[460px]">
            <AnimatePresence mode="wait">
              {/* SUCCESS STATE */}
              {isSuccess ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="absolute inset-0 flex flex-col items-center justify-center text-center p-4"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    className="w-20 h-20 sm:w-24 sm:h-24 bg-green-100 rounded-full flex items-center justify-center mb-6"
                  >
                    <CheckCircle2
                      size={40}
                      className="sm:w-12 sm:h-12 text-green-600"
                    />
                  </motion.div>
                  <h3 className="text-xl sm:text-2xl font-black text-[#1B1B1B] mb-2">
                    Pendaftaran Berhasil!
                  </h3>
                  <p className="text-[#6B7280] text-sm max-w-xs mb-8 leading-relaxed">
                    Akun Anda sebagai{" "}
                    <span className="font-bold text-[#233982]">
                      {roleSelection === "jurnalis"
                        ? "Jurnalis"
                        : roleSelection === "kol"
                          ? "KOL"
                          : "Member"}
                    </span>{" "}
                    telah dibuat.
                  </p>
                  <a
                    href="/login"
                    className="w-full max-w-xs bg-[#233982] text-white font-bold py-3.5 rounded-2xl hover:bg-[#4F619B] transition-all active:scale-[0.98]"
                  >
                    MASUK SEKARANG
                  </a>
                </motion.div>
              ) : !roleSelection ? (
                /* STEP 0: ROLE SELECTION */
                <motion.div
                  key="role-select"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 flex flex-col justify-center"
                >
                  <div className="mb-6 sm:mb-8 text-center">
                    <h3 className="text-xl sm:text-2xl font-black text-[#1B1B1B] tracking-tight mb-2">
                      Pilih Peran Anda
                    </h3>
                    <p className="text-[#6B7280] text-xs sm:text-sm">
                      Tentukan bagaimana Anda ingin berpartisipasi.
                    </p>
                  </div>

                  <div className="space-y-3">
                    {(["user", "jurnalis", "kol"] as const).map((role) => (
                      <button
                        key={role}
                        onClick={() => handleRoleSelect(role)}
                        className="group w-full flex items-center gap-4 p-4 rounded-2xl border-2 border-[#F8FAF9] hover:border-[#FCC200]/40 bg-[#FFFFFF] hover:bg-[#FFFEF5] transition-all duration-300 text-left hover:shadow-lg hover:shadow-[#FCC200]/5 hover:-translate-y-0.5"
                      >
                        <div
                          className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110 ${
                            role === "user"
                              ? "bg-gradient-to-br from-[#4F619B]/10 to-[#7281AF]/10 text-[#4F619B]"
                              : role === "jurnalis"
                                ? "bg-gradient-to-br from-[#FCC200]/30 to-[#FDCE33]/20 text-[#233982]"
                                : "bg-gradient-to-br from-[#233982]/10 to-[#4F619B]/20 text-[#233982]"
                          }`}
                        >
                          {role === "user" ? (
                            <BookOpen size={22} />
                          ) : role === "jurnalis" ? (
                            <PenTool size={22} />
                          ) : (
                            <Megaphone size={22} />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-[#1B1B1B] text-sm sm:text-base">
                            {role === "user"
                              ? "Member"
                              : role === "jurnalis"
                                ? "Jurnalis Pelajar"
                                : "Key Opinion Leader"}
                          </h4>
                          <p className="text-[11px] sm:text-xs text-[#6B7280] mt-0.5 leading-relaxed line-clamp-2">
                            {role === "user"
                              ? "Baca artikel, blog, dan berinteraksi."
                              : role === "jurnalis"
                                ? "Tulis artikel, unggah karya, bangun portofolio."
                                : "Buat konten, bangun pengaruh, dan kolaborasi."}
                          </p>
                        </div>
                        <ArrowRight
                          className="text-[#C4C4C4] group-hover:text-[#FCC200] group-hover:translate-x-1 transition-all duration-300 flex-shrink-0"
                          size={18}
                        />
                      </button>
                    ))}
                  </div>
                </motion.div>
              ) : (
                /* STEP 1: REGISTER FORM */
                <motion.form
                  key="register-form"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={handleSubmit}
                  className="absolute inset-0 flex flex-col"
                >
                  <div className="space-y-3 sm:space-y-4 flex-1">
                    <FormInput
                      icon={User}
                      label="Nama Lengkap"
                      name="fullName"
                      placeholder="Masukan Nama Lengkap"
                      value={formData.fullName}
                      onChange={handleInputChange}
                    />
                    <FormInput
                      icon={Mail}
                      label="Email"
                      name="email"
                      type="email"
                      placeholder="Masukan Email"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                    <FormInput
                      icon={Lock}
                      label="Kata Sandi"
                      name="password"
                      type="password"
                      placeholder="Minimal 8 karakter"
                      value={formData.password}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="pt-4 sm:pt-6 space-y-4">
                    {/* Tombol Kembali & Daftar Berdampingan (Responsive Ratio) */}
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => setRoleSelection(null)}
                        className="flex-1 bg-[#F8FAF9] hover:bg-[#F1F5F9] text-[#4F619B] font-bold py-3.5 rounded-2xl transition-all flex items-center justify-center gap-2 active:scale-[0.98] border-2 border-[#d0d2d1]  hover:border-[#4F619B]/20"
                      >
                        <ArrowLeft size={18} />
                        <span className="text-sm">Kembali</span>
                      </button>
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="flex-[1.8] bg-gradient-to-r from-[#233982] to-[#4F619B] hover:from-[#4F619B] hover:to-[#7281AF] text-[#FFFFFF] font-bold py-3.5 rounded-2xl shadow-lg shadow-[#233982]/20 transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
                      >
                        {isLoading ? "Memproses..." : "Daftar"}
                      </button>
                    </div>

                    {/* Divider */}
                    <div className="relative flex py-1 items-center">
                      <div className="flex-grow border-t border-[#F8FAF9]"></div>
                      <span className="flex-shrink-0 mx-4 text-[#C4C4C4] text-[10px] font-bold uppercase tracking-widest">
                        atau
                      </span>
                      <div className="flex-grow border-t border-[#F8FAF9]"></div>
                    </div>

                    {/* Google Login Button */}
                    <button
                      type="button"
                      className="w-full bg-[#FFFFFF] border-2 border-[#aaaeac] hover:border-[#C4C4C4] hover:bg-[#FAFAFA] text-[#1B1B1B] font-bold py-3.5 rounded-2xl transition-all flex items-center justify-center gap-3 active:scale-[0.98] group"
                    >
                      <svg
                        className="w-5 h-5 flex-shrink-0"
                        viewBox="0 0 24 24"
                      >
                        <path
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          fill="#4285F4"
                        />
                        <path
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          fill="#34A853"
                        />
                        <path
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                          fill="#FBBC05"
                        />
                        <path
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                          fill="#EA4335"
                        />
                      </svg>
                      <span className="text-sm group-hover:text-[#233982] transition-colors">
                        Daftar dengan Google
                      </span>
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>

          {/* Footer */}
          {!isSuccess && (
            <div className="relative z-20 mt-6 sm:mt-5 text-center border-t border-[#F8FAF9]">
              <p className="text-xs text-[#6B7280] font-bold">
                Sudah punya akun?{" "}
                <a
                  href="/login"
                  className="text-[#FCC200] hover:text-[#233982] hover:underline underline-offset-4 transition-colors font-bold"
                >
                  Masuk di sini
                </a>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
