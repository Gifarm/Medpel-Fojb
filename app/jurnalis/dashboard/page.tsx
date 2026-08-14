/* eslint-disable react-hooks/static-components */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  Clock,
  CheckCircle2,
  Eye,
  Plus,
  Edit3,
  AlertCircle,
  MessageSquare,
  TrendingUp,
  MoreHorizontal,
  Loader2,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import SidebarJurnalis from "@/components/jurnalis/Sidebar"; // Sesuaikan path
import toast from "react-hot-toast";

const COLORS = {
  primary: "#FCC200",
  blueDark: "#233982",
  blue: "#4F619B",
  black: "#1B1B1B",
  gray: "#C4C4C4",
};

// --- Komponen Badge Status ---
const StatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    Published: "bg-green-50 text-green-700 border-green-100",
    Review: "bg-yellow-50 text-yellow-700 border-yellow-100",
    Revision: "bg-red-50 text-red-700 border-red-100",
    Draft: "bg-gray-100 text-gray-600 border-gray-200",
    Rejected: "bg-red-50 text-red-700 border-red-100",
  };
  const labels: Record<string, string> = {
    Published: "Diterbitkan",
    Review: "Menunggu Review",
    Revision: "Perlu Revisi",
    Draft: "Draft",
    Rejected: "Ditolak",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide border ${
        styles[status] || styles.Draft
      }`}
    >
      {labels[status] || status}
    </span>
  );
};

const formatNumber = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    maximumFractionDigits: 2,
  }).format(value);

export default function JurnalisDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch data dashboard jurnalis dari API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/jurnalis/dashboard");
        const result = await res.json();
        if (result.success) {
          setDashboardData(result.data);
        } else {
          toast.error("Gagal memuat data dashboard");
        }
      } catch (error) {
        console.error("Gagal memuat data dashboard", error);
        toast.error("Gagal memuat data dashboard");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#1B1B1B] text-white text-xs p-3 rounded-xl shadow-xl border border-gray-700">
          <p className="font-bold mb-1 text-white">{label}</p>
          <p className="text-white font-semibold">
            Views:{" "}
            <span style={{ color: COLORS.primary }}>
              {payload[0].value.toLocaleString()}
            </span>
          </p>
        </div>
      );
    }
    return null;
  };

  if (isLoading || !dashboardData) {
    return (
      <div className="min-h-screen bg-[#f8faf9] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#233982]"></div>
      </div>
    );
  }

  const { stats, recentArticles, notifications, chartData } = dashboardData;

  const statsData = [
    {
      label: "Total Artikel",
      val: stats.totalArticles.toString(),
      icon: FileText,
      color: "text-[#233982]",
      bg: "bg-[#233982]/10",
    },
    {
      label: "Menunggu Review",
      val: stats.pendingReview.toString(),
      icon: Clock,
      color: "text-yellow-600",
      bg: "bg-yellow-50",
    },
    {
      label: "Diterbitkan",
      val: stats.published.toString(),
      icon: CheckCircle2,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      label: "Total Views",
      val: formatNumber(stats.totalViews),
      icon: Eye,
      color: "text-[#4F619B]",
      bg: "bg-[#4F619B]/10",
    },
  ];

  return (
    <div className="min-h-screen bg-[#f8faf9] font-sans text-[#1B1B1B] overflow-x-hidden flex">
      {/* --- SIDEBAR --- */}
      <SidebarJurnalis
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
              Dashboard Jurnalis
            </h2>
            <p className="text-[11px] text-[#C4C4C4] font-semibold uppercase tracking-wider">
              Kelola karya dan pantau performa artikel Anda
            </p>
          </div>
          <button
            onClick={() => (window.location.href = "/jurnalis/tulis-artikel")}
            className="px-5 py-2.5 bg-[#233982] text-white text-xs font-bold rounded-xl flex items-center gap-2 hover:bg-[#4F619B] transition-all shadow-md shadow-[#233982]/20"
          >
            <Plus size={16} />
            Tulis Artikel Baru
          </button>
        </header>

        <div className="p-8 max-w-[1600px] mx-auto space-y-8">
          {/* 1. Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statsData.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-[#FFFFFF] p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-all"
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color}`}
                >
                  <stat.icon size={22} />
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-[#C4C4C4] uppercase tracking-wide">
                    {stat.label}
                  </p>
                  <h3 className="text-2xl font-bold text-[#1B1B1B]">
                    {stat.val}
                  </h3>
                </div>
              </motion.div>
            ))}
          </div>

          {/* 2. Main Content Split: Recent Articles & Notifications */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Recent Articles (2/3 width) */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-2 bg-[#FFFFFF] rounded-2xl border border-gray-100 shadow-sm p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-bold text-lg text-[#1B1B1B]">
                    Artikel Terbaru Saya
                  </h3>
                  <p className="text-xs text-[#C4C4C4]">
                    Pantau status dan performa tulisan Anda
                  </p>
                </div>
                <button
                  onClick={() =>
                    (window.location.href = "/jurnalis/artikel-saya")
                  }
                  className="text-xs font-bold text-[#233982] hover:underline"
                >
                  Lihat Semua
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50/80 text-[11px] uppercase font-bold text-[#C4C4C4] tracking-wider border-b border-gray-100">
                    <tr>
                      <th className="px-4 py-3">Judul Artikel</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Views</th>
                      <th className="px-4 py-3 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {recentArticles.length > 0 ? (
                      recentArticles.map((article: any) => (
                        <tr
                          key={article.id}
                          className="group hover:bg-[#FCC200]/[0.03] transition-colors"
                        >
                          <td className="px-4 py-4">
                            <p className="font-bold text-sm text-[#1B1B1B] line-clamp-1 group-hover:text-[#233982] transition-colors">
                              {article.title}
                            </p>
                            <p className="text-[11px] text-[#C4C4C4] mt-0.5">
                              {article.category} • {article.date}
                            </p>
                          </td>
                          <td className="px-4 py-4">
                            <StatusBadge status={article.status} />
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#1B1B1B]">
                              <Eye size={14} className="text-[#4F619B]" />
                              {article.views > 0
                                ? formatNumber(article.views)
                                : "-"}
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                className="p-2 text-[#4F619B] hover:bg-[#4F619B]/10 rounded-lg transition-all"
                                title="Edit"
                                onClick={() =>
                                  (window.location.href = `/jurnalis/tulis-artikel?edit=${article.id}`)
                                }
                              >
                                <Edit3 size={16} />
                              </button>
                              <button
                                className="p-2 text-[#233982] hover:bg-[#233982]/10 rounded-lg transition-all"
                                title="Preview"
                              >
                                <MoreHorizontal size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={4}
                          className="px-4 py-8 text-center text-gray-400 text-sm"
                        >
                          Belum ada artikel yang dibuat.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>

            {/* Right: Notifications & Feedback (1/3 width) */}
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-[#FFFFFF] rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-lg text-[#1B1B1B]">
                  Notifikasi & Feedback
                </h3>
                <MessageSquare size={18} className="text-[#4F619B]" />
              </div>

              <div className="space-y-4 flex-1 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
                {notifications.length > 0 ? (
                  notifications.map((notif: any) => (
                    <div
                      key={notif.id}
                      className={`p-4 rounded-xl border transition-all hover:shadow-md ${
                        notif.type === "warning"
                          ? "bg-red-50/50 border-red-100"
                          : notif.type === "success"
                            ? "bg-green-50/50 border-green-100"
                            : "bg-blue-50/30 border-blue-100"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`mt-0.5 flex-shrink-0 ${
                            notif.type === "warning"
                              ? "text-red-500"
                              : notif.type === "success"
                                ? "text-green-500"
                                : "text-blue-500"
                          }`}
                        >
                          {notif.type === "warning" ? (
                            <AlertCircle size={18} />
                          ) : notif.type === "success" ? (
                            <CheckCircle2 size={18} />
                          ) : (
                            <MessageSquare size={18} />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <p
                              className={`text-xs font-bold uppercase tracking-wide ${
                                notif.type === "warning"
                                  ? "text-red-600"
                                  : notif.type === "success"
                                    ? "text-green-600"
                                    : "text-blue-600"
                              }`}
                            >
                              {notif.title}
                            </p>
                            <span className="text-[10px] text-[#C4C4C4] whitespace-nowrap">
                              {notif.date}
                            </span>
                          </div>
                          <p className="text-xs text-[#1B1B1B]/80 leading-relaxed mb-2">
                            {notif.message}
                          </p>
                          <p className="text-[10px] font-semibold text-[#4F619B] bg-[#4F619B]/10 inline-block px-2 py-0.5 rounded">
                            {notif.article}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-400 text-sm">
                    Tidak ada notifikasi baru.
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* 3. Performance Chart */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-[#FFFFFF] rounded-2xl border border-gray-100 shadow-sm p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-bold text-lg text-[#1B1B1B]">
                  Performa Artikel Terpopuler
                </h3>
                <p className="text-xs text-[#C4C4C4]">
                  Total views pada 5 artikel terbaik Anda
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-[#4F619B] bg-[#4F619B]/10 px-3 py-1.5 rounded-lg">
                <TrendingUp size={14} />
                <span>Real-time data</span>
              </div>
            </div>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#f0f0f0"
                  />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#6B7280", fontSize: 11 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#6B7280", fontSize: 11 }}
                  />
                  <Tooltip
                    content={<CustomTooltip />}
                    cursor={{ fill: "rgba(0,0,0,0.02)" }}
                  />
                  <Bar
                    dataKey="views"
                    fill={COLORS.blueDark}
                    radius={[6, 6, 0, 0]}
                    barSize={40}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
