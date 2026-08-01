/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/static-components */
"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Bell,
  Search,
  FileText,
  UserPlus,
  Trash2,
  Layers,
  Users,
  CheckSquare,
  Activity,
  ShieldAlert,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import Sidebar from "@/components/admin/Sidebar";

const COLORS = {
  primary: "#FCC200",
  primarySoft: "#FDCE33",
  blueDark: "#233982",
  blue: "#4F619B",
  blueLight: "#7281AF",
  black: "#1B1B1B",
  gray: "#C4C4C4",
  white: "#FFFFFF",
  bg: "#f8faf9",
};

// --- Dummy Data untuk Charts ---
const trafficData = [
  { name: "Sen", visitors: 4200 },
  { name: "Sel", visitors: 3800 },
  { name: "Rab", visitors: 5100 },
  { name: "Kam", visitors: 4900 },
  { name: "Jum", visitors: 6800 },
  { name: "Sab", visitors: 8400 },
  { name: "Min", visitors: 7200 },
];

const articleStatusData = [
  { name: "Published", value: 145, color: COLORS.blueDark },
  { name: "Pending", value: 28, color: COLORS.primary },
  { name: "Draft", value: 12, color: COLORS.gray },
];

const App = () => {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Mock Data
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

  // Custom Tooltip untuk Recharts - DINAMIS (bisa untuk LineChart & PieChart)
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#1B1B1B] text-white text-xs p-3 rounded-xl shadow-xl border border-gray-700">
          <p className="font-bold mb-1 text-white">{label}</p>
          <p className="text-white font-semibold">
            {payload[0].name}:{" "}
            <span style={{ color: payload[0].color }}>
              {payload[0].value.toLocaleString()}
            </span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-[#f8faf9] font-sans text-[#1B1B1B] overflow-x-hidden flex">
      {/* --- SIDEBAR ADMIN --- */}
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
        <header className="h-20 bg-[#FFFFFF]/80 backdrop-blur-md border-b border-gray-200/60 sticky top-0 z-40 px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div>
              <h2 className="text-xl font-bold text-[#1B1B1B]">{activeTab}</h2>
              <p className="text-[11px] text-[#C4C4C4] font-semibold uppercase tracking-wider">
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
                placeholder="Cari data..."
                className="bg-gray-50 border border-gray-200 rounded-xl py-2.5 pl-10 pr-4 text-sm w-64 focus:ring-2 focus:ring-[#233982]/20 focus:border-[#233982] transition-all outline-none text-[#1B1B1B] placeholder-[#C4C4C4]"
              />
            </div>
            <button className="p-2.5 text-[#C4C4C4] hover:bg-gray-100 rounded-xl transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-[#FFFFFF]" />
            </button>
            <div className="w-9 h-9 rounded-xl bg-[#233982] flex items-center justify-center text-white cursor-pointer hover:bg-[#4F619B] transition-all shadow-md shadow-[#233982]/20">
              <Layers size={18} />
            </div>
          </div>
        </header>

        <div className="p-8 max-w-[1600px] mx-auto space-y-8">
          {/* DASHBOARD OVERVIEW */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* 1. Hero Stats (Refined) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  label: "Total Jurnalis",
                  val: "154",
                  sub: "+12 bulan ini",
                  icon: Users,
                  trend: "up",
                  color: "blue",
                },
                {
                  label: "Pending Review",
                  val: "28",
                  sub: "Butuh tindakan",
                  icon: CheckSquare,
                  trend: "neutral",
                  color: "primary",
                },
                {
                  label: "Visitor Hari Ini",
                  val: "12,402",
                  sub: "↑ 14% dari kemarin",
                  icon: Activity,
                  trend: "up",
                  color: "blue",
                },
                {
                  label: "Security Alerts",
                  val: "0",
                  sub: "System Secure",
                  icon: ShieldAlert,
                  trend: "down",
                  color: "green",
                },
              ].map((s, i) => (
                <div
                  key={i}
                  className="bg-[#FFFFFF] p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center ${s.color === "primary" ? "bg-[#FCC200]/15 text-[#FCC200]" : s.color === "green" ? "bg-green-50 text-green-600" : "bg-[#233982]/10 text-[#233982]"} group-hover:scale-105 transition-transform`}
                    >
                      <s.icon size={22} />
                    </div>
                    {s.trend === "up" && (
                      <TrendingUp size={16} className="text-green-500" />
                    )}
                    {s.trend === "down" && (
                      <TrendingDown size={16} className="text-green-500" />
                    )}
                  </div>
                  <p className="text-[11px] font-semibold text-[#C4C4C4] uppercase tracking-wide">
                    {s.label}
                  </p>
                  <div className="flex items-baseline gap-2 mt-1">
                    <h3 className="text-2xl font-bold text-[#1B1B1B]">
                      {s.val}
                    </h3>
                  </div>
                  <p className="text-[11px] font-medium text-[#4F619B] mt-1">
                    {s.sub}
                  </p>
                </div>
              ))}
            </div>

            {/* 2. Charts Section (FIXED - teks putih & visible) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Line Chart: Traffic */}
              <div className="lg:col-span-2 bg-[#FFFFFF] rounded-2xl border border-gray-100 shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="font-bold text-lg text-[#1B1B1B]">
                      Trafik Pengunjung
                    </h3>
                    <p className="text-xs text-[#C4C4C4]">
                      Statistik kunjungan 7 hari terakhir
                    </p>
                  </div>
                  <select className="text-xs font-semibold text-[#1B1B1B] bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-[#233982]/20">
                    <option>7 Hari Terakhir</option>
                    <option>30 Hari Terakhir</option>
                  </select>
                </div>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trafficData}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="#f0f0f0"
                      />
                      <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{
                          fill: "#6B7280",
                          fontSize: 12,
                          fontWeight: 600,
                        }}
                        dy={10}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{
                          fill: "#6B7280",
                          fontSize: 12,
                          fontWeight: 600,
                        }}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Line
                        type="monotone"
                        dataKey="visitors"
                        stroke={COLORS.blueDark}
                        strokeWidth={3}
                        dot={{
                          fill: COLORS.blueDark,
                          r: 4,
                          strokeWidth: 2,
                          stroke: "#fff",
                        }}
                        activeDot={{ r: 6, fill: COLORS.primary }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Donut Chart: Article Status (FIXED - teks putih) */}
              {/* Donut Chart: Article Status (IMPROVED) */}
              <div className="bg-[#FFFFFF] rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col">
                <h3 className="font-bold text-lg text-[#1B1B1B] mb-1">
                  Status Artikel
                </h3>
                <p className="text-xs text-[#C4C4C4] mb-6">
                  Distribusi konten saat ini
                </p>
                <div className="flex-1 min-h-[250px] relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={articleStatusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={70}
                        outerRadius={90}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {articleStatusData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={entry.color}
                            stroke="none"
                          />
                        ))}
                      </Pie>
                      {/* Tooltip dengan posisi di atas chart */}
                      <Tooltip
                        content={<CustomTooltip />}
                        position={{ x: 150, y: 20 }} // Posisi tooltip di atas
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  {/* Center Text */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <div className="bg-white rounded-full w-24 h-24 flex flex-col items-center justify-center shadow-lg border-2 border-gray-50">
                      <span className="text-2xl font-bold text-[#233982]">
                        185
                      </span>
                      <span className="text-[9px] font-bold text-[#C4C4C4] uppercase tracking-wider">
                        Total
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 space-y-3">
                  {articleStatusData.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between text-sm"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-[#1B1B1B] font-medium">
                          {item.name}
                        </span>
                      </div>
                      <span className="font-bold text-[#1B1B1B]">
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 3. Moderation Queue & Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Moderation Queue */}
              <div className="lg:col-span-2 bg-[#FFFFFF] rounded-2xl border border-gray-100 shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="font-bold text-lg text-[#1B1B1B]">
                      Antrean Moderasi Konten
                    </h3>
                    <p className="text-xs text-[#C4C4C4]">
                      Tinjau artikel sebelum dipublikasikan.
                    </p>
                  </div>
                  <button className="text-xs font-bold text-[#233982] bg-[#233982]/10 px-4 py-2 rounded-xl hover:bg-[#233982]/20 transition-all">
                    Lihat Semua
                  </button>
                </div>

                <div className="space-y-3">
                  {pendingArticles.map((art) => (
                    <div
                      key={art.id}
                      className="flex items-center justify-between p-4 bg-gray-50/50 rounded-xl border border-transparent hover:border-[#233982]/20 hover:bg-white hover:shadow-sm transition-all group"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold shadow-sm ${art.priority === "High" ? "bg-red-50 text-red-600" : "bg-[#233982]/10 text-[#233982]"}`}
                        >
                          {art.title.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-sm text-[#1B1B1B] line-clamp-1">
                              {art.title}
                            </h4>
                            {art.priority === "High" && (
                              <span className="px-2 py-0.5 bg-red-100 text-red-600 text-[9px] font-black rounded-md uppercase tracking-wide">
                                Urgent
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] text-[#C4C4C4] font-semibold">
                              {art.author}
                            </span>
                            <span className="text-[#C4C4C4]">•</span>
                            <span className="text-[10px] text-[#4F619B] font-semibold">
                              {art.category}
                            </span>
                            <span className="text-[#C4C4C4]">•</span>
                            <span className="text-[10px] text-[#C4C4C4]">
                              {art.date}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                        <button
                          className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-500 hover:text-white transition-all"
                          title="Approve"
                        >
                          <CheckCircle2 size={16} />
                        </button>
                        <button
                          className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-500 hover:text-white transition-all"
                          title="Reject"
                        >
                          <AlertCircle size={16} />
                        </button>
                        <button
                          className="p-2 bg-white text-[#1B1B1B] border border-gray-200 rounded-lg hover:bg-gray-50 transition-all"
                          title="Preview"
                        >
                          <FileText size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* System Logs */}
              <div className="bg-[#FFFFFF] rounded-2xl border border-gray-100 shadow-sm p-6">
                <h3 className="font-bold text-lg mb-6 flex items-center gap-2 text-[#1B1B1B]">
                  <Activity size={18} className="text-[#4F619B]" /> Log
                  Aktivitas
                </h3>
                <div className="space-y-6">
                  {[
                    {
                      action: "User Suspended",
                      target: "Rina Kartika",
                      time: "12m ago",
                      color: "red",
                    },
                    {
                      action: "Role Updated",
                      target: "Andi Wijaya",
                      time: "45m ago",
                      color: "blue",
                    },
                    {
                      action: "New Registration",
                      target: "Siska Putri",
                      time: "2h ago",
                      color: "green",
                    },
                    {
                      action: "System Backup",
                      target: "Database_Main",
                      time: "5h ago",
                      color: "blue",
                    },
                  ].map((log, i) => (
                    <div key={i} className="flex gap-4 relative">
                      {i !== 3 && (
                        <div className="absolute left-[19px] top-10 bottom-[-24px] w-[2px] bg-gray-100" />
                      )}
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 z-10 border border-gray-100 bg-white shadow-sm ${log.color === "blue" ? "text-[#233982]" : log.color === "red" ? "text-red-500" : "text-green-500"}`}
                      >
                        <div
                          className={`w-2.5 h-2.5 rounded-full ${log.color === "blue" ? "bg-[#233982]" : log.color === "red" ? "bg-red-500" : "bg-green-500"}`}
                        />
                      </div>
                      <div className="pt-1.5">
                        <p className="text-xs font-bold text-[#1B1B1B]">
                          {log.action}
                        </p>
                        <p className="text-[11px] text-[#C4C4C4] font-medium">
                          {log.target} • {log.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default App;
