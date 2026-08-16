/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Wallet,
  Briefcase,
  CheckCircle2,
  TrendingUp,
  Clock,
  ArrowRight,
  Copy,
  ExternalLink,
  AlertCircle,
  XCircle,
} from "lucide-react";
import SidebarKOL from "@/components/kol/SidebarKOL"; // Pastikan path ini sesuai
import toast from "react-hot-toast";

// --- DUMMY DATA ---
const walletData = {
  balance: 150000,
  totalEarned: 450000,
  danaName: "Rina Kartika Sari",
  danaPhone: "081234567890",
};

const availableTasks = [
  {
    id: "T001",
    title: "Buat Konten TikTok Edukasi Beasiswa",
    description:
      "Video 30-60 detik tentang tips LPDP. Wajib hashtag #MedPelBeasiswa.",
    reward: 25000,
    quota: 50,
    claimed: 12,
  },
  {
    id: "T003",
    title: "Menulis Thread Twitter Kesehatan Mental",
    description:
      "Minimal 5 thread berisi tips menjaga kesehatan mental saat ujian.",
    reward: 30000,
    quota: 20,
    claimed: 5,
  },
  {
    id: "T004",
    title: "Review Aplikasi Belajar di Instagram Story",
    description:
      "Upload story review aplikasi Ruangguru/Zenius, tag @mediapelajar.id.",
    reward: 15000,
    quota: 100,
    claimed: 88,
  },
];

const recentSubmissions = [
  {
    id: "S001",
    taskTitle: "Buat Konten TikTok Edukasi Beasiswa",
    status: "APPROVED",
    reward: 25000,
    date: "26 Okt 2024",
  },
  {
    id: "S002",
    taskTitle: "Review Buku Pelajaran di IG Story",
    status: "PENDING",
    reward: 15000,
    date: "28 Okt 2024",
  },
  {
    id: "S003",
    taskTitle: "Thread Twitter Kesehatan Mental",
    status: "REJECTED",
    reward: 30000,
    date: "25 Okt 2024",
    feedback: "Thread kurang dari 5 dan tidak ada infografis.",
  },
];

