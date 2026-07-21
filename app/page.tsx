/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  LayoutGrid,
  Hash,
  Info,
  Mail,
  Search,
  ChevronRight,
  ChevronDown,
  Bookmark,
  Share2,
  MoreHorizontal,
  Menu,
  X,
  UserCircle,
  BarChart3,
  TrendingUp,
  Users,
  GraduationCap,
  Cpu,
  Trophy,
  BookOpen,
  Dumbbell,
  Palette,
  MessageSquare,
  Award,
  Medal,
  Lightbulb,
  Briefcase,
  Gamepad2,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import Navbar from "@/components/admin/Navbar";
import Footer from "@/components/ui/footer";

const App = () => {
  const [activeTab, setActiveTab] = useState("Beranda");
  const [activeCategory, setActiveCategory] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [mobileCategoryOpen, setMobileCategoryOpen] = useState(false); // State terpisah untuk mobile

  // OPTIMASI: Scroll listener
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const isScrolled = window.scrollY > 20;
          setScrolled((prev) => (prev !== isScrolled ? isScrolled : prev));
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Tutup dropdown ketika klik di luar
  useEffect(() => {
    const handleClickOutside = (e: any) => {
      if (!e.target.closest("[data-category-dropdown]")) {
        setIsCategoryOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // Reset mobile category saat mobile menu ditutup
  useEffect(() => {
    if (!isMobileMenuOpen) {
      setMobileCategoryOpen(false);
    }
  }, [isMobileMenuOpen]);

  const navItems = [
    { name: "Beranda", icon: Home },
    { name: "Kategori", icon: LayoutGrid, hasDropdown: true },
    { name: "Tag Populer", icon: Hash },
    { name: "Tentang Kami", icon: Info },
    { name: "Kontak", icon: Mail },
  ];

  const popularCategories = [
    {
      name: "Pendidikan",
      icon: GraduationCap,
      desc: "Kurikulum, sekolah, belajar",
      color: "from-blue-500 to-blue-600",
      count: 124,
    },
    {
      name: "Teknologi",
      icon: Cpu,
      desc: "Inovasi, gadget, digital",
      color: "from-purple-500 to-purple-600",
      count: 89,
    },
    {
      name: "Prestasi",
      icon: Trophy,
      desc: "Juara, kompetisi, penghargaan",
      color: "from-yellow-500 to-orange-500",
      count: 67,
    },
    {
      name: "Beasiswa",
      icon: Award,
      desc: "Info beasiswa dalam & luar negeri",
      color: "from-emerald-500 to-emerald-600",
      count: 45,
    },
  ];

  const allCategories = [
    { name: "Pendidikan", icon: GraduationCap, count: 124 },
    { name: "Teknologi", icon: Cpu, count: 89 },
    { name: "Kegiatan Sekolah", icon: BookOpen, count: 156 },
    { name: "Prestasi", icon: Trophy, count: 67 },
    { name: "Olahraga", icon: Dumbbell, count: 43 },
    { name: "Seni & Budaya", icon: Palette, count: 38 },
    { name: "Opini", icon: MessageSquare, count: 92 },
    { name: "Beasiswa", icon: Award, count: 45 },
    { name: "Lomba", icon: Medal, count: 71 },
    { name: "Tips & Tricks", icon: Lightbulb, count: 58 },
    { name: "Karir & Kuliah", icon: Briefcase, count: 34 },
    { name: "Hiburan", icon: Gamepad2, count: 29 },
  ];

  const articles = [
    {
      id: 1,
      title: "Inovasi Teknologi Pendidikan di Era Digital 2026",
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
      image: "/kegiatan1.jpeg",
      views: "850",
    },
    {
      id: 3,
      title: "Laporan Khusus: Prestasi Gemilang Atlet Pelajar Nasional",
      author: "Rian Ardianto",
      category: "Olahraga",
      date: "1 Hari yang lalu",
      image: "/kegiatan1.jpeg",
      views: "2.4k",
    },
  ];

  const isCategoryActive = activeTab === "Kategori" || activeCategory !== null;

  const handleCategoryClick = (categoryName: any) => {
    setActiveTab("Kategori");
    setActiveCategory(categoryName);
    setIsCategoryOpen(false);
    setMobileCategoryOpen(false);
    setIsMobileMenuOpen(false);
  };

  const handleViewAllCategories = () => {
    setActiveTab("Kategori");
    setActiveCategory(null);
    setIsCategoryOpen(false);
    setMobileCategoryOpen(false);
    setIsMobileMenuOpen(false);
  };

  const handleMobileCategoryToggle = () => {
    setMobileCategoryOpen(!mobileCategoryOpen);
  };

  return (
    <div className="min-h-screen bg-[#f8faf9] font-sans text-gray-900 selection:bg-yellow-100">
      {/* Dynamic Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[#FDCE33]/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[#4F619B]/10 blur-[120px]" />
      </div>

      {/* Navbar */}
      <Navbar></Navbar>

      {/* Main Content Area */}
      <main className="container mx-auto px-6 pt-32 pb-20">
        {activeTab === "Beranda" && !activeCategory && (
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
                      <span>• 12 Okt 2026</span>
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
                      { tag: "#Beasiswa2026", count: "1.2k Postingan" },
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

        {/* Halaman Kategori */}
        {activeTab === "Kategori" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                {activeCategory
                  ? `Kategori: ${activeCategory}`
                  : "Semua Kategori"}
              </h2>
              <div className="h-1.5 w-12 bg-gradient-to-r from-[#FCC200] to-[#FDCE33] rounded-full" />
            </div>

            {activeCategory ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {articles
                  .filter((a) => a.category === activeCategory)
                  .map((article, index) => (
                    <motion.div
                      key={article.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white rounded-[2rem] overflow-hidden border border-gray-100 shadow-lg group hover:shadow-2xl transition-shadow duration-500"
                    >
                      <div className="relative h-56 overflow-hidden">
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
                      </div>
                      <div className="p-8">
                        <h4 className="text-xl font-bold text-gray-800 mb-4 group-hover:text-[#233982] transition-colors leading-tight">
                          {article.title}
                        </h4>
                        <button className="flex items-center gap-2 text-sm font-bold text-[#FCC200] group/btn">
                          Baca Selengkapnya
                          <ChevronRight
                            size={16}
                            className="group-hover/btn:translate-x-1 transition-transform"
                          />
                        </button>
                      </div>
                    </motion.div>
                  ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {allCategories.map((cat, index) => (
                  <motion.button
                    key={cat.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => handleCategoryClick(cat.name)}
                    className="bg-white p-6 rounded-2xl border border-gray-100 shadow-lg hover:shadow-xl transition-all group text-left"
                  >
                    <cat.icon
                      size={32}
                      className="text-[#FCC200] mb-3 group-hover:scale-110 transition-transform"
                    />
                    <h3 className="font-bold text-gray-800 mb-1">{cat.name}</h3>
                    <p className="text-xs text-gray-500">{cat.count} artikel</p>
                  </motion.button>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Placeholder untuk tab lain */}
        {activeTab !== "Beranda" && activeTab !== "Kategori" && (
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
      <Footer></Footer>
    </div>
  );
};

export default App;
