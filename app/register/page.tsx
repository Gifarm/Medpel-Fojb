"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Mail,
  Lock,
  School,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  BookOpen,
  PenTool,
  Sparkles,
  ArrowRight,
} from "lucide-react";

const COLORS = {
  primary: "#12a44d",
  secondary: "#d7dd21",
  navy: "#2b529b",
  bg: "#fefefe",
};

const App = () => {
  const [roleSelection, setRoleSelection] = useState<
    "user" | "jurnalis" | null
  >(null);
  const [step, setStep] = useState(0); // 0 is selection, 1+ is form
  const [isLoading, setIsLoading] = useState(false);
  type FormDataType = {
    fullName: string;
    email: string;
    school: string;
    password: string;
    confirmPassword: string;
  };

  const [formData, setFormData] = useState<FormDataType>({
    fullName: "",
    email: "",
    school: "",
    password: "",
    confirmPassword: "",
  });

  const handleRoleSelect = (role: "user" | "jurnalis") => {
    setRoleSelection(role);
    setStep(1);
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => {
    if (step === 1) {
      setStep(0);
      setRoleSelection(null);
    } else {
      setStep(step - 1);
    }
  };

  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep(4); // Success Step
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#fefefe] flex items-center justify-center p-6 font-sans overflow-hidden relative">
      {/* Background Ornaments */}
      <div className="absolute top-[-10%] left-[-10%] w-[45%] h-[45%] bg-[#12a44d]/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-5%] right-[-5%] w-[35%] h-[35%] bg-[#d7dd21]/10 rounded-full blur-[100px]" />

      <div className="w-full max-w-[1100px] bg-white rounded-[2.5rem] shadow-[0_20px_80px_rgba(0,0,0,0.06)] border border-gray-50 flex overflow-hidden relative z-10 min-h-[700px]">
        {/* Left Side: Branding & Progress */}
        <div className="hidden lg:flex w-[40%] bg-gradient-to-br from-[#12a44d] to-[#2b529b] p-12 flex-col justify-between relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div
              className="absolute top-0 left-0 w-full h-full"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
                backgroundSize: "30px 30px",
              }}
            />
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-12">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-[#12a44d] font-black text-xl">M</span>
              </div>
              <h1 className="text-white font-bold text-2xl tracking-tight">
                MedPel <span className="text-[#d7dd21]">Join</span>
              </h1>
            </div>

            <div className="space-y-8">
              {step === 0 ? (
                <div className="space-y-4">
                  <h2 className="text-white text-3xl font-black leading-tight">
                    Pilih Peranmu di Ekosistem MedPel
                  </h2>
                  <p className="text-white/60 text-sm italic">
                    Setiap suara berharga, baik sebagai penulis maupun pembaca.
                  </p>
                </div>
              ) : (
                [
                  { s: 1, t: "Informasi Dasar", d: "Identitas utama anda" },
                  {
                    s: 2,
                    t:
                      roleSelection === "jurnalis"
                        ? "Detail Sekolah"
                        : "Preferensi",
                    d: "Kustomisasi akun",
                  },
                  { s: 3, t: "Keamanan Akun", d: "Proteksi sandi" },
                ].map((item) => (
                  <div
                    key={item.s}
                    className="flex items-center gap-4 transition-all"
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center border-2 font-bold text-xs transition-all ${step >= item.s ? "bg-[#d7dd21] border-[#d7dd21] text-gray-900" : "border-white/20 text-white/40"}`}
                    >
                      {step > item.s ? <CheckCircle2 size={16} /> : item.s}
                    </div>
                    <div>
                      <p
                        className={`text-sm font-bold ${step >= item.s ? "text-white" : "text-white/40"}`}
                      >
                        {item.t}
                      </p>
                      <p className="text-[10px] text-white/50 uppercase font-black tracking-widest">
                        {item.d}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="relative z-10 p-6 bg-white/10 backdrop-blur-md rounded-[2rem] border border-white/20">
            <p className="text-white/90 text-[11px] italic leading-relaxed">
              {roleSelection === "jurnalis"
                ? "Sebagai Jurnalis, Anda memiliki akses untuk menerbitkan artikel dan menginspirasi ribuan siswa lainnya."
                : "Sebagai Pembaca, nikmati konten berkualitas dan dukung karya teman-teman jurnalis sekolahmu."}
            </p>
          </div>
        </div>

        {/* Right Side: Step Handler */}
        <div className="w-full lg:w-[60%] p-8 lg:px-16 lg:py-12 flex flex-col bg-white">
          <AnimatePresence mode="wait">
            {/* Step 0: Role Selection */}
            {step === 0 && (
              <motion.div
                key="role-select"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex-1 flex flex-col justify-center"
              >
                <div className="mb-10">
                  <h3 className="text-4xl font-black text-gray-800">
                    Daftar Akun
                  </h3>
                  <p className="text-gray-400 mt-2">
                    Pilih bagaimana Anda ingin berinteraksi dengan MedPel.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {/* Option User Biasa */}
                  <button
                    onClick={() => handleRoleSelect("user")}
                    className="group flex items-center gap-6 p-6 rounded-[2rem] border-2 border-gray-100 hover:border-[#12a44d]/30 hover:bg-green-50/30 transition-all text-left"
                  >
                    <div className="w-14 h-14 bg-blue-50 text-[#2b529b] rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <BookOpen size={28} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-800">
                        Pembaca (User Biasa)
                      </h4>
                      <p className="text-xs text-gray-400">
                        Hanya melihat artikel, blog, dan memberikan komentar.
                      </p>
                    </div>
                    <ArrowRight
                      className="text-gray-300 group-hover:text-[#12a44d] group-hover:translate-x-1 transition-all"
                      size={20}
                    />
                  </button>

                  {/* Option Jurnalis */}
                  <button
                    onClick={() => handleRoleSelect("jurnalis")}
                    className="group flex items-center gap-6 p-6 rounded-[2rem] border-2 border-gray-100 hover:border-[#d7dd21]/50 hover:bg-yellow-50/30 transition-all text-left"
                  >
                    <div className="w-14 h-14 bg-green-50 text-[#12a44d] rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <PenTool size={28} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-800">
                        Jurnalis Siswa
                      </h4>
                      <p className="text-xs text-gray-400">
                        Menulis artikel, mengunggah foto, dan berkontribusi
                        konten.
                      </p>
                    </div>
                    <ArrowRight
                      className="text-gray-300 group-hover:text-[#d7dd21] group-hover:translate-x-1 transition-all"
                      size={20}
                    />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 1: Basic Info */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8 flex-1"
              >
                <div>
                  <button
                    onClick={prevStep}
                    className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-gray-600 mb-6 uppercase tracking-widest"
                  >
                    <ChevronLeft size={14} /> Ganti Peran
                  </button>
                  <h3 className="text-3xl font-black text-gray-800">
                    Informasi Dasar
                  </h3>
                  <p className="text-gray-400 text-sm mt-2">
                    Daftar sebagai{" "}
                    <span className="font-bold text-[#12a44d] uppercase">
                      {roleSelection === "user" ? "Pembaca" : "Jurnalis"}
                    </span>
                  </p>
                </div>

                <div className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                      Nama Lengkap
                    </label>
                    <div className="relative group">
                      <User
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#12a44d] transition-colors"
                        size={18}
                      />
                      <input
                        type="text"
                        placeholder="Contoh: Budi Jurnalis"
                        className="w-full bg-gray-50 text-black border-2 border-gray-50 rounded-2xl py-4 pl-12 pr-4 text-sm focus:bg-white focus:border-[#12a44d]/20 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                      Email
                    </label>
                    <div className="relative group">
                      <Mail
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#12a44d] transition-colors"
                        size={18}
                      />
                      <input
                        type="email"
                        placeholder="email@sekolah.sch.id"
                        className="w-full bg-gray-50 border-2 text-black border-gray-50 rounded-2xl py-4 pl-12 pr-4 text-sm focus:bg-white focus:border-[#12a44d]/20 outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-8">
                  <button
                    onClick={nextStep}
                    className="w-full bg-[#12a44d] text-white font-black py-4 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 group"
                  >
                    LANJUTKAN <ChevronRight size={18} />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 2: Role Specific Detail */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8 flex-1"
              >
                <div>
                  <h3 className="text-3xl font-black text-gray-800">
                    {roleSelection === "jurnalis"
                      ? "Detail Sekolah"
                      : "Minat Bacaan"}
                  </h3>
                  <p className="text-gray-400 text-sm mt-2">
                    Berikan detail tambahan untuk personalisasi akunmu.
                  </p>
                </div>

                <div className="space-y-5">
                  {roleSelection === "jurnalis" ? (
                    <>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                          Nama Institusi / Sekolah
                        </label>
                        <div className="relative group">
                          <School
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#12a44d] transition-colors"
                            size={18}
                          />
                          <input
                            type="text"
                            placeholder="SMA Negeri 1 Jakarta"
                            className="w-full bg-gray-50 border-2 text-black border-gray-50 rounded-2xl py-4 pl-12 pr-4 text-sm focus:bg-white focus:border-[#12a44d]/20 outline-none transition-all"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                          Peran dalam Redaksi
                        </label>
                        <select className="w-full bg-gray-50 border-2 border-gray-50 rounded-2xl py-4 px-6 text-sm font-bold text-gray-600 outline-none">
                          <option>Jurnalis Siswa</option>
                          <option>Editor Konten</option>
                          <option>Fotografer</option>
                        </select>
                      </div>
                    </>
                  ) : (
                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                        Topik yang disukai
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          "Opini",
                          "Event Sekolah",
                          "Sains",
                          "Sastra",
                          "Tips Siswa",
                          "Berita Utama",
                        ].map((topic) => (
                          <button
                            key={topic}
                            className="px-4 py-3 rounded-xl border-2 border-gray-50 text-xs font-bold text-gray-500 hover:bg-gray-50 transition-all text-left"
                          >
                            {topic}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-8 flex gap-4">
                  <button
                    onClick={prevStep}
                    className="flex-1 border-2 border-gray-50 text-gray-400 font-black py-4 rounded-2xl hover:bg-gray-50"
                  >
                    KEMBALI
                  </button>
                  <button
                    onClick={nextStep}
                    className="flex-[2] bg-[#12a44d] text-white font-black py-4 rounded-2xl shadow-lg flex items-center justify-center gap-2"
                  >
                    KEAMANAN <ChevronRight size={18} />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Security */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8 flex-1"
              >
                <div>
                  <h3 className="text-3xl font-black text-gray-800">
                    Keamanan Akun
                  </h3>
                  <p className="text-gray-400 text-sm mt-2">
                    Buat sandi yang kuat untuk melindungi akun MedPel anda.
                  </p>
                </div>

                <div className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                      Kata Sandi
                    </label>
                    <div className="relative group">
                      <Lock
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#12a44d] transition-colors"
                        size={18}
                      />
                      <input
                        type="password"
                        placeholder="••••••••"
                        className="w-full bg-gray-50 border-2 text-black border-gray-50 rounded-2xl py-4 pl-12 pr-4 text-sm focus:bg-white focus:border-[#12a44d]/20 outline-none transition-all"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                      Konfirmasi Sandi
                    </label>
                    <div className="relative group">
                      <Lock
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#12a44d] transition-colors"
                        size={18}
                      />
                      <input
                        type="password"
                        placeholder="••••••••"
                        className="w-full bg-gray-50 border-2 text-black border-gray-50 rounded-2xl py-4 pl-12 pr-4 text-sm focus:bg-white focus:border-[#12a44d]/20 outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-8 flex gap-4">
                  <button
                    onClick={prevStep}
                    className="flex-1 border-2 border-gray-50 text-gray-400 font-black py-4 rounded-2xl hover:bg-gray-50 transition-all"
                  >
                    BALIK
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="flex-[2] bg-[#2b529b] text-white font-black py-4 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    {isLoading ? "MENDAFTARKAN..." : "SELESAIKAN DAFTAR"}
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 4: Success */}
            {step === 4 && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex-1 flex flex-col items-center justify-center text-center"
              >
                <div className="w-24 h-24 bg-green-100 text-[#12a44d] rounded-full flex items-center justify-center mb-6">
                  <CheckCircle2 size={48} />
                </div>
                <h3 className="text-3xl font-black text-gray-800">
                  Hore! Berhasil Daftar.
                </h3>
                <p className="text-gray-400 text-sm mt-4 max-w-sm">
                  {roleSelection === "jurnalis"
                    ? "Akun Jurnalis sedang ditinjau. Tunggu email aktivasi ya!"
                    : "Akun Pembaca aktif! Silakan login untuk mulai menjelajahi artikel."}
                </p>
                <button className="mt-10 px-12 py-4 bg-[#12a44d] text-white font-black rounded-2xl shadow-lg hover:translate-y-[-2px] transition-all">
                  LOGIN SEKARANG
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {step < 4 && (
            <div className="mt-auto pt-8 text-center border-t border-gray-50">
              <p className="text-xs text-gray-400 font-bold">
                Sudah jadi member?{" "}
                <a href="/login" className="text-[#12a44d] hover:underline">
                  Masuk Disini
                </a>
              </p>
            </div>
          )}
        </div>
      </div>

      {/* <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-20 right-20 text-[#d7dd21]/20 hidden lg:block"
      >
        <Sparkles size={60} />
      </motion.div> */}
    </div>
  );
};

export default App;
