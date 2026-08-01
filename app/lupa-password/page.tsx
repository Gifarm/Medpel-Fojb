/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, CheckCircle2, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

// --- UI Components Helper (Sama persis dengan Login/Register) ---
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
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error("Email wajib diisi");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Gagal memproses permintaan");
      }

      // Tampilkan toast sukses
      toast.success(data.message);
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
        <div className="p-6 sm:p-10 flex-1 flex flex-col">
          {/* Branding Header */}
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
          <div className="flex-1 relative min-h-[380px] sm:min-h-[400px]">
            <AnimatePresence mode="wait">
              {isSuccess ? (
                // SUCCESS STATE
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
                    className="w-20 h-20 sm:w-24 sm:h-24 bg-[#233982]/10 rounded-full flex items-center justify-center mb-6"
                  >
                    <Mail
                      size={40}
                      className="sm:w-12 sm:h-12 text-[#233982]"
                    />
                  </motion.div>
                  <h3 className="text-xl sm:text-2xl font-black text-[#1B1B1B] mb-2">
                    Cek Email Anda!
                  </h3>
                  <p className="text-[#6B7280] text-sm max-w-xs mb-8 leading-relaxed">
                    Jika email tersebut terdaftar, kami telah mengirimkan
                    password baru ke inbox Anda.
                    <br />
                    <span className="text-xs text-[#FCC200] font-bold mt-2 block">
                      (Jangan lupa cek folder Spam/Junk)
                    </span>
                  </p>
                  <button
                    onClick={() => router.push("/login")}
                    className="w-full max-w-xs bg-[#233982] text-white font-bold py-3.5 rounded-2xl hover:bg-[#4F619B] transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                  >
                    <ArrowLeft size={18} />
                    KEMBALI KE LOGIN
                  </button>
                </motion.div>
              ) : (
                // FORM STATE
                <motion.form
                  key="forgot-form"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={handleSubmit}
                  className="absolute inset-0 flex flex-col"
                >
                  <div className="mb-6 sm:mb-8 text-center">
                    <p className="text-[#6B7280] text-xs sm:text-sm">
                      Masukkan email yang terdaftar. Kami akan mengirimkan
                      password baru secara acak ke email Anda.
                    </p>
                  </div>

                  <div className="space-y-4 flex-1">
                    <FormInput
                      icon={Mail}
                      label="Email Terdaftar"
                      name="email"
                      type="email"
                      placeholder="contoh@email.com"
                      value={email}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setEmail(e.target.value)
                      }
                    />
                  </div>

                  <div className="pt-4 sm:pt-6 space-y-3">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-[#233982] to-[#4F619B] hover:from-[#4F619B] hover:to-[#7281AF] text-[#FFFFFF] font-bold py-3.5 rounded-2xl shadow-lg shadow-[#233982]/20 transition-all flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isLoading ? "Mengirim..." : "Kirim Password Baru"}
                    </button>

                    <button
                      type="button"
                      onClick={() => router.push("/login")}
                      className="w-full bg-[#F8FAF9] hover:bg-[#F1F5F9] text-[#4F619B] font-bold py-3.5 rounded-2xl transition-all flex items-center justify-center gap-2 active:scale-[0.98] border-2 border-[#d0d2d1] hover:border-[#4F619B]/20"
                    >
                      <ArrowLeft size={18} />
                      <span className="text-sm">Kembali ke Login</span>
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>

          {/* Footer */}
          {!isSuccess && (
            <div className="relative z-20 mt-6 sm:mt-5 text-center border-t border-[#F8FAF9] pt-6">
              <p className="text-xs text-[#6B7280] font-bold">
                Ingat password Anda?{" "}
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
