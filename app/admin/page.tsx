"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Bell,
  Search,
  FileText,
  UserPlus,
  Trash2,
  Globe,
  Database,
  Layers,
  Settings,
  Users,
  CheckSquare,
  Activity,
  ShieldAlert,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

// Pastikan path import ini disesuaikan dengan lokasi Anda menyimpan file Sidebar di atas
import Sidebar from "@/app/components/admin/Sidebar";

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

const App = () => {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Mock Data Khusus Admin
  const pendingArticles = [
    {
      id: 101,
      title: "Dampak AI dalam Pendidikan Modern",
      author: "Budi Santoso",
      date: "Baru saja",
      category: "Teknologi",
      priority: "High",
    },
    {
      id: 102,
      title: "Eksplorasi Budaya di Sekolah Menengah",
      author: "Siska Putri",
      date: "2 jam lalu",
      category: "Budaya",
      priority: "Medium",
    },
    {
      id: 103,
      title: "Pemanasan Global: Fakta vs Mitos",
      author: "Rian Hidayat",
      date: "5 jam lalu",
      category: "Sains",
      priority: "Low",
    },
  ];

  const allUsers = [
    {
      id: 1,
      name: "Budi Santoso",
      role: "Jurnalis",
      status: "Active",
      posts: 12,
      joined: "Jan 2024",
      email: "budi@medpel.com",
    },
    {
      id: 2,
      name: "Siska Putri",
      role: "Jurnalis",
      status: "Pending",
      posts: 0,
      joined: "Okt 2024",
      email: "siska@medpel.com",
    },
    {
      id: 3,
      name: "Andi Wijaya",
      role: "Editor",
      status: "Active",
      posts: 45,
      joined: "Mei 2023",
      email: "andi@medpel.com",
    },
    {
      id: 4,
      name: "Rina Kartika",
      role: "Jurnalis",
      status: "Suspended",
      posts: 8,
      joined: "Feb 2023",
      email: "rina@medpel.com",
    },
  ];

  return (
    <div className="min-h-screen bg-[#f8faf9] font-sans text-[#1B1B1B] overflow-x-hidden flex">
      {/* --- SIDEBAR ADMIN (DIPISAH) --- */}
      <Sidebar
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
            {/* <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-[#233982]/10 rounded-lg">
              <Globe size={14} className="text-[#233982]" />
              <span className="text-[10px] font-bold text-[#233982]">
                PROD_ENV_MAIN
              </span>
            </div> */}
            <div className="h-4 w-[1px] bg-[#C4C4C4]/20" />
            <div>
              <h2 className="text-lg font-bold text-[#1B1B1B]">{activeTab}</h2>
              <p className="text-[10px] text-[#C4C4C4] font-bold uppercase tracking-widest">
                Sistem Manajemen Terpusat
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
                placeholder="Cari jurnalis, artikel, atau log..."
                className="bg-[#C4C4C4]/10 border-none rounded-xl py-2.5 pl-10 pr-4 text-xs w-72 focus:ring-2 focus:ring-[#233982]/20 transition-all outline-none text-[#1B1B1B] placeholder-[#C4C4C4]"
              />
            </div>
            <button className="p-2.5 text-[#C4C4C4] hover:bg-[#C4C4C4]/10 rounded-xl transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-[#FFFFFF]" />
            </button>
            <div className="w-8 h-8 rounded-lg bg-[#C4C4C4]/10 flex items-center justify-center text-[#C4C4C4] hover:bg-[#233982]/10 hover:text-[#233982] cursor-pointer transition-all">
              <Layers size={18} />
            </div>
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
                    label: "Total Jurnalis",
                    val: "154",
                    sub: "+12 bulan ini",
                    icon: Users,
                    color: "blue",
                  },
                  {
                    label: "Pending Review",
                    val: "28",
                    sub: "Butuh tindakan",
                    icon: CheckSquare,
                    color: "primary",
                  },
                  {
                    label: "Visitor Hari Ini",
                    val: "12,402",
                    sub: "↑ 14% dari kemarin",
                    icon: Activity,
                    color: "blue",
                  },
                  {
                    label: "Security Alerts",
                    val: "0",
                    sub: "System Secure",
                    icon: ShieldAlert,
                    color: "blue",
                  },
                ].map((s, i) => (
                  <div
                    key={i}
                    className="bg-[#FFFFFF] p-6 rounded-[2rem] border border-[#C4C4C4]/10 shadow-sm hover:shadow-xl transition-all group"
                  >
                    <div
                      className={`w-12 h-12 rounded-2xl mb-4 flex items-center justify-center ${
                        s.color === "primary"
                          ? "bg-[#FCC200]/20 text-[#FCC200]"
                          : "bg-[#233982]/10 text-[#233982]"
                      } group-hover:scale-110 transition-transform`}
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

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Moderation Queue Section */}
                <div className="lg:col-span-2 bg-[#FFFFFF] rounded-[2.5rem] border border-[#C4C4C4]/10 shadow-sm p-8">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h3 className="font-bold text-lg text-[#1B1B1B]">
                        Antrean Moderasi Konten
                      </h3>
                      <p className="text-xs text-[#C4C4C4]">
                        Tinjau artikel sebelum dipublikasikan ke publik.
                      </p>
                    </div>
                    <button className="text-xs font-bold text-[#4F619B] bg-[#4F619B]/10 px-4 py-2 rounded-xl hover:bg-[#4F619B]/20 transition-all">
                      Manajemen Semua
                    </button>
                  </div>

                  <div className="space-y-4">
                    {pendingArticles.map((art) => (
                      <div
                        key={art.id}
                        className="flex items-center justify-between p-5 bg-[#C4C4C4]/10 rounded-[2rem] hover:bg-[#FFFFFF] border border-transparent hover:border-[#4F619B]/20 hover:shadow-md transition-all group"
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm font-bold ${
                              art.priority === "High"
                                ? "bg-red-50 text-red-500"
                                : "bg-[#233982]/10 text-[#233982]"
                            }`}
                          >
                            {art.title.charAt(0)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-bold text-sm text-[#1B1B1B]">
                                {art.title}
                              </h4>
                              {art.priority === "High" && (
                                <span className="px-2 py-0.5 bg-red-100 text-red-600 text-[8px] font-black rounded uppercase">
                                  Urgent
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-3 mt-1">
                              <span className="text-[10px] text-[#C4C4C4] font-bold uppercase">
                                {art.author}
                              </span>
                              <div className="w-1 h-1 bg-[#C4C4C4] rounded-full" />
                              <span className="text-[10px] text-[#4F619B] font-bold uppercase">
                                {art.category}
                              </span>
                              <div className="w-1 h-1 bg-[#C4C4C4] rounded-full" />
                              <span className="text-[10px] text-[#C4C4C4]">
                                {art.date}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                          <button className="p-2.5 bg-green-500 text-white rounded-xl hover:shadow-lg hover:shadow-green-200 transition-all">
                            <CheckCircle2 size={18} />
                          </button>
                          <button className="p-2.5 bg-red-500 text-white rounded-xl hover:shadow-lg hover:shadow-red-200 transition-all">
                            <AlertCircle size={18} />
                          </button>
                          <button className="p-2.5 bg-[#FFFFFF] text-[#1B1B1B] border border-[#C4C4C4]/20 rounded-xl hover:bg-[#C4C4C4]/10 transition-all">
                            <FileText size={18} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* System Logs / Activity */}
                <div className="bg-[#FFFFFF] rounded-[2.5rem] border border-[#C4C4C4]/10 shadow-sm p-8">
                  <h3 className="font-bold text-lg mb-6 flex items-center gap-2 text-[#1B1B1B]">
                    <Activity size={20} className="text-[#4F619B]" /> Log
                    Aktivitas
                  </h3>
                  <div className="space-y-6">
                    {[
                      {
                        action: "User Suspended",
                        target: "Rina Kartika",
                        time: "12m ago",
                        icon: Settings,
                        color: "red",
                      },
                      {
                        action: "Role Update",
                        target: "Andi Wijaya (Admin)",
                        time: "45m ago",
                        icon: ShieldAlert,
                        color: "blue",
                      },
                      {
                        action: "New Registration",
                        target: "Siska Putri",
                        time: "2h ago",
                        icon: UserPlus,
                        color: "green",
                      },
                      {
                        action: "Backup Success",
                        target: "Database_Main_01",
                        time: "5h ago",
                        icon: Database,
                        color: "blue",
                      },
                    ].map((log, i) => (
                      <div key={i} className="flex gap-4 relative">
                        {i !== 3 && (
                          <div className="absolute left-5 top-10 bottom-[-24px] w-[2px] bg-[#C4C4C4]/10" />
                        )}
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                            log.color === "blue"
                              ? "bg-[#233982]/10 text-[#233982]"
                              : log.color === "red"
                                ? "bg-red-50 text-red-500"
                                : "bg-green-50 text-green-500"
                          } z-10`}
                        >
                          <log.icon size={18} />
                        </div>
                        <div className="pt-1">
                          <p className="text-xs font-bold text-[#1B1B1B]">
                            {log.action}
                          </p>
                          <p className="text-[10px] text-[#C4C4C4]">
                            {log.target} • {log.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button className="w-full mt-8 py-3 bg-[#C4C4C4]/10 text-[#C4C4C4] text-[10px] font-black uppercase rounded-2xl hover:bg-[#C4C4C4]/20 transition-all tracking-widest">
                    Lihat Semua Log
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* USER MANAGEMENT VIEW */}
          {activeTab === "Manajemen User" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#FFFFFF] p-6 rounded-[2.5rem] border border-[#C4C4C4]/10 shadow-sm">
                <div>
                  <h3 className="text-xl font-bold text-[#1B1B1B]">
                    Direktori Pengguna
                  </h3>
                  <p className="text-sm text-[#C4C4C4]">
                    Total 154 pengguna terdaftar di platform.
                  </p>
                </div>
                <div className="flex gap-3">
                  <button className="px-6 py-3 bg-[#233982] text-[#FFFFFF] text-xs font-bold rounded-2xl flex items-center gap-2 shadow-lg shadow-[#233982]/20 hover:translate-y-[-2px] transition-all">
                    <UserPlus size={18} /> UNDANG USER
                  </button>
                  <button className="px-6 py-3 bg-[#FFFFFF] border border-[#C4C4C4]/20 text-[#1B1B1B] text-xs font-bold rounded-2xl flex items-center gap-2 hover:bg-[#C4C4C4]/10 transition-all">
                    Export CSV
                  </button>
                </div>
              </div>

              <div className="bg-[#FFFFFF] rounded-[2.5rem] border border-[#C4C4C4]/10 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-[#C4C4C4]/10 text-[10px] uppercase font-black text-[#C4C4C4]">
                    <tr>
                      <th className="px-8 py-5">Identitas User</th>
                      <th className="px-8 py-5">Peran</th>
                      <th className="px-8 py-5">Status Akun</th>
                      <th className="px-8 py-5">Kontribusi</th>
                      <th className="px-8 py-5">Aksi Cepat</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#C4C4C4]/10">
                    {allUsers.map((u) => (
                      <tr
                        key={u.id}
                        className="group hover:bg-[#233982]/5 transition-all"
                      >
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-[#233982]/10 text-[#233982] rounded-xl flex items-center justify-center font-bold">
                              {u.name[0]}
                            </div>
                            <div>
                              <p className="font-bold text-sm text-[#1B1B1B]">
                                {u.name}
                              </p>
                              <p className="text-[10px] text-[#C4C4C4] font-medium">
                                {u.email}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-2 h-2 rounded-full ${
                                u.role === "Editor"
                                  ? "bg-[#FCC200]"
                                  : "bg-[#4F619B]"
                              }`}
                            />
                            <span className="text-xs font-bold text-[#1B1B1B]/70 uppercase tracking-tight">
                              {u.role}
                            </span>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <span
                            className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase ${
                              u.status === "Active"
                                ? "bg-green-100 text-green-600"
                                : u.status === "Suspended"
                                  ? "bg-red-100 text-red-600"
                                  : "bg-[#FCC200]/20 text-[#FCC200]"
                            }`}
                          >
                            {u.status}
                          </span>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex flex-col">
                            <span className="text-xs font-bold text-[#1B1B1B]">
                              {u.posts} Artikel
                            </span>
                            <span className="text-[10px] text-[#C4C4C4] uppercase font-bold">
                              Sejak {u.joined}
                            </span>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="p-2.5 text-[#4F619B] bg-[#FFFFFF] border border-[#C4C4C4]/20 rounded-xl hover:bg-[#4F619B] hover:text-[#FFFFFF] transition-all shadow-sm">
                              <Settings size={16} />
                            </button>
                            <button className="p-2.5 text-red-600 bg-[#FFFFFF] border border-[#C4C4C4]/20 rounded-xl hover:bg-red-600 hover:text-[#FFFFFF] transition-all shadow-sm">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* MODULE PLACEHOLDER */}
          {activeTab !== "Dashboard" && activeTab !== "Manajemen User" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-32 bg-[#FFFFFF] rounded-[3rem] border-2 border-dashed border-[#C4C4C4]/20"
            >
              <div className="w-20 h-20 bg-[#233982]/10 rounded-full flex items-center justify-center mb-6 animate-pulse">
                <Database size={40} className="text-[#7281AF]" />
              </div>
              <h3 className="font-bold text-[#1B1B1B] text-xl mb-2">
                Modul {activeTab}
              </h3>
              <p className="text-[#C4C4C4] text-sm max-w-sm text-center">
                Panel kontrol untuk fungsi ini sedang dioptimalkan dalam
                environment pengembangan Admin.
              </p>
              {/* <div className="mt-8 flex gap-3">
                <div className="px-4 py-2 bg-[#C4C4C4]/10 rounded-xl text-[10px] font-black text-[#C4C4C4] uppercase tracking-widest">
                  Version 1.0.4-BETA
                </div>
              </div> */}
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
