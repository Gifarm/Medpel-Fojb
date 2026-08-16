/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Filter,
  Briefcase,
  Wallet,
  Users,
  CheckCircle2,
  X,
  Loader2,
  AlertCircle,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import SidebarKOL from "@/components/kol/SidebarKOL"; // Sesuaikan path
import toast from "react-hot-toast";

// --- DUMMY DATA ---
const initialTasks = [
  {
    id: "T001",
    title: "Buat Konten TikTok Edukasi Beasiswa",
    description:
      "Buat video TikTok 30-60 detik tentang tips mendaftar beasiswa LPDP. Wajib pakai hashtag #MedPelBeasiswa dan tag @mediapelajar.id.",
    reward: 25000,
    quota: 50,
    claimed: 12,
    status: "ACTIVE",
  },
  {
    id: "T002",
    title: "Menulis Thread Twitter tentang Kesehatan Mental",
    description:
      "Minimal 5 thread berisi tips menjaga kesehatan mental saat ujian. Sertakan infografis sederhana dan gunakan hashtag #MentalHealthPelajar.",
    reward: 30000,
    quota: 20,
    claimed: 19, // Hampir habis
    status: "ACTIVE",
  },
  {
    id: "T003",
    title: "Review Buku Pelajaran di Instagram Story",
    description:
      "Upload story review buku paket terbaru, tag akun @mediapelajar.id dan sertakan link di bio. Minimal 3 slide story.",
    reward: 15000,
    quota: 30,
    claimed: 30,
    status: "COMPLETED",
  },
  {
    id: "T004",
    title: "Membuat Artikel Blog Mini tentang Coding",
    description:
      "Tulis artikel 500 kata tentang 'Belajar Coding untuk Pemula'. Submit dalam bentuk Google Docs.",
    reward: 50000,
    quota: 10,
    claimed: 2,
    status: "ACTIVE",
  },
];