// --- KOMPONEN BADGE ---
const StatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    APPROVED: "bg-green-50 text-green-700 border-green-100",
    PENDING: "bg-yellow-50 text-yellow-700 border-yellow-100",
    REJECTED: "bg-red-50 text-red-700 border-red-100",
  };
  const labels: Record<string, string> = {
    APPROVED: "Disetujui",
    PENDING: "Menunggu Review",
    REJECTED: "Ditolak",
  };
  const icons: Record<string, any> = {
    APPROVED: CheckCircle2,
    PENDING: Clock,
    REJECTED: XCircle,
  };
  const Icon = icons[status] || Clock;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide border ${styles[status]}`}
    >
      <Icon size={12} />
      {labels[status]}
    </span>
  );
};

export default function KOLDashboardPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const copyDanaNumber = () => {
    navigator.clipboard.writeText(walletData.danaPhone);
    toast.success("Nomor DANA berhasil disalin!");
  };

  return (
    <div className="min-h-screen bg-[#f8faf9] font-sans text-[#1B1B1B] overflow-x-hidden flex">
      <SidebarKOL
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      <main
        className={`flex-1 transition-all duration-300 ${isSidebarOpen ? "ml-[280px]" : "ml-[80px]"}`}
      >
        {/* Top Header */}
        <header className="h-20 bg-[#FFFFFF]/80 backdrop-blur-md border-b border-gray-200/60 sticky top-0 z-30 px-8 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-[#1B1B1B]">Dashboard KOL</h2>
            <p className="text-[11px] text-[#C4C4C4] font-semibold uppercase tracking-wider">
              Selamat datang, Rina! Pantau task dan pendapatanmu di sini.
            </p>
          </div>
        </header>

        <div className="p-8 max-w-[1600px] mx-auto space-y-8">
          {/* 1. Stats Overview & Wallet Card */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Wallet Card (Dominan) */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-1 bg-gradient-to-br from-[#233982] to-[#4F619B] rounded-2xl p-6 text-white shadow-xl shadow-[#233982]/20 relative overflow-hidden"
            >
              {/* Background Ornaments */}
              <div className="absolute top-[-20%] right-[-10%] w-32 h-32 bg-[#FCC200]/20 rounded-full blur-2xl" />
              <div className="absolute bottom-[-10%] left-[-10%] w-24 h-24 bg-white/10 rounded-full blur-xl" />

              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-6">
                  <Wallet size={20} className="text-[#FCC200]" />
                  <p className="text-xs font-bold uppercase tracking-wider text-white/80">
                    Saldo Dompet KOL
                  </p>
                </div>
                <h3 className="text-3xl font-black mb-6">
                  {formatRupiah(walletData.balance)}
                </h3>

                <div className="space-y-3 pt-4 border-t border-white/20">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-white/70">Akun DANA</span>
                    <span className="font-bold">{walletData.danaName}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-white/70">Nomor HP</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold">
                        {walletData.danaPhone}
                      </span>
                      <button
                        onClick={copyDanaNumber}
                        className="p-1 hover:bg-white/20 rounded transition-colors"
                        title="Salin"
                      >
                        <Copy size={12} />
                      </button>
                    </div>
                  </div>
                </div>

                <button className="w-full mt-6 py-2.5 bg-[#FCC200] text-[#1B1B1B] text-xs font-black rounded-xl hover:bg-[#FDCE33] transition-all flex items-center justify-center gap-2">
                  Tarik Saldo <ArrowRight size={14} />
                </button>
              </div>
            </motion.div>

            {/* Stats Cards */}
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  label: "Task Tersedia",
                  val: availableTasks.length.toString(),
                  icon: Briefcase,
                  color: "text-[#233982]",
                  bg: "bg-[#233982]/10",
                },
                {
                  label: "Task Selesai",
                  val: "12",
                  icon: CheckCircle2,
                  color: "text-green-600",
                  bg: "bg-green-50",
                },
                {
                  label: "Total Pendapatan",
                  val: formatRupiah(walletData.totalEarned),
                  icon: TrendingUp,
                  color: "text-[#B48A00]",
                  bg: "bg-[#FCC200]/15",
                },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-[#FFFFFF] p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-all"
                >
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color}`}
                  >
                    <stat.icon size={22} />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-[#C4C4C4] uppercase tracking-wide">
                      {stat.label}
                    </p>
                    <h3 className="text-xl font-bold text-[#1B1B1B] mt-1">
                      {stat.val}
                    </h3>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* 2. Main Content Split: Available Tasks & Recent Submissions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Available Tasks (2/3 width) */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-2 bg-[#FFFFFF] rounded-2xl border border-gray-100 shadow-sm p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-bold text-lg text-[#1B1B1B]">
                    Task Tersedia Untukmu
                  </h3>
                  <p className="text-xs text-[#C4C4C4]">
                    Ambil task, kerjakan, dan dapatkan reward!
                  </p>
                </div>
                <button className="text-xs font-bold text-[#233982] hover:underline flex items-center gap-1">
                  Lihat Semua <ArrowRight size={12} />
                </button>
              </div>

              <div className="space-y-4">
                {availableTasks.map((task) => {
                  const progressPercent = (task.claimed / task.quota) * 100;
                  const isAlmostFull = progressPercent > 80;

                  return (
                    <div
                      key={task.id}
                      className="border border-gray-100 rounded-2xl p-5 hover:shadow-md transition-all bg-white group"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1 pr-4">
                          <h4 className="font-bold text-sm text-[#1B1B1B] mb-1 group-hover:text-[#233982] transition-colors">
                            {task.title}
                          </h4>
                          <p className="text-xs text-[#C4C4C4] line-clamp-2">
                            {task.description}
                          </p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-lg font-black text-[#233982]">
                            {formatRupiah(task.reward)}
                          </p>
                          <p className="text-[10px] text-[#C4C4C4] font-medium">
                            per KOL
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                        <div className="flex items-center gap-3 flex-1">
                          <div className="flex-1 max-w-[150px] bg-gray-100 rounded-full h-1.5 overflow-hidden">
                            <div
                              className={`h-1.5 rounded-full transition-all duration-500 ${isAlmostFull ? "bg-red-500" : "bg-[#FCC200]"}`}
                              style={{ width: `${progressPercent}%` }}
                            />
                          </div>
                          <span
                            className={`text-[11px] font-bold ${isAlmostFull ? "text-red-600" : "text-[#1B1B1B]"}`}
                          >
                            {task.claimed}/{task.quota} Slot
                          </span>
                        </div>
                        <button
                          disabled={isAlmostFull}
                          className="px-4 py-2 text-xs font-bold text-white bg-[#233982] hover:bg-[#4F619B] rounded-lg transition-all flex items-center gap-1.5 disabled:bg-gray-300 disabled:cursor-not-allowed"
                        >
                          <Briefcase size={14} /> Ambil Task
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            {/* Right: Recent Submissions (1/3 width) */}
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-[#FFFFFF] rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-lg text-[#1B1B1B]">
                  Riwayat Pengerjaan
                </h3>
                <Clock size={18} className="text-[#4F619B]" />
              </div>

              <div className="space-y-4 flex-1 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
                {recentSubmissions.map((sub) => (
                  <div
                    key={sub.id}
                    className="p-4 rounded-xl border border-gray-100 hover:border-gray-200 transition-all bg-gray-50/50"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <StatusBadge status={sub.status} />
                      <span className="text-[10px] text-[#C4C4C4] font-medium">
                        {sub.date}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-[#1B1B1B] mb-1 line-clamp-1">
                      {sub.taskTitle}
                    </p>

                    {sub.status === "APPROVED" && (
                      <p className="text-[11px] font-bold text-green-600 flex items-center gap-1">
                        <TrendingUp size={12} /> +{formatRupiah(sub.reward)}{" "}
                        masuk saldo
                      </p>
                    )}

                    {sub.status === "REJECTED" && sub.feedback && (
                      <div className="mt-2 p-2 bg-red-50 border border-red-100 rounded-lg">
                        <p className="text-[10px] font-bold text-red-600 flex items-center gap-1 mb-0.5">
                          <AlertCircle size={10} /> Catatan Admin:
                        </p>
                        <p className="text-[10px] text-red-700 leading-tight">
                          {sub.feedback}
                        </p>
                      </div>
                    )}

                    {sub.status === "PENDING" && (
                      <p className="text-[11px] text-[#C4C4C4] italic">
                        Sedang diperiksa oleh admin...
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
