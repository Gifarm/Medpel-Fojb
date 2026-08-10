/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Search,
  FileText,
  Edit3,
  Trash2,
  Eye,
  Plus,
  Filter,
  ChevronDown,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
} from "lucide-react";
import SidebarJurnalis from "@/components/jurnalis/Sidebar"; // Sesuaikan path

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
    id: 1,
    title: "Dampak AI dalam Pendidikan Modern di Indonesia",
    category: "Teknologi",
    status: "Published",
    date: "25 Okt 2024",
    views: 1250,
  },
  {
    id: 2,
    title: "Tips Sukses Menghadapi Olimpiade Sains Nasional",
    category: "Pendidikan",
    status: "Review",
    date: "27 Okt 2024",
    views: 0,
  },
  {
    id: 3,
    title: "Eksplorasi Budaya: Festival Seni Pelajar Jawa Barat",
    category: "Budaya",
    status: "Revision",
    date: "28 Okt 2024",
    views: 0,
  },
  {
    id: 4,
    title: "Pemanasan Global: Fakta vs Mitos di Kalangan Pelajar",
    category: "Sains",
    status: "Draft",
    date: "29 Okt 2024",
    views: 0,
  },
  {
    id: 5,
    title: "Review Film: Perjuangan Pelajar di Daerah Terpencil",
    category: "Hiburan",
    status: "Published",
    date: "20 Okt 2024",
    views: 840,
  },
  {
    id: 6,
    title: "Panduan Lengkap Beasiswa Kuliah 2024",
    category: "Pendidikan",
    status: "Rejected",
    date: "15 Okt 2024",
    views: 0,
  },
];

// --- Komponen Badge Status ---
const StatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    Published: "bg-green-50 text-green-700 border-green-100",
    Review: "bg-yellow-50 text-yellow-700 border-yellow-100",
    Revision: "bg-red-50 text-red-700 border-red-100",
    Draft: "bg-gray-100 text-gray-600 border-gray-200",
    Rejected: "bg-gray-100 text-gray-500 border-gray-200",
  };

  const icons: Record<string, any> = {
    Published: CheckCircle2,
    Review: Clock,
    Revision: AlertCircle,
    Draft: FileText,
    Rejected: XCircle,
  };

  const labels: Record<string, string> = {
    Published: "Diterbitkan",
    Review: "Menunggu Review",
    Revision: "Perlu Revisi",
    Draft: "Draft",
    Rejected: "Ditolak",
  };

  const Icon = icons[status] || FileText;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide border ${styles[status]}`}
    >
      <Icon size={12} />
      {labels[status]}
    </span>
  );
};

export default function ArtikelSayaPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Filter Data
  const filteredArticles = useMemo(() => {
    return mockArticles.filter((article) => {
      const matchesSearch = article.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === "All" || article.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, statusFilter]);

  return (
    <div className="min-h-screen bg-[#f8faf9] font-sans text-[#1B1B1B] overflow-x-hidden flex">
      {/* --- SIDEBAR --- */}
      <SidebarJurnalis
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
            <h2 className="text-xl font-bold text-[#1B1B1B]">Artikel Saya</h2>
            <p className="text-[11px] text-[#C4C4C4] font-semibold uppercase tracking-wider">
              Kelola, pantau status, dan edit semua karya Anda
            </p>
          </div>
          <button className="px-5 py-2.5 bg-[#233982] text-white text-xs font-bold rounded-xl flex items-center gap-2 hover:bg-[#4F619B] transition-all shadow-md shadow-[#233982]/20">
            <Plus size={16} />
            Tulis Artikel Baru
          </button>
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
                placeholder="Cari judul artikel..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-[#FCC200]/20 focus:border-[#FCC200] transition-all outline-none"
              />
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:flex-none">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="appearance-none w-full md:w-48 bg-gray-50 border border-gray-200 rounded-xl py-2.5 pl-4 pr-10 text-sm font-semibold text-[#1B1B1B] focus:ring-2 focus:ring-[#FCC200]/20 outline-none cursor-pointer"
                >
                  <option value="All">Semua Status</option>
                  <option value="Published">Diterbitkan</option>
                  <option value="Review">Menunggu Review</option>
                  <option value="Revision">Perlu Revisi</option>
                  <option value="Draft">Draft</option>
                  <option value="Rejected">Ditolak</option>
                </select>
                <ChevronDown
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#C4C4C4] pointer-events-none"
                  size={16}
                />
              </div>

              <button className="p-2.5 text-[#C4C4C4] hover:bg-gray-100 rounded-xl transition-colors border border-gray-200">
                <Filter size={18} />
              </button>
            </div>
          </div>

          {/* 2. Data Table */}
          <div className="bg-[#FFFFFF] rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50/80 text-[11px] uppercase font-bold text-[#C4C4C4] tracking-wider border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4">Judul & Kategori</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Terakhir Diupdate</th>
                    <th className="px-6 py-4">Views</th>
                    <th className="px-6 py-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredArticles.length > 0 ? (
                    filteredArticles.map((article) => (
                      <motion.tr
                        key={article.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="group hover:bg-[#FCC200]/[0.03] transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <p className="font-bold text-sm text-[#1B1B1B] line-clamp-1 group-hover:text-[#233982] transition-colors">
                              {article.title}
                            </p>
                            <span className="text-[10px] font-semibold text-[#4F619B] bg-[#4F619B]/10 px-2 py-0.5 rounded-md w-fit mt-1.5">
                              {article.category}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <StatusBadge status={article.status} />
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-xs font-medium text-[#1B1B1B]">
                            {article.date}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#1B1B1B]">
                            <Eye size={14} className="text-[#4F619B]" />
                            {article.views > 0
                              ? article.views.toLocaleString()
                              : "-"}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              className="p-2 text-[#4F619B] hover:bg-[#4F619B]/10 rounded-lg transition-all"
                              title="Preview"
                            >
                              <Eye size={18} />
                            </button>
                            <button
                              className="p-2 text-[#233982] hover:bg-[#233982]/10 rounded-lg transition-all"
                              title="Edit"
                            >
                              <Edit3 size={18} />
                            </button>
                            {/* Tombol Hapus hanya muncul untuk Draft atau Ditolak */}
                            {(article.status === "Draft" ||
                              article.status === "Rejected") && (
                              <button
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                title="Hapus"
                              >
                                <Trash2 size={18} />
                              </button>
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
    </div>
  );
}