export default function DaftarTaskPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [tasks, setTasks] = useState(initialTasks);

  // State Filter & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("ALL"); // ALL, HIGH_REWARD, ALMOST_FULL

  // State Modal Claim
  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [isClaiming, setIsClaiming] = useState(false);

  // Format Rupiah
  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Filter Logic
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch = task.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      if (filterType === "HIGH_REWARD")
        return matchesSearch && task.reward >= 30000;
      if (filterType === "ALMOST_FULL")
        return (
          matchesSearch &&
          task.status === "ACTIVE" &&
          task.claimed / task.quota > 0.8
        );

      return matchesSearch; // ALL
    });
  }, [tasks, searchQuery, filterType]);

  // Handler Buka Modal Claim
  const openClaimModal = (task: any) => {
    if (task.claimed >= task.quota) {
      toast.error("Maaf, kuota untuk task ini sudah habis!");
      return;
    }
    setSelectedTask(task);
    setIsClaimModalOpen(true);
  };

  // Handler Konfirmasi Ambil Task
  const handleConfirmClaim = () => {
    if (!selectedTask) return;
    setIsClaiming(true);

    // Simulasi API Call
    setTimeout(() => {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === selectedTask.id ? { ...t, claimed: t.claimed + 1 } : t,
        ),
      );

      setIsClaimModalOpen(false);
      setSelectedTask(null);
      setIsClaiming(false);
      toast.success(
        `Berhasil mengambil task "${selectedTask.title}"! Segera kerjakan.`,
      );
    }, 1000);
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
            <h2 className="text-xl font-bold text-[#1B1B1B]">Daftar Task</h2>
            <p className="text-[11px] text-[#C4C4C4] font-semibold uppercase tracking-wider">
              Pilih task, kerjakan, dan dapatkan rewardnya!
            </p>
          </div>
        </header>

        <div className="p-8 max-w-[1600px] mx-auto space-y-8">
          {/* 1. Filter & Search Bar */}
          <div className="bg-[#FFFFFF] p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-96">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#C4C4C4]"
                size={18}
              />
              <input
                type="text"
                placeholder="Cari judul task..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-[#FCC200]/20 focus:border-[#FCC200] transition-all outline-none"
              />
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:flex-none">
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="appearance-none w-full md:w-48 bg-gray-50 border border-gray-200 rounded-xl py-2.5 pl-4 pr-10 text-sm font-semibold text-[#1B1B1B] focus:ring-2 focus:ring-[#FCC200]/20 outline-none cursor-pointer"
                >
                  <option value="ALL">Semua Task</option>
                  <option value="HIGH_REWARD">Reward Tinggi (≥30rb)</option>
                  <option value="ALMOST_FULL">
                    Segera Habis (Kuota ≤ 20%)
                  </option>
                </select>
                <Filter
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#C4C4C4] pointer-events-none"
                  size={16}
                />
              </div>
            </div>
          </div>

          {/* 2. Task Grid/List */}
          {filteredTasks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredTasks.map((task) => {
                const progressPercent = (task.claimed / task.quota) * 100;
                const isAlmostFull = progressPercent > 80;
                const isFull = task.claimed >= task.quota;

                return (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-[#FFFFFF] rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col overflow-hidden group"
                  >
                    {/* Header Card */}
                    <div className="p-6 flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div className="w-10 h-10 rounded-xl bg-[#233982]/10 text-[#233982] flex items-center justify-center flex-shrink-0">
                          <Briefcase size={20} />
                        </div>
                        {isFull && (
                          <span className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full text-[10px] font-bold uppercase">
                            Penuh
                          </span>
                        )}
                        {isAlmostFull && !isFull && (
                          <span className="px-2.5 py-1 bg-red-50 text-red-600 rounded-full text-[10px] font-bold uppercase flex items-center gap-1">
                            <AlertCircle size={10} /> Sisa Sedikit
                          </span>
                        )}
                      </div>

                      <h3 className="font-bold text-base text-[#1B1B1B] mb-2 line-clamp-2 group-hover:text-[#233982] transition-colors">
                        {task.title}
                      </h3>
                      <p className="text-xs text-[#C4C4C4] line-clamp-3 mb-6 leading-relaxed">
                        {task.description}
                      </p>

                      {/* Reward */}
                      <div className="flex items-center gap-2 mb-4">
                        <Wallet size={16} className="text-[#B48A00]" />
                        <span className="text-lg font-black text-[#233982]">
                          {formatRupiah(task.reward)}
                        </span>
                      </div>
                    </div>

                    {/* Footer Card (Progress & Button) */}
                    <div className="bg-gray-50/50 p-4 border-t border-gray-100">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-bold text-[#C4C4C4] uppercase tracking-wide flex items-center gap-1">
                          <Users size={12} /> Kuota Terisi
                        </span>
                        <span
                          className={`text-[11px] font-black ${isAlmostFull ? "text-red-600" : "text-[#1B1B1B]"}`}
                        >
                          {task.claimed} / {task.quota}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5 mb-4 overflow-hidden">
                        <div
                          className={`h-1.5 rounded-full transition-all duration-500 ${isAlmostFull ? "bg-red-500" : "bg-[#FCC200]"}`}
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>

                      <button
                        onClick={() => openClaimModal(task)}
                        disabled={isFull}
                        className="w-full py-2.5 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed bg-[#233982] text-white hover:bg-[#4F619B]"
                      >
                        {isFull ? "Kuota Habis" : "Ambil Task"}
                        {!isFull && <ArrowRight size={14} />}
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            /* Empty State */
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-20 bg-[#FFFFFF] rounded-2xl border border-gray-100 border-dashed"
            >
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <Briefcase size={32} className="text-[#C4C4C4]" />
              </div>
              <h3 className="font-bold text-[#1B1B1B] mb-1">
                Tidak ada task yang ditemukan
              </h3>
              <p className="text-xs text-[#C4C4C4] max-w-xs text-center">
                Coba ubah kata kunci pencarian atau filter kamu. Task baru akan
                segera ditambahkan oleh Admin.
              </p>
            </motion.div>
          )}
        </div>
      </main>

      {/* --- MODAL KONFIRMASI AMBIL TASK --- */}
      <AnimatePresence>
        {isClaimModalOpen && selectedTask && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setIsClaimModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-[#FCC200]/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#FCC200] text-[#1B1B1B] flex items-center justify-center">
                    <Briefcase size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#1B1B1B]">
                      Konfirmasi Ambil Task
                    </h3>
                    <p className="text-xs text-[#C4C4C4]">
                      Baca ketentuan sebelum memulai
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsClaimModalOpen(false)}
                  className="p-2 hover:bg-gray-200 rounded-full transition-colors text-[#C4C4C4] hover:text-[#1B1B1B]"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 space-y-5">
                <div>
                  <h4 className="font-bold text-[#1B1B1B] mb-2">
                    {selectedTask.title}
                  </h4>
                  <p className="text-sm text-[#C4C4C4] leading-relaxed bg-gray-50 p-3 rounded-xl border border-gray-100">
                    {selectedTask.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[#233982]/5 rounded-xl p-3 text-center border border-[#233982]/10">
                    <p className="text-[10px] font-bold text-[#C4C4C4] uppercase tracking-wide mb-1">
                      Reward
                    </p>
                    <p className="text-lg font-black text-[#233982]">
                      {formatRupiah(selectedTask.reward)}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3 text-center border border-gray-100">
                    <p className="text-[10px] font-bold text-[#C4C4C4] uppercase tracking-wide mb-1">
                      Sisa Kuota
                    </p>
                    <p className="text-lg font-black text-[#1B1B1B]">
                      {selectedTask.quota - selectedTask.claimed} Slot
                    </p>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 flex items-start gap-2">
                  <AlertCircle
                    size={16}
                    className="text-blue-600 flex-shrink-0 mt-0.5"
                  />
                  <p className="text-[11px] text-blue-700 leading-relaxed">
                    Dengan mengambil task ini, kamu setuju untuk mengerjakan
                    sesuai ketentuan dan mengirimkan bukti pengerjaan di menu{" "}
                    <b>Task Saya</b>.
                  </p>
                </div>
              </div>

              <div className="px-6 py-5 border-t border-gray-100 bg-gray-50/50 flex items-center justify-end gap-3">
                <button
                  onClick={() => setIsClaimModalOpen(false)}
                  className="px-5 py-2.5 text-sm font-bold text-[#C4C4C4] hover:text-[#1B1B1B] transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={handleConfirmClaim}
                  disabled={isClaiming}
                  className="px-5 py-2.5 text-sm font-bold text-white bg-[#233982] rounded-xl hover:bg-[#4F619B] transition-all shadow-md shadow-[#233982]/20 flex items-center gap-2 disabled:opacity-50"
                >
                  {isClaiming ? (
                    <Loader2 className="animate-spin" size={16} />
                  ) : (
                    <CheckCircle2 size={16} />
                  )}
                  {isClaiming ? "Memproses..." : "Ya, Ambil Task Ini"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
