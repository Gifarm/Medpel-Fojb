/* eslint-disable react-hooks/static-components */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Eye,
  FileText,
  Users,
  MessageSquare,
  TrendingUp,
  TrendingDown,
  Monitor,
  Smartphone,
  Tablet,
  Award,
  Folder,
  ArrowUpRight,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import Sidebar from "@/components/admin/Sidebar";

const COLORS = {
  primary: "#FCC200",
  blueDark: "#233982",
  blue: "#4F619B",
  blueLight: "#7281AF",
  black: "#1B1B1B",
  gray: "#C4C4C4",
  white: "#FFFFFF",
  green: "#10b981",
  red: "#ef4444",
};

// --- Mock Data untuk Charts ---
const growthData = [
  { month: "Jan", articles: 45, users: 120 },
  { month: "Feb", articles: 52, users: 145 },
  { month: "Mar", articles: 61, users: 180 },
  { month: "Apr", articles: 58, users: 210 },
  { month: "Mei", articles: 75, users: 260 },
  { month: "Jun", articles: 89, users: 310 },
  { month: "Jul", articles: 95, users: 380 },
];

const deviceData = [
  { name: "Mobile", value: 65, color: COLORS.blueDark },
  { name: "Desktop", value: 25, color: COLORS.primary },
  { name: "Tablet", value: 10, color: COLORS.gray },
];

const topArticlesData = [
  { name: "Tips Sukses OSN", views: 4500 },
  { name: "Beasiswa 2024", views: 3800 },
  { name: "Dampak AI", views: 3200 },
  { name: "Festival Seni", views: 2100 },
  { name: "Pemanasan Global", views: 1800 },
];

const topCategories = [
  { name: "Pendidikan", count: 124, percentage: 85 },
  { name: "Kegiatan Sekolah", count: 98, percentage: 70 },
  { name: "Teknologi", count: 76, percentage: 55 },
  { name: "Prestasi", count: 54, percentage: 40 },
  { name: "Opini", count: 42, percentage: 30 },
];

const topJurnalis = [
  { name: "Andi Wijaya", articles: 45, views: 12500, rank: 1 },
  { name: "Budi Santoso", articles: 32, views: 9800, rank: 2 },
  { name: "Siska Putri", articles: 28, views: 8400, rank: 3 },
  { name: "Rian Hidayat", articles: 21, views: 6200, rank: 4 },
  { name: "Dewi Lestari", articles: 18, views: 5100, rank: 5 },
];

