"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Bell,
  Search,
  FilePlus,
  FileText,
  Eye,
  Edit3,
  Trash2,
  Globe,
  CheckCircle2,
  Clock,
} from "lucide-react";

// Pastikan path import ini disesuaikan dengan lokasi Anda menyimpan file SidebarJurnalis
import SidebarJurnalis from "@/app/components/jurnalis/Sidebar";

const COLORS = {
  primary: "#FCC200",
  primarySoft: "#FDCE33",
  primaryLight: "#FDD85C",
  blueDark: "#233982",
  blue: "#4F619B",
  blueLight: "#7281AF",
  black: "#1B1B1B",
  gray: "#C4C4C4",
  white: "#FFFFFF",
  bg: "#f8faf9",
};

const JurnalisPage = () => {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Mock Data Jurnalis
  const myArticles = [
    {
      id: 1,
      title: "Dampak AI dalam Pendidikan Modern",
      category: "Teknologi",
      status: "Published",
      views: 1240,
      date: "12 Okt 2024",
    },
    {
      id: 2,
      title: "Eksplorasi Budaya di Sekolah Menengah",
      category: "Budaya",
      status: "Pending",
      views: 0,
      date: "14 Okt 2024",
    },
    {
      id: 3,
      title: "Pemanasan Global: Fakta vs Mitos",
      category: "Sains",
      status: "Draft",
      views: 0,
      date: "15 Okt 2024",
    },
  ];

  return (
    <div className="min-h-screen bg-[#f8faf9] font-sans text-[#1B1B1B] overflow-x-hidden flex">
      {/* --- SIDEBAR JURNALIS (DIPISAH) --- */}
      <SidebarJurnalis
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      {/* --- MAIN CONTENT --- */}
      <main
        className={`flex-1 transition-all duration-300 ${isSidebarOpen ? "ml-[280px]" : "ml-[80px]"}`}
      >
        {/* Top Header */}
        <header className="h-20 bg-[#FFFFFF]/80 backdrop-blur-md border-b border-[#C4C4C4]/10 sticky top-0 z-40 px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-[#FCC200]/10 rounded-lg">
              <Globe size={14} className="text-[#233982]" />
              <span className="text-[10px] font-bold text-[#233982]">
                JURNALIS_PORTAL
              </span>
            </div> */}
            <div className="h-4 w-[1px] bg-[#C4C4C4]/20" />
            <div>
              <h2 className="text-lg font-bold text-[#1B1B1B]">{activeTab}</h2>
              <p className="text-[10px] text-[#C4C4C4] font-bold uppercase tracking-widest">
                Ruang Kerja Jurnalis
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative group hidden md:block">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#C4C4C4] group-focus-within:text-[#233982] transition-colors"
                size={16}
              />
              <input
                type="text"
                placeholder="Cari artikel Anda..."
                className="bg-[#C4C4C4]/10 border-none rounded-xl py-2.5 pl-10 pr-4 text-xs w-64 focus:ring-2 focus:ring-[#FCC200]/30 transition-all outline-none text-[#1B1B1B] placeholder-[#C4C4C4]"
              />
            </div>
            <button className="p-2.5 text-[#C4C4C4] hover:bg-[#C4C4C4]/10 rounded-xl transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-[#FCC200] rounded-full border-2 border-[#FFFFFF]" />
            </button>
          </div>
        </header>

        <div className="p-8 max-w-[1600px] mx-auto">
          {/* DASHBOARD OVERVIEW */}
          {activeTab === "Dashboard" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              {/* Hero Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  {
                    label: "Total Artikel",
                    val: "24",
                    sub: "Sepanjang masa",
                    icon: FileText,
                    color: "blue",
                  },
                  {
                    label: "Menunggu Review",
                    val: "2",
                    sub: "Butuh verifikasi",
                    icon: Clock,
                    color: "primary",
                  },
                  {
                    label: "Total Views",
                    val: "14.2K",
                    sub: "↑ 8% bulan ini",
                    icon: Eye,
                    color: "blue",
                  },
                  {
                    label: "Diterbitkan",
                    val: "21",
                    sub: "Artikel aktif",
                    icon: CheckCircle2,
                    color: "blue",
                  },
                ].map((s, i) => (
                  <div
                    key={i}
                    className="bg-[#FFFFFF] p-6 rounded-[2rem] border border-[#C4C4C4]/10 shadow-sm hover:shadow-xl transition-all group"
                  >
                    <div
                      className={`w-12 h-12 rounded-2xl mb-4 flex items-center justify-center ${s.color === "primary" ? "bg-[#FCC200]/20 text-[#FCC200]" : "bg-[#233982]/10 text-[#233982]"} group-hover:scale-110 transition-transform`}
                    >
                      <s.icon size={24} />
                    </div>
                    <p className="text-[10px] font-black text-[#C4C4C4] uppercase tracking-widest">
                      {s.label}
                    </p>
                    <div className="flex items-baseline gap-2 mt-1">
                      <h3 className="text-3xl font-black text-[#1B1B1B]">
                        {s.val}
                      </h3>
                      <span className="text-[10px] font-bold text-[#C4C4C4]">
                        {s.sub}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Recent Articles List */}
              <div className="bg-[#FFFFFF] rounded-[2.5rem] border border-[#C4C4C4]/10 shadow-sm p-8">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="font-bold text-lg text-[#1B1B1B]">
                      Artikel Terbaru Anda
                    </h3>
                    <p className="text-xs text-[#C4C4C4]">
                      Pantau status dan performa tulisan Anda.
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab("Tulis Artikel")}
                    className="text-xs font-bold text-[#FFFFFF] bg-[#233982] px-4 py-2.5 rounded-xl hover:bg-[#233982]/90 transition-all flex items-center gap-2 shadow-lg shadow-[#233982]/20"
                  >
                    <FilePlus size={16} /> Tulis Baru
                  </button>
                </div>

                <div className="space-y-4">
                  {myArticles.map((art) => (
                    <div
                      key={art.id}
                      className="flex items-center justify-between p-5 bg-[#C4C4C4]/10 rounded-[2rem] hover:bg-[#FFFFFF] border border-transparent hover:border-[#4F619B]/20 hover:shadow-md transition-all group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm font-bold bg-[#233982]/10 text-[#233982]">
                          {art.title.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-sm text-[#1B1B1B]">
                              {art.title}
                            </h4>
                            <span
                              className={`px-2 py-0.5 text-[8px] font-black rounded uppercase ${
                                art.status === "Published"
                                  ? "bg-green-100 text-green-600"
                                  : art.status === "Pending"
                                    ? "bg-[#FCC200]/20 text-[#FCC200]"
                                    : "bg-[#C4C4C4]/20 text-[#C4C4C4]"
                              }`}
                            >
                              {art.status}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-[10px] text-[#4F619B] font-bold uppercase">
                              {art.category}
                            </span>
                            <div className="w-1 h-1 bg-[#C4C4C4] rounded-full" />
                            <span className="text-[10px] text-[#C4C4C4]">
                              {art.date}
                            </span>
                            {art.status === "Published" && (
                              <>
                                <div className="w-1 h-1 bg-[#C4C4C4] rounded-full" />
                                <span className="text-[10px] text-[#1B1B1B] font-bold">
                                  {art.views} Views
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                        <button className="p-2.5 bg-[#FFFFFF] text-[#4F619B] border border-[#C4C4C4]/20 rounded-xl hover:bg-[#4F619B] hover:text-[#FFFFFF] transition-all shadow-sm">
                          <Edit3 size={18} />
                        </button>
                        <button className="p-2.5 bg-[#FFFFFF] text-red-500 border border-[#C4C4C4]/20 rounded-xl hover:bg-red-500 hover:text-[#FFFFFF] transition-all shadow-sm">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* PLACEHOLDER FOR OTHER TABS */}
          {activeTab !== "Dashboard" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-32 bg-[#FFFFFF] rounded-[3rem] border-2 border-dashed border-[#C4C4C4]/20"
            >
              <div className="w-20 h-20 bg-[#FCC200]/10 rounded-full flex items-center justify-center mb-6 animate-pulse">
                <FilePlus size={40} className="text-[#FCC200]" />
              </div>
              <h3 className="font-bold text-[#1B1B1B] text-xl mb-2">
                Modul {activeTab}
              </h3>
              <p className="text-[#C4C4C4] text-sm max-w-sm text-center">
                Fitur ini siap diintegrasikan. Struktur warna dan layout sudah
                sesuai panduan.
              </p>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
};

export default JurnalisPage;
