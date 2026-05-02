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
} from "lucide-react";

const COLORS = {
  primary: "#FCC200", // kuning utama
  primarySoft: "#FDCE33",
  primaryLight: "#FDD85C",

  blueDark: "#233982",
  blue: "#4F619B",
  blueLight: "#7281AF",

  black: "#1B1B1B",
  gray: "#C4C4C4",
  white: "#FFFFFF",
};

const App = () => {
  const [activeTab, setActiveTab] = useState("Beranda");
  const [userRole, setUserRole] = useState("visitor"); // visitor, jurnalis, admin
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Dummy Data
  const articles = [
    {
      id: 1,
      title: "Inovasi Teknologi Pendidikan di Era Digital 2024",
      author: "Budi Santoso",
      category: "Teknologi",
      date: "2 Jam yang lalu",
      image:
        "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=800",
      views: "1.2k",
    },
    {
      id: 2,
      title: "Pentingnya Organisasi bagi Pengembangan Karakter Pelajar",
      author: "Siti Aminah",
      category: "Opini",
      date: "5 Jam yang lalu",
      image:
        "https://images.unsplash.com/photo-1523240715634-d1c651177e4d?auto=format&fit=crop&q=80&w=800",
      views: "850",
    },
    {
      id: 3,
      title: "Laporan Khusus: Prestasi Gemilang Atlet Pelajar Nasional",
      author: "Rian Ardianto",
      category: "Olahraga",
      date: "1 Hari yang lalu",
      image:
        "https://images.unsplash.com/photo-1526676037777-05a232554f77?auto=format&fit=crop&q=80&w=800",
      views: "2.4k",
    },
  ];

  const navItems = [
    { name: "Beranda", icon: LayoutDashboard, COLORS: "primary" },
    { name: "Eksplorasi", icon: Search },
    { name: "Jurnalisme", icon: Newspaper, role: "jurnalis" },
    { name: "Panel Admin", icon: Settings, role: "admin" },
  ];

  const filteredNav = navItems.filter(
    (item) => !item.role || item.role === userRole || userRole === "admin",
  );

  return (
    <div className="min-h-screen bg-[#f8faf9] font-sans text-gray-900 selection:bg-green-100">
      {/* Dynamic Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[#d7dd21]/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[#12a44d]/10 blur-[120px]" />
      </div>

      {/* Custom Navigation Bar */}
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? "py-3 bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100" : "py-6 bg-transparent"}`}
      >
        <div className="container mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* <div className="w-10 h-10 bg-gradient-to-br from-[#12a44d] to-[#d7dd21] rounded-xl flex items-center justify-center shadow-lg shadow-green-200">
              <span className="text-white font-bold text-xl">M</span>
            </div> */}
            <div>
              <h1 className="text-xl font-bold tracking-tight text-[#2b529b]">
                Med<span className="text-[#12a44d]">Pel</span>
              </h1>
              <p className="text-[10px] uppercase tracking-[0.2em] font-semibold text-gray-400 leading-none">
                Media Pelajar
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center bg-gray-100/50 p-1 rounded-2xl border border-gray-200/50">
            {filteredNav.map((item) => (
              <button
                key={item.name}
                onClick={() => setActiveTab(item.name)}
                className={`relative px-6 py-2 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2 ${activeTab === item.name ? "text-white" : "text-gray-500 hover:text-gray-800"}`}
              >
                {activeTab === item.name && (
                  <motion.div
                    layoutId="nav-active"
                    className="absolute inset-0 bg-gradient-to-r from-[#12a44d] to-[#11a44c] rounded-xl shadow-md"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  <item.icon size={16} />
                  {item.name}
                </span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center bg-white border border-gray-200 rounded-full px-4 py-1.5 focus-within:ring-2 ring-[#12a44d]/20 transition-all">
              <Search size={16} className="text-gray-400" />
              <input
                type="text"
                placeholder="Cari berita..."
                className="bg-transparent border-none outline-none text-sm ml-2 w-32 focus:w-48 transition-all"
              />
            </div>

            <div className="relative group">
              <button className="flex items-center gap-2 p-1 pr-3 bg-white border border-gray-200 rounded-full hover:shadow-md transition-all">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#2b529b] to-[#2c5298] flex items-center justify-center text-white text-xs font-bold">
                  {userRole === "visitor"
                    ? "V"
                    : userRole === "jurnalis"
                      ? "J"
                      : "A"}
                </div>
                <span className="text-xs font-semibold text-gray-700 capitalize">
                  {userRole}
                </span>
              </button>
              {/* Role Switcher for Prototype */}
              <div className="absolute right-0 top-full mt-2 w-40 bg-white rounded-xl shadow-xl border border-gray-100 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all p-2">
                <p className="text-[10px] text-gray-400 px-2 py-1 uppercase font-bold">
                  Ganti Role (Demo)
                </p>
                {["visitor", "jurnalis", "admin"].map((role) => (
                  <button
                    key={role}
                    onClick={() => setUserRole(role)}
                    className="w-full text-left px-3 py-2 text-xs hover:bg-gray-50 rounded-lg capitalize"
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>

            <button
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="container mx-auto px-6 pt-32 pb-20">
        {activeTab === "Beranda" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Hero Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
              <div className="lg:col-span-8">
                <div className="relative group overflow-hidden rounded-[2rem] aspect-[16/9] shadow-2xl">
                  <img
                    src="https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&q=80&w=1200"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    alt="Featured"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-10">
                    <div className="flex gap-2 mb-4">
                      <span className="px-4 py-1 bg-[#d7dd21] text-[#1a1a1a] text-xs font-bold rounded-full">
                        SOROTAN UTAMA
                      </span>
                      <span className="px-4 py-1 bg-white/20 backdrop-blur-md text-white text-xs font-bold rounded-full">
                        PENDIDIKAN
                      </span>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
                      Membangun Ekosistem Digital <br />
                      Untuk Masa Depan Pelajar Indonesia
                    </h2>
                    <div className="flex items-center gap-6 text-white/80 text-sm">
                      <span className="flex items-center gap-2">
                        <UserCircle size={16} /> Tim Redaksi
                      </span>
                      <span>• 12 Okt 2024</span>
                      <span className="flex items-center gap-2">
                        <TrendingUp size={16} /> Trending #1
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-4 flex flex-col gap-6">
                <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/50 flex-1">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold text-xl text-[#2b529b]">
                      Topik Hangat
                    </h3>
                    <div className="w-8 h-8 bg-gray-50 rounded-full flex items-center justify-center">
                      <MoreHorizontal size={16} />
                    </div>
                  </div>
                  <div className="space-y-4">
                    {[
                      { tag: "#Beasiswa2024", count: "1.2k Postingan" },
                      { tag: "#LombaKaryaIlmiah", count: "850 Postingan" },
                      { tag: "#KurikulumMerdeka", count: "2.1k Postingan" },
                      { tag: "#MentalHealthPelajar", count: "540 Postingan" },
                    ].map((item, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-2xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100 cursor-pointer group"
                      >
                        <p className="font-bold text-[#12a44d] group-hover:translate-x-1 transition-transform">
                          {item.tag}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {item.count}
                        </p>
                      </div>
                    ))}
                  </div>
                  <button className="w-full mt-6 py-3 bg-[#f8faf9] text-[#2b529b] font-bold rounded-xl hover:bg-gray-100 transition-colors">
                    Lihat Semua Topik
                  </button>
                </div>
              </div>
            </div>

            {/* Content Feed */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-2xl font-bold text-gray-800">
                  Berita Terbaru
                </h3>
                <div className="h-1.5 w-12 bg-gradient-to-r from-[#12a44d] to-[#d7dd21] rounded-full mt-2" />
              </div>
              <div className="flex gap-2">
                {["Semua", "Berita", "Prestasi", "Tips"].map((cat) => (
                  <button
                    key={cat}
                    className="px-5 py-2 rounded-full text-xs font-bold border border-gray-200 hover:border-[#12a44d] transition-all"
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.map((article, index) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-[2rem] overflow-hidden border border-gray-100 shadow-lg group hover:shadow-2xl transition-all duration-500"
                >
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={article.image}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      alt={article.title}
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-4 py-1.5 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-black text-[#12a44d] uppercase shadow-sm">
                        {article.category}
                      </span>
                    </div>
                    <button className="absolute bottom-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-gray-600 hover:text-[#12a44d] shadow-sm transition-colors">
                      <Bookmark size={18} />
                    </button>
                  </div>
                  <div className="p-8">
                    <div className="flex items-center gap-3 mb-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      <span>{article.author}</span>
                      <span className="w-1 h-1 bg-gray-300 rounded-full" />
                      <span>{article.date}</span>
                    </div>
                    <h4 className="text-xl font-bold text-gray-800 mb-4 group-hover:text-[#2b529b] transition-colors leading-tight">
                      {article.title}
                    </h4>
                    <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1 text-xs text-gray-400">
                          <BarChart3 size={14} /> {article.views}
                        </span>
                      </div>
                      <button className="flex items-center gap-2 text-sm font-bold text-[#FCC200] group/btn">
                        Baca Selengkapnya
                        <ChevronRight
                          size={16}
                          className="group-hover/btn:translate-x-1 transition-transform"
                        />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Jurnalist Interface View */}
        {activeTab === "Jurnalisme" && userRole !== "visitor" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            <div className="bg-gradient-to-r from-[#2b529b] to-[#2c5298] p-10 rounded-[2.5rem] text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
              <div>
                <h2 className="text-3xl font-bold mb-2">
                  Halo, Kontributor! 👋
                </h2>
                <p className="text-blue-100 opacity-80">
                  Siap untuk membagikan informasi bermanfaat hari ini?
                </p>
              </div>
              <button className="px-8 py-4 bg-[#d7dd21] text-[#1a1a1a] font-black rounded-2xl flex items-center gap-3 hover:scale-105 transition-transform shadow-lg shadow-yellow-400/20">
                <PlusCircle size={20} />
                BUAT ARTIKEL BARU
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  label: "Total Pembaca",
                  val: "45.2k",
                  icon: Users,
                  color: "text-blue-500",
                },
                {
                  label: "Artikel Publish",
                  val: "12",
                  icon: Newspaper,
                  color: "text-green-500",
                },
                {
                  label: "Interaksi",
                  val: "1.2k",
                  icon: Bell,
                  color: "text-yellow-500",
                },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-4"
                >
                  <div
                    className={`w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center ${stat.color}`}
                  >
                    <stat.icon size={24} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase">
                      {stat.label}
                    </p>
                    <p className="text-2xl font-black text-gray-800">
                      {stat.val}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-[2rem] border border-gray-100 shadow-xl overflow-hidden">
              <div className="p-8 border-b border-gray-50 flex justify-between items-center">
                <h3 className="font-bold text-lg">Draf & Postingan Saya</h3>
                <div className="flex gap-2">
                  <button className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-xs font-bold">
                    Terbaru
                  </button>
                  <button className="px-4 py-2 text-gray-400 rounded-lg text-xs font-bold">
                    Populer
                  </button>
                </div>
              </div>
              <div className="p-0">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 text-[10px] uppercase font-black text-gray-400">
                    <tr>
                      <th className="px-8 py-4">Judul Artikel</th>
                      <th className="px-8 py-4">Status</th>
                      <th className="px-8 py-4">Views</th>
                      <th className="px-8 py-4">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {[1, 2, 3].map((i) => (
                      <tr
                        key={i}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-8 py-6">
                          <p className="font-bold text-gray-700">
                            Analisis Kurikulum 2024 terhadap Minat Belajar
                          </p>
                          <p className="text-[10px] text-gray-400 mt-1">
                            Terakhir diedit: 10 Menit yang lalu
                          </p>
                        </td>
                        <td className="px-8 py-6">
                          <span className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-[10px] font-bold">
                            PUBLISHED
                          </span>
                        </td>
                        <td className="px-8 py-6 font-bold text-gray-500">
                          1.240
                        </td>
                        <td className="px-8 py-6">
                          <button className="p-2 text-gray-400 hover:text-blue-500 transition-colors">
                            <Settings size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* Admin Panel Placeholder */}
        {activeTab === "Panel Admin" && userRole === "admin" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 lg:grid-cols-4 gap-8"
          >
            <aside className="lg:col-span-1 space-y-4">
              <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-xl space-y-2">
                {[
                  "Statistik Umum",
                  "Manajemen User",
                  "Moderasi Konten",
                  "Sistem Konfigurasi",
                ].map((item, i) => (
                  <button
                    key={i}
                    className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all ${i === 0 ? "bg-green-50 text-[#12a44d]" : "text-gray-400 hover:bg-gray-50"}`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </aside>
            <div className="lg:col-span-3 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm border-l-4 border-l-[#12a44d]">
                  <h4 className="text-gray-400 text-xs font-black uppercase mb-2">
                    User Aktif
                  </h4>
                  <p className="text-4xl font-black text-gray-800">1.402</p>
                  <div className="mt-4 flex items-center gap-2 text-green-500 text-xs font-bold">
                    <TrendingUp size={14} /> +12% dari bulan lalu
                  </div>
                </div>
                <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm border-l-4 border-l-[#d7dd21]">
                  <h4 className="text-gray-400 text-xs font-black uppercase mb-2">
                    Konten Butuh Review
                  </h4>
                  <p className="text-4xl font-black text-gray-800">08</p>
                  <div className="mt-4 flex items-center gap-2 text-yellow-600 text-xs font-bold">
                    Pending Approval
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-[2rem] border border-gray-100 shadow-xl p-8">
                <h3 className="font-bold mb-6">Log Aktivitas Sistem</h3>
                <div className="space-y-6">
                  {[
                    {
                      user: "Admin01",
                      act: "Merubah pengaturan landing page",
                      time: "2 menit yang lalu",
                    },
                    {
                      user: "Jurnalis_Rian",
                      act: "Mengupload artikel baru: Tips Belajar",
                      time: "15 menit yang lalu",
                    },
                    {
                      user: "Sistem",
                      act: "Backup otomatis selesai",
                      time: "1 jam yang lalu",
                    },
                  ].map((log, i) => (
                    <div
                      key={i}
                      className="flex gap-4 items-start pb-4 border-b border-gray-50 last:border-0"
                    >
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                      <div>
                        <p className="text-sm text-gray-700">
                          <strong>{log.user}</strong> {log.act}
                        </p>
                        <p className="text-[10px] text-gray-400 uppercase font-bold mt-1">
                          {log.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </main>

      {/* Footer Section */}
      <footer className="bg-white border-t border-gray-100 pt-20 pb-10">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center gap-2 mb-6">
                {/* <div className="w-8 h-8 bg-[#12a44d] rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">M</span>
                </div> */}
                <h1 className="text-lg font-bold tracking-tight text-[#2b529b]">
                  Med<span className="text-[#12a44d]">Pel</span>
                </h1>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed">
                Wadah aspirasi dan informasi terpercaya bagi seluruh pelajar di
                Indonesia untuk masa depan yang lebih cerah.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-gray-800 mb-6">Navigasi</h4>
              <ul className="space-y-4 text-sm text-gray-500">
                <li className="hover:text-[#12a44d] cursor-pointer transition-colors">
                  Tentang Kami
                </li>
                <li className="hover:text-[#12a44d] cursor-pointer transition-colors">
                  Redaksi
                </li>
                <li className="hover:text-[#12a44d] cursor-pointer transition-colors">
                  Kebijakan Privasi
                </li>
                <li className="hover:text-[#12a44d] cursor-pointer transition-colors">
                  Kontak Kami
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-gray-800 mb-6">Kategori</h4>
              <ul className="space-y-4 text-sm text-gray-500">
                <li className="hover:text-[#12a44d] cursor-pointer transition-colors">
                  Pendidikan
                </li>
                <li className="hover:text-[#12a44d] cursor-pointer transition-colors">
                  Gaya Hidup
                </li>
                <li className="hover:text-[#12a44d] cursor-pointer transition-colors">
                  Prestasi
                </li>
                <li className="hover:text-[#12a44d] cursor-pointer transition-colors">
                  Teknologi
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-gray-800 mb-6">Newsletter</h4>
              <p className="text-xs text-gray-500 mb-4">
                Dapatkan update berita pilihan setiap pagi.
              </p>
              <div className="flex bg-gray-100 p-1 rounded-xl">
                <input
                  type="text"
                  placeholder="Email Anda"
                  className="bg-transparent border-none outline-none text-xs px-3 w-full"
                />
                <button className="bg-[#12a44d] text-white p-2 rounded-lg">
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
          <div className="pt-10 border-t border-gray-50 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-gray-400 font-medium">
              © 2024 MedPel Indonesia. All rights reserved.
            </p>
            <div className="flex gap-6 text-gray-400">
              <Share2
                size={18}
                className="hover:text-[#2b529b] cursor-pointer transition-colors"
              />
              <Users
                size={18}
                className="hover:text-[#2b529b] cursor-pointer transition-colors"
              />
              <Bell
                size={18}
                className="hover:text-[#2b529b] cursor-pointer transition-colors"
              />
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Action for Mobiles (Contextual) */}
      <AnimatePresence>
        {userRole !== "visitor" && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed bottom-8 right-8 w-16 h-16 bg-[#12a44d] text-white rounded-full shadow-2xl flex items-center justify-center z-50 hover:rotate-90 transition-transform duration-500"
          >
            <PlusCircle size={32} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