export default function StatistikPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Custom Tooltip Dinamis
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#1B1B1B] text-white text-xs p-3 rounded-xl shadow-xl border border-gray-700">
          <p className="font-bold mb-1 text-white">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="font-semibold text-white">
              {entry.name}:{" "}
              <span style={{ color: entry.color }}>
                {entry.value.toLocaleString()}
              </span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const stats = [
    {
      label: "Total Page Views",
      val: "124,592",
      sub: "+18% bulan ini",
      icon: Eye,
      trend: "up",
      color: "blue",
    },
    {
      label: "Artikel Terbit",
      val: "412",
      sub: "+24 artikel baru",
      icon: FileText,
      trend: "up",
      color: "primary",
    },
    {
      label: "Total Pengguna",
      val: "3,845",
      sub: "+310 pengguna baru",
      icon: Users,
      trend: "up",
      color: "blue",
    },
    {
      label: "Total Komentar",
      val: "1,208",
      sub: "-5% dari bulan lalu",
      icon: MessageSquare,
      trend: "down",
      color: "green",
    },
  ];

  return (
    <div className="min-h-screen bg-[#f8faf9] font-sans text-[#1B1B1B] overflow-x-hidden flex">
      {/* --- SIDEBAR --- */}
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      {/* --- MAIN CONTENT --- */}
      <main
        className={`flex-1 transition-all duration-300 ${isSidebarOpen ? "ml-[280px]" : "ml-[80px]"}`}
      >
        {/* Top Header */}
        <header className="h-20 bg-[#FFFFFF]/80 backdrop-blur-md border-b border-gray-200/60 sticky top-0 z-30 px-8 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-[#1B1B1B]">
              Statistik Ringkas
            </h2>
            <p className="text-[11px] text-[#C4C4C4] font-semibold uppercase tracking-wider">
              Analisis performa dan aktivitas platform
            </p>
          </div>
          <div className="flex items-center gap-3">
            <select className="text-xs font-semibold text-[#1B1B1B] bg-white border border-gray-200 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-[#233982]/20 shadow-sm cursor-pointer">
              <option>7 Hari Terakhir</option>
              <option>30 Hari Terakhir</option>
              <option>Bulan Ini</option>
              <option>Tahun Ini</option>
            </select>
          </div>
        </header>

        <div className="p-8 max-w-[1600px] mx-auto space-y-8">
          {/* 1. Hero Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-[#FFFFFF] p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      s.color === "primary"
                        ? "bg-[#FCC200]/15 text-[#FCC200]"
                        : s.color === "green"
                          ? "bg-green-50 text-green-600"
                          : "bg-[#233982]/10 text-[#233982]"
                    } group-hover:scale-105 transition-transform`}
                  >
                    <s.icon size={22} />
                  </div>
                  {s.trend === "up" ? (
                    <div className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded-lg">
                      <TrendingUp size={14} />
                      <span className="text-[10px] font-bold">Naik</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-red-600 bg-red-50 px-2 py-1 rounded-lg">
                      <TrendingDown size={14} />
                      <span className="text-[10px] font-bold">Turun</span>
                    </div>
                  )}
                </div>
                <p className="text-[11px] font-semibold text-[#C4C4C4] uppercase tracking-wide">
                  {s.label}
                </p>
                <h3 className="text-2xl font-bold text-[#1B1B1B] mt-1">
                  {s.val}
                </h3>
                <p className="text-[11px] font-medium text-[#4F619B] mt-1">
                  {s.sub}
                </p>
              </motion.div>
            ))}
          </div>

          {/* 2. Main Charts: Growth & Devices */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Area Chart: Pertumbuhan */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-2 bg-[#FFFFFF] rounded-2xl border border-gray-100 shadow-sm p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-bold text-lg text-[#1B1B1B]">
                    Pertumbuhan Platform
                  </h3>
                  <p className="text-xs text-[#C4C4C4]">
                    Tren artikel terbit vs pendaftaran user
                  </p>
                </div>
                <div className="flex items-center gap-4 text-xs font-semibold">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#233982]" />
                    <span className="text-[#1B1B1B]">User</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#FCC200]" />
                    <span className="text-[#1B1B1B]">Artikel</span>
                  </div>
                </div>
              </div>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={growthData}>
                    <defs>
                      <linearGradient
                        id="colorUsers"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor={COLORS.blueDark}
                          stopOpacity={0.2}
                        />
                        <stop
                          offset="95%"
                          stopColor={COLORS.blueDark}
                          stopOpacity={0}
                        />
                      </linearGradient>
                      <linearGradient
                        id="colorArticles"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor={COLORS.primary}
                          stopOpacity={0.2}
                        />
                        <stop
                          offset="95%"
                          stopColor={COLORS.primary}
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#f0f0f0"
                    />
                    <XAxis
                      dataKey="month"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#6B7280", fontSize: 12, fontWeight: 600 }}
                      dy={10}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#6B7280", fontSize: 12, fontWeight: 600 }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="users"
                      stroke={COLORS.blueDark}
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorUsers)"
                      dot={{
                        r: 4,
                        fill: COLORS.blueDark,
                        strokeWidth: 2,
                        stroke: "#fff",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="articles"
                      stroke={COLORS.primary}
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorArticles)"
                      dot={{
                        r: 4,
                        fill: COLORS.primary,
                        strokeWidth: 2,
                        stroke: "#fff",
                      }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Donut Chart: Devices */}
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-[#FFFFFF] rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col"
            >
              <h3 className="font-bold text-lg text-[#1B1B1B] mb-1">
                Perangkat Pengguna
              </h3>
              <p className="text-xs text-[#C4C4C4] mb-6">
                Distribusi akses berdasarkan device
              </p>
              <div className="flex-1 min-h-[220px] relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={deviceData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {deviceData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.color}
                          stroke="none"
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      content={<CustomTooltip />}
                      position={{ x: 100, y: 10 }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <div className="bg-white rounded-full w-20 h-20 flex flex-col items-center justify-center shadow-sm border border-gray-50">
                    <span className="text-xl font-bold text-[#233982]">
                      100%
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-4 space-y-3">
                {deviceData.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between text-sm"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-[#1B1B1B] font-medium flex items-center gap-2">
                        {item.name === "Mobile" ? (
                          <Smartphone size={14} />
                        ) : item.name === "Desktop" ? (
                          <Monitor size={14} />
                        ) : (
                          <Tablet size={14} />
                        )}
                        {item.name}
                      </span>
                    </div>
                    <span className="font-bold text-[#1B1B1B]">
                      {item.value}%
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* 3. Secondary Charts: Top Articles & Categories */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Bar Chart: Top Articles */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-[#FFFFFF] rounded-2xl border border-gray-100 shadow-sm p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-bold text-lg text-[#1B1B1B]">
                    Artikel Terpopuler
                  </h3>
                  <p className="text-xs text-[#C4C4C4]">
                    5 Artikel dengan views tertinggi bulan ini
                  </p>
                </div>
              </div>
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={topArticlesData}
                    layout="vertical"
                    margin={{ left: 10 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      horizontal={false}
                      stroke="#f0f0f0"
                    />
                    <XAxis
                      type="number"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#6B7280", fontSize: 11 }}
                    />
                    <YAxis
                      type="category"
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#1B1B1B", fontSize: 12, fontWeight: 600 }}
                      width={100}
                    />
                    <Tooltip
                      content={<CustomTooltip />}
                      cursor={{ fill: "rgba(0,0,0,0.02)" }}
                    />
                    <Bar
                      dataKey="views"
                      fill={COLORS.blueDark}
                      radius={[0, 8, 8, 0]}
                      barSize={20}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* List: Top Categories */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-[#FFFFFF] rounded-2xl border border-gray-100 shadow-sm p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-bold text-lg text-[#1B1B1B]">
                    Kategori Teraktif
                  </h3>
                  <p className="text-xs text-[#C4C4C4]">
                    Distribusi artikel berdasarkan kategori
                  </p>
                </div>
                <Folder className="text-[#4F619B]" size={20} />
              </div>
              <div className="space-y-5">
                {topCategories.map((cat, idx) => (
                  <div key={idx}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-bold text-[#1B1B1B]">
                        {cat.name}
                      </span>
                      <span className="text-xs font-semibold text-[#4F619B]">
                        {cat.count} Artikel
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${cat.percentage}%` }}
                        transition={{ duration: 1, delay: 0.5 + idx * 0.1 }}
                        className={`h-2.5 rounded-full ${idx === 0 ? "bg-[#233982]" : idx === 1 ? "bg-[#FCC200]" : "bg-[#4F619B]"}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* 4. Leaderboard: Top Jurnalis */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-[#FFFFFF] rounded-2xl border border-gray-100 shadow-sm p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-bold text-lg text-[#1B1B1B]">
                  Papan Peringkat Jurnalis
                </h3>
                <p className="text-xs text-[#C4C4C4]">
                  Kontributor paling aktif dan dibaca bulan ini
                </p>
              </div>
              <Award className="text-[#FCC200]" size={24} />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50/80 text-[11px] uppercase font-bold text-[#C4C4C4] tracking-wider border-b border-gray-100">
                  <tr>
                    <th className="px-4 py-3 rounded-l-lg">Peringkat</th>
                    <th className="px-4 py-3">Nama Jurnalis</th>
                    <th className="px-4 py-3">Artikel Terbit</th>
                    <th className="px-4 py-3 rounded-r-lg">Total Views</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {topJurnalis.map((jurnalis) => (
                    <tr
                      key={jurnalis.rank}
                      className="group hover:bg-[#233982]/[0.02] transition-colors"
                    >
                      <td className="px-4 py-4">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                            jurnalis.rank === 1
                              ? "bg-[#FCC200]/20 text-[#B48A00]"
                              : jurnalis.rank === 2
                                ? "bg-gray-200 text-gray-700"
                                : jurnalis.rank === 3
                                  ? "bg-orange-100 text-orange-700"
                                  : "bg-gray-50 text-gray-500"
                          }`}
                        >
                          {jurnalis.rank}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          {/* <div className="w-9 h-9 bg-[#233982]/10 text-[#233982] rounded-lg flex items-center justify-center text-sm font-bold">
                            {jurnalis.name.charAt(0)}
                          </div> */}
                          <span className="font-bold text-sm text-[#1B1B1B]">
                            {jurnalis.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-sm font-semibold text-[#1B1B1B]">
                          {jurnalis.articles} Artikel
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1.5 text-sm font-bold text-[#233982]">
                          <Eye size={14} />
                          {jurnalis.views.toLocaleString()}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
