/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
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
} from "lucide-react";
import SidebarJurnalis from "@/components/jurnalis/Sidebar"; // Sesuaikan path
import toast from "react-hot-toast";

// --- Mock Data Notifikasi ---
const initialNotifications = [
  {
    id: 1,
    type: "revision",
    title: "Artikel Memerlukan Revisi",
    message:
      "Admin meminta Anda menambahkan sumber referensi pada paragraf ke-2 dan memperbaiki typo pada judul.",
    articleTitle: "Eksplorasi Budaya: Festival Seni Pelajar",
    date: "2 Jam lalu",
    isRead: false,
  },
  {
    id: 2,
    type: "success",
    title: "Artikel Berhasil Diterbitkan",
    message:
      "Selamat! Artikel Anda telah disetujui dan tayang di halaman utama Media Pelajar.",
    articleTitle: "Dampak AI dalam Pendidikan Modern",
    date: "1 Hari lalu",
    isRead: true,
  },
  {
    id: 3,
    type: "revision",
    title: "Perlu Tindakan: Revisi Minor",
    message:
      "Mohon ganti gambar cover karena resolusi terlalu rendah (minimal 1200x630px).",
    articleTitle: "Pemanasan Global: Fakta vs Mitos",
    date: "2 Hari lalu",
    isRead: false,
  },
  {
    id: 4,
    type: "info",
    title: "Feedback dari Editor",
    message:
      "Judul artikel sudah sangat menarik (catchy). Silakan langsung submit ke tahap review.",
    articleTitle: "Tips Sukses Menghadapi OSN",
    date: "3 Hari lalu",
    isRead: true,
  },
  {
    id: 5,
    type: "info",
    title: "Selamat Datang di Media Pelajar!",
    message:
      "Akun Jurnalis Anda telah aktif. Mulai tulis artikel pertamamu dan bagikan idemu ke pelajar Indonesia.",
    articleTitle: null,
    date: "1 Minggu lalu",
    isRead: true,
  },
];

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
  const [notifications, setNotifications] = useState(initialNotifications);

  // Filter Notifikasi
  const filteredNotifications = notifications.filter((notif) => {
    if (activeTab === "Belum Dibaca") return !notif.isRead;
    if (activeTab === "Perlu Tindakan")
      return notif.type === "revision" && !notif.isRead;
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const actionRequiredCount = notifications.filter(
    (n) => n.type === "revision" && !n.isRead,
  ).length;

  // Handler Tandai Dibaca
  const markAsRead = (id: number) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
    );
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
    toast.success("Semua notifikasi ditandai sudah dibaca");
  };

  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  const tabs = [
    { name: "Semua", count: notifications.length },
    { name: "Belum Dibaca", count: unreadCount },
    { name: "Perlu Tindakan", count: actionRequiredCount },
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
            <h2 className="text-xl font-bold text-[#1B1B1B]">Notifikasi</h2>
            <p className="text-[11px] text-[#C4C4C4] font-semibold uppercase tracking-wider">
              Pantau feedback dan status artikel dari Admin
            </p>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="px-4 py-2 bg-white border border-gray-200 text-[#1B1B1B] text-xs font-bold rounded-xl flex items-center gap-2 hover:bg-gray-50 transition-all"
            >
              <CheckCheck size={16} /> Tandai Semua Dibaca
            </button>
          )}
        </header>

        <div className="p-8 max-w-[1000px] mx-auto space-y-8">
          {/* 1. Tabs Filter */}
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

          {/* 2. Notification List */}
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {filteredNotifications.length > 0 ? (
                filteredNotifications.map((notif) => (
                  <motion.div
                    key={notif.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    onClick={() => markAsRead(notif.id)}
                    className={`group relative bg-[#FFFFFF] rounded-2xl border transition-all cursor-pointer overflow-hidden ${
                      notif.isRead
                        ? "border-gray-100 opacity-80 hover:opacity-100"
                        : "border-[#FCC200]/30 shadow-sm hover:shadow-md"
                    }`}
                  >
                    {/* Unread Indicator Line */}
                    {!notif.isRead && (
                      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#FCC200]" />
                    )}

                    <div className="p-5 flex items-start gap-4">
                      {/* Icon Box */}
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 border ${TypeBg({ type: notif.type })}`}
                      >
                        <TypeIcon type={notif.type} />
                      </div>

                      {/* Content */}
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

                        {/* Article Context Badge */}
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

                      {/* Actions (Visible on Hover) */}
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
