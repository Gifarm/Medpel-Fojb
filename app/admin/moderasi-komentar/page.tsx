/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  MessageSquare,
  Flag,
  EyeOff,
  CheckCircle2,
  Trash2,
  X,
  FileText,
  AlertTriangle,
  MoreHorizontal,
  User,
} from "lucide-react";
import Sidebar from "@/components/admin/Sidebar";

const COLORS = {
  primary: "#FCC200",
  blueDark: "#233982",
  blue: "#4F619B",
  black: "#1B1B1B",
  gray: "#C4C4C4",
};

// --- Mock Data Komentar ---
const mockComments = [
  {
    id: 1,
    user: "Rina Kartika",
    userRole: "User",
    comment:
      "Artikelnya sangat inspiratif! Saya jadi termotivasi untuk mengikuti lomba OSN tahun ini. Terima kasih kak!",
    articleTitle: "Tips Sukses Menghadapi Olimpiade Sains Nasional",
    date: "10 Menit lalu",
    status: "Approved",
    reports: 0,
  },
  {
    id: 2,
    user: "Anonymous_99",
    userRole: "User",
    comment:
      "Konten tidak berkualitas, penulisnya pasti tidak riset dulu. Sampah!",
    articleTitle: "Pemanasan Global: Fakta vs Mitos",
    date: "1 Jam lalu",
    status: "Reported",
    reports: 3,
  },
  {
    id: 3,
    user: "Budi Santoso",
    userRole: "Jurnalis",
    comment:
      "Terima kasih atas masukannya, akan saya pertimbangkan untuk artikel selanjutnya.",
    articleTitle: "Dampak AI dalam Pendidikan Modern",
    date: "3 Jam lalu",
    status: "Approved",
    reports: 0,
  },
  {
    id: 4,
    user: "SpamBot_01",
    userRole: "User",
    comment:
      "Kunjungi website kami untuk mendapatkan hadiah jutaan rupiah!!! Klik di sini -> [link]",
    articleTitle: "Beasiswa Kuliah Gratis 2024",
    date: "5 Jam lalu",
    status: "Hidden",
    reports: 12,
  },
  {
    id: 5,
    user: "Siska Putri",
    userRole: "Jurnalis",
    comment:
      "Min, kapan artikel tentang festival seni akan dipublikasikan? Sudah submit dari kemarin.",
    articleTitle: "Eksplorasi Budaya: Festival Seni Pelajar",
    date: "1 Hari lalu",
    status: "Pending",
    reports: 0,
  },
];

