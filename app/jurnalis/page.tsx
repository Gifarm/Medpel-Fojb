"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Newspaper,
  Users,
  Settings,
  Bell,
  Search,
  ChevronRight,
  TrendingUp,
  Bookmark,
  Share2,
  MoreHorizontal,
  PlusCircle,
  BarChart3,
  UserCircle,
  Menu,
  X,
  FileText,
  MessageSquare,
  Eye,
  LogOut,
  Image as ImageIcon,
  Send,
  Save,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

const COLORS = {
  primary: "#12a44d",
  secondary: "#d7dd21",
  accent: "#2b529b",
  bg: "#f8faf9",
};

const App = () => {
  const [userRole, setUserRole] = useState("jurnalis"); // Default ke jurnalis untuk demo ini
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isWriting, setIsWriting] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Mock Data
  const myArticles = [
    {
      id: 1,
      title: "Tips Belajar Efektif Menjelang UTBK 2024",
      status: "Published",
      views: 2450,
      comments: 45,
      date: "12 Okt 2024",
    },
    {
      id: 2,
      title: "Review Organisasi Siswa Intra Sekolah (OSIS)",
      status: "Draft",
      views: 0,
      comments: 0,
      date: "14 Okt 2024",
    },
    {
      id: 3,
      title: "Lomba Esai Nasional: Peluang Pelajar Berprestasi",
      status: "Review",
      views: 120,
      comments: 2,
      date: "15 Okt 2024",
    },
  ];

  const sidebarItems = [
    { name: "Dashboard", icon: LayoutDashboard },
    { name: "Artikel Saya", icon: FileText },
    { name: "Statistik Pembaca", icon: BarChart3 },
    { name: "Komentar", icon: MessageSquare },
    { name: "Pengaturan", icon: Settings },
  ];

  // Logic to handle layout based on role
  const isDashboardMode = userRole === "jurnalis" || userRole === "admin";

  return (
    <div className="min-h-screen bg-[#f8faf9] font-sans text-gray-900 overflow-x-hidden">
      {/* Role Switcher Floating (Demo Only) */}
      <div className="fixed bottom-4 left-4 z-[100] flex gap-2 bg-white/80 backdrop-blur shadow-lg border border-gray-100 p-2 rounded-2xl">
        {["visitor", "jurnalis", "admin"].map((r) => (
          <button
            key={r}
            onClick={() => setUserRole(r)}
            className={`px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase transition-all ${userRole === r ? "bg-[#12a44d] text-white" : "text-gray-400 hover:bg-gray-100"}`}
          >
            {r}
          </button>
        ))}
      </div>

      {/* --- VISITOR VIEW --- */}
      {userRole === "visitor" && (
        <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-3xl flex items-center justify-center text-[#12a44d] mb-6">
            <LayoutDashboard size={40} />
          </div>
          <h1 className="text-3xl font-bold text-[#2b529b] mb-4">
            Halaman Publik MedPel
          </h1>
          <p className="text-gray-500 max-w-md mb-8">
            Anda sedang berada di mode pengunjung. Klik switcher di pojok kiri
            bawah untuk melihat sistem Jurnalis/Admin.
          </p>
          <button
            onClick={() => setUserRole("jurnalis")}
            className="px-8 py-4 bg-[#12a44d] text-white rounded-2xl font-bold shadow-xl shadow-green-200 transition-transform hover:scale-105"
          >
            Masuk sebagai Jurnalis
          </button>
        </div>
      )}

      {/* --- DASHBOARD JURNALIS/ADMIN VIEW --- */}
      {isDashboardMode && (
        <div className="flex min-h-screen relative">
          {/* Sidebar */}
          <motion.aside
            initial={false}
            animate={{ width: isSidebarOpen ? 280 : 80 }}
            className="fixed left-0 top-0 h-full bg-white border-r border-gray-100 z-50 flex flex-col transition-all duration-300"
          >
            {/* Sidebar Logo */}
            <div className="p-6 flex items-center gap-3">
              {/* <div className="min-w-[40px] h-10 bg-gradient-to-br from-[#12a44d] to-[#d7dd21] rounded-xl flex items-center justify-center shadow-lg shadow-green-100">
                <span className="text-white font-bold text-xl">M</span>
              </div> */}
              <AnimatePresence>
                {isSidebarOpen && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="overflow-hidden whitespace-nowrap"
                  >
                    <h1 className="font-bold text-[#2b529b]">
                      Med<span className="text-[#12a44d]">Pel</span>
                    </h1>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-none">
                      Creative Hub
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Sidebar Nav */}
            <div className="flex-1 px-4 py-6 space-y-2">
              {sidebarItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => setActiveTab(item.name)}
                  className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group relative ${activeTab === item.name ? "bg-green-50 text-[#12a44d]" : "text-gray-400 hover:bg-gray-50"}`}
                >
                  <item.icon
                    size={20}
                    className={
                      activeTab === item.name
                        ? "text-[#12a44d]"
                        : "group-hover:text-gray-600"
                    }
                  />
                  <AnimatePresence>
                    {isSidebarOpen && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-sm font-bold"
                      >
                        {item.name}
                      </motion.span>
                    )}
                  </AnimatePresence>
                  {activeTab === item.name && (
                    <motion.div
                      layoutId="sidebar-active"
                      className="absolute left-0 w-1 h-6 bg-[#12a44d] rounded-r-full"
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Sidebar Footer */}
            <div className="p-4 mt-auto">
              <div
                className={`flex items-center gap-3 p-3 bg-gray-50 rounded-2xl transition-all ${!isSidebarOpen ? "justify-center" : ""}`}
              >
                <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 shrink-0 font-bold">
                  J
                </div>
                {isSidebarOpen && (
                  <div className="overflow-hidden">
                    <p className="text-xs font-bold text-gray-800 truncate">
                      Jurnalis_Medpel
                    </p>
                    <p className="text-[10px] text-gray-400 uppercase font-black">
                      Level 3 Editor
                    </p>
                  </div>
                )}
              </div>
              <button
                className={`w-full mt-2 flex items-center gap-4 px-4 py-3 rounded-xl text-red-400 hover:bg-red-50 transition-all ${!isSidebarOpen ? "justify-center" : ""}`}
              >
                <LogOut size={18} />
                {isSidebarOpen && (
                  <span className="text-xs font-bold uppercase">Keluar</span>
                )}
              </button>
            </div>

            {/* Toggle Button */}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="absolute -right-3 top-12 w-6 h-6 bg-white border border-gray-100 shadow-md rounded-full flex items-center justify-center text-gray-400 hover:text-[#12a44d] transition-colors"
            >
              {isSidebarOpen ? <X size={12} /> : <ChevronRight size={12} />}
            </button>
          </motion.aside>

          {/* Main Dashboard Content */}
          <main
            className={`flex-1 transition-all duration-300 ${isSidebarOpen ? "pl-[280px]" : "pl-[80px]"}`}
          >
            {/* Dashboard Header */}
            <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-40 px-8 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-800">{activeTab}</h2>
                <div className="flex items-center gap-2 text-[10px] text-gray-400 uppercase font-bold tracking-widest">
                  <span>Jurnalis</span>
                  <ChevronRight size={10} />
                  <span className="text-[#12a44d]">{activeTab}</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <button className="p-2.5 text-gray-400 hover:bg-gray-100 rounded-xl transition-colors relative">
                  <Bell size={20} />
                  <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
                </button>
                <div className="h-8 w-[1px] bg-gray-100 mx-2" />
                <button
                  onClick={() => setIsWriting(true)}
                  className="px-6 py-2.5 bg-[#12a44d] text-white text-sm font-bold rounded-xl shadow-lg shadow-green-200 flex items-center gap-2 hover:translate-y-[-2px] transition-all active:scale-95"
                >
                  <PlusCircle size={18} />
                  TULIS BERITA
                </button>
              </div>
            </header>

            <div className="p-8">
              {activeTab === "Dashboard" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-8"
                >
                  {/* Summary Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {[
                      {
                        label: "Views Bulan Ini",
                        val: "12,402",
                        change: "+24%",
                        icon: Eye,
                        color: "blue",
                      },
                      {
                        label: "Komentar Baru",
                        val: "48",
                        change: "+12%",
                        icon: MessageSquare,
                        color: "yellow",
                      },
                      {
                        label: "Artikel Live",
                        val: "24",
                        change: "0%",
                        icon: FileText,
                        color: "green",
                      },
                      {
                        label: "Poin Reputasi",
                        val: "850",
                        change: "+5",
                        icon: TrendingUp,
                        color: "purple",
                      },
                    ].map((s, i) => (
                      <div
                        key={i}
                        className="bg-white p-6 rounded-[2rem] border border-gray-50 shadow-sm hover:shadow-xl hover:shadow-gray-200/50 transition-all group"
                      >
                        <div
                          className={`w-12 h-12 rounded-2xl mb-4 flex items-center justify-center bg-${s.color}-50 text-${s.color}-500 group-hover:scale-110 transition-transform`}
                        >
                          <s.icon size={24} />
                        </div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                          {s.label}
                        </p>
                        <div className="flex items-end justify-between mt-1">
                          <h3 className="text-2xl font-black text-gray-800">
                            {s.val}
                          </h3>
                          <span className="text-[10px] font-bold text-green-500 bg-green-50 px-2 py-0.5 rounded-full">
                            {s.change}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Main Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Performance Chart Placeholder */}
                    <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-gray-50 shadow-sm p-8">
                      <div className="flex items-center justify-between mb-8">
                        <div>
                          <h3 className="font-bold text-lg">
                            Statistik Kunjungan
                          </h3>
                          <p className="text-xs text-gray-400">
                            Analisis data 7 hari terakhir
                          </p>
                        </div>
                        <select className="bg-gray-50 text-[10px] font-bold border-none rounded-lg px-4 py-2 outline-none">
                          <option>7 Hari Terakhir</option>
                          <option>30 Hari Terakhir</option>
                        </select>
                      </div>
                      <div className="h-64 w-full flex items-end gap-3 px-4">
                        {[40, 70, 45, 90, 65, 80, 100].map((h, i) => (
                          <div
                            key={i}
                            className="flex-1 flex flex-col items-center gap-3 group"
                          >
                            <motion.div
                              initial={{ height: 0 }}
                              animate={{ height: `${h}%` }}
                              className="w-full bg-gradient-to-t from-[#12a44d] to-[#d7dd21] rounded-t-xl relative group-hover:brightness-110 transition-all cursor-pointer"
                            >
                              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                {h * 120} Views
                              </div>
                            </motion.div>
                            <span className="text-[10px] font-bold text-gray-400">
                              Sen-Min[i]
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Task/Feedback List */}
                    <div className="bg-white rounded-[2.5rem] border border-gray-50 shadow-sm p-8">
                      <h3 className="font-bold text-lg mb-6">Ulasan Editor</h3>
                      <div className="space-y-4">
                        {[
                          {
                            status: "rejected",
                            msg: "Perbaiki typo pada paragraf 2 artikel Beasiswa.",
                            time: "2j",
                          },
                          {
                            status: "approved",
                            msg: 'Artikel "UTBK 2024" telah disetujui.',
                            time: "5j",
                          },
                          {
                            status: "pending",
                            msg: 'Artikel "OSIS" sedang dalam review.',
                            time: "1h",
                          },
                        ].map((item, i) => (
                          <div
                            key={i}
                            className="flex gap-4 p-4 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors"
                          >
                            <div
                              className={`mt-1 ${item.status === "rejected" ? "text-red-500" : item.status === "approved" ? "text-green-500" : "text-yellow-500"}`}
                            >
                              {item.status === "rejected" ? (
                                <AlertCircle size={18} />
                              ) : item.status === "approved" ? (
                                <CheckCircle2 size={18} />
                              ) : (
                                <MoreHorizontal size={18} />
                              )}
                            </div>
                            <div>
                              <p className="text-xs font-medium text-gray-700 leading-relaxed">
                                {item.msg}
                              </p>
                              <p className="text-[10px] text-gray-400 mt-1 uppercase font-bold">
                                {item.time} yang lalu
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                      <button className="w-full mt-6 py-3 border border-dashed border-gray-200 text-gray-400 text-xs font-bold rounded-xl hover:bg-gray-50 transition-all">
                        Lihat Semua Notifikasi
                      </button>
                    </div>
                  </div>

                  {/* My Articles Table */}
                  <div className="bg-white rounded-[2.5rem] border border-gray-50 shadow-sm overflow-hidden">
                    <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                      <h3 className="font-bold">Daftar Konten Saya</h3>
                      <button className="text-[#2b529b] text-xs font-bold hover:underline">
                        Lihat Semua Artikel
                      </button>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead className="bg-gray-50 text-[10px] uppercase font-black text-gray-400">
                          <tr>
                            <th className="px-8 py-4">Judul & Kategori</th>
                            <th className="px-8 py-4">Status</th>
                            <th className="px-8 py-4">Metrik</th>
                            <th className="px-8 py-4">Tanggal</th>
                            <th className="px-8 py-4 text-center">Aksi</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                          {myArticles.map((art) => (
                            <tr
                              key={art.id}
                              className="group hover:bg-gray-50 transition-all"
                            >
                              <td className="px-8 py-6">
                                <p className="font-bold text-gray-800 text-sm group-hover:text-[#12a44d] transition-colors">
                                  {art.title}
                                </p>
                                <span className="text-[10px] text-gray-400 font-bold uppercase mt-1 inline-block">
                                  Tips & Trik
                                </span>
                              </td>
                              <td className="px-8 py-6">
                                <span
                                  className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                                    art.status === "Published"
                                      ? "bg-green-100 text-green-600"
                                      : art.status === "Draft"
                                        ? "bg-gray-100 text-gray-500"
                                        : "bg-yellow-100 text-yellow-600"
                                  }`}
                                >
                                  {art.status}
                                </span>
                              </td>
                              <td className="px-8 py-6">
                                <div className="flex items-center gap-4">
                                  <span className="flex items-center gap-1 text-xs text-gray-500 font-medium">
                                    <Eye size={14} /> {art.views}
                                  </span>
                                  <span className="flex items-center gap-1 text-xs text-gray-500 font-medium">
                                    <MessageSquare size={14} /> {art.comments}
                                  </span>
                                </div>
                              </td>
                              <td className="px-8 py-6 text-xs text-gray-400 font-medium">
                                {art.date}
                              </td>
                              <td className="px-8 py-6">
                                <div className="flex items-center justify-center gap-2">
                                  <button className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all">
                                    <Settings size={16} />
                                  </button>
                                  <button className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                                    <X size={16} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </main>
        </div>
      )}

      {/* --- WRITING MODAL (OVERLAY) --- */}
      <AnimatePresence>
        {isWriting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-[#f8faf9] flex flex-col"
          >
            {/* Writing Header */}
            <header className="h-20 bg-white border-b border-gray-100 px-8 flex items-center justify-between sticky top-0">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setIsWriting(false)}
                  className="p-2 text-gray-400 hover:bg-gray-100 rounded-xl transition-all"
                >
                  <X size={20} />
                </button>
                <div className="h-6 w-[1px] bg-gray-200" />
                <h2 className="font-bold text-gray-800">Tulis Artikel Baru</h2>
              </div>
              <div className="flex items-center gap-3">
                <button className="px-6 py-2.5 text-gray-500 text-sm font-bold flex items-center gap-2 hover:bg-gray-100 rounded-xl transition-all">
                  <Save size={18} /> SIMPAN DRAF
                </button>
                <button className="px-8 py-2.5 bg-[#12a44d] text-white text-sm font-bold rounded-xl shadow-lg shadow-green-200 flex items-center gap-2 hover:brightness-110 active:scale-95 transition-all">
                  <Send size={18} /> PUBLISH SEKARANG
                </button>
              </div>
            </header>

            {/* Editor Area */}
            <div className="flex-1 overflow-y-auto py-12 px-6">
              <div className="max-w-4xl mx-auto space-y-12">
                {/* Image Upload Area */}
                <div className="relative group aspect-[21/9] bg-gray-100 rounded-[3rem] border-4 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 hover:border-[#12a44d] hover:bg-green-50 transition-all cursor-pointer overflow-hidden">
                  <ImageIcon
                    size={48}
                    strokeWidth={1.5}
                    className="mb-4 group-hover:scale-110 transition-transform"
                  />
                  <p className="font-bold">Klik untuk unggah banner utama</p>
                  <p className="text-[10px] uppercase font-black tracking-widest mt-2">
                    Rekomendasi: 1200x500px (Max 2MB)
                  </p>
                </div>

                {/* Title & Category */}
                <div className="space-y-6">
                  <input
                    type="text"
                    placeholder="Masukkan Judul Berita yang Menarik..."
                    className="w-full text-4xl md:text-5xl font-black bg-transparent border-none outline-none placeholder:text-gray-200 text-gray-800"
                  />
                  <div className="flex flex-wrap gap-3">
                    {[
                      "Pendidikan",
                      "Opini",
                      "Event",
                      "Teknologi",
                      "Olahraga",
                    ].map((cat) => (
                      <button
                        key={cat}
                        className="px-6 py-2.5 rounded-2xl border border-gray-200 text-xs font-bold text-gray-500 hover:border-[#12a44d] hover:text-[#12a44d] transition-all"
                      >
                        {cat}
                      </button>
                    ))}
                    <button className="px-6 py-2.5 rounded-2xl border border-dashed border-gray-200 text-xs font-bold text-gray-300">
                      + Tambah Kategori
                    </button>
                  </div>
                </div>

                {/* Content Placeholder */}
                <div className="min-h-[400px] text-lg text-gray-600 leading-relaxed">
                  <textarea
                    placeholder="Mulai menulis cerita Anda di sini..."
                    className="w-full h-full min-h-[400px] bg-transparent border-none outline-none resize-none placeholder:text-gray-300"
                  />
                </div>
              </div>
            </div>

            {/* Simple Editor Toolbar */}
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-xl border border-gray-100 px-8 py-4 rounded-3xl shadow-2xl flex items-center gap-8">
              <button className="text-gray-400 hover:text-gray-800 font-serif font-bold text-xl italic transition-colors">
                B
              </button>
              <button className="text-gray-400 hover:text-gray-800 font-serif font-bold text-xl italic transition-colors underline">
                U
              </button>
              <div className="h-4 w-[1px] bg-gray-200" />
              <button className="text-gray-400 hover:text-gray-800 transition-colors">
                <ImageIcon size={20} />
              </button>
              <button className="text-gray-400 hover:text-gray-800 transition-colors">
                <Search size={20} />
              </button>
              <div className="h-4 w-[1px] bg-gray-200" />
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                0 Kata • Draft tersimpan
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
