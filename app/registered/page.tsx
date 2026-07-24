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
} from "lucide-react";

// --- UI Components Helper (Agar tombol Google & Input tetap rapi) ---
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
        className="w-full bg-[#FFFFFF] text-[#1B1B1B] border-2 border-[#F8FAF9] rounded-2xl py-3.5 pl-12 pr-4 text-sm font-medium 
                   focus:bg-[#FFFEF5] focus:border-[#FCC200] focus:ring-4 focus:ring-[#FCC200]/10 outline-none transition-all duration-300 placeholder:text-[#C4C4C4]"
      />
    </div>
  </div>
);

// --- Main Component ---
const App = () => {
  const [roleSelection, setRoleSelection] = useState<
    "user" | "jurnalis" | null
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

  const handleRoleSelect = (role: "user" | "jurnalis") => {
    setRoleSelection(role);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulasi proses register
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFFEF5] via-[#FFFFFF] to-[#F0F4FF] flex items-center justify-center p-4 md:p-8 font-sans overflow-hidden relative">
      {/* Background Ornaments */}
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-[#FCC200]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-[#4F619B]/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-[1100px] bg-[#FFFFFF]/90 backdrop-blur-xl rounded-[3rem] shadow-[0_40px_100px_-20px_rgba(35,57,130,0.1)] border border-[#FFFFFF] flex overflow-hidden relative z-10 min-h-[700px]">
        {/* --- LEFT SIDE: Image / Branding (Seperti Request) --- */}
        <div className="hidden lg:flex w-[45%] relative overflow-hidden bg-[#233982]">
          {/* Ganti URL ini dengan gambar yang diinginkan */}
          <div
            className="absolute inset-0 bg-cover bg-center opacity-80 mix-blend-overlay transition-all duration-700"
            style={{
              backgroundImage: `url('ganteng.jpeg')`,
            }}
          />

          {/* Gradient Overlay agar teks terbaca */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#233982] via-[#233982]/80 to-transparent opacity-90" />

          <div className="relative z-10 flex flex-col justify-end p-12 h-full text-white">
            <div className="mb-auto pt-8">
              <h1 className="text-[#FCC200] font-bold text-3xl tracking-tight mb-2">
                MedPel
              </h1>
              <p className="text-white/80 text-xs font-bold uppercase tracking-widest">
                Journalism Platform
              </p>
            </div>

            <div className="space-y-6">
              <h2 className="text-4xl font-black leading-tight">
                Mulai Cerita <br />
                <span className="text-[#FCC200]">Anda Hari Ini.</span>
              </h2>
              <p className="text-white/70 text-sm leading-relaxed max-w-md">
                Bergabunglah dengan ribuan pelajar lainnya. Bagikan ide, tulis
                berita, dan bangun portofolio jurnalistikmu bersama kami.
              </p>
            </div>
          </div>
        </div>

        {/* --- RIGHT SIDE: Form Handler --- */}
        <div className="w-full lg:w-[55%] p-8 md:p-12 flex flex-col bg-[#FFFFFF]">
          <AnimatePresence mode="wait">
            {/* SUCCESS STATE */}
            {isSuccess ? (
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
                  className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 relative"
                >
                  <CheckCircle2 size={48} className="text-green-600" />
                </motion.div>
                <h3 className="text-2xl font-black text-[#1B1B1B] mb-2">
                  Pendaftaran Berhasil!
                </h3>
                <p className="text-[#6B7280] text-sm max-w-sm mb-8">
                  Akun Anda sebagai{" "}
                  <span className="font-bold text-[#233982]">
                    {roleSelection === "jurnalis" ? "Jurnalis" : "Member"}
                  </span>{" "}
                  telah dibuat.
                </p>
                <a
                  href="/login"
                  className="w-full max-w-xs bg-[#233982] text-white font-bold py-3 rounded-xl hover:bg-[#4F619B] transition-colors"
                >
                  MASUK SEKARANG
                </a>
              </motion.div>
            ) : !roleSelection ? (
              /* STEP 0: ROLE SELECTION */
              <motion.div
                key="role-select"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex-1 flex flex-col justify-center"
              >
                <div className="mb-10">
                  <h3 className="text-3xl font-black text-[#1B1B1B] tracking-tight mb-3">
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
                          {role === "user"
                            ? "Member Pembaca"
                            : "Jurnalis Pelajar"}
                        </h4>
                        <p className="text-xs text-[#6B7280] mt-1 leading-relaxed">
                          {role === "user"
                            ? "Baca artikel, blog, dan berinteraksi."
                            : "Tulis artikel, unggah karya, bangun portofolio."}
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
            ) : (
              /* STEP 1: REGISTER FORM (Langsung muncul setelah pilih role) */
              <motion.form
                key="register-form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleSubmit}
                className="space-y-6 flex-1 flex flex-col justify-center"
              >
                <div>
                  <button
                    type="button"
                    onClick={() => setRoleSelection(null)}
                    className="flex items-center gap-2 text-xs font-bold text-[#C4C4C4] hover:text-[#4F619B] mb-4 uppercase tracking-widest transition-colors"
                  >
                    Kembali
                  </button>
                  <h3 className="text-3xl font-black text-[#1B1B1B] mb-2">
                    Buat Akun
                  </h3>
                  <p className="text-[#6B7280] text-sm">
                    Daftar sebagai{" "}
                    <span className="font-bold text-[#FCC200] uppercase">
                      {roleSelection === "user" ? "Member" : "Jurnalis"}
                    </span>
                  </p>
                </div>

                <div className="space-y-4">
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

                <div className="pt-2 space-y-4">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-[#233982] to-[#4F619B] hover:from-[#4F619B] hover:to-[#7281AF] text-[#FFFFFF] font-bold py-4 rounded-2xl shadow-lg shadow-[#233982]/20 transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
                  >
                    {isLoading ? "Memproses..." : "Daftar Sekarang"}
                  </button>

                  {/* Divider */}
                  <div className="relative flex items-center justify-center">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-gray-200"></span>
                    </div>
                    <div className="relative bg-white px-4 text-xs text-gray-400 uppercase font-bold tracking-wider">
                      Atau lanjutkan dengan
                    </div>
                  </div>

                  {/* Google Button */}
                  <button
                    type="button"
                    className="w-full flex items-center justify-center gap-3 bg-white border-2 border-[#F8FAF9] hover:bg-gray-50 text-[#1B1B1B] font-bold py-3.5 rounded-2xl transition-all duration-300"
                  >
                    <img
                      src="https://www.svgrepo.com/show/475656/google-color.svg"
                      alt="Google"
                      className="w-5 h-5"
                    />
                    <span className="text-sm">Lanjutkan dengan Google</span>
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>

          {!isSuccess && (
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