// --- Komponen Badge Status ---
const StatusBadge = ({
  status,
  reports,
}: {
  status: string;
  reports: number;
}) => {
  const styles: Record<string, string> = {
    Approved: "bg-green-50 text-green-700 border-green-100",
    Hidden: "bg-gray-100 text-gray-600 border-gray-200",
    Reported: "bg-red-50 text-red-700 border-red-100",
    Pending: "bg-yellow-50 text-yellow-700 border-yellow-100",
  };

  const icons: Record<string, any> = {
    Approved: CheckCircle2,
    Hidden: EyeOff,
    Reported: Flag,
    Pending: MessageSquare,
  };

  const Icon = icons[status] || MessageSquare;
  const label =
    status === "Reported"
      ? `Dilaporkan (${reports})`
      : status === "Hidden"
        ? "Disembunyikan"
        : status === "Pending"
          ? "Menunggu"
          : "Disetujui";

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide border ${styles[status]}`}
    >
      <Icon size={12} />
      {label}
    </span>
  );
};

export default function ModerasiKomentarPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedComment, setSelectedComment] = useState<any>(null);

  // Filter Data
  const filteredComments = useMemo(() => {
    return mockComments.filter((c) => {
      const matchesSearch =
        c.comment.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.articleTitle.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "All" || c.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, statusFilter]);

  // Stats Data
  const stats = [
    {
      label: "Total Komentar",
      val: mockComments.length,
      icon: MessageSquare,
      color: "text-[#233982]",
      bg: "bg-[#233982]/10",
    },
    {
      label: "Perlu Tinjauan",
      val: mockComments.filter((c) => c.status === "Pending").length,
      icon: MessageSquare,
      color: "text-yellow-600",
      bg: "bg-yellow-50",
    },
    {
      label: "Dilaporkan",
      val: mockComments.filter((c) => c.status === "Reported").length,
      icon: Flag,
      color: "text-red-600",
      bg: "bg-red-50",
    },
    {
      label: "Disembunyikan",
      val: mockComments.filter((c) => c.status === "Hidden").length,
      icon: EyeOff,
      color: "text-gray-600",
      bg: "bg-gray-100",
    },
  ];

  return (
    <div className="min-h-screen bg-[#f8faf9] font-sans text-[#1B1B1B] overflow-x-hidden flex">
      {/* --- SIDEBAR --- */}
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      {/* --- MAIN CONTENT --- */}
      <main
        className={`flex-1 transition-all duration-300 ${isSidebarOpen ? "ml-[280px]" : "ml-[80px]"}`}
      >
        {/* Top Header */}
        <header className="h-20 bg-[#FFFFFF]/80 backdrop-blur-md border-b border-gray-200/60 sticky top-0 z-30 px-8 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-[#1B1B1B]">
              Moderasi Komentar
            </h2>
            <p className="text-[11px] text-[#C4C4C4] font-semibold uppercase tracking-wider">
              Tinjau, sembunyikan, atau hapus komentar tidak pantas
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 bg-white border border-gray-200 text-[#1B1B1B] text-xs font-bold rounded-xl flex items-center gap-2 hover:bg-gray-50 transition-all">
              <FileText size={16} />
              Pedoman Komentar
            </button>
          </div>
        </header>

        <div className="p-8 max-w-[1600px] mx-auto space-y-8">
          {/* 1. Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
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
                  <h3 className="text-2xl font-bold text-[#1B1B1B]">
                    {stat.val}
                  </h3>
                </div>
              </motion.div>
            ))}
          </div>

          {/* 2. Filter & Search Bar */}
          <div className="bg-[#FFFFFF] p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-96">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#C4C4C4]"
                size={18}
              />
              <input
                type="text"
                placeholder="Cari komentar, user, atau judul artikel..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-[#233982]/20 focus:border-[#233982] transition-all outline-none"
              />
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:flex-none">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="appearance-none w-full md:w-48 bg-gray-50 border border-gray-200 rounded-xl py-2.5 pl-4 pr-10 text-sm font-semibold text-[#1B1B1B] focus:ring-2 focus:ring-[#233982]/20 outline-none cursor-pointer"
                >
                  <option value="All">Semua Status</option>
                  <option value="Approved">Disetujui</option>
                  <option value="Pending">Menunggu</option>
                  <option value="Reported">Dilaporkan</option>
                  <option value="Hidden">Disembunyikan</option>
                </select>
                <Flag
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#C4C4C4] pointer-events-none"
                  size={14}
                />
              </div>
            </div>
          </div>

          {/* 3. Data Table */}
          <div className="bg-[#FFFFFF] rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50/80 text-[11px] uppercase font-bold text-[#C4C4C4] tracking-wider border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4">Pengguna & Komentar</th>
                    <th className="px-6 py-4">Artikel Terkait</th>
                    <th className="px-6 py-4">Waktu</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Aksi Moderasi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredComments.length > 0 ? (
                    filteredComments.map((comment) => (
                      <motion.tr
                        key={comment.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className={`group transition-colors ${
                          comment.status === "Reported"
                            ? "bg-red-50/30 hover:bg-red-50/60"
                            : "hover:bg-[#233982]/[0.02]"
                        }`}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-start gap-3 max-w-md">
                            {/* <div
                              className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                                comment.userRole === "Jurnalis"
                                  ? "bg-[#FCC200]/15 text-[#B48A00]"
                                  : "bg-[#233982]/10 text-[#233982]"
                              }`}
                            >
                              {comment.user.charAt(0)}
                            </div> */}
                            <div className="min-w-0">
                              <div className="flex items-center gap-2 mb-0.5">
                                <p className="font-bold text-sm text-[#1B1B1B] truncate">
                                  {comment.user}
                                </p>
                                {comment.userRole === "Jurnalis" && (
                                  <span className="text-[9px] font-bold text-[#B48A00] bg-[#FCC200]/20 px-1.5 py-0.5 rounded">
                                    JURNALIS
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-[#1B1B1B]/70 line-clamp-2 leading-relaxed">
                                {comment.comment}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-xs text-[#4F619B] font-medium max-w-[200px]">
                            <FileText
                              size={14}
                              className="flex-shrink-0 opacity-60"
                            />
                            <span className="truncate">
                              {comment.articleTitle}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-xs font-medium text-[#C4C4C4] whitespace-nowrap">
                            {comment.date}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <StatusBadge
                            status={comment.status}
                            reports={comment.reports}
                          />
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setSelectedComment(comment)}
                              className="p-2 text-[#4F619B] hover:bg-[#4F619B]/10 rounded-lg transition-all"
                              title="Lihat Detail"
                            >
                              <MoreHorizontal size={18} />
                            </button>
                            {comment.status !== "Approved" && (
                              <button
                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-all"
                                title="Setujui"
                              >
                                <CheckCircle2 size={18} />
                              </button>
                            )}
                            {comment.status !== "Hidden" && (
                              <button
                                className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-all"
                                title="Sembunyikan"
                              >
                                <EyeOff size={18} />
                              </button>
                            )}
                            <button
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                              title="Hapus Permanen"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center justify-center text-[#C4C4C4]">
                          <MessageSquare
                            size={48}
                            className="mb-3 opacity-20"
                          />
                          <p className="font-semibold text-sm">
                            Tidak ada komentar yang ditemukan
                          </p>
                          <p className="text-xs mt-1">
                            Coba ubah kata kunci pencarian atau filter status.
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination (Dummy) */}
            <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
              <p className="text-xs text-[#C4C4C4]">
                Menampilkan {filteredComments.length} dari {mockComments.length}{" "}
                komentar
              </p>
              <div className="flex items-center gap-2">
                <button
                  className="px-3 py-1.5 text-xs font-bold text-[#C4C4C4] border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                  disabled
                >
                  Sebelumnya
                </button>
                <button className="px-3 py-1.5 text-xs font-bold text-[#233982] bg-[#233982]/10 border border-[#233982]/20 rounded-lg">
                  1
                </button>
                <button className="px-3 py-1.5 text-xs font-bold text-[#C4C4C4] border border-gray-200 rounded-lg hover:bg-gray-50">
                  Selanjutnya
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* --- MODAL DETAIL KOMENTAR --- */}
      <AnimatePresence>
        {selectedComment && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedComment(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col"
            >
              {/* Modal Header */}
              <div
                className={`px-8 py-6 border-b border-gray-100 flex items-center justify-between ${
                  selectedComment.status === "Reported"
                    ? "bg-red-50/50"
                    : "bg-gray-50/50"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      selectedComment.status === "Reported"
                        ? "bg-red-100 text-red-600"
                        : "bg-[#233982]/10 text-[#233982]"
                    }`}
                  >
                    {selectedComment.status === "Reported" ? (
                      <AlertTriangle size={24} />
                    ) : (
                      <MessageSquare size={24} />
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#1B1B1B]">
                      Detail Komentar
                    </h3>
                    <p className="text-xs text-[#C4C4C4] mt-1">
                      ID: #{selectedComment.id} • {selectedComment.date}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedComment(null)}
                  className="p-2 hover:bg-gray-200 rounded-full transition-colors text-[#C4C4C4] hover:text-[#1B1B1B]"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-8 overflow-y-auto flex-1 space-y-6">
                {/* User Info */}
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                      selectedComment.userRole === "Jurnalis"
                        ? "bg-[#FCC200]/20 text-[#B48A00]"
                        : "bg-[#233982]/10 text-[#233982]"
                    }`}
                  >
                    {selectedComment.user.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#1B1B1B]">
                      {selectedComment.user}
                    </p>
                    <p className="text-xs text-[#C4C4C4]">
                      Peran: {selectedComment.userRole}
                    </p>
                  </div>
                  {selectedComment.reports > 0 && (
                    <div className="ml-auto flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-600 rounded-lg border border-red-100">
                      <Flag size={12} />
                      <span className="text-xs font-bold">
                        {selectedComment.reports} Laporan
                      </span>
                    </div>
                  )}
                </div>

                {/* Article Context */}
                <div>
                  <p className="text-[10px] font-bold text-[#C4C4C4] uppercase tracking-widest mb-2">
                    Berkomentar pada artikel:
                  </p>
                  <div className="flex items-start gap-3 p-4 bg-[#233982]/5 rounded-xl border border-[#233982]/10">
                    <FileText
                      size={20}
                      className="text-[#233982] flex-shrink-0 mt-0.5"
                    />
                    <p className="text-sm font-semibold text-[#233982]">
                      {selectedComment.articleTitle}
                    </p>
                  </div>
                </div>

                {/* Comment Content */}
                <div>
                  <p className="text-[10px] font-bold text-[#C4C4C4] uppercase tracking-widest mb-2">
                    Isi Komentar:
                  </p>
                  <div className="p-5 bg-white rounded-xl border border-gray-200 shadow-sm">
                    <p className="text-sm text-[#1B1B1B] leading-relaxed whitespace-pre-wrap">
                      {selectedComment.comment}
                    </p>
                  </div>
                </div>
              </div>

              {/* Modal Footer (Actions) */}
              <div className="px-8 py-6 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between">
                <StatusBadge
                  status={selectedComment.status}
                  reports={selectedComment.reports}
                />
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setSelectedComment(null)}
                    className="px-5 py-2.5 text-sm font-bold text-[#C4C4C4] hover:text-[#1B1B1B] transition-colors"
                  >
                    Tutup
                  </button>
                  <button className="px-5 py-2.5 text-sm font-bold text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all flex items-center gap-2">
                    <EyeOff size={16} /> Sembunyikan
                  </button>
                  <button className="px-5 py-2.5 text-sm font-bold text-red-600 bg-red-50 border border-red-100 rounded-xl hover:bg-red-100 transition-all flex items-center gap-2">
                    <Trash2 size={16} /> Hapus
                  </button>
                  <button className="px-5 py-2.5 text-sm font-bold text-white bg-[#233982] rounded-xl hover:bg-[#4F619B] transition-all shadow-md shadow-[#233982]/20 flex items-center gap-2">
                    <CheckCircle2 size={16} /> Setujui
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
