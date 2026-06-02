"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Newspaper,
  Users,
  TrendingUp,
  Search,
  ChevronRight,
  Bookmark,
  Share2,
  MoreHorizontal,
  Menu,
  X,
  UserCircle,
  BarChart3,
} from "lucide-react";

const App = () => {
  const [activeTab, setActiveTab] = useState("Beranda");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // OPTIMASI 1: Scroll listener dengan requestAnimationFrame & passive: true
  // Mencegah thread utama terhambat saat user scroll cepat
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const isScrolled = window.scrollY > 20;
          // Hanya update state jika nilai benar-benar berubah
          setScrolled((prev) => (prev !== isScrolled ? isScrolled : prev));
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Cek posisi awal

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Data khusus pengguna/pembaca
  const navItems = [
    { name: "Beranda", icon: LayoutDashboard },
    { name: "Nasional", icon: Newspaper },
    { name: "Pendidikan", icon: Users },
    { name: "Olahraga", icon: TrendingUp },
  ];

  const articles = [
    {
      id: 1,
      title: "Inovasi Teknologi Pendidikan di Era Digital 2024",
      author: "Budi Santoso",
      category: "Teknologi",
      date: "2 Jam yang lalu",
      image: "/kegiatan1.jpeg",
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

  return (
    <div className="min-h-screen bg-[#f8faf9] font-sans text-gray-900 selection:bg-yellow-100">
      {/* Dynamic Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[#FDCE33]/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[#4F619B]/10 blur-[120px]" />
      </div>

      {/* 
        OPTIMASI 2: Navbar yang sangat optimal 
        - will-change: memberi hint ke browser untuk mempersiapkan kompositing GPU
        - transition spesifik: hanya properti yang berubah yang dianimasikan
      */}
      <nav
        className="fixed top-0 w-full z-50 will-change-[background-color,backdrop-filter,box-shadow,padding] transition-[background-color,backdrop-filter,box-shadow,padding] duration-300 ease-out"
        style={{
          backgroundColor: scrolled
            ? "rgba(255, 255, 255, 0.85)"
            : "transparent",
          backdropFilter: scrolled ? "blur(12px)" : "none",
          boxShadow: scrolled ? "0 1px 3px 0 rgb(0 0 0 / 0.05)" : "none",
          paddingTop: scrolled ? "12px" : "24px",
          paddingBottom: scrolled ? "12px" : "24px",
          borderBottom: scrolled
            ? "1px solid rgba(0,0,0,0.05)"
            : "1px solid transparent",
        }}
      >
        <div className="container mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/medpel.png"
              alt="MedPel Logo"
              className="w-12 h-12 object-contain"
              width={48}
              height={48}
            />
            <div>
              <h1 className="text-xl font-bold tracking-tight text-[#233982]">
                Med<span className="text-[#FCC200]">Pel</span>
              </h1>
              <p className="text-[10px] uppercase tracking-[0.2em] font-semibold text-gray-400 leading-none">
                Media Pelajar
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center bg-gray-100/50 p-1 rounded-2xl border border-gray-200/50">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => setActiveTab(item.name)}
                className={`relative px-6 py-2 rounded-xl text-sm font-medium transition-colors duration-300 flex items-center gap-2 ${
                  activeTab === item.name
                    ? "text-white"
                    : "text-gray-500 hover:text-gray-800"
                }`}
              >
                {activeTab === item.name && (
                  <motion.div
                    layoutId="nav-active"
                    className="absolute inset-0 bg-gradient-to-r from-[#233982] to-[#4F619B] rounded-xl shadow-md"
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
            <div className="hidden sm:flex items-center bg-white border border-gray-200 rounded-full px-4 py-1.5 focus-within:ring-2 ring-[#FCC200]/20 transition-shadow">
              <Search size={16} className="text-gray-400" />
              <input
                type="text"
                placeholder="Cari berita..."
                className="bg-transparent border-none outline-none text-sm ml-2 w-32 focus:w-48 transition-[width] duration-300"
              />
            </div>

            <button className="flex items-center gap-2 p-1 pr-3 bg-white border border-gray-200 rounded-full hover:shadow-md transition-shadow">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#233982] to-[#4F619B] flex items-center justify-center text-white text-xs font-bold">
                U
              </div>
              <span className="text-xs font-semibold text-gray-700 hidden sm:block">
                Masuk
              </span>
            </button>

            <button
              className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="md:hidden overflow-hidden bg-white/95 backdrop-blur-md border-t border-gray-100"
            >
              <div className="container mx-auto px-6 py-4 space-y-2">
                {navItems.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => {
                      setActiveTab(item.name);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                      activeTab === item.name
                        ? "bg-[#FCC200]/10 text-[#233982]"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <item.icon size={18} />
                    {item.name}
                  </button>
                ))}
                <div className="pt-4 mt-2 border-t border-gray-100">
                  <div className="flex items-center bg-gray-50 border border-gray-200 rounded-full px-4 py-2">
                    <Search size={16} className="text-gray-400" />
                    <input
                      type="text"
                      placeholder="Cari berita..."
                      className="bg-transparent border-none outline-none text-sm ml-2 w-full"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Main Content Area (Khusus Pengguna/Pembaca) */}
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
                  {/* OPTIMASI 3: fetchPriority="high" untuk mempercepat LCP (Largest Contentful Paint) */}
                  <img
                    src="/kegiatan1.jpeg"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    alt="Featured"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-10">
                    <div className="flex gap-2 mb-4">
                      <span className="px-4 py-1 bg-[#FCC200] text-[#1B1B1B] text-xs font-bold rounded-full">
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
                    <h3 className="font-bold text-xl text-[#233982]">
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
                        <p className="font-bold text-[#FCC200] group-hover:translate-x-1 transition-transform">
                          {item.tag}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {item.count}
                        </p>
                      </div>
                    ))}
                  </div>
                  <button className="w-full mt-6 py-3 bg-[#f8faf9] text-[#233982] font-bold rounded-xl hover:bg-gray-100 transition-colors">
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
                <div className="h-1.5 w-12 bg-gradient-to-r from-[#FCC200] to-[#FDCE33] rounded-full mt-2" />
              </div>
              <div className="flex gap-2">
                {["Semua", "Berita", "Prestasi", "Tips"].map((cat) => (
                  <button
                    key={cat}
                    className="px-5 py-2 rounded-full text-xs font-bold border border-gray-200 hover:border-[#FCC200] transition-colors"
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
                  className="bg-white rounded-[2rem] overflow-hidden border border-gray-100 shadow-lg group hover:shadow-2xl transition-shadow duration-500"
                >
                  <div className="relative h-56 overflow-hidden">
                    {/* OPTIMASI 4: Lazy loading & async decoding untuk gambar di bawah fold */}
                    <img
                      src={article.image}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      alt={article.title}
                      loading="lazy"
                      decoding="async"
                      width={800}
                      height={600}
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-4 py-1.5 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-black text-[#FCC200] uppercase shadow-sm">
                        {article.category}
                      </span>
                    </div>
                    <button
                      className="absolute bottom-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-gray-600 hover:text-[#FCC200] shadow-sm transition-colors"
                      aria-label="Bookmark article"
                    >
                      <Bookmark size={18} />
                    </button>
                  </div>
                  <div className="p-8">
                    <div className="flex items-center gap-3 mb-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      <span>{article.author}</span>
                      <span className="w-1 h-1 bg-gray-300 rounded-full" />
                      <span>{article.date}</span>
                    </div>
                    <h4 className="text-xl font-bold text-gray-800 mb-4 group-hover:text-[#233982] transition-colors leading-tight">
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

        {/* Placeholder untuk tab lain agar tidak error saat diklik */}
        {activeTab !== "Beranda" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-32 text-center"
          >
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <Search size={40} className="text-gray-300" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Halaman {activeTab}
            </h2>
            <p className="text-gray-500 max-w-md">
              Konten untuk kategori ini sedang dalam proses kurasi oleh tim
              redaksi kami. Silakan kembali lagi nanti.
            </p>
          </motion.div>
        )}
      </main>

      {/* Footer Section */}
      <footer className="bg-white border-t border-gray-100 pt-20 pb-10">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center gap-2 mb-6">
                {/* <div className="w-8 h-8 bg-[#FCC200] rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">M</span>
                </div> */}
                <h1 className="text-lg font-bold tracking-tight text-[#233982]">
                  Med<span className="text-[#FCC200]">Pel</span>
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
                {[
                  "Tentang Kami",
                  "Redaksi",
                  "Kebijakan Privasi",
                  "Kontak Kami",
                ].map((item) => (
                  <li
                    key={item}
                    className="hover:text-[#FCC200] cursor-pointer transition-colors"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-gray-800 mb-6">Kategori</h4>
              <ul className="space-y-4 text-sm text-gray-500">
                {["Pendidikan", "Gaya Hidup", "Prestasi", "Teknologi"].map(
                  (item) => (
                    <li
                      key={item}
                      className="hover:text-[#FCC200] cursor-pointer transition-colors"
                    >
                      {item}
                    </li>
                  ),
                )}
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
                <button className="bg-[#FCC200] text-[#1B1B1B] p-2 rounded-lg hover:bg-[#FDCE33] transition-colors">
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
                className="hover:text-[#233982] cursor-pointer transition-colors"
              />
              <Users
                size={18}
                className="hover:text-[#233982] cursor-pointer transition-colors"
              />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
