/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2, RefreshCw } from "lucide-react";
import toast from "react-hot-toast"; // <-- TAMBAHKAN IMPORT INI

// --- OTP Box Component ---
const OtpBox = ({
  value,
  index,
  onChange,
  onBackspace,
  inputRef,
}: {
  value: string;
  index: number;
  onChange: (val: string) => void;
  onBackspace: () => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "");
    if (val.length <= 1) {
      onChange(val);
      if (val && inputRef.current?.nextElementSibling) {
        const nextInput = inputRef.current
          .nextElementSibling as HTMLInputElement;
        nextInput?.focus();
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !value) {
      onBackspace();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 4);

    if (pastedData) {
      const inputs = inputRef.current?.parentElement?.querySelectorAll("input");
      if (inputs) {
        pastedData.split("").forEach((digit, i) => {
          const input = inputs[i] as HTMLInputElement;
          if (input) {
            input.value = digit;
            input.dispatchEvent(new Event("input", { bubbles: true }));
          }
        });
        const nextIndex = Math.min(pastedData.length, 3);
        (inputs[nextIndex] as HTMLInputElement)?.focus();
      }
    }
  };

  return (
    <input
      ref={inputRef}
      type="text"
      inputMode="numeric"
      maxLength={1}
      value={value}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      onPaste={handlePaste}
      className="w-14 h-14 sm:w-16 sm:h-16 bg-[#FFFFFF] text-[#1B1B1B] border-2 border-[#e1e2e2] rounded-xl text-center text-xl sm:text-2xl font-black
                 focus:bg-[#FFFEF5] focus:border-[#FCC200] focus:ring-4 focus:ring-[#FCC200]/20 outline-none transition-all duration-300
                 placeholder:text-[#C4C4C4] caret-[#FCC200]"
    />
  );
};

// --- Main Component ---
const OtpVerification = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "example@email.com";

  const [otp, setOtp] = useState(["", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  useEffect(() => {
    if (timeLeft > 0 && !canResend) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setCanResend(true);
    }
  }, [timeLeft, canResend]);

  useEffect(() => {
    setTimeout(() => {
      inputRefs[0].current?.focus();
    }, 100);
  }, []);

  const handleOtpChange = (index: number, value: string) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
  };

  const handleBackspace = (index: number) => {
    if (index > 0) {
      const newOtp = [...otp];
      newOtp[index - 1] = "";
      setOtp(newOtp);
      inputRefs[index - 1].current?.focus();
    }
  };

  const handleResend = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/otp/resend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal mengirim ulang OTP");

      setTimeLeft(60);
      setCanResend(false);
      setOtp(["", "", "", ""]);

      // <-- GANTI ALERT DENGAN TOAST SUCCESS
      toast.success("Kode OTP baru telah dikirim ke email Anda!");
      setTimeout(() => inputRefs[0].current?.focus(), 100);
    } catch (error: any) {
      // <-- GANTI ALERT DENGAN TOAST ERROR
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const isOtpComplete = otp.every((digit) => digit !== "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpString = otp.join("");

    if (otpString.length !== 4) return;

    setIsLoading(true);
    try {
      const res = await fetch("/api/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code: otpString }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Verifikasi gagal");

      setIsSuccess(true);
      // <-- TAMBAHKAN TOAST SUCCESS SAAT VERIFIKASI BERHASIL
      toast.success("Email berhasil diverifikasi!");
      setTimeout(() => router.push("/login"), 2000);
    } catch (error: any) {
      // <-- GANTI ALERT DENGAN TOAST ERROR
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFFEF5] via-[#FFFFFF] to-[#F0F4FF] flex items-center justify-center p-4 sm:p-6 font-sans overflow-hidden relative">
      {/* Background Ornaments */}
      <div className="absolute top-[-10%] right-[-5%] w-[400px] h-[400px] sm:w-[500px] sm:h-[500px] bg-[#FCC200]/10 rounded-full blur-[100px] sm:blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] bg-[#4F619B]/5 rounded-full blur-[80px] sm:blur-[100px] pointer-events-none" />

      {/* Main Centered Card */}
      <div className="w-full max-w-[440px] bg-[#FFFFFF]/95 backdrop-blur-xl rounded-[2rem] shadow-[0_30px_80px_-20px_rgba(35,57,130,0.12)] border border-[#FFFFFF] flex flex-col overflow-hidden relative z-10">
        <div className="p-5 sm:p-8 flex-1 flex flex-col">
          <div className="flex flex-col items-center mb-4 sm:mb-6">
            <img
              src="/logomedpel.png"
              alt="MedPel Logo"
              className="w-12 h-12 sm:w-14 sm:h-14 object-contain drop-shadow-sm"
            />
            <h1 className="text-[#233982] font-black text-xl sm:text-2xl tracking-tight mt-2">
              Media <span className="text-[#FCC200]">Pelajar</span>
            </h1>
          </div>

          <div className="flex-1 relative min-h-[300px] sm:min-h-[340px]">
            <AnimatePresence mode="wait">
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
                    className="w-20 h-20 sm:w-24 sm:h-24 bg-green-100 rounded-full flex items-center justify-center mb-4"
                  >
                    <CheckCircle2
                      size={40}
                      className="sm:w-12 sm:h-12 text-green-600"
                    />
                  </motion.div>
                  <h3 className="text-xl sm:text-2xl font-black text-[#1B1B1B] mb-2">
                    Email Terverifikasi!
                  </h3>
                  <p className="text-[#6B7280] text-sm max-w-xs mb-6 leading-relaxed">
                    Akun Anda telah berhasil diverifikasi. Silahkan Login untuk
                    bergabung dengan Media Pelajar.
                  </p>
                  <a
                    href="/login"
                    className="w-full max-w-xs bg-[#233982] text-white font-bold py-3 rounded-xl hover:bg-[#4F619B] transition-all active:scale-[0.98] shadow-lg shadow-[#233982]/20"
                  >
                    LANJUTKAN
                  </a>
                </motion.div>
              ) : (
                <motion.form
                  key="otp-form"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={handleSubmit}
                  className="absolute inset-0 flex flex-col pt-4 sm:pt-6"
                >
                  <div className="flex justify-center gap-2 sm:gap-3 mb-4">
                    {otp.map((digit, index) => (
                      <OtpBox
                        key={index}
                        value={digit}
                        index={index}
                        onChange={(val) => handleOtpChange(index, val)}
                        onBackspace={() => handleBackspace(index)}
                        inputRef={inputRefs[index]}
                      />
                    ))}
                  </div>

                  <div className="text-center mb-4">
                    <p className="text-xs sm:text-sm text-[#6B7280]">
                      Anda dapat mengirim ulang OTP dalam{" "}
                      <span className="font-bold text-[#233982]">
                        {formatTime(timeLeft)}
                      </span>
                    </p>
                  </div>

                  <div className="space-y-3 mt-4">
                    <button
                      type="submit"
                      disabled={isLoading || !isOtpComplete}
                      className="w-full bg-gradient-to-r from-[#233982] to-[#4F619B] hover:from-[#4F619B] hover:to-[#7281AF] disabled:opacity-40 disabled:cursor-not-allowed text-[#FFFFFF] font-bold py-3 rounded-xl shadow-lg shadow-[#233982]/20 transition-all flex items-center justify-center gap-2 active:scale-[0.98] text-sm sm:text-base"
                    >
                      {isLoading ? (
                        <>
                          <RefreshCw size={18} className="animate-spin" />{" "}
                          Memverifikasi...
                        </>
                      ) : (
                        "Verifikasi OTP"
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={handleResend}
                      disabled={!canResend}
                      className="w-full bg-[#F8FAF9] hover:bg-[#F1F5F9] disabled:opacity-50 disabled:cursor-not-allowed text-[#4F619B] font-bold py-2.5 sm:py-3 rounded-xl transition-all flex items-center justify-between px-4 sm:px-5 active:scale-[0.98] border-2 border-[#d0d2d1] hover:border-[#4F619B]/20 text-sm"
                    >
                      <span className="flex items-center gap-2">
                        <RefreshCw
                          size={16}
                          className={canResend ? "" : "text-[#C4C4C4]"}
                        />
                        Kirim Ulang OTP
                      </span>
                      <span
                        className={`font-bold ${canResend ? "text-[#233982]" : "text-[#C4C4C4]"}`}
                      >
                        {formatTime(timeLeft)}
                      </span>
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OtpVerification;
