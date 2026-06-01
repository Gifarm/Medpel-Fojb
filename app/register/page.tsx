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
  ArrowRight,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

const COLORS = {
  primary: "#FCC200",
  primarySoft: "#FDCE33",
  primaryLight: "#FDD85C",
  blueDark: "#233982",
  blue: "#4F619B",
  blueLight: "#7281AF",
  black: "#1B1B1B",
  gray: "#C4C4C4",
  white: "#FFFFFF",
};

// 1. Interface didefinisikan di luar komponen
interface FormInputProps {
  icon: React.ElementType;
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => void;
}

// 2. Komponen FormInput didefinisikan DI LUAR komponen App
const FormInput = ({
  icon: Icon,
  label,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
}: FormInputProps) => (
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
        className="w-full bg-[#FFFFFF] text-[#1B1B1B] border-2 border-[#F8FAF9] rounded-2xl py-3.5 pl-12 pr-4 text-sm font-medium 
                   focus:bg-[#FFFEF5] focus:border-[#FCC200] focus:ring-4 focus:ring-[#FCC200]/10 outline-none transition-all duration-300 placeholder:text-[#C4C4C4]"
      />
    </div>
  </div>
);

// 3. Komponen utama App
const App = () => {
  const [roleSelection, setRoleSelection] = useState<
    "user" | "jurnalis" | null
  >(null);
  const [step, setStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    school: "",
    roleDetail: "",
    password: "",
    confirmPassword: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep(4);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFFEF5] via-[#FFFFFF] to-[#F0F4FF] flex items-center justify-center p-4 md:p-8 font-sans overflow-hidden relative">
      {/* Soft Background Ornaments */}
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-[#FCC200]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-[#4F619B]/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-[40%] left-[20%] w-[300px] h-[300px] bg-[#7281AF]/5 rounded-full blur-[80px] pointer-events-none" />

      <div className="w-full max-w-[1100px] bg-[#FFFFFF]/80 backdrop-blur-xl rounded-[3rem] shadow-[0_40px_100px_-20px_rgba(35,57,130,0.1)] border border-[#FFFFFF] flex overflow-hidden relative z-10 min-h-[700px]">
        {/* --- LEFT SIDE: Clean Branding --- */}
        <div className="hidden lg:flex w-[40%] bg-[#FFFFFF] p-12 flex-col justify-between relative overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-gradient-to-br from-[#FCC200]/20 to-[#FDCE33]/10 rounded-full blur-[60px]" />
          <div className="absolute bottom-20 left-10 w-[150px] h-[150px] bg-gradient-to-tr from-[#4F619B]/10 to-transparent rounded-full blur-[40px]" />

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-8">
              <div>
                <h1 className="text-[#233982] font-bold text-2xl tracking-tight">
                  MedPel
                </h1>
                <p className="text-[#C4C4C4] text-[10px] font-bold uppercase tracking-widest">
                  Journalism Platform
                </p>
              </div>
            </div>

            {step === 0 ? (
              <div className="space-y-6 mt-12">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#FCC200]/10 rounded-full">
                  <span className="text-[11px] font-bold text-[#233982] uppercase tracking-wide">
                    Start Your Journey
                  </span>
                </div>
                <h2 className="text-[#1B1B1B] text-4xl font-black leading-tight">
                  Bergabung dengan{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FCC200] to-[#FDCE33]">
                    Komunitas
                  </span>{" "}
                  Jurnalis Muda
                </h2>
                <p className="text-[#6B7280] text-sm leading-relaxed">
                  Wujudkan passion menulis dan karyamu dibaca oleh ribuan siswa
                  di seluruh Indonesia.
                </p>
              </div>
            ) : (
              <div className="space-y-6 mt-12">
                <h2 className="text-[#1B1B1B] text-2xl font-black leading-tight">
                  Lengkapi Data{" "}
                  <span className="text-[#FCC200]">Pendaftaran</span>
                </h2>
                <div className="space-y-4">
                  {[
                    { s: 1, t: "Informasi Dasar" },
                    {
                      s: 2,
                      t:
                        roleSelection === "jurnalis"
                          ? "Detail Sekolah"
                          : "Minat Bacaan",
                    },
                    { s: 3, t: "Keamanan Akun" },
                  ].map((item) => (
                    <div key={item.s} className="flex items-center gap-4">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center border-2 font-bold text-xs transition-all duration-500
                          ${
                            step >= item.s
                              ? "bg-gradient-to-br from-[#FCC200] to-[#FDCE33] border-[#FCC200] text-[#233982] shadow-lg shadow-[#FCC200]/30"
                              : "border-[#C4C4C4]/30 text-[#C4C4C4] bg-[#F8FAF9]"
                          }`}
                      >
                        {step > item.s ? (
                          <CheckCircle2 size={16} strokeWidth={3} />
                        ) : (
                          item.s
                        )}
                      </div>
                      <p
                        className={`text-sm font-bold transition-colors duration-300 ${step >= item.s ? "text-[#233982]" : "text-[#C4C4C4]"}`}
                      >
                        {item.t}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="relative z-10">
            <div className="p-6 bg-gradient-to-br from-[#F8FAF9] to-[#F0F4FF] rounded-3xl border border-[#FFFFFF] shadow-sm">
              {/* Placeholder for quote/testimonial */}
            </div>
          </div>
        </div>

        {/* --- RIGHT SIDE: Form Handler --- */}
        <div className="w-full lg:w-[60%] p-8 md:p-12 flex flex-col bg-[#FFFFFF]/50">
          <AnimatePresence mode="wait">
            {/* STEP 0: Role Selection */}
            {step === 0 && (
              <motion.div
                key="role-select"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex-1 flex flex-col justify-center"
              >
                <div className="mb-10">
                  <h3 className="text-3xl md:text-4xl font-black text-[#1B1B1B] tracking-tight mb-3">
                    Pilih Peran Anda
                  </h3>
                  <p className="text-[#6B7280] text-sm">
                    Tentukan bagaimana Anda ingin berpartisipasi di MedPel.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {(["user", "jurnalis"] as const).map((role) => (
                    <button
                      key={role}
                      onClick={() => handleRoleSelect(role)}
                      className="group flex items-center gap-5 p-6 rounded-3xl border-2 border-[#F8FAF9] hover:border-[#FCC200]/40 bg-[#FFFFFF] hover:bg-[#FFFEF5] transition-all duration-300 text-left hover:shadow-xl hover:shadow-[#FCC200]/5 hover:-translate-y-1"
                    >
                      <div
                        className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 ${role === "user" ? "bg-gradient-to-br from-[#4F619B]/10 to-[#7281AF]/10 text-[#4F619B]" : "bg-gradient-to-br from-[#FCC200]/30 to-[#FDCE33]/20 text-[#233982]"}`}
                      >
                        {role === "user" ? (
                          <BookOpen size={26} />
                        ) : (
                          <PenTool size={26} />
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-[#1B1B1B] text-lg">
                          {role === "user" ? "Pembaca" : "Jurnalis Siswa"}
                        </h4>
                        <p className="text-xs text-[#6B7280] mt-1 leading-relaxed">
                          {role === "user"
                            ? "Baca artikel, blog, dan berinteraksi melalui komentar."
                            : "Tulis artikel, unggah karya, dan bangun portofolio."}
                        </p>
                      </div>
                      <ArrowRight
                        className="text-[#C4C4C4] group-hover:text-[#FCC200] group-hover:translate-x-1 transition-all duration-300"
                        size={22}
                      />
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* STEP 1: Basic Info */}
            {step === 1 && (
              <motion.form
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8 flex-1"
                onSubmit={(e) => e.preventDefault()} // Prevent default reload
              >
                <div>
                  <button
                    type="button"
                    onClick={prevStep}
                    className="flex items-center gap-2 text-xs font-bold text-[#C4C4C4] hover:text-[#4F619B] mb-6 uppercase tracking-widest transition-colors"
                  >
                    <ChevronLeft size={14} /> Kembali
                  </button>
                  <h3 className="text-3xl font-black text-[#1B1B1B] mb-2">
                    Informasi Dasar
                  </h3>
                  <p className="text-[#6B7280] text-sm">
                    Daftar sebagai{" "}
                    <span className="font-bold text-[#FCC200] uppercase">
                      {roleSelection === "user" ? "Pembaca" : "Jurnalis"}
                    </span>
                  </p>
                </div>

                <div className="space-y-5">
                  <FormInput
                    icon={User}
                    label="Nama Lengkap"
                    name="fullName"
                    placeholder="Budi Santoso"
                    value={formData.fullName}
                    onChange={handleInputChange}
                  />
                  <FormInput
                    icon={Mail}
                    label="Email Aktif"
                    name="email"
                    type="email"
                    placeholder="budi@sekolah.sch.id"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="pt-6">
                  <button
                    type="button"
                    onClick={nextStep}
                    className="w-full bg-gradient-to-r from-[#FCC200] to-[#FDCE33] hover:from-[#FDD85C] hover:to-[#FCC200] text-[#233982] font-black py-4 rounded-2xl shadow-lg shadow-[#FCC200]/25 transition-all duration-300 flex items-center justify-center gap-2 group active:scale-[0.98]"
                  >
                    LANJUTKAN{" "}
                    <ChevronRight
                      size={18}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </button>
                </div>
              </motion.form>
            )}

            {/* STEP 2: Role Specific Detail */}
            {step === 2 && (
              <motion.form
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8 flex-1"
                onSubmit={(e) => e.preventDefault()}
              >
                <div>
                  <button
                    type="button"
                    onClick={prevStep}
                    className="flex items-center gap-2 text-xs font-bold text-[#C4C4C4] hover:text-[#4F619B] mb-6 uppercase tracking-widest transition-colors"
                  >
                    <ChevronLeft size={14} /> Kembali
                  </button>
                  <h3 className="text-3xl font-black text-[#1B1B1B] mb-2">
                    {roleSelection === "jurnalis"
                      ? "Detail Sekolah"
                      : "Minat Bacaan"}
                  </h3>
                  <p className="text-[#6B7280] text-sm">
                    Personalisasi pengalaman Anda di MedPel.
                  </p>
                </div>

                <div className="space-y-5">
                  {roleSelection === "jurnalis" ? (
                    <>
                      <FormInput
                        icon={School}
                        label="Nama Sekolah"
                        name="school"
                        placeholder="SMA Negeri 1 Jakarta"
                        value={formData.school}
                        onChange={handleInputChange}
                      />
                      <div className="space-y-2">
                        <label className="text-[11px] font-bold text-[#233982] uppercase tracking-wider ml-1">
                          Peran dalam Redaksi
                        </label>
                        <div className="relative group">
                          <select
                            name="roleDetail"
                            value={formData.roleDetail}
                            onChange={handleInputChange}
                            className="w-full bg-[#FFFFFF] text-[#1B1B1B] border-2 border-[#F8FAF9] rounded-2xl py-3.5 px-4 text-sm font-medium appearance-none focus:bg-[#FFFEF5] focus:border-[#FCC200] focus:ring-4 focus:ring-[#FCC200]/10 outline-none transition-all duration-300 cursor-pointer"
                          >
                            <option value="">Pilih Peran...</option>
                            <option value="jurnalis">Jurnalis Siswa</option>
                            <option value="editor">Editor Konten</option>
                            <option value="fotografer">Fotografer</option>
                          </select>
                          <ChevronRight
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#C4C4C4] rotate-90 pointer-events-none"
                            size={18}
                          />
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="space-y-3">
                      <label className="text-[11px] font-bold text-[#233982] uppercase tracking-wider ml-1">
                        Topik yang Disukai
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          "Opini",
                          "Event Sekolah",
                          "Sains & Teknologi",
                          "Sastra & Seni",
                          "Tips Siswa",
                          "Berita Utama",
                        ].map((topic) => (
                          <button
                            key={topic}
                            type="button"
                            className="px-4 py-3 rounded-xl border-2 border-[#F8FAF9] text-xs font-bold text-[#6B7280] hover:border-[#FCC200]/40 hover:bg-[#FFFEF5] hover:text-[#233982] transition-all duration-300 text-left"
                          >
                            {topic}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-6 flex gap-4">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="flex-1 border-2 border-[#F8FAF9] text-[#6B7280] font-bold py-4 rounded-2xl hover:bg-[#F8FAF9] hover:text-[#1B1B1B] transition-all active:scale-[0.98]"
                  >
                    KEMBALI
                  </button>
                  <button
                    type="button"
                    onClick={nextStep}
                    className="flex-[2] bg-gradient-to-r from-[#233982] to-[#4F619B] hover:from-[#4F619B] hover:to-[#7281AF] text-[#FFFFFF] font-bold py-4 rounded-2xl shadow-lg shadow-[#233982]/20 transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
                  >
                    KEAMANAN <ChevronRight size={18} />
                  </button>
                </div>
              </motion.form>
            )}

            {/* STEP 3: Security */}
            {step === 3 && (
              <motion.form
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleSubmit}
                className="space-y-8 flex-1"
              >
                <div>
                  <button
                    type="button"
                    onClick={prevStep}
                    className="flex items-center gap-2 text-xs font-bold text-[#C4C4C4] hover:text-[#4F619B] mb-6 uppercase tracking-widest transition-colors"
                  >
                    <ChevronLeft size={14} /> Kembali
                  </button>
                  <h3 className="text-3xl font-black text-[#1B1B1B] mb-2">
                    Keamanan Akun
                  </h3>
                  <p className="text-[#6B7280] text-sm">
                    Buat kata sandi yang kuat untuk melindungi akun Anda.
                  </p>
                </div>

                <div className="space-y-5">
                  <FormInput
                    icon={Lock}
                    label="Kata Sandi"
                    name="password"
                    type="password"
                    placeholder="Minimal 8 karakter"
                    value={formData.password}
                    onChange={handleInputChange}
                  />
                  <FormInput
                    icon={ShieldCheck}
                    label="Konfirmasi Kata Sandi"
                    name="confirmPassword"
                    type="password"
                    placeholder="Ulangi kata sandi"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="pt-6 flex gap-4">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="flex-1 border-2 border-[#F8FAF9] text-[#6B7280] font-bold py-4 rounded-2xl hover:bg-[#F8FAF9] hover:text-[#1B1B1B] transition-all active:scale-[0.98]"
                  >
                    BALIK
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-[2] bg-gradient-to-r from-[#FCC200] to-[#FDCE33] hover:from-[#FDD85C] hover:to-[#FCC200] disabled:opacity-70 disabled:cursor-not-allowed text-[#233982] font-black py-4 rounded-2xl shadow-lg shadow-[#FCC200]/25 transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
                  >
                    {isLoading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          repeat: Infinity,
                          duration: 1,
                          ease: "linear",
                        }}
                        className="w-5 h-5 border-2 border-[#233982]/30 border-t-[#233982] rounded-full"
                      />
                    ) : (
                      <>
                        SELESAIKAN <CheckCircle2 size={18} />
                      </>
                    )}
                  </button>
                </div>
              </motion.form>
            )}

            {/* STEP 4: Success */}
            {step === 4 && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex-1 flex flex-col items-center justify-center text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className="w-28 h-28 bg-gradient-to-br from-[#FCC200] to-[#FDCE33] rounded-full flex items-center justify-center mb-8 relative shadow-2xl shadow-[#FCC200]/40"
                >
                  <div className="absolute inset-0 bg-[#FCC200] rounded-full animate-ping opacity-20" />
                  <CheckCircle2
                    size={52}
                    strokeWidth={2.5}
                    className="text-[#233982]"
                  />
                </motion.div>

                <h3 className="text-3xl font-black text-[#1B1B1B] mb-3">
                  Pendaftaran Berhasil!
                </h3>
                <p className="text-[#6B7280] text-sm max-w-sm leading-relaxed mb-10">
                  {roleSelection === "jurnalis"
                    ? "Akun Jurnalis sedang ditinjau. Cek email untuk notifikasi aktivasi."
                    : "Akun Pembaca aktif! Mulai jelajahi ribuan artikel menarik."}
                </p>

                <a
                  href="/login"
                  className="px-10 py-4 bg-gradient-to-r from-[#233982] to-[#4F619B] hover:from-[#4F619B] hover:to-[#7281AF] text-[#FFFFFF] font-bold rounded-2xl shadow-lg shadow-[#233982]/20 hover:translate-y-[-2px] transition-all duration-300 active:scale-[0.98]"
                >
                  MASUK
                </a>
              </motion.div>
            )}
          </AnimatePresence>

          {step < 4 && (
            <div className="mt-auto pt-8 text-center border-t border-[#F8FAF9]">
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
