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
  Eye, // <-- TAMBAHKAN IMPORT INI
  EyeOff, // <-- TAMBAHKAN IMPORT INI
} from "lucide-react";
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
  rightIcon: RightIcon, // <-- TAMBAHKAN PROP INI
  onRightIconClick, // <-- TAMBAHKAN PROP INI
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
        // <-- UBAH: pr-12 jika ada rightIcon, jika tidak pr-4
        className={`w-full bg-[#FFFFFF] text-[#252222] border-2 border-[#e1e2e2] rounded-2xl py-3.5 pl-12 ${
          RightIcon ? "pr-12" : "pr-4"
        } text-sm font-medium 
                   focus:bg-[#FFFEF5] focus:border-[#FCC200] focus:ring-4 focus:ring-[#FCC200]/10 outline-none transition-all duration-300 placeholder:text-[#C4C4C4]`}
      />
      {/* <-- TAMBAHKAN: Render Right Icon jika ada */}
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
  const [roleSelection, setRoleSelection] = useState<
    "MEMBER" | "JURNALIS" | "KOL" | null
  >(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");

  // <-- TAMBAHKAN STATE UNTUK SHOW/HIDE PASSWORD
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const handleRoleSelect = (role: "MEMBER" | "JURNALIS" | "KOL") => {
    setRoleSelection(role);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roleSelection) return;

    setIsLoading(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.fullName,
          email: formData.email,
          password: formData.password,
          role: roleSelection,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registrasi gagal");

      setRegisteredEmail(formData.email);
      setIsSuccess(true);
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
                      {roleSelection === "JURNALIS"
                        ? "JURNALIS"
                        : roleSelection === "KOL"
                          ? "KOL"
                          : "Member"}
                    </span>{" "}
                    telah dibuat.
                  </p>
                  <button
                    onClick={() =>
                      router.push(
                        `/otp?email=${encodeURIComponent(registeredEmail)}`,
                      )
                    }
                    className="w-full max-w-xs bg-[#233982] text-white font-bold py-3.5 rounded-2xl hover:bg-[#4F619B] transition-all active:scale-[0.98]"
                  >
                    VERIFIKASI OTP
                  </button>
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
                    {(["MEMBER", "JURNALIS", "KOL"] as const).map((role) => (
                      <button
                        key={role}
                        onClick={() => handleRoleSelect(role)}
                        className="group w-full flex items-center gap-4 p-4 rounded-2xl border-2 border-[#F8FAF9] hover:border-[#FCC200]/40 bg-[#FFFFFF] hover:bg-[#FFFEF5] transition-all duration-300 text-left hover:shadow-lg hover:shadow-[#FCC200]/5 hover:-translate-y-0.5"
                      >
                        <div
                          className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110 ${
                            role === "MEMBER"
                              ? "bg-gradient-to-br from-[#4F619B]/10 to-[#7281AF]/10 text-[#4F619B]"
                              : role === "JURNALIS"
                                ? "bg-gradient-to-br from-[#FCC200]/30 to-[#FDCE33]/20 text-[#233982]"
                                : "bg-gradient-to-br from-[#233982]/10 to-[#4F619B]/20 text-[#233982]"
                          }`}
                        >
                          {role === "MEMBER" ? (
                            <BookOpen size={22} />
                          ) : role === "JURNALIS" ? (
                            <PenTool size={22} />
                          ) : (
                            <Megaphone size={22} />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-[#1B1B1B] text-sm sm:text-base">
                            {role === "MEMBER"
                              ? "Member"
                              : role === "JURNALIS"
                                ? "Jurnalis Pelajar"
                                : "Key Opinion Leader"}
                          </h4>
                          <p className="text-[11px] sm:text-xs text-[#6B7280] mt-0.5 leading-relaxed line-clamp-2">
                            {role === "MEMBER"
                              ? "Baca artikel, blog, dan berinteraksi."
                              : role === "JURNALIS"
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
                  <div className="mt-8 space-y-3 sm:space-y-4 flex-1">
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

                    {/* <-- UPDATE: FormInput Password dengan fitur Show/Hide */}
                    <FormInput
                      icon={Lock}
                      label="Kata Sandi"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Minimal 8 karakter"
                      value={formData.password}
                      onChange={handleInputChange}
                      rightIcon={showPassword ? EyeOff : Eye}
                      onRightIconClick={() => setShowPassword(!showPassword)}
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
