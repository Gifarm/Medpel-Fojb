/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Home,
  LayoutGrid,
  Hash,
  Info,
  Mail,
  Search,
  ChevronRight,
  MoreHorizontal,
  UserCircle,
  BarChart3,
  TrendingUp,
  GraduationCap,
  Cpu,
  Trophy,
  Award,
  BookOpen,
  Dumbbell,
  Palette,
  MessageSquare,
  Medal,
  Lightbulb,
  Briefcase,
  Gamepad2,
} from "lucide-react";
import Navbar from "@/components/ui/navbar";
import Footer from "@/components/ui/footer";

const App = () => {
  const [activeTab, setActiveTab] = useState("Beranda");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [mobileCategoryOpen, setMobileCategoryOpen] = useState(false);

  // State untuk data real dari database
  const [homeData, setHomeData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch data homepage dari API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/home");
        const result = await res.json();
        if (result.success) {
          setHomeData(result.data);
        }
      } catch (error) {
        console.error("Gagal memuat data homepage", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

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

  useEffect(() => {
    if (!isMobileMenuOpen) {
      setMobileCategoryOpen(false);
    }
  }, [isMobileMenuOpen]);

  // Helper untuk icon kategori
  const getCategoryIcon = (name: string) => {
    const map: Record<string, any> = {
      Pendidikan: GraduationCap,
      Teknologi: Cpu,
      "Kegiatan Sekolah": BookOpen,
      Prestasi: Trophy,
      Olahraga: Dumbbell,
      "Seni & Budaya": Palette,
      Opini: MessageSquare,
      Beasiswa: Award,
      Lomba: Medal,
      "Tips & Tricks": Lightbulb,
      "Karir & Kuliah": Briefcase,
      Hiburan: Gamepad2,
    };
    return map[name] || LayoutGrid;
  };

  const handleCategoryClick = (categoryName: string) => {
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

  // Fallback data jika masih loading
  const displayCategories = homeData?.categories || [];
  const displayArticles = homeData?.latestArticles || [];
  const featured = homeData?.featuredArticle;
  const trendingTags = homeData?.trendingTags || [
    { tag: "#Beasiswa2026", count: "0 Postingan" },
    { tag: "#LombaKaryaIlmiah", count: "0 Postingan" },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f8faf9] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#233982]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8faf9] font-sans text-gray-900 selection:bg-yellow-100">
      {/* Dynamic Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[#FDCE33]/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[#4F619B]/10 blur-[120px]" />
      </div>

      {/* Navbar */}
      <Navbar />

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
                {featured ? (
                  <div className="relative group overflow-hidden rounded-[2rem] aspect-[16/9] shadow-2xl">
                    <img
                      src={featured.image}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      alt={featured.title}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-10">
                      <div className="flex gap-2 mb-4">
                        <span className="px-4 py-1 bg-[#FCC200] text-[#1B1B1B] text-xs font-bold rounded-full">
                          SOROTAN UTAMA
                        </span>
                        <span className="px-4 py-1 bg-white/20 backdrop-blur-md text-white text-xs font-bold rounded-full">
                          {featured.category.toUpperCase()}
                        </span>
                      </div>
                      <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
                        {featured.title}
                      </h2>
                      <div className="flex items-center gap-6 text-white/80 text-sm">
                        <span className="flex items-center gap-2">
                          <UserCircle size={16} /> {featured.author}
                        </span>
                        <span>• {featured.date}</span>
                        <span className="flex items-center gap-2">
                          <TrendingUp size={16} /> {featured.views} Views
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-100 rounded-[2rem] aspect-[16/9] flex items-center justify-center text-gray-400">
                    Belum ada artikel sorotan
                  </div>
                )}
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
                    {trendingTags.map((item: any, idx: number) => (
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayArticles.length > 0 ? (
                displayArticles.map((article: any, index: number) => (
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
                      />
                      <div className="absolute top-4 left-4">
                        <span className="px-4 py-1.5 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-black text-[#FCC200] uppercase shadow-sm">
                          {article.category}
                        </span>
                      </div>
                    </div>
                    <div className="p-8">
                      <div className="flex items-center gap-3 mb-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        <span>{article.author}</span>
                        <span className="w-1 h-1 bg-gray-300 rounded-full" />
                        <span>{article.date}</span>
                      </div>
                      <h4 className="text-xl font-bold text-gray-800 mb-4 group-hover:text-[#233982] transition-colors leading-tight line-clamp-2">
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
                ))
              ) : (
                <div className="col-span-full text-center py-12 text-gray-400">
                  Belum ada artikel yang dipublikasikan.
                </div>
              )}
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
                {displayArticles
                  .filter((a: any) => a.category === activeCategory)
                  .map((article: any, index: number) => (
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
                        />
                        <div className="absolute top-4 left-4">
                          <span className="px-4 py-1.5 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-black text-[#FCC200] uppercase shadow-sm">
                            {article.category}
                          </span>
                        </div>
                      </div>
                      <div className="p-8">
                        <h4 className="text-xl font-bold text-gray-800 mb-4 group-hover:text-[#233982] transition-colors leading-tight line-clamp-2">
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
                {displayArticles.filter(
                  (a: any) => a.category === activeCategory,
                ).length === 0 && (
                  <div className="col-span-full text-center py-12 text-gray-400">
                    Belum ada artikel di kategori ini.
                  </div>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {displayCategories.map((cat: any, index: number) => {
                  const IconComponent = getCategoryIcon(cat.name);
                  return (
                    <motion.button
                      key={cat.name}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => handleCategoryClick(cat.name)}
                      className="bg-white p-6 rounded-2xl border border-gray-100 shadow-lg hover:shadow-xl transition-all group text-left"
                    >
                      <IconComponent
                        size={32}
                        className="text-[#FCC200] mb-3 group-hover:scale-110 transition-transform"
                      />
                      <h3 className="font-bold text-gray-800 mb-1">
                        {cat.name}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {cat.count} artikel
                      </p>
                    </motion.button>
                  );
                })}
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
      <Footer />
    </div>
  );
};

export default App;
