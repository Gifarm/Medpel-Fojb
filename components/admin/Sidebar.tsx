"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Home,
  Users,
  Settings,
  CheckSquare,
  Activity,
  Tags,
  MessageSquare,
  LogOut,
  ChevronRight,
} from "lucide-react";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
}

export default function Sidebar({
  activeTab,
  setActiveTab,
  isSidebarOpen,
  setIsSidebarOpen,
}: SidebarProps) {
  const router = useRouter();

  // Menu disesuaikan persis dengan spesifikasi PRD Dashboard Admin
  const adminItems = [
    { name: "Dashboard", icon: Home },
    { name: "Moderasi Artikel", icon: CheckSquare },
    { name: "Manajemen User", icon: Users },
    { name: "Kategori & Tag", icon: Tags },
    { name: "Moderasi Komentar", icon: MessageSquare },
    { name: "Statistik Ringkas", icon: Activity },
    { name: "Pengaturan Platform", icon: Settings },
  ];

  // Fungsi Logout
  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/login");
  };

  return (
    <motion.aside
      initial={false}
      animate={{ width: isSidebarOpen ? 280 : 80 }}
      className="fixed left-0 top-0 h-full bg-[#FFFFFF] border-r border-[#C4C4C4]/30 z-50 flex flex-col shadow-xl shadow-[#233982]/5 transition-all duration-300"
    >
      {/* 1. Sidebar Header & Logo */}
      <div className="h-20 flex items-center justify-center border-b border-[#C4C4C4]/50 px-4 transition-all duration-300">
        <div className="flex items-center gap-3">
          {/* Logo selalu muncul, ukurannya konsisten */}
          <img
            src="/logomedpel.png"
            alt="MedPel Logo"
            className="w-10 h-10 object-contain flex-shrink-0 transition-all duration-300"
          />

          {/* Teks hanya muncul saat sidebar terbuka */}
          <AnimatePresence>
            {isSidebarOpen && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                className="overflow-hidden whitespace-nowrap"
              >
                <h1 className="font-black text-lg text-[#233982] leading-tight">
                  Media <span className="text-[#233982]">Pelajar</span>
                </h1>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* 2. Sidebar Navigation */}
      <div className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto no-scrollbar">
        {adminItems.map((item) => (
          <button
            key={item.name}
            onClick={() => setActiveTab(item.name)}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 group relative ${
              activeTab === item.name
                ? "bg-[#233982]/10 text-[#233982]"
                : "text-[#C4C4C4] hover:bg-[#C4C4C4]/10 hover:text-[#1B1B1B]"
            }`}
          >
            <item.icon
              size={20}
              className={`flex-shrink-0 transition-colors ${
                activeTab === item.name
                  ? "text-[#233982]"
                  : "group-hover:text-[#1B1B1B]"
              }`}
            />

            <AnimatePresence>
              {isSidebarOpen && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-sm font-bold whitespace-nowrap"
                >
                  {item.name}
                </motion.span>
              )}
            </AnimatePresence>

            {/* Active Indicator */}
            {activeTab === item.name && (
              <motion.div
                layoutId="sidebar-active"
                className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full bg-[#233982]"
              />
            )}
          </button>
        ))}
      </div>

      {/* 3. Sidebar Footer & Logout */}
      <div className="p-4 mt-auto border-t border-[#C4C4C4]/20">
        <button
          onClick={handleLogout}
          className={`w-full flex items-center transition-all duration-300 rounded-xl text-red-500 hover:bg-red-50 group ${
            // KUNCI: Saat tertutup, justify-center & px-0 agar icon benar-benar di tengah
            !isSidebarOpen
              ? "justify-center px-0 py-3"
              : "justify-start px-4 py-3 gap-4"
          }`}
        >
          <LogOut
            size={20}
            className="flex-shrink-0 group-hover:scale-110 transition-transform duration-200"
          />

          <AnimatePresence>
            {isSidebarOpen && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-sm font-bold uppercase whitespace-nowrap"
              >
                Logout
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* 4. Toggle Sidebar Button */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="absolute -right-3 top-10 w-6 h-6 bg-[#FFFFFF] border border-[#C4C4C4]/30 shadow-md rounded-full flex items-center justify-center text-[#C4C4C4] hover:text-[#233982] hover:border-[#233982]/30 transition-all duration-300 z-50"
        aria-label="Toggle Sidebar"
      >
        <ChevronRight
          size={14}
          className={`transition-transform duration-300 ${isSidebarOpen ? "rotate-180" : "rotate-0"}`}
        />
      </button>
    </motion.aside>
  );
}
