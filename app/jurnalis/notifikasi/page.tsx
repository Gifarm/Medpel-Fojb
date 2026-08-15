/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  AlertCircle,
  CheckCircle2,
  Info,
  FileText,
  CheckCheck,
  Trash2,
  Clock,
  ArrowRight,
  Loader2,
} from "lucide-react";
import SidebarJurnalis from "@/components/jurnalis/Sidebar";
import toast from "react-hot-toast";

// --- Komponen Ikon Berdasarkan Tipe ---
const TypeIcon = ({ type }: { type: string }) => {
  if (type === "revision")
    return <AlertCircle size={20} className="text-red-600" />;
  if (type === "success")
    return <CheckCircle2 size={20} className="text-green-600" />;
  return <Info size={20} className="text-blue-600" />;
};

const TypeBg = ({ type }: { type: string }) => {
  if (type === "revision") return "bg-red-50 border-red-100";
  if (type === "success") return "bg-green-50 border-green-100";
  return "bg-blue-50 border-blue-100";
};

export default function NotifikasiPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("Semua");
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);

  // Fetch Notifikasi dari API
  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      const filterMap: Record<string, string> = {
        Semua: "all",
        "Belum Dibaca": "unread",
        "Perlu Tindakan": "action_required",
      };

      const res = await fetch(
        `/api/jurnalis/notifications?filter=${filterMap[activeTab]}`,
      );
      const result = await res.json();
      if (result.success) {
        setNotifications(result.data);
      }
    } catch (error) {
      console.error("Gagal memuat notifikasi", error);
      toast.error("Gagal memuat notifikasi");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [activeTab]);

  // Hitung jumlah untuk badge tab
  const unreadCount = notifications.filter((n) => !n.isRead).length;
  // Untuk "Perlu Tindakan", kita asumsikan semua yang belum dibaca di tab ini adalah action required

  // Handler Tandai Dibaca
  const markAsRead = async (id: string) => {
    try {
      await fetch("/api/jurnalis/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      // Update UI secara optimistik
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
      );
    } catch (error) {
      toast.error("Gagal menandai sebagai dibaca");
    }
  };

  const markAllAsRead = async () => {
    setIsActionLoading(true);
    try {
      await fetch("/api/jurnalis/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markAll: true }),
      });
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      toast.success("Semua notifikasi ditandai sudah dibaca");
    } catch (error) {
      toast.error("Gagal memperbarui notifikasi");
    } finally {
      setIsActionLoading(false);
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      await fetch(`/api/jurnalis/notifications?id=${id}`, { method: "DELETE" });
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      toast.success("Notifikasi dihapus");
    } catch (error) {
      toast.error("Gagal menghapus notifikasi");
    }
  };

  const tabs = [
    { name: "Semua", count: notifications.length },
    {
      name: "Belum Dibaca",
      count: notifications.filter((n) => !n.isRead).length,
    },
    {
      name: "Perlu Tindakan",
      count: notifications.filter((n) => n.type === "revision" && !n.isRead)
        .length,
    },
  ];

  return (
    <div className="min-h-screen bg-[#f8faf9] font-sans text-[#1B1B1B] overflow-x-hidden flex">
      <SidebarJurnalis
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      <main
        className={`flex-1 transition-all duration-300 ${isSidebarOpen ? "ml-[280px]" : "ml-[80px]"}`}
      >
        <header className="h-20 bg-[#FFFFFF]/80 backdrop-blur-md border-b border-gray-200/60 sticky top-0 z-30 px-8 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-[#1B1B1B]">Notifikasi</h2>
            <p className="text-[11px] text-[#C4C4C4] font-semibold uppercase tracking-wider">
              Pantau feedback dan status artikel dari Admin
            </p>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              disabled={isActionLoading}
              className="px-4 py-2 bg-white border border-gray-200 text-[#1B1B1B] text-xs font-bold rounded-xl flex items-center gap-2 hover:bg-gray-50 transition-all disabled:opacity-50"
            >
              {isActionLoading ? (
                <Loader2 className="animate-spin" size={16} />
              ) : (
                <CheckCheck size={16} />
              )}
              Tandai Semua Dibaca
            </button>
          )}
        </header>

        <div className="p-8 max-w-[1000px] mx-auto space-y-8">
          {/* Tabs Filter */}
          <div className="flex items-center gap-2 border-b border-gray-200 pb-1 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.name}
                onClick={() => setActiveTab(tab.name)}
                className={`relative px-5 py-3 text-sm font-bold transition-colors whitespace-nowrap ${
                  activeTab === tab.name
                    ? "text-[#233982]"
                    : "text-[#C4C4C4] hover:text-[#1B1B1B]"
                }`}
              >
                {tab.name}
                {tab.count > 0 && (
                  <span
                    className={`ml-2 px-2 py-0.5 rounded-full text-[10px] font-black ${
                      activeTab === tab.name
                        ? "bg-[#233982] text-white"
                        : tab.name === "Perlu Tindakan"
                          ? "bg-red-100 text-red-600"
                          : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
                {activeTab === tab.name && (
                  <motion.div
                    layoutId="notif-tab-active"
                    className="absolute bottom-[-1px] left-0 right-0 h-[3px] bg-[#FCC200] rounded-t-full"
                  />
                )}
              </button>
            ))}
          </div>

          {/* Notification List */}
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {isLoading ? (
                <div className="flex justify-center py-20">
                  <Loader2 className="animate-spin text-[#233982]" size={32} />
                </div>
              ) : notifications.length > 0 ? (
                notifications.map((notif) => (
                  <motion.div
                    key={notif.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    onClick={() => !notif.isRead && markAsRead(notif.id)}
                    className={`group relative bg-[#FFFFFF] rounded-2xl border transition-all cursor-pointer overflow-hidden ${
                      notif.isRead
                        ? "border-gray-100 opacity-80 hover:opacity-100"
                        : "border-[#FCC200]/30 shadow-sm hover:shadow-md"
                    }`}
                  >
                    {!notif.isRead && (
                      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#FCC200]" />
                    )}

                    <div className="p-5 flex items-start gap-4">
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 border ${TypeBg({ type: notif.type })}`}
                      >
                        <TypeIcon type={notif.type} />
                      </div>

                      <div className="flex-1 min-w-0 pt-0.5">
                        <div className="flex items-center justify-between mb-1">
                          <h3
                            className={`text-sm font-bold ${notif.isRead ? "text-[#1B1B1B]" : "text-[#233982]"}`}
                          >
                            {notif.title}
                          </h3>
                          <div className="flex items-center gap-1.5 text-[10px] font-medium text-[#C4C4C4] whitespace-nowrap">
                            <Clock size={12} />
                            {notif.date}
                          </div>
                        </div>

                        <p className="text-xs text-[#1B1B1B]/70 leading-relaxed mb-3">
                          {notif.message}
                        </p>

                        {notif.articleTitle && (
                          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-50 border border-gray-100 rounded-lg group-hover:bg-[#233982]/5 group-hover:border-[#233982]/10 transition-colors">
                            <FileText size={12} className="text-[#4F619B]" />
                            <span className="text-[11px] font-semibold text-[#4F619B] truncate max-w-[200px]">
                              {notif.articleTitle}
                            </span>
                            <ArrowRight
                              size={12}
                              className="text-[#C4C4C4] group-hover:text-[#233982] transition-colors"
                            />
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col items-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {!notif.isRead && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              markAsRead(notif.id);
                            }}
                            className="p-2 text-[#4F619B] hover:bg-[#4F619B]/10 rounded-lg transition-all"
                            title="Tandai Dibaca"
                          >
                            <CheckCheck size={16} />
                          </button>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotification(notif.id);
                          }}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all"
                          title="Hapus Notifikasi"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center py-20 bg-[#FFFFFF] rounded-2xl border border-gray-100 border-dashed"
                >
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                    <Bell size={32} className="text-[#C4C4C4]" />
                  </div>
                  <h3 className="font-bold text-[#1B1B1B] mb-1">
                    Tidak ada notifikasi
                  </h3>
                  <p className="text-xs text-[#C4C4C4]">
                    {activeTab === "Perlu Tindakan"
                      ? "Hebat! Tidak ada artikel yang perlu direvisi saat ini."
                      : "Anda sudah membaca semua notifikasi."}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}
