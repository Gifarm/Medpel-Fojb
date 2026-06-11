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
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img
              src="/logomedpel.png"
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
            {navItems.map((item) => {
              const isActive = item.hasDropdown
                ? isCategoryActive
                : activeTab === item.name;

              return (
                <div
                  key={item.name}
                  className="relative"
                  data-category-dropdown
                  onMouseEnter={() =>
                    item.hasDropdown && setIsCategoryOpen(true)
                  }
                  onMouseLeave={() =>
                    item.hasDropdown && setIsCategoryOpen(false)
                  }
                >
                  <button
                    onClick={() => {
                      if (!item.hasDropdown) {
                        setActiveTab(item.name);
                        setActiveCategory(null);
                      } else {
                        setIsCategoryOpen(!isCategoryOpen);
                      }
                    }}
                    className={`relative px-6 py-2 rounded-xl text-sm font-medium transition-colors duration-300 flex items-center gap-2 ${
                      isActive
                        ? "text-white"
                        : "text-gray-500 hover:text-gray-800"
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="nav-active"
                        className="absolute inset-0 bg-gradient-to-r from-[#233982] to-[#4F619B] rounded-xl shadow-md"
                        transition={{
                          type: "spring",
                          bounce: 0.2,
                          duration: 0.6,
                        }}
                      />
                    )}
                    <span className="relative z-10 flex items-center gap-2">
                      <item.icon size={16} />
                      {item.name}
                      {item.hasDropdown && (
                        <motion.div
                          animate={{ rotate: isCategoryOpen ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ChevronDown size={14} />
                        </motion.div>
                      )}
                    </span>
                  </button>

                  {/* MEGA MENU DROPDOWN KATEGORI - Desktop */}
                  <AnimatePresence>
                    {item.hasDropdown && isCategoryOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.98 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-[680px] bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50"
                        data-category-dropdown
                      >
                        {/* Header Dropdown */}
                        <div className="px-6 py-4 bg-gradient-to-r from-[#233982]/5 to-[#FCC200]/5 border-b border-gray-100">
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-sm text-[#233982]">
                              Jelajahi Topik Favorit Pelajar
                            </h3>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            Temukan berita sesuai minat kamu
                          </p>
                        </div>

                        {/* Kategori Populer */}
                        <div className="px-6 py-5 border-b border-gray-100">
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">
                            Kategori Populer
                          </p>
                          <div className="grid grid-cols-2 gap-3">
                            {popularCategories.map((cat) => (
                              <button
                                key={cat.name}
                                onClick={() => handleCategoryClick(cat.name)}
                                className={`group flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-all text-left border ${
                                  activeCategory === cat.name
                                    ? "border-[#FCC200] bg-[#FCC200]/5"
                                    : "border-transparent hover:border-gray-100"
                                }`}
                              >
                                <div
                                  className={`w-10 h-10 rounded-lg bg-gradient-to-br ${cat.color} flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform`}
                                >
                                  <cat.icon size={18} />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p
                                    className={`font-bold text-sm transition-colors truncate ${
                                      activeCategory === cat.name
                                        ? "text-[#233982]"
                                        : "text-gray-800 group-hover:text-[#233982]"
                                    }`}
                                  >
                                    {cat.name}
                                  </p>
                                  <p className="text-[11px] text-gray-500 truncate">
                                    {cat.desc}
                                  </p>
                                </div>
                                <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                                  {cat.count}
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Semua Kategori */}
                        <div className="px-6 py-5">
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">
                            Semua Kategori
                          </p>
                          <div className="grid grid-cols-3 gap-1">
                            {allCategories.map((cat) => (
                              <button
                                key={cat.name}
                                onClick={() => handleCategoryClick(cat.name)}
                                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors text-left group ${
                                  activeCategory === cat.name
                                    ? "bg-[#FCC200]/10 text-[#233982]"
                                    : "text-gray-600 hover:bg-[#FCC200]/10 hover:text-[#233982]"
                                }`}
                              >
                                <cat.icon
                                  size={14}
                                  className={
                                    activeCategory === cat.name
                                      ? "text-[#FCC200]"
                                      : "text-gray-400 group-hover:text-[#FCC200]"
                                  }
                                />
                                <span className="font-medium truncate flex-1">
                                  {cat.name}
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Footer Dropdown */}
                        <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                          <p className="text-xs text-gray-500">
                            Total{" "}
                            <span className="font-bold text-[#233982]">
                              {allCategories.length}
                            </span>{" "}
                            kategori tersedia
                          </p>
                          <button
                            onClick={handleViewAllCategories}
                            className="flex items-center gap-1 text-xs font-bold text-[#233982] hover:text-[#FCC200] transition-colors group"
                          >
                            Lihat Semua
                            <ArrowRight
                              size={12}
                              className="group-hover:translate-x-1 transition-transform"
                            />
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          {/* Right Side: Search & Auth Buttons */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center bg-white border border-gray-200 rounded-full px-4 py-1.5 focus-within:ring-2 ring-[#FCC200]/20 transition-shadow">
              <Search size={16} className="text-gray-400" />
              <input
                type="text"
                placeholder="Cari berita..."
                className="bg-transparent border-none outline-none text-sm ml-2 w-32 focus:w-48 transition-[width] duration-300"
              />
            </div>

            {/* Desktop Auth Buttons */}
            <div className="hidden sm:flex items-center gap-3">
              {isLoggedIn ? (
                <div className="relative group">
                  <button className="flex items-center gap-2 p-1 pr-3 bg-white border border-gray-200 rounded-full hover:shadow-md transition-shadow">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#233982] to-[#4F619B] flex items-center justify-center text-white text-xs font-bold">
                      U
                    </div>
                    <span className="text-xs font-semibold text-gray-700">
                      Profil
                    </span>
                    <ChevronDown size={14} className="text-gray-400" />
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="p-4 border-b border-gray-100">
                      <p className="text-sm font-bold text-gray-800">
                        User Pelajar
                      </p>
                      <p className="text-xs text-gray-500">
                        user@mediapelajar.id
                      </p>
                    </div>
                    <div className="p-2">
                      <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                        <UserCircle size={16} /> Edit Profil
                      </button>
                      <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                        <BarChart3 size={16} /> Riwayat Komentar
                      </button>
                      <button
                        onClick={() => setIsLoggedIn(false)}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <X size={16} /> Logout
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <button
                    onClick={() => setIsLoggedIn(true)}
                    className="px-5 py-2 text-xs font-semibold text-[#233982] border border-[#233982]/20 rounded-full hover:bg-[#233982]/5 transition-colors"
                  >
                    Masuk
                  </button>
                  <button className="px-5 py-2 text-xs font-semibold text-white bg-gradient-to-r from-[#233982] to-[#4F619B] rounded-full hover:shadow-md transition-shadow">
                    Daftar
                  </button>
                </>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors z-50"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu - Improved */}
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
                {navItems.map((item) => {
                  const isActive = item.hasDropdown
                    ? isCategoryActive
                    : activeTab === item.name;

                  return (
                    <div key={item.name}>
                      <button
                        onClick={() => {
                          if (item.hasDropdown) {
                            // Untuk kategori, toggle accordion
                            handleMobileCategoryToggle();
                          } else {
                            // Untuk menu lain, langsung navigate
                            setActiveTab(item.name);
                            setActiveCategory(null);
                            setIsMobileMenuOpen(false);
                          }
                        }}
                        className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                          isActive
                            ? "bg-[#233982] text-white shadow-md"
                            : "text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        <span className="flex items-center gap-3">
                          <item.icon size={18} />
                          {item.name}
                        </span>
                        {item.hasDropdown && (
                          <motion.div
                            animate={{ rotate: mobileCategoryOpen ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                            className="p-1"
                          >
                            <ChevronDown
                              size={18}
                              className={
                                mobileCategoryOpen ? "text-[#FCC200]" : ""
                              }
                            />
                          </motion.div>
                        )}
                      </button>

                      {/* Mobile Category Accordion - IMPROVED */}
                      <AnimatePresence>
                        {item.hasDropdown && mobileCategoryOpen && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.25, ease: "easeInOut" }}
                            className="overflow-hidden"
                          >
                            <div className="pl-4 pr-2 py-3 space-y-2">
                              {/* Kategori Populer Section */}
                              <div className="mb-3">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-3 py-2">
                                  Kategori Populer
                                </p>
                                <div className="space-y-1">
                                  {popularCategories.map((cat) => (
                                    <button
                                      key={cat.name}
                                      onClick={() =>
                                        handleCategoryClick(cat.name)
                                      }
                                      className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm transition-all duration-200 ${
                                        activeCategory === cat.name
                                          ? "bg-[#FCC200]/20 text-[#233982] shadow-sm"
                                          : "text-gray-600 hover:bg-gray-50"
                                      }`}
                                    >
                                      <div
                                        className={`w-9 h-9 rounded-lg bg-gradient-to-br ${cat.color} flex items-center justify-center text-white flex-shrink-0`}
                                      >
                                        <cat.icon size={16} />
                                      </div>
                                      <div className="flex-1 text-left min-w-0">
                                        <p className="font-semibold text-sm truncate">
                                          {cat.name}
                                        </p>
                                        <p className="text-[11px] text-gray-500 truncate">
                                          {cat.desc}
                                        </p>
                                      </div>
                                      <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded-full flex-shrink-0">
                                        {cat.count}
                                      </span>
                                    </button>
                                  ))}
                                </div>
                              </div>

                              {/* Semua Kategori Section */}
                              <div className="border-t border-gray-100 pt-3">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-3 py-2">
                                  Semua Kategori
                                </p>
                                <div className="grid grid-cols-2 gap-1">
                                  {allCategories.map((cat) => (
                                    <button
                                      key={cat.name}
                                      onClick={() =>
                                        handleCategoryClick(cat.name)
                                      }
                                      className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                                        activeCategory === cat.name
                                          ? "bg-[#FCC200]/20 text-[#233982]"
                                          : "text-gray-600 hover:bg-gray-50"
                                      }`}
                                    >
                                      <cat.icon
                                        size={14}
                                        className={
                                          activeCategory === cat.name
                                            ? "text-[#FCC200]"
                                            : "text-gray-400"
                                        }
                                      />
                                      <span className="font-medium truncate">
                                        {cat.name}
                                      </span>
                                    </button>
                                  ))}
                                </div>
                              </div>

                              {/* Lihat Semua Button */}
                              <button
                                onClick={handleViewAllCategories}
                                className="w-full flex items-center justify-center gap-2 px-3 py-3 mt-3 text-xs font-bold text-[#233982] bg-[#233982]/5 hover:bg-[#233982]/10 rounded-xl transition-colors"
                              >
                                Lihat Semua Kategori
                                <ArrowRight size={14} />
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}

                {/* Mobile Search & Auth */}
                <div className="pt-4 mt-2 border-t border-gray-100 space-y-3">
                  <div className="flex items-center bg-gray-50 border border-gray-200 rounded-full px-4 py-3">
                    <Search size={18} className="text-gray-400" />
                    <input
                      type="text"
                      placeholder="Cari berita..."
                      className="bg-transparent border-none outline-none text-sm ml-3 w-full"
                    />
                  </div>

                  {isLoggedIn ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#233982] to-[#4F619B] flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                          U
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-800">
                            User Pelajar
                          </p>
                          <p className="text-xs text-gray-500">
                            user@mediapelajar.id
                          </p>
                        </div>
                      </div>
                      <button className="w-full flex items-center gap-2 px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-xl transition-colors">
                        <UserCircle size={16} /> Edit Profil
                      </button>
                      <button className="w-full flex items-center gap-2 px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-xl transition-colors">
                        <BarChart3 size={16} /> Riwayat Komentar
                      </button>
                      <button
                        onClick={() => setIsLoggedIn(false)}
                        className="w-full flex items-center gap-2 px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                      >
                        <X size={16} /> Logout
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-3">
                      <button
                        onClick={() => setIsLoggedIn(true)}
                        className="flex-1 py-3 text-sm font-semibold text-[#233982] border border-[#233982]/20 rounded-xl hover:bg-[#233982]/5 transition-colors"
                      >
                        Masuk
                      </button>
                      <button className="flex-1 py-3 text-sm font-semibold text-white bg-gradient-to-r from-[#233982] to-[#4F619B] rounded-xl hover:shadow-md transition-shadow">
                        Daftar
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

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
      <footer className="bg-white border-t border-gray-100 pt-20 pb-10">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center gap-2 mb-6">
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
                  "Beranda",
                  "Kategori",
                  "Tag Populer",
                  "Tentang Kami",
                  "Kontak",
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
              <h4 className="font-bold text-gray-800 mb-6">Sosial Media</h4>
              <ul className="space-y-4 text-sm text-gray-500">
                {["Instagram", "Tiktok", "Youtube", "Whatsapp"].map((item) => (
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
              © 2026 MedPel Indonesia. All rights reserved.
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
