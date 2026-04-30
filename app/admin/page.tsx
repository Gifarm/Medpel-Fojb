"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  Settings,
  Bell,
  Search,
  ChevronRight,
  X,
  FileText,
  BarChart3,
  LogOut,
  CheckCircle2,
  AlertCircle,
  UserPlus,
  Trash2,
  CheckSquare,
  Activity,
  ShieldAlert,
  Globe,
  Database,
  Lock,
  Layers,
} from "lucide-react";

const COLORS = {
  primary: "#2b529b", // Admin Blue
  secondary: "#12a44d", // Accent Green
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

  const adminItems = [
    { name: "Dashboard", icon: LayoutDashboard },
    { name: "Moderasi Konten", icon: CheckSquare },
    { name: "Manajemen User", icon: Users },
    { name: "Analitik Global", icon: Activity },
    { name: "Keamanan Sistem", icon: ShieldAlert },
    { name: "Database & Log", icon: Database },
    { name: "Konfigurasi Site", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#f8faf9] font-sans text-gray-900 overflow-x-hidden flex">
      {/* --- SIDEBAR ADMIN --- */}
      <motion.aside
        initial={false}
        animate={{ width: isSidebarOpen ? 280 : 80 }}
        className="fixed left-0 top-0 h-full bg-white border-r border-blue-50 z-50 flex flex-col transition-all duration-300"
      >
        {/* Sidebar Logo */}
        <div className="p-6 flex items-center gap-3">
          {/* <div className="min-w-[40px] h-10 rounded-xl flex items-center justify-center shadow-lg bg-gradient-to-br from-[#2b529b] to-[#1e3a8a] shadow-blue-100">
            <span className="text-white font-bold text-xl">A</span>
          </div> */}
          <AnimatePresence>
            {isSidebarOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="overflow-hidden whitespace-nowrap"
              >
                <h1 className="font-bold text-[#2b529b]">
                  MedPel <span className="text-gray-400">Admin</span>
                </h1>

                <p className="text-[10px] text-[#2b529b]/60 font-bold uppercase tracking-widest leading-none">
                  Command Center
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sidebar Nav */}
        <div className="flex-1 px-4 py-6 space-y-2 overflow-y-auto no-scrollbar">
          <p
            className={`text-[9px] font-black uppercase tracking-[0.2em] mb-4 ml-4 text-gray-400 ${isSidebarOpen ? "opacity-100" : "opacity-0"}`}
          >
            Sistem Utama
          </p>
          {adminItems.map((item) => (
            <button
              key={item.name}
              onClick={() => setActiveTab(item.name)}
              className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group relative ${activeTab === item.name ? "bg-blue-50 text-[#2b529b]" : "text-gray-400 hover:bg-gray-50"}`}
            >
              <item.icon
                size={20}
                className={
                  activeTab === item.name
                    ? "text-[#2b529b]"
                    : "group-hover:text-gray-600"
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
                  layoutId="sidebar-active"
                  className="absolute left-0 w-1.5 h-6 rounded-r-full bg-[#2b529b]"
                />
              )}
            </button>
          ))}
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 mt-auto space-y-2">
          <div
            className={`flex items-center gap-3 p-3 bg-gray-50 rounded-2xl transition-all ${!isSidebarOpen ? "justify-center" : ""}`}
          >
            {/* <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-bold bg-blue-600 text-white shadow-md">
              AD
            </div> */}
            {isSidebarOpen && (
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-gray-800 truncate">
                  Administrator
                </p>
                <p className="text-[10px] text-green-600 uppercase font-black flex items-center gap-1">
                  {/* <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse" />{" "}
                  Online */}
                </p>
              </div>
            )}
          </div>
          <button
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl text-red-400 hover:bg-red-50 transition-all ${!isSidebarOpen ? "justify-center" : ""}`}
          >
            <LogOut size={18} />
            {isSidebarOpen && (
              <span className="text-xs font-bold uppercase">Logout Sistem</span>
            )}
          </button>
        </div>

        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="absolute -right-3 top-12 w-6 h-6 bg-white border border-gray-100 shadow-md rounded-full flex items-center justify-center text-gray-400 hover:text-[#2b529b] transition-colors"
        >
          {isSidebarOpen ? (
            <ChevronRight className="rotate-180" size={12} />
          ) : (
            <ChevronRight size={12} />
          )}
        </button>
      </motion.aside>

      {/* --- MAIN CONTENT --- */}
      <main
        className={`flex-1 transition-all duration-300 ${isSidebarOpen ? "ml-[280px]" : "ml-[80px]"}`}
      >
        {/* Top Header */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-40 px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-lg">
              <Globe size={14} className="text-[#2b529b]" />
              <span className="text-[10px] font-bold text-[#2b529b]">
                PROD_ENV_MAIN
              </span>
            </div>
            <div className="h-4 w-[1px] bg-gray-200" />
            <div>
              <h2 className="text-lg font-bold text-gray-800">{activeTab}</h2>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                Sistem Manajemen Terpusat
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative group hidden md:block">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#2b529b] transition-colors"
                size={16}
              />
              <input
                type="text"
                placeholder="Cari jurnalis, artikel, atau log..."
                className="bg-gray-50 border-none rounded-xl py-2.5 pl-10 pr-4 text-xs w-72 focus:ring-2 focus:ring-blue-100 transition-all outline-none"
              />
            </div>
            <button className="p-2.5 text-gray-400 hover:bg-gray-100 rounded-xl transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </button>
            <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 hover:bg-blue-50 hover:text-blue-600 cursor-pointer transition-all">
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
                    color: "orange",
                  },
                  {
                    label: "Visitor Hari Ini",
                    val: "12,402",
                    sub: "↑ 14% dari kemarin",
                    icon: Activity,
                    color: "green",
                  },
                  {
                    label: "Security Alerts",
                    val: "0",
                    sub: "System Secure",
                    icon: ShieldAlert,
                    color: "indigo",
                  },
                ].map((s, i) => (
                  <div
                    key={i}
                    className="bg-white p-6 rounded-[2rem] border border-gray-50 shadow-sm hover:shadow-xl transition-all group"
                  >
                    <div
                      className={`w-12 h-12 rounded-2xl mb-4 flex items-center justify-center bg-${s.color}-50 text-${s.color}-500 group-hover:scale-110 transition-transform`}
                    >
                      <s.icon size={24} />
                    </div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      {s.label}
                    </p>
                    <div className="flex items-baseline gap-2 mt-1">
                      <h3 className="text-3xl font-black text-gray-800">
                        {s.val}
                      </h3>
                      <span className="text-[10px] font-bold text-gray-400">
                        {s.sub}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Moderation Queue Section */}
                <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-gray-50 shadow-sm p-8">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h3 className="font-bold text-lg">
                        Antrean Moderasi Konten
                      </h3>
                      <p className="text-xs text-gray-400">
                        Tinjau artikel sebelum dipublikasikan ke publik.
                      </p>
                    </div>
                    <button className="text-xs font-bold text-blue-600 bg-blue-50 px-4 py-2 rounded-xl hover:bg-blue-100 transition-all">
                      Manajemen Semua
                    </button>
                  </div>

                  <div className="space-y-4">
                    {pendingArticles.map((art) => (
                      <div
                        key={art.id}
                        className="flex items-center justify-between p-5 bg-gray-50 rounded-[2rem] hover:bg-white border border-transparent hover:border-blue-100 hover:shadow-md transition-all group"
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm font-bold ${art.priority === "High" ? "bg-red-50 text-red-500" : "bg-blue-50 text-blue-500"}`}
                          >
                            {art.title.charAt(0)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-bold text-sm text-gray-800">
                                {art.title}
                              </h4>
                              {art.priority === "High" && (
                                <span className="px-2 py-0.5 bg-red-100 text-red-600 text-[8px] font-black rounded uppercase">
                                  Urgent
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-3 mt-1">
                              <span className="text-[10px] text-gray-500 font-bold uppercase">
                                {art.author}
                              </span>
                              <div className="w-1 h-1 bg-gray-300 rounded-full" />
                              <span className="text-[10px] text-blue-500 font-bold uppercase">
                                {art.category}
                              </span>
                              <div className="w-1 h-1 bg-gray-300 rounded-full" />
                              <span className="text-[10px] text-gray-400">
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
                            <X size={18} />
                          </button>
                          <button className="p-2.5 bg-white text-gray-600 border border-gray-100 rounded-xl hover:bg-gray-50 transition-all">
                            {/* <Eye size={18} /> */}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* System Logs / Activity */}
                <div className="bg-white rounded-[2.5rem] border border-gray-50 shadow-sm p-8">
                  <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                    <Activity size={20} className="text-blue-600" /> Log
                    Aktivitas
                  </h3>
                  <div className="space-y-6">
                    {[
                      {
                        action: "User Suspended",
                        target: "Rina Kartika",
                        time: "12m ago",
                        icon: Lock,
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
                        color: "indigo",
                      },
                    ].map((log, i) => (
                      <div key={i} className="flex gap-4 relative">
                        {i !== 3 && (
                          <div className="absolute left-5 top-10 bottom-[-24px] w-[2px] bg-gray-50" />
                        )}
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-${log.color}-50 text-${log.color}-500 z-10`}
                        >
                          <log.icon size={18} />
                        </div>
                        <div className="pt-1">
                          <p className="text-xs font-bold text-gray-800">
                            {log.action}
                          </p>
                          <p className="text-[10px] text-gray-400">
                            {log.target} • {log.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button className="w-full mt-8 py-3 bg-gray-50 text-gray-500 text-[10px] font-black uppercase rounded-2xl hover:bg-gray-100 transition-all tracking-widest">
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
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-[2.5rem] border border-gray-50 shadow-sm">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">
                    Direktori Pengguna
                  </h3>
                  <p className="text-sm text-gray-400">
                    Total 154 pengguna terdaftar di platform.
                  </p>
                </div>
                <div className="flex gap-3">
                  <button className="px-6 py-3 bg-[#2b529b] text-white text-xs font-bold rounded-2xl flex items-center gap-2 shadow-lg shadow-blue-100 hover:translate-y-[-2px] transition-all">
                    <UserPlus size={18} /> UNDANG USER
                  </button>
                  <button className="px-6 py-3 bg-white border border-gray-100 text-gray-600 text-xs font-bold rounded-2xl flex items-center gap-2 hover:bg-gray-50 transition-all">
                    Export CSV
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-[2.5rem] border border-gray-50 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 text-[10px] uppercase font-black text-gray-400">
                    <tr>
                      <th className="px-8 py-5">Identitas User</th>
                      <th className="px-8 py-5">Peran</th>
                      <th className="px-8 py-5">Status Akun</th>
                      <th className="px-8 py-5">Kontribusi</th>
                      <th className="px-8 py-5">Aksi Cepat</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {allUsers.map((u) => (
                      <tr
                        key={u.id}
                        className="group hover:bg-blue-50/30 transition-all"
                      >
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center font-bold">
                              {u.name[0]}
                            </div>
                            <div>
                              <p className="font-bold text-sm text-gray-800">
                                {u.name}
                              </p>
                              <p className="text-[10px] text-gray-400 font-medium">
                                {u.email}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-2 h-2 rounded-full ${u.role === "Admin" ? "bg-purple-500" : "bg-blue-500"}`}
                            />
                            <span className="text-xs font-bold text-gray-600 uppercase tracking-tight">
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
                                  : "bg-yellow-100 text-yellow-600"
                            }`}
                          >
                            {u.status}
                          </span>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex flex-col">
                            <span className="text-xs font-bold text-gray-700">
                              {u.posts} Artikel
                            </span>
                            <span className="text-[10px] text-gray-400 uppercase font-bold">
                              Sejak {u.joined}
                            </span>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="p-2.5 text-blue-600 bg-white border border-gray-100 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm">
                              <Settings size={16} />
                            </button>
                            <button className="p-2.5 text-red-600 bg-white border border-gray-100 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm">
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
              className="flex flex-col items-center justify-center py-32 bg-white rounded-[3rem] border-2 border-dashed border-gray-100"
            >
              <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6 animate-pulse">
                <Database size={40} className="text-blue-300" />
              </div>
              <h3 className="font-bold text-gray-800 text-xl mb-2">
                Modul {activeTab}
              </h3>
              <p className="text-gray-400 text-sm max-w-sm text-center">
                Panel kontrol untuk fungsi ini sedang dioptimalkan dalam
                environment pengembangan Admin.
              </p>
              <div className="mt-8 flex gap-3">
                <div className="px-4 py-2 bg-gray-50 rounded-xl text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  Version 1.0.4-BETA
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
