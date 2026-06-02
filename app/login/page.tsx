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
  CheckCircle2,
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

interface FormInputProps {
  icon: React.ElementType;
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  rightElement?: React.ReactNode;
}

// Komponen FormInput didefinisikan DI LUAR komponen App untuk mencegah error re-render
const FormInput = ({
  icon: Icon,
  label,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  rightElement,
}: FormInputProps) => (
  <div className="space-y-2">
    <label
      htmlFor={name}
      className="text-[11px] font-bold text-[#233982] uppercase tracking-wider ml-1"
    >
      {label}
    </label>
    <div className="relative group">
      <Icon
        className="absolute left-4 top-1/2 -translate-y-1/2 text-[#C4C4C4] group-focus-within:text-[#FCC200] transition-colors duration-300"
        size={18}
      />
      <input
        id={name}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full bg-[#FFFFFF] text-[#1B1B1B] pl-10 border-2 border-[#F8FAF9] rounded-2xl py-3.5 text-sm font-medium 
                   focus:bg-[#FFFEF5] focus:border-[#FCC200] focus:ring-4 focus:ring-[#FCC200]/10 outline-none transition-all duration-300 placeholder:text-[#C4C4C4]
                   ${rightElement ? "pr-12" : "pr-4"}`}
      />
      {rightElement && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2">
          {rightElement}
        </div>
      )}
    </div>
  </div>
);

const App = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulasi proses login (ganti dengan API call sesungguhnya)
    setTimeout(() => {
      setIsLoading(false);
      // router.push('/dashboard'); // Contoh redirect
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFFEF5] via-[#FFFFFF] to-[#F0F4FF] flex items-center justify-center p-4 md:p-8 font-sans overflow-hidden relative">
      {/* Soft Background Ornaments */}
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-[#FCC200]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-[#4F619B]/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-[40%] left-[20%] w-[300px] h-[300px] bg-[#7281AF]/5 rounded-full blur-[80px] pointer-events-none" />

      <div className="w-full max-w-[1100px] bg-[#FFFFFF]/80 backdrop-blur-xl rounded-[3rem] shadow-[0_40px_100px_-20px_rgba(35,57,130,0.1)] border border-[#FFFFFF] flex overflow-hidden relative z-10 min-h-[650px]">
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

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-6 mt-12"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#FCC200]/10 rounded-full">
                {/* <Sparkles size={16} className="text-[#FCC200]" /> */}
                <span className="text-[11px] font-bold text-[#233982] uppercase tracking-wide">
                  Secure Access
                </span>
              </div>
              <h2 className="text-[#1B1B1B] text-4xl font-black leading-tight">
                Selamat Datang <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FCC200] to-[#FDCE33]">
                  Kembali
                </span>
              </h2>
              <p className="text-[#6B7280] text-sm leading-relaxed max-w-xs">
                Masuk ke ekosistem jurnalisme sekolah paling canggih. Kelola
                konten, kolaborasi, dan publikasi dalam satu pintu yang aman.
              </p>
            </motion.div>
          </div>

          <div className="relative z-10">
            <div className="p-6 bg-gradient-to-br from-[#F8FAF9] to-[#F0F4FF] rounded-3xl border border-[#FFFFFF] shadow-sm flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FCC200] to-[#FDCE33] flex items-center justify-center flex-shrink-0 shadow-lg shadow-[#FCC200]/20">
                <ShieldCheck size={20} className="text-[#233982]" />
              </div>
              <div>
                <p className="text-[#233982] text-xs font-black mb-1">
                  Enkripsi End-to-End
                </p>
                <p className="text-[#6B7280] text-[11px] leading-relaxed">
                  Data kredensial Anda dilindungi dengan standar keamanan
                  industri terkini.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* --- RIGHT SIDE: Login Form --- */}
        <div className="w-full lg:w-[60%] p-8 md:p-12 flex flex-col bg-[#FFFFFF]/50 justify-center">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md mx-auto"
          >
            <div className="mb-10 text-center lg:text-left">
              <h3 className="text-3xl font-black text-[#1B1B1B] mb-2">
                Masuk ke Akun
              </h3>
              <p className="text-[#6B7280] text-sm">
                Silakan masukkan kredensial MedPel Anda untuk melanjutkan.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <FormInput
                icon={Mail}
                label="Alamat Email"
                name="email"
                type="email"
                placeholder="nama@sekolah.sch.id"
                value={formData.email}
                onChange={handleInputChange}
              />

              <FormInput
                icon={Lock}
                label="Kata Sandi"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={formData.password}
                onChange={handleInputChange}
                rightElement={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[#C4C4C4] hover:text-[#233982] transition-colors duration-300 focus:outline-none"
                    aria-label={
                      showPassword
                        ? "Sembunyikan kata sandi"
                        : "Tampilkan kata sandi"
                    }
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                }
              />

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative flex items-center justify-center">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="peer appearance-none w-5 h-5 border-2 border-[#F8FAF9] rounded-lg checked:bg-[#FCC200] checked:border-[#FCC200] transition-all cursor-pointer"
                    />
                    <CheckCircle2
                      className="absolute text-[#233982] opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none"
                      size={14}
                      strokeWidth={3}
                    />
                  </div>
                  <span className="text-xs font-bold text-[#6B7280] group-hover:text-[#233982] transition-colors">
                    Ingat saya
                  </span>
                </label>

                <a
                  href="/forgot-password"
                  className="text-xs font-bold text-[#4F619B] hover:text-[#233982] hover:underline underline-offset-4 transition-colors"
                >
                  Lupa Kata Sandi?
                </a>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-[#FCC200] to-[#FDCE33] hover:from-[#FDD85C] hover:to-[#FCC200] disabled:opacity-70 disabled:cursor-not-allowed text-[#233982] font-black py-4 rounded-2xl shadow-lg shadow-[#FCC200]/25 transition-all duration-300 flex items-center justify-center gap-2 group active:scale-[0.98]"
                >
                  <AnimatePresence mode="wait">
                    {isLoading ? (
                      <motion.div
                        key="loader"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="w-5 h-5 border-2 border-[#233982]/30 border-t-[#233982] rounded-full animate-spin"
                      />
                    ) : (
                      <motion.div
                        key="text"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-2"
                      >
                        MASUK SEKARANG
                        <ArrowRight
                          size={18}
                          className="group-hover:translate-x-1 transition-transform"
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
              </div>
            </form>

            {/* Footer Link */}
            <div className="mt-10 pt-8 text-center border-t border-[#F8FAF9]">
              <p className="text-xs text-[#6B7280] font-bold">
                Belum punya akun?{" "}
                <a
                  href="/register"
                  className="text-[#FCC200] hover:text-[#233982] hover:underline underline-offset-4 transition-colors font-bold"
                >
                  Daftar Jurnalis di sini
                </a>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default App;
