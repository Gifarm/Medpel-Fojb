/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Filter,
  Eye,
  CheckCircle2,
  XCircle,
  Edit3,
  Clock,
  FileText,
  ChevronDown,
  X,
  AlertTriangle,
  Check,
} from "lucide-react";
import Sidebar from "@/components/admin/Sidebar";

const COLORS = {
  primary: "#FCC200",
  blueDark: "#233982",
  blue: "#4F619B",
  black: "#1B1B1B",
  gray: "#C4C4C4",
};

// --- Mock Data Artikel ---
const mockArticles = [
  {
    id: 101,
    title: "Dampak AI dalam Pendidikan Modern di Indonesia",
    author: "Budi Santoso",
    authorRole: "Jurnalis",
    date: "2024-10-25",
    category: "Teknologi",
    status: "Pending",
    excerpt:
      "Kecerdasan buatan mulai merambah dunia pendidikan. Apakah ini ancaman atau peluang bagi pelajar...",
  },
  {
    id: 102,
    title: "Eksplorasi Budaya: Festival Seni Pelajar Jawa Barat",
    author: "Siska Putri",
    authorRole: "Jurnalis",
    date: "2024-10-24",
    category: "Budaya",
    status: "Needs Revision",
    excerpt:
      "Festival seni tahunan kembali digelar dengan antusiasme tinggi. Namun, ada beberapa bagian yang perlu...",
  },
  {
    id: 103,
    title: "Pemanasan Global: Fakta vs Mitos di Kalangan Pelajar",
    author: "Rian Hidayat",
    authorRole: "Jurnalis",
    date: "2024-10-23",
    category: "Sains",
    status: "Approved",
    excerpt:
      "Banyak informasi menyesatkan tentang perubahan iklim. Mari kita bedah fakta ilmiahnya...",
  },
  {
    id: 104,
    title: "Tips Sukses Menghadapi Olimpiade Sains Nasional",
    author: "Dewi Lestari",
    authorRole: "Jurnalis",
    date: "2024-10-22",
    category: "Pendidikan",
    status: "Rejected",
    excerpt:
      "Persiapan matang adalah kunci. Berikut adalah panduan lengkap dari para juara OSN...",
  },
  {
    id: 105,
    title: "Review Film: Perjuangan Pelajar di Daerah Terpencil",
    author: "Andi Wijaya",
    authorRole: "Editor",
    date: "2024-10-21",
    category: "Hiburan",
    status: "Pending",
    excerpt:
      "Film ini mengangkat kisah nyata yang menginspirasi tentang semangat belajar tanpa batas...",
  },
];

