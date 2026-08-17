/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Briefcase,
  Clock,
  CheckCircle2,
  XCircle,
  Upload,
  ExternalLink,
  AlertCircle,
  X,
  Loader2,
  Send,
  MessageSquare,
} from "lucide-react";
import SidebarKOL from "@/components/kol/SidebarKOL";
import toast from "react-hot-toast";

// --- KOMPONEN BADGE ---
const StatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    CLAIMED: "bg-gray-100 text-gray-600 border-gray-200",
    PENDING: "bg-yellow-50 text-yellow-700 border-yellow-100",
    APPROVED: "bg-green-50 text-green-700 border-green-100",
    REJECTED: "bg-red-50 text-red-700 border-red-100",
  };
  const labels: Record<string, string> = {
    CLAIMED: "Perlu Disubmit",
    PENDING: "Menunggu Review",
    APPROVED: "Disetujui",
    REJECTED: "Ditolak",
  };
  const icons: Record<string, any> = {
    CLAIMED: Briefcase,
    PENDING: Clock,
    APPROVED: CheckCircle2,
    REJECTED: XCircle,
  };
  const Icon = icons[status] || Briefcase;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide border ${styles[status]}`}
    >
      <Icon size={12} />
      {labels[status]}
    </span>
  );
};

export default function TaskSayaPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [tasks, setTasks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("ALL");

  // State Modal Submit
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [submissionLink, setSubmissionLink] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch Data Submissions dari API
  const fetchSubmissions = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/kol/submissions");
      const result = await res.json();
      if (result.success) {
        setTasks(result.data);
      } else {
        toast.error(result.error || "Gagal memuat data task");
      }
    } catch (error) {
      console.error("Gagal memuat data task", error);
      toast.error("Gagal memuat data task");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  // Format Rupiah
  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Filter Tabs Logic
  const filteredTasks = useMemo(() => {
    if (activeTab === "ALL") return tasks;
    return tasks.filter((t) => t.status === activeTab);
  }, [tasks, activeTab]);

  const tabs = [
    { id: "ALL", label: "Semua", count: tasks.length },
    {
      id: "CLAIMED",
      label: "Perlu Disubmit",
      count: tasks.filter((t) => t.status === "CLAIMED").length,
    },
    {
      id: "PENDING",
      label: "Menunggu Review",
      count: tasks.filter((t) => t.status === "PENDING").length,
    },
    {
      id: "APPROVED",
      label: "Disetujui",
      count: tasks.filter((t) => t.status === "APPROVED").length,
    },
    {
      id: "REJECTED",
      label: "Ditolak",
      count: tasks.filter((t) => t.status === "REJECTED").length,
    },
  ];

  // Handler Buka Modal Submit
  const openSubmitModal = (task: any) => {
    setSelectedTask(task);
    setSubmissionLink(task.proofLink || ""); // Jika revisi, link lama muncul
    setIsSubmitModalOpen(true);
  };

  // Handler Kirim Submission
  const handleSubmitProof = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!submissionLink.trim()) {
      toast.error("Link bukti pengerjaan wajib diisi!");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/kol/submissions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          submissionId: selectedTask.id,
          proofLink: submissionLink,
        }),
      });

      const result = await res.json();
      if (result.success) {
        toast.success(
          "Bukti pengerjaan berhasil dikirim! Menunggu review admin.",
        );
        setIsSubmitModalOpen(false);
        setSelectedTask(null);
        setSubmissionLink("");
        fetchSubmissions(); // Refresh data agar status berubah jadi PENDING
      } else {
        toast.error(result.error || "Gagal mengirim bukti");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan pada server");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8faf9] font-sans text-[#1B1B1B] overflow-x-hidden flex">
      <SidebarKOL
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      <main
        className={`flex-1 transition-all duration-300 ${isSidebarOpen ? "ml-[280px]" : "ml-[80px]"}`}
      >
        {/* Top Header */}
        <header className="h-20 bg-[#FFFFFF]/80 backdrop-blur-md border-b border-gray-200/60 sticky top-0 z-30 px-8 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-[#1B1B1B]">Task Saya</h2>
            <p className="text-[11px] text-[#C4C4C4] font-semibold uppercase tracking-wider">
              Pantau progress dan submit bukti pengerjaan task kamu
            </p>
          </div>
        </header>

        <div className="p-8 max-w-[1200px] mx-auto space-y-8">
          {/* 1. Tabs Filter */}
          <div className="flex items-center gap-2 border-b border-gray-200 pb-1 overflow-x-auto no-scrollbar">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative px-4 py-2.5 text-sm font-bold transition-colors whitespace-nowrap flex items-center gap-2 ${
                  activeTab === tab.id
                    ? "text-[#233982]"
                    : "text-[#C4C4C4] hover:text-[#1B1B1B]"
                }`}
              >
                {tab.label}
                {tab.count > 0 && (
                  <span
                    className={`px-1.5 py-0.5 rounded-md text-[10px] font-black ${
                      activeTab === tab.id
                        ? "bg-[#233982] text-white"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="task-tab-active"
                    className="absolute bottom-[-1px] left-0 right-0 h-[3px] bg-[#FCC200] rounded-t-full"
                  />
                )}
              </button>
            ))}
          </div>

          {/* 2. Task List */}
          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {isLoading ? (
                <div className="flex justify-center py-20">
                  <Loader2 className="animate-spin text-[#233982]" size={32} />
                </div>
              ) : filteredTasks.length > 0 ? (
                filteredTasks.map((task) => (
                  <motion.div
                    key={task.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="bg-[#FFFFFF] rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-all"
                  >
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                      {/* Left: Task Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 rounded-xl bg-[#233982]/10 text-[#233982] flex items-center justify-center flex-shrink-0">
                            <Briefcase size={20} />
                          </div>
                          <div>
                            <h3 className="font-bold text-base text-[#1B1B1B]">
                              {task.title}
                            </h3>
                            <p className="text-[11px] text-[#C4C4C4]">
                              Terakhir update: {task.updatedAt}
                            </p>
                          </div>
                        </div>

                        {/* Feedback Box (Jika Ditolak) */}
                        {task.status === "REJECTED" && task.feedback && (
                          <div className="mt-3 p-3 bg-red-50 border border-red-100 rounded-xl flex items-start gap-2">
                            <AlertCircle
                              size={16}
                              className="text-red-600 flex-shrink-0 mt-0.5"
                            />
                            <div>
                              <p className="text-[11px] font-bold text-red-600 uppercase tracking-wide mb-0.5">
                                Catatan dari Admin:
                              </p>
                              <p className="text-xs text-red-700 leading-relaxed">
                                {task.feedback}
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Proof Link (Jika sudah disubmit) */}
                        {(task.status === "PENDING" ||
                          task.status === "APPROVED") &&
                          task.proofLink && (
                            <div className="mt-3 flex items-center gap-2 text-xs">
                              <span className="text-[#C4C4C4] font-medium">
                                Link Bukti:
                              </span>
                              <a
                                href={task.proofLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#233982] font-bold hover:underline flex items-center gap-1"
                              >
                                Lihat Bukti <ExternalLink size={12} />
                              </a>
                            </div>
                          )}
                      </div>

                      {/* Right: Status & Action */}
                      <div className="flex flex-row md:flex-col items-center md:items-end gap-3 md:gap-2 min-w-[140px]">
                        <StatusBadge status={task.status} />
                        <p className="text-lg font-black text-[#233982]">
                          {formatRupiah(task.reward)}
                        </p>

                        {/* Action Buttons */}
                        {(task.status === "CLAIMED" ||
                          task.status === "REJECTED") && (
                          <button
                            onClick={() => openSubmitModal(task)}
                            className="w-full md:w-auto px-4 py-2 text-xs font-bold text-white bg-[#233982] hover:bg-[#4F619B] rounded-lg transition-all flex items-center justify-center gap-1.5"
                          >
                            <Upload size={14} />{" "}
                            {task.status === "REJECTED"
                              ? "Submit Revisi"
                              : "Submit Bukti"}
                          </button>
                        )}

                        {task.status === "PENDING" && (
                          <p className="text-[11px] text-[#C4C4C4] italic flex items-center gap-1">
                            <Clock size={12} /> Sedang diperiksa...
                          </p>
                        )}

                        {task.status === "APPROVED" && (
                          <p className="text-[11px] text-green-600 font-bold flex items-center gap-1">
                            <CheckCircle2 size={12} /> Saldo masuk
                          </p>
                        )}
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
                    <Briefcase size={32} className="text-[#C4C4C4]" />
                  </div>
                  <h3 className="font-bold text-[#1B1B1B] mb-1">
                    Tidak ada task di kategori ini
                  </h3>
                  <p className="text-xs text-[#C4C4C4]">
                    {activeTab === "CLAIMED"
                      ? "Hebat! Semua task sudah kamu submit."
                      : "Coba ubah filter tab di atas."}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* --- MODAL SUBMIT BUKTI --- */}
      <AnimatePresence>
        {isSubmitModalOpen && selectedTask && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setIsSubmitModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-[#FCC200]/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#FCC200] text-[#1B1B1B] flex items-center justify-center">
                    <Upload size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#1B1B1B]">
                      {selectedTask.status === "REJECTED"
                        ? "Submit Revisi"
                        : "Kirim Bukti Pengerjaan"}
                    </h3>
                    <p className="text-xs text-[#C4C4C4]">
                      {selectedTask.title}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsSubmitModalOpen(false)}
                  className="p-2 hover:bg-gray-200 rounded-full transition-colors text-[#C4C4C4] hover:text-[#1B1B1B]"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmitProof} className="p-6 space-y-5">
                <div>
                  <label className="block text-xs font-bold text-[#C4C4C4] uppercase tracking-wide mb-1.5">
                    Link Bukti Pengerjaan *
                  </label>
                  <input
                    type="url"
                    required
                    value={submissionLink}
                    onChange={(e) => setSubmissionLink(e.target.value)}
                    placeholder="Contoh: https://tiktok.com/@username/video/123 atau Link Google Drive"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 text-sm font-medium text-[#1B1B1B] focus:ring-2 focus:ring-[#233982]/20 focus:border-[#233982] outline-none transition-all"
                  />
                  <p className="text-[10px] text-[#C4C4C4] mt-1.5">
                    Pastikan link bisa diakses oleh Admin (Public/Anyone with
                    link).
                  </p>
                </div>

                <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setIsSubmitModalOpen(false)}
                    className="px-5 py-2.5 text-sm font-bold text-[#C4C4C4] hover:text-[#1B1B1B] transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2.5 text-sm font-bold text-white bg-[#233982] rounded-xl hover:bg-[#4F619B] transition-all shadow-md shadow-[#233982]/20 flex items-center gap-2 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <Loader2 className="animate-spin" size={16} />
                    ) : (
                      <Send size={16} />
                    )}
                    {isSubmitting ? "Mengirim..." : "Kirim Submission"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
