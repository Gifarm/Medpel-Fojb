"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  FilePlus,
  FileText,
  BarChart3,
  Settings,
  LogOut,
  ChevronRight,
} from "lucide-react";

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

interface SidebarJurnalisProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
}

export default function SidebarJurnalis({
  activeTab,
  setActiveTab,
  isSidebarOpen,
  setIsSidebarOpen,
}: SidebarJurnalisProps) {
  const jurnalisItems = [
    { name: "Dashboard", icon: Home },
    { name: "Tulis Artikel", icon: FilePlus },
    { name: "Artikel Saya", icon: FileText },
    { name: "Statistik", icon: BarChart3 },
    { name: "Pengaturan", icon: Settings },
  ];

  return (
    <motion.aside
      initial={false}
      animate={{ width: isSidebarOpen ? 280 : 80 }}
      className="fixed left-0 top-0 h-full bg-[#ffffff] border-r border-[#C4C4C4]/50 z-50 flex flex-col transition-all duration-300"
    >
      {/* Sidebar Logo */}
      <div className="p-6 flex items-center gap-3">
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="overflow-hidden whitespace-nowrap"
            >
              <h1 className="font-bold text-[#233982]">
                MedPel <span className="text-[#C4C4C4]">Jurnalis</span>
              </h1>
              <p className="text-[10px] text-[#233982]/60 font-bold uppercase tracking-widest leading-none">
                Writer Portal
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Sidebar Nav */}
      <div className="flex-1 px-4 py-6 space-y-2 no-scrollbar">
        <p
          className={`text-[9px] font-black uppercase tracking-[0.2em] mb-4 ml-4 text-[#C4C4C4] ${isSidebarOpen ? "opacity-100" : "opacity-0"}`}
        >
          Master Data
        </p>
        {jurnalisItems.map((item) => (
          <button
            key={item.name}
            onClick={() => setActiveTab(item.name)}
            className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group relative ${
              activeTab === item.name
                ? "bg-[#FCC200]/10 text-[#233982]"
                : "text-[#C4C4C4] hover:bg-[#C4C4C4]/10"
            }`}
          >
            <item.icon
              size={20}
              className={
                activeTab === item.name
                  ? "text-[#233982]"
                  : "group-hover:text-[#1B1B1B]/70"
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
                layoutId="sidebar-jurnalis-active"
                className="absolute left-0 w-1.5 h-6 rounded-r-full bg-[#FCC200]"
              />
            )}
          </button>
        ))}
      </div>

      {/* Sidebar Footer */}
      <div className="p-4 mt-auto space-y-2">
        <div
          className={`flex items-center gap-3 p-3 bg-[#C4C4C4]/10 rounded-2xl transition-all ${!isSidebarOpen ? "justify-center" : ""}`}
        >
          {isSidebarOpen && (
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-[#1B1B1B] truncate">
                Jurnalis Aktif
              </p>
              <p className="text-[10px] text-[#233982] uppercase font-black flex items-center gap-1">
                Online
              </p>
            </div>
          )}
        </div>
        <button
          className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl text-red-400 hover:bg-red-50 transition-all ${!isSidebarOpen ? "justify-center" : ""}`}
        >
          <LogOut size={18} />
          {isSidebarOpen && (
            <span className="text-xs font-bold uppercase">Keluar</span>
          )}
        </button>
      </div>

      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="absolute -right-3 top-12 w-6 h-6 bg-[#FFFFFF] border border-[#C4C4C4]/20 shadow-md rounded-full flex items-center justify-center text-[#C4C4C4] hover:text-[#233982] transition-colors"
      >
        {isSidebarOpen ? (
          <ChevronRight className="rotate-180" size={12} />
        ) : (
          <ChevronRight size={12} />
        )}
      </button>
    </motion.aside>
  );
}