// --- Komponen Badge Status ---
const StatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    Pending: "bg-yellow-50 text-yellow-700 border-yellow-100",
    "Needs Revision": "bg-blue-50 text-blue-700 border-blue-100",
    Approved: "bg-green-50 text-green-700 border-green-100",
    Rejected: "bg-red-50 text-red-700 border-red-100",
  };

  const icons: Record<string, any> = {
    Pending: Clock,
    "Needs Revision": Edit3,
    Approved: CheckCircle2,
    Rejected: XCircle,
  };

  const Icon = icons[status] || Clock;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide border ${styles[status] || styles.Pending}`}
    >
      <Icon size={12} />
      {status === "Needs Revision" ? "Perlu Revisi" : status}
    </span>
  );
};

export default function ModerasiArtikelPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedArticle, setSelectedArticle] = useState<any>(null);

  // Filter Data
  const filteredArticles = useMemo(() => {
    return mockArticles.filter((article) => {
      const matchesSearch =
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.author.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === "All" || article.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, statusFilter]);

  // Stats Data
  const stats = [
    {
      label: "Menunggu Review",
      val: "28",
      icon: Clock,
      color: "text-yellow-600",
      bg: "bg-yellow-50",
    },
    {
      label: "Perlu Revisi",
      val: "12",
      icon: Edit3,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Disetujui Hari Ini",
      val: "45",
      icon: CheckCircle2,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      label: "Ditolak Hari Ini",
      val: "3",
      icon: XCircle,
      color: "text-red-600",
      bg: "bg-red-50",
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
              Moderasi Artikel
            </h2>
            <p className="text-[11px] text-[#C4C4C4] font-semibold uppercase tracking-wider">
              Tinjau, revisi, atau publikasikan konten jurnalis
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 bg-[#233982] text-white text-xs font-bold rounded-xl flex items-center gap-2 hover:bg-[#4F619B] transition-all shadow-md shadow-[#233982]/20">
              <FileText size={16} />
              Panduan Moderasi
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
                placeholder="Cari judul artikel atau nama penulis..."
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
                  <option value="Pending">Menunggu Review</option>
                  <option value="Needs Revision">Perlu Revisi</option>
                  <option value="Approved">Disetujui</option>
                  <option value="Rejected">Ditolak</option>
                </select>
                <ChevronDown
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#C4C4C4] pointer-events-none"
                  size={16}
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
                    <th className="px-6 py-4">Informasi Artikel</th>
                    <th className="px-6 py-4">Kategori</th>
                    <th className="px-6 py-4">Tanggal Submit</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Aksi Moderasi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredArticles.length > 0 ? (
                    filteredArticles.map((article) => (
                      <motion.tr
                        key={article.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="group hover:bg-[#233982]/[0.02] transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-start gap-3">
                            {/* <div className="w-10 h-10 bg-[#233982]/10 text-[#233982] rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0">
                              {article.author.charAt(0)}
                            </div> */}
                            <div>
                              <p className="font-bold text-sm text-[#1B1B1B] line-clamp-1 group-hover:text-[#233982] transition-colors">
                                {article.title}
                              </p>
                              <p className="text-[11px] text-[#C4C4C4] mt-0.5">
                                Oleh:{" "}
                                <span className="font-semibold text-[#4F619B]">
                                  {article.author}
                                </span>{" "}
                                ({article.authorRole})
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-xs font-semibold text-[#1B1B1B] bg-gray-100 px-2.5 py-1 rounded-md">
                            {article.category}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-xs font-medium text-[#1B1B1B]">
                            {article.date}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <StatusBadge status={article.status} />
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setSelectedArticle(article)}
                              className="p-2 text-[#4F619B] hover:bg-[#4F619B]/10 rounded-lg transition-all"
                              title="Preview Artikel"
                            >
                              <Eye size={18} />
                            </button>
                            {article.status === "Pending" && (
                              <>
                                <button
                                  className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-all"
                                  title="Setujui"
                                >
                                  <Check size={18} />
                                </button>
                                <button
                                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                  title="Tolak"
                                >
                                  <X size={18} />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </motion.tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center justify-center text-[#C4C4C4]">
                          <FileText size={48} className="mb-3 opacity-20" />
                          <p className="font-semibold text-sm">
                            Tidak ada artikel yang ditemukan
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
                Menampilkan {filteredArticles.length} dari {mockArticles.length}{" "}
                artikel
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

      {/* --- MODAL PREVIEW ARTIKEL --- */}
      <AnimatePresence>
        {selectedArticle && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedArticle(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white w-full max-w-3xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col"
            >
              {/* Modal Header */}
              <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                <div>
                  <h3 className="text-lg font-bold text-[#1B1B1B]">
                    Preview Artikel
                  </h3>
                  <p className="text-xs text-[#C4C4C4] mt-1">
                    Tinjau konten sebelum mengambil keputusan
                  </p>
                </div>
                <button
                  onClick={() => setSelectedArticle(null)}
                  className="p-2 hover:bg-gray-200 rounded-full transition-colors text-[#C4C4C4] hover:text-[#1B1B1B]"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-8 overflow-y-auto flex-1">
                <div className="flex items-center gap-3 mb-6">
                  <StatusBadge status={selectedArticle.status} />
                  <span className="text-xs font-semibold text-[#4F619B] bg-[#4F619B]/10 px-2.5 py-1 rounded-md">
                    {selectedArticle.category}
                  </span>
                </div>

                <h1 className="text-2xl font-black text-[#1B1B1B] mb-4 leading-tight">
                  {selectedArticle.title}
                </h1>

                <div className="flex items-center gap-4 mb-8 pb-8 border-b border-gray-100">
                  <div className="w-10 h-10 bg-[#233982] text-white rounded-full flex items-center justify-center font-bold">
                    {selectedArticle.author.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#1B1B1B]">
                      {selectedArticle.author}
                    </p>
                    <p className="text-xs text-[#C4C4C4]">
                      {selectedArticle.authorRole} • Disubmit pada{" "}
                      {selectedArticle.date}
                    </p>
                  </div>
                </div>

                <div className="prose prose-sm max-w-none text-[#1B1B1B]/80 leading-relaxed">
                  <p className="font-semibold text-lg text-[#1B1B1B] mb-4">
                    {selectedArticle.excerpt}
                  </p>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                    ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    Duis aute irure dolor in reprehenderit in voluptate velit
                    esse cillum dolore eu fugiat nulla pariatur.
                  </p>
                  <p className="mt-4">
                    Excepteur sint occaecat cupidatat non proident, sunt in
                    culpa qui officia deserunt mollit anim id est laborum. Sed
                    ut perspiciatis unde omnis iste natus error sit voluptatem
                    accusantium doloremque laudantium.
                  </p>
                </div>
              </div>

              {/* Modal Footer (Actions) */}
              <div className="px-8 py-6 border-t border-gray-100 bg-gray-50/50 flex items-center justify-end gap-3">
                <button
                  onClick={() => setSelectedArticle(null)}
                  className="px-5 py-2.5 text-sm font-bold text-[#C4C4C4] hover:text-[#1B1B1B] transition-colors"
                >
                  Batal
                </button>
                <button className="px-5 py-2.5 text-sm font-bold text-red-600 bg-red-50 border border-red-100 rounded-xl hover:bg-red-100 transition-all flex items-center gap-2">
                  <XCircle size={16} /> Tolak
                </button>
                <button className="px-5 py-2.5 text-sm font-bold text-blue-600 bg-blue-50 border border-blue-100 rounded-xl hover:bg-blue-100 transition-all flex items-center gap-2">
                  <Edit3 size={16} /> Minta Revisi
                </button>
                <button className="px-5 py-2.5 text-sm font-bold text-white bg-[#233982] rounded-xl hover:bg-[#4F619B] transition-all shadow-md shadow-[#233982]/20 flex items-center gap-2">
                  <CheckCircle2 size={16} /> Setujui & Publikasi
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
