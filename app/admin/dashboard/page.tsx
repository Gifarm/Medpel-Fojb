/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/static-components */
"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  Bell,
  Search,
  FileText,
  Users,
  CheckSquare,
  Activity,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Eye,
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

const App = () => {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // State untuk filter dan data trafik real
  const [trafficFilter, setTrafficFilter] = useState("7_days");
  const [trafficData, setTrafficData] = useState<any[]>([]);
  const [isTrafficLoading, setIsTrafficLoading] = useState(false);

  // 1. Fetch Data Dashboard Utama
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await fetch("/api/admin/dashboard");
        const result = await res.json();
        if (result.success) {
          setDashboardData(result.data);
        }
      } catch (error) {
        console.error("Gagal memuat data dashboard", error);
        toast.error("Gagal memuat data dashboard");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // 2. Fetch Data Trafik Berdasarkan Filter
  useEffect(() => {
    const fetchTrafficData = async () => {
      setIsTrafficLoading(true);
      try {
        const res = await fetch(`/api/admin/traffic?period=${trafficFilter}`);
        const result = await res.json();
        if (result.success) {
          setTrafficData(result.data);
        }
      } catch (error) {
        console.error("Gagal memuat data trafik", error);
        toast.error("Gagal memuat data trafik");
      } finally {
        setIsTrafficLoading(false);
      }
    };

    fetchTrafficData();
  }, [trafficFilter]); // Re-fetch setiap kali filter berubah

  if (isLoading || !dashboardData) {
    return (
      <div className="min-h-screen bg-[#f8faf9] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#233982]"></div>
      </div>
    );
  }

  const {
    stats,
    recentPendingArticles,
    articleStatusData: apiArticleStatusData,
  } = dashboardData;

  const totalArticles = apiArticleStatusData.reduce(
    (sum: number, item: any) => sum + item.value,
    0,
  );

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
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      <main
        className={`flex-1 transition-all duration-300 ${isSidebarOpen ? "ml-[280px]" : "ml-[80px]"}`}
      >
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
          </div>
        </header>

        <div className="p-8 max-w-[1600px] mx-auto space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* 1. Hero Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  label: "Total Jurnalis",
                  val: stats.totalJurnalis.toString(),
                  sub: "Terdaftar di sistem",
                  icon: Users,
                  trend: "up",
                  color: "blue",
                },
                {
                  label: "Pending Review",
                  val: stats.pendingReview.toString(),
                  sub: "Butuh tindakan",
                  icon: CheckSquare,
                  trend: "neutral",
                  color: "primary",
                },
                {
                  label: "Artikel Terbit",
                  val: stats.publishedArticles.toString(),
                  sub: "Sudah dipublikasikan",
                  icon: Activity,
                  trend: "up",
                  color: "blue",
                },
                {
                  label: "Total Views Hari Ini",
                  val: (stats.visitorToday || 0).toString(),
                  sub: "Pengunjung unik",
                  icon: Eye,
                  trend: "up",
                  color: "blue",
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

            {/* 2. Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Line Chart: Traffic (DINAMIS DARI API) */}
              <div className="lg:col-span-2 bg-[#FFFFFF] rounded-2xl border border-gray-100 shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="font-bold text-lg text-[#1B1B1B]">
                      Trafik Pengunjung
                    </h3>
                    <p className="text-xs text-[#C4C4C4]">
                      Statistik kunjungan berdasarkan periode
                    </p>
                  </div>
                  <select
                    value={trafficFilter}
                    onChange={(e) => setTrafficFilter(e.target.value)}
                    disabled={isTrafficLoading}
                    className="text-xs font-semibold text-[#1B1B1B] bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-[#233982]/20 cursor-pointer disabled:opacity-50"
                  >
                    <option value="7_days">7 Hari Terakhir</option>
                    <option value="this_month">Bulan Ini</option>
                    <option value="this_year">Tahun Ini</option>
                  </select>
                </div>

                <div className="h-[300px] w-full">
                  {isTrafficLoading ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#233982]"></div>
                    </div>
                  ) : (
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
                  )}
                </div>
              </div>

              {/* Donut Chart: Article Status */}
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
                        data={apiArticleStatusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={70}
                        outerRadius={90}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {apiArticleStatusData.map(
                          (entry: any, index: number) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={entry.color}
                              stroke="none"
                            />
                          ),
                        )}
                      </Pie>
                      <Tooltip
                        content={<CustomTooltip />}
                        position={{ x: 150, y: 20 }}
                      />
                    </PieChart>
                  </ResponsiveContainer>

                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <div className="bg-white rounded-full w-24 h-24 flex flex-col items-center justify-center shadow-lg border-2 border-gray-50">
                      <span className="text-2xl font-bold text-[#233982]">
                        {totalArticles}
                      </span>
                      <span className="text-[9px] font-bold text-[#C4C4C4] uppercase tracking-wider">
                        Total
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 space-y-3">
                  {apiArticleStatusData.map((item: any, idx: number) => (
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

            {/* 3. Moderation Queue & Activity (Tetap sama seperti sebelumnya) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
                  {recentPendingArticles.length > 0 ? (
                    recentPendingArticles.map((art: any) => (
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
                    ))
                  ) : (
                    <div className="text-center py-8 text-[#C4C4C4] text-sm">
                      Tidak ada artikel yang menunggu review. Kerja bagus! 🎉
                    </div>
                  )}
                </div>
              </div>

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
