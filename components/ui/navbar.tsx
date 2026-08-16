/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  LayoutGrid,
  Hash,
  Info,
  Mail,
  Search,
  ChevronDown,
  Menu,
  X,
  UserCircle,
  User,
  BarChart3,
  GraduationCap,
  Trophy,
  BookOpen,
  MessageSquare,
  Award,
  Camera,
  Calendar,
  ArrowRight,
  Newspaper,
  LogOut,
} from "lucide-react";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<any>(null); // <-- GANTI: Simpan data user, bukan boolean
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [mobileCategoryOpen, setMobileCategoryOpen] = useState(false);

  // <-- BARU: Cek status login dari localStorage saat komponen mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem("user");
      }
    }
  }, []);

  // OPTIMASI: Scroll listener dengan requestAnimationFrame
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
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("[data-dropdown]")) {
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

  const handleLogout = () => {
    // 1. Hapus data dari localStorage
    localStorage.removeItem("user");

    // 2. Hapus cookie agar middleware tahu user sudah logout
    document.cookie =
      "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    document.cookie =
      "user_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

    // 3. Redirect ke halaman login
    router.push("/login");
  };

  // --- ROUTING MAPPING ---
  const navItems = [
    { name: "Beranda", icon: Home, path: "/" },
    { name: "Tentang Kami", icon: Info, path: "/tentang-kami" },
    {
      name: "Kategori",
      icon: LayoutGrid,
      hasDropdown: true,
      path: "/kategori",
    },
    { name: "Tag Populer", icon: Hash, path: "/tags" },
    { name: "Kontak", icon: Mail, path: "/kontak" },
  ];

  const popularCategories = [
    {
      name: "Berita Terkini",
      icon: Newspaper,
      desc: "Nasional & Daerah terbaru",
      color: "from-blue-600 to-blue-700",
      count: 210,
    },
    {
      name: "Karya Pelajar",
      icon: Camera,
      desc: "Foto, Videografi & Tulis",
      color: "from-indigo-500 to-purple-600",
      count: 85,
    },
    {
      name: "Event Pelajar",
      icon: Calendar,
      desc: "Info lomba, webinar, gathering",
      color: "from-orange-500 to-red-500",
      count: 42,
    },
    {
      name: "Opini & Inspirasi",
      icon: MessageSquare,
      desc: "Suara dan kisah inspiratif pelajar",
      color: "from-emerald-500 to-teal-600",
      count: 67,
    },
  ];

  const allCategories = [
    { name: "Berita Terkini", icon: Newspaper, count: 210 },
    { name: "Karya Pelajar", icon: Camera, count: 85 },
    { name: "Event Pelajar", icon: Calendar, count: 42 },
    { name: "Opini", icon: MessageSquare, count: 92 },
    { name: "Pendidikan", icon: GraduationCap, count: 124 },
    { name: "Prestasi", icon: Trophy, count: 67 },
    { name: "Beasiswa", icon: Award, count: 45 },
    { name: "Kegiatan Sekolah", icon: BookOpen, count: 156 },
  ];

  const isCategoryActive = pathname.startsWith("/kategori");
  const createSlug = (name: string) => name.toLowerCase().replace(/\s+/g, "-");

  const handleCategoryClick = (categoryName: string) => {
    setIsCategoryOpen(false);
    setMobileCategoryOpen(false);
    setIsMobileMenuOpen(false);
    router.push(`/kategori/${createSlug(categoryName)}`);
  };

  const handleViewAllCategories = () => {
    setIsCategoryOpen(false);
    setMobileCategoryOpen(false);
    setIsMobileMenuOpen(false);
    router.push("/kategori");
  };

  const handleMobileCategoryToggle = () => {
    setMobileCategoryOpen(!mobileCategoryOpen);
  };

  return (
    <nav
      className="fixed top-0 w-full z-50 will-change-[background-color,backdrop-filter,box-shadow,padding] transition-[background-color,backdrop-filter,box-shadow,padding] duration-300 ease-out"
      style={{
        backgroundColor: scrolled
          ? "rgba(255, 255, 255, 0.95)"
          : "rgba(255, 255, 255, 0.8)",
        backdropFilter: scrolled ? "blur(12px)" : "blur(8px)",
        boxShadow: scrolled ? "0 4px 6px -1px rgb(0 0 0 / 0.05)" : "none",
        paddingTop: scrolled ? "10px" : "16px",
        paddingBottom: scrolled ? "10px" : "16px",
        borderBottom: scrolled
          ? "1px solid rgba(35, 57, 130, 0.1)"
          : "1px solid transparent",
      }}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        {/* Logo & Tagline MPN */}
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => router.push("/")}
        >
          <img
            src="/logomedpel.png"
            alt="MedPel Logo"
            className="w-10 h-10 md:w-12 md:h-12 object-contain"
            width={48}
            height={48}
          />
          <div className="flex flex-col justify-center">
            <h1 className="text-lg md:text-xl font-extrabold tracking-tight text-[#233982] leading-none">
              Media Pelajar Network
            </h1>
            <p className="text-[9px] md:text-[10px] uppercase tracking-[0.15em] font-bold text-[#233982] leading-none mt-1">
              Informasi • Fakta • Pembelajar
            </p>
          </div>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center bg-blue-50/50 p-1.5 rounded-2xl border border-blue-100/50">
          {navItems.map((item) => {
            const isActive = item.hasDropdown
              ? isCategoryActive
              : pathname === item.path;
            return (
              <div
                key={item.name}
                className="relative"
                data-dropdown
                onMouseEnter={() => item.hasDropdown && setIsCategoryOpen(true)}
                onMouseLeave={() =>
                  item.hasDropdown && setIsCategoryOpen(false)
                }
              >
                <button
                  onClick={() => {
                    if (!item.hasDropdown) {
                      router.push(item.path);
                    } else {
                      setIsCategoryOpen(!isCategoryOpen);
                    }
                  }}
                  className={`relative px-5 py-2 rounded-xl text-sm font-semibold transition-colors duration-300 flex items-center gap-2 ${
                    isActive
                      ? "text-white"
                      : "text-gray-600 hover:text-[#233982]"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="nav-active"
                      className="absolute inset-0 bg-[#233982] rounded-xl shadow-md"
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
                      className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-[640px] bg-white rounded-2xl shadow-xl border border-blue-100 overflow-hidden z-50"
                      data-dropdown
                    >
                      <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-white border-b border-blue-50">
                        <h3 className="font-bold text-sm text-[#233982]">
                          Jelajahi Topik Favorit Pelajar
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">
                          Temukan berita, karya, dan event sesuai minat kamu
                        </p>
                      </div>
                      <div className="px-6 py-5 border-b border-gray-100">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">
                          Kategori Populer
                        </p>
                        <div className="grid grid-cols-2 gap-3">
                          {popularCategories.map((cat) => {
                            const isCatActive =
                              pathname === `/kategori/${createSlug(cat.name)}`;
                            return (
                              <button
                                key={cat.name}
                                onClick={() => handleCategoryClick(cat.name)}
                                className={`group flex items-center gap-3 p-3 rounded-xl hover:bg-blue-50/50 transition-all text-left border ${
                                  isCatActive
                                    ? "border-blue-200 bg-blue-50"
                                    : "border-transparent hover:border-blue-100"
                                }`}
                              >
                                <div
                                  className={`w-10 h-10 rounded-lg bg-gradient-to-br ${cat.color} flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform`}
                                >
                                  <cat.icon size={18} />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p
                                    className={`font-bold text-sm transition-colors truncate ${isCatActive ? "text-[#233982]" : "text-gray-800 group-hover:text-[#233982]"}`}
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
                            );
                          })}
                        </div>
                      </div>
                      <div className="px-6 py-5">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">
                          Semua Kategori
                        </p>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                          {allCategories.map((cat) => {
                            const isCatActive =
                              pathname === `/kategori/${createSlug(cat.name)}`;
                            return (
                              <button
                                key={cat.name}
                                onClick={() => handleCategoryClick(cat.name)}
                                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors text-left group ${
                                  isCatActive
                                    ? "bg-blue-50 text-[#233982]"
                                    : "text-gray-600 hover:bg-blue-50 hover:text-[#233982]"
                                }`}
                              >
                                <cat.icon
                                  size={14}
                                  className={
                                    isCatActive
                                      ? "text-blue-600"
                                      : "text-gray-400 group-hover:text-blue-600"
                                  }
                                />
                                <span className="font-medium truncate flex-1">
                                  {cat.name}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
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
                          className="flex items-center gap-1 text-xs font-bold text-[#233982] hover:text-blue-600 transition-colors group"
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
        <div className="flex items-center gap-3 md:gap-4">
          <div className="hidden sm:flex items-center bg-white border border-gray-200 rounded-full px-4 py-1.5 focus-within:ring-2 ring-blue-200 transition-shadow">
            <Search size={16} className="text-gray-400" />
            <input
              type="text"
              placeholder="Cari berita..."
              className="bg-transparent border-none outline-none text-sm ml-2 w-24 focus:w-40 transition-[width] duration-300 placeholder-gray-400"
            />
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            {user ? (
              // <-- BARU: Tampilan jika SUDAH LOGIN (Profile Dropdown)
              <div className="relative group" data-dropdown>
                <button className="flex items-center gap-2 p-1 pr-3 bg-white border border-gray-200 rounded-full hover:shadow-md transition-shadow">
                  {/* Ikon Profile Generik Melingkar */}
                  <div className="w-8 h-8 rounded-full bg-[#233982] flex items-center justify-center text-white">
                    <User size={18} />
                  </div>
                  <span className="text-xs font-semibold text-gray-700 max-w-[80px] truncate">
                    {user.name}
                  </span>
                  <ChevronDown size={14} className="text-gray-400" />
                </button>

                {/* Dropdown Menu */}
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 overflow-hidden">
                  <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                    <p className="text-sm font-bold text-gray-800 truncate">
                      {user.name}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {user.email}
                    </p>
                    <span className="inline-block mt-2 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-[#233982]/10 text-[#233982] rounded-md">
                      {user.role}
                    </span>
                  </div>
                  <div className="p-2">
                    {/* <button
                      onClick={() => router.push("/profil")}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <UserCircle size={16} /> Profil Saya
                    </button> */}

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <LogOut size={16} /> Keluar
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              // <-- Tampilan jika BELUM LOGIN
              <>
                <button
                  onClick={() => router.push("/login")}
                  className="px-5 py-2 text-xs font-semibold text-[#233982] border border-[#233982]/20 rounded-full hover:bg-blue-50 transition-colors"
                >
                  Masuk
                </button>
                <button
                  onClick={() => router.push("/register")}
                  className="px-5 py-2 text-xs font-semibold text-white bg-[#233982] rounded-full hover:bg-blue-800 hover:shadow-md transition-all"
                >
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
            <div className="container mx-auto px-4 py-4 space-y-2">
              {navItems.map((item) => {
                const isActive = item.hasDropdown
                  ? isCategoryActive
                  : pathname === item.path;
                return (
                  <div key={item.name}>
                    <button
                      onClick={() => {
                        if (item.hasDropdown) {
                          handleMobileCategoryToggle();
                        } else {
                          setIsMobileMenuOpen(false);
                          router.push(item.path);
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
                              mobileCategoryOpen ? "text-blue-400" : ""
                            }
                          />
                        </motion.div>
                      )}
                    </button>

                    <AnimatePresence>
                      {item.hasDropdown && mobileCategoryOpen && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.25, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          <div className="pl-4 pr-2 py-3 space-y-3">
                            <div>
                              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-3 py-2">
                                Kategori Populer
                              </p>
                              <div className="space-y-1">
                                {popularCategories.map((cat) => {
                                  const isCatActive =
                                    pathname ===
                                    `/kategori/${createSlug(cat.name)}`;
                                  return (
                                    <button
                                      key={cat.name}
                                      onClick={() =>
                                        handleCategoryClick(cat.name)
                                      }
                                      className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm transition-all duration-200 ${
                                        isCatActive
                                          ? "bg-blue-50 text-[#233982] shadow-sm"
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
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                            <div className="border-t border-gray-100 pt-3">
                              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-3 py-2">
                                Semua Kategori
                              </p>
                              <div className="grid grid-cols-2 gap-1">
                                {allCategories.map((cat) => {
                                  const isCatActive =
                                    pathname ===
                                    `/kategori/${createSlug(cat.name)}`;
                                  return (
                                    <button
                                      key={cat.name}
                                      onClick={() =>
                                        handleCategoryClick(cat.name)
                                      }
                                      className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                                        isCatActive
                                          ? "bg-blue-50 text-[#233982]"
                                          : "text-gray-600 hover:bg-gray-50"
                                      }`}
                                    >
                                      <cat.icon
                                        size={14}
                                        className={
                                          isCatActive
                                            ? "text-blue-600"
                                            : "text-gray-400"
                                        }
                                      />
                                      <span className="font-medium truncate">
                                        {cat.name}
                                      </span>
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
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

                {user ? (
                  // <-- BARU: Tampilan Mobile jika SUDAH LOGIN
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                      <div className="w-10 h-10 rounded-full bg-[#233982] flex items-center justify-center text-white flex-shrink-0">
                        <User size={20} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-gray-800 truncate">
                          {user.name}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {user.email}
                        </p>
                        <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-[#233982]/10 text-[#233982] rounded-md">
                          {user.role}
                        </span>
                      </div>
                    </div>
                    {/* <button
                      onClick={() => {
                        router.push("/profil");
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-xl transition-colors"
                    >
                      <UserCircle size={16} /> Profil Saya
                    </button> */}

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                    >
                      <LogOut size={16} /> Keluar
                    </button>
                  </div>
                ) : (
                  // Tampilan Mobile jika BELUM LOGIN
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        router.push("/login");
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex-1 py-3 text-sm font-semibold text-[#233982] border border-[#233982]/20 rounded-xl hover:bg-blue-50 transition-colors"
                    >
                      Masuk
                    </button>
                    <button
                      onClick={() => {
                        router.push("/register");
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex-1 py-3 text-sm font-semibold text-white bg-[#233982] rounded-xl hover:bg-blue-800 transition-colors"
                    >
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
  );
}
