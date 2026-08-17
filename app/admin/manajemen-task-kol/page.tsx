/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Briefcase,
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  X,
  ExternalLink,
  AlertCircle,
  Loader2,
} from "lucide-react";
import Sidebar from "@/components/admin/Sidebar";
import toast from "react-hot-toast";

// --- KOMPONEN BADGE ---
const TaskStatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    ACTIVE: "bg-green-50 text-green-700 border-green-100",
    COMPLETED: "bg-gray-100 text-gray-600 border-gray-200",
    CANCELLED: "bg-red-50 text-red-700 border-red-100",
  };
  const labels: Record<string, string> = {
    ACTIVE: "Aktif",
    COMPLETED: "Selesai",
    CANCELLED: "Dibatalkan",
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide border ${styles[status]}`}
    >
      {labels[status]}
    </span>
  );
};

const SubmissionStatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    PENDING: "bg-yellow-50 text-yellow-700 border-yellow-100",
    APPROVED: "bg-green-50 text-green-700 border-green-100",
    REJECTED: "bg-red-50 text-red-700 border-red-100",
  };
  const labels: Record<string, string> = {
    PENDING: "Menunggu Review",
    APPROVED: "Disetujui",
    REJECTED: "Ditolak",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide border ${styles[status]}`}
    >
      {status === "PENDING" && <Clock size={12} />}
      {status === "APPROVED" && <CheckCircle2 size={12} />}
      {status === "REJECTED" && <XCircle size={12} />}
      {labels[status]}
    </span>
  );
};

export default function ManajemenTaskKOLPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // State Data
  const [tasks, setTasks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // State Modal & Form
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // State Form Create Task
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    reward: "",
    quota: "",
  });

  // State Form Review
  const [reviewFeedback, setReviewFeedback] = useState("");
  const [reviewingSubmissionId, setReviewingSubmissionId] = useState<
    string | null
  >(null);

  // Fetch Tasks dari API
  const fetchTasks = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/tasks");
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
    fetchTasks();
  }, []);

  // Hitung Statistik Real-time
  const activeTasksCount = tasks.filter((t) => t.status === "ACTIVE").length;
  const pendingSubmissionsCount = tasks.reduce(
    (sum, t) =>
      sum + t.submissions.filter((s: any) => s.status === "PENDING").length,
    0,
  );
  const totalBudgetAllocated = tasks.reduce(
    (sum, t) => sum + t.reward * t.claimed,
    0,
  );

  // Handler Buka Modal Review
  const openReviewModal = (task: any) => {
    setSelectedTask(task);
    setIsReviewModalOpen(true);
    setReviewFeedback("");
    setReviewingSubmissionId(null);
  };

  // Handler Buat Task Baru
  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title || !newTask.reward || !newTask.quota) {
      toast.error("Semua field wajib diisi!");
      return;
    }

    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTask.title,
          description: newTask.description,
          reward: parseInt(newTask.reward),
          quota: parseInt(newTask.quota),
        }),
      });

      const result = await res.json();
      if (result.success) {
        toast.success("Task berhasil dibuat!");
        setIsCreateModalOpen(false);
        setNewTask({ title: "", description: "", reward: "", quota: "" });
        fetchTasks(); // Refresh data
      } else {
        toast.error(result.error || "Gagal membuat task");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan pada server");
    } finally {
      setIsSaving(false);
    }
  };

  // Handler Approve/Reject Submission
  const handleReviewSubmission = async (
    submissionId: string,
    action: "APPROVED" | "REJECTED",
  ) => {
    if (action === "REJECTED" && !reviewFeedback.trim()) {
      toast.error("Harap isi alasan penolakan!");
      return;
    }

    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/submissions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          submissionId,
          action,
          feedback: action === "REJECTED" ? reviewFeedback : undefined,
        }),
      });

      const result = await res.json();
      if (result.success) {
        toast.success(
          action === "APPROVED"
            ? "Submission disetujui & saldo ditambahkan!"
            : "Submission ditolak!",
        );
        setReviewFeedback("");
        setReviewingSubmissionId(null);
        fetchTasks(); // Refresh data untuk update claimed & status
      } else {
        toast.error(result.error || "Gagal mengupdate submission");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan pada server");
    } finally {
      setIsSaving(false);
    }
  };

  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
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
        {/* Top Header */}
        <header className="h-20 bg-[#FFFFFF]/80 backdrop-blur-md border-b border-gray-200/60 sticky top-0 z-30 px-8 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-[#1B1B1B]">
              Manajemen Task KOL
            </h2>
            <p className="text-[11px] text-[#C4C4C4] font-semibold uppercase tracking-wider">
              Buat, pantau, dan review pengerjaan tugas dari KOL
            </p>
          </div>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-5 py-2.5 bg-[#233982] text-white text-xs font-bold rounded-xl flex items-center gap-2 hover:bg-[#4F619B] transition-all shadow-md shadow-[#233982]/20"
          >
            <Plus size={16} /> Buat Task Baru
          </button>
        </header>

        <div className="p-8 max-w-[1600px] mx-auto space-y-8">
          {/* 1. Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#FFFFFF] p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4"
            >
              <div className="w-12 h-12 rounded-xl bg-[#233982]/10 text-[#233982] flex items-center justify-center">
                <Briefcase size={22} />
              </div>
              <div>
                <p className="text-[11px] font-semibold text-[#C4C4C4] uppercase tracking-wide">
                  Task Aktif
                </p>
                <h3 className="text-2xl font-bold text-[#1B1B1B]">
                  {activeTasksCount}
                </h3>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-[#FFFFFF] p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4"
            >
              <div className="w-12 h-12 rounded-xl bg-yellow-50 text-yellow-600 flex items-center justify-center">
                <Clock size={22} />
              </div>
              <div>
                <p className="text-[11px] font-semibold text-[#C4C4C4] uppercase tracking-wide">
                  Menunggu Review
                </p>
                <h3 className="text-2xl font-bold text-[#1B1B1B]">
                  {pendingSubmissionsCount}
                </h3>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-[#FFFFFF] p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4"
            >
              <div className="w-12 h-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
                <Users size={22} />
              </div>
              <div>
                <p className="text-[11px] font-semibold text-[#C4C4C4] uppercase tracking-wide">
                  Total Budget Terklaim
                </p>
                <h3 className="text-2xl font-bold text-[#1B1B1B]">
                  {formatRupiah(totalBudgetAllocated)}
                </h3>
              </div>
            </motion.div>
          </div>

          {/* 2. Data Table Task */}
          <div className="bg-[#FFFFFF] rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50/80 text-[11px] uppercase font-bold text-[#C4C4C4] tracking-wider border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4">Nama Task</th>
                    <th className="px-6 py-4">Reward / Kuota</th>
                    <th className="px-6 py-4">Progress</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {isLoading ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#233982] mx-auto"></div>
                      </td>
                    </tr>
                  ) : tasks.length > 0 ? (
                    tasks.map((task) => {
                      const pendingCount = task.submissions.filter(
                        (s: any) => s.status === "PENDING",
                      ).length;
                      return (
                        <motion.tr
                          key={task.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="group hover:bg-[#233982]/[0.02] transition-colors"
                        >
                          <td className="px-6 py-4">
                            <p className="font-bold text-sm text-[#1B1B1B] line-clamp-1">
                              {task.title}
                            </p>
                            <p className="text-[11px] text-[#C4C4C4] mt-0.5">
                              Dibuat: {task.createdAt}
                            </p>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-sm font-bold text-[#233982]">
                              {formatRupiah(task.reward)}
                            </p>
                            <p className="text-[11px] text-[#C4C4C4]">
                              per KOL
                            </p>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex-1 w-24 bg-gray-100 rounded-full h-2 overflow-hidden">
                                <div
                                  className="bg-[#FCC200] h-2 rounded-full transition-all duration-500"
                                  style={{
                                    width: `${(task.claimed / task.quota) * 100}%`,
                                  }}
                                />
                              </div>
                              <span className="text-xs font-bold text-[#1B1B1B]">
                                {task.claimed}/{task.quota}
                              </span>
                            </div>
                            {pendingCount > 0 && (
                              <span className="text-[10px] text-yellow-600 font-semibold mt-1 block">
                                {pendingCount} menunggu review
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <TaskStatusBadge status={task.status} />
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => openReviewModal(task)}
                                className="px-3 py-1.5 text-xs font-bold text-[#233982] bg-[#233982]/10 hover:bg-[#233982]/20 rounded-lg transition-all flex items-center gap-1.5"
                              >
                                <Eye size={14} /> Review (
                                {task.submissions.length})
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center justify-center text-[#C4C4C4]">
                          <Briefcase size={48} className="mb-3 opacity-20" />
                          <p className="font-semibold text-sm">
                            Belum ada task yang dibuat.
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {/* --- MODAL BUAT TASK BARU --- */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setIsCreateModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                <h3 className="text-lg font-bold text-[#1B1B1B]">
                  Buat Task KOL Baru
                </h3>
                <button
                  onClick={() => setIsCreateModalOpen(false)}
                  className="p-2 hover:bg-gray-200 rounded-full transition-colors text-[#C4C4C4] hover:text-[#1B1B1B]"
                >
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleCreateTask} className="p-6 space-y-5">
                <div>
                  <label className="block text-xs font-bold text-[#C4C4C4] uppercase tracking-wide mb-1.5">
                    Judul Task
                  </label>
                  <input
                    type="text"
                    required
                    value={newTask.title}
                    onChange={(e) =>
                      setNewTask({ ...newTask, title: e.target.value })
                    }
                    placeholder="Contoh: Buat Konten TikTok Edukasi"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 text-sm font-medium text-[#1B1B1B] focus:ring-2 focus:ring-[#233982]/20 focus:border-[#233982] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#C4C4C4] uppercase tracking-wide mb-1.5">
                    Deskripsi & Ketentuan
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={newTask.description}
                    onChange={(e) =>
                      setNewTask({ ...newTask, description: e.target.value })
                    }
                    placeholder="Jelaskan detail pengerjaan, hashtag wajib, dll."
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 text-sm font-medium text-[#1B1B1B] focus:ring-2 focus:ring-[#233982]/20 focus:border-[#233982] outline-none resize-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#C4C4C4] uppercase tracking-wide mb-1.5">
                      Reward (Rp)
                    </label>
                    <input
                      type="number"
                      required
                      value={newTask.reward}
                      onChange={(e) =>
                        setNewTask({ ...newTask, reward: e.target.value })
                      }
                      placeholder="20000"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 text-sm font-medium text-[#1B1B1B] focus:ring-2 focus:ring-[#233982]/20 focus:border-[#233982] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#C4C4C4] uppercase tracking-wide mb-1.5">
                      Kuota KOL
                    </label>
                    <input
                      type="number"
                      required
                      value={newTask.quota}
                      onChange={(e) =>
                        setNewTask({ ...newTask, quota: e.target.value })
                      }
                      placeholder="50"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 text-sm font-medium text-[#1B1B1B] focus:ring-2 focus:ring-[#233982]/20 focus:border-[#233982] outline-none"
                    />
                  </div>
                </div>
                <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-100 mt-6">
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="px-5 py-2.5 text-sm font-bold text-[#C4C4C4] hover:text-[#1B1B1B] transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-5 py-2.5 text-sm font-bold text-white bg-[#233982] rounded-xl hover:bg-[#4F619B] transition-all shadow-md shadow-[#233982]/20 flex items-center gap-2 disabled:opacity-70"
                  >
                    {isSaving ? (
                      <Loader2 className="animate-spin" size={16} />
                    ) : (
                      <Plus size={16} />
                    )}
                    Publish Task
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- MODAL REVIEW SUBMISSION --- */}
      <AnimatePresence>
        {isReviewModalOpen && selectedTask && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setIsReviewModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white w-full max-w-3xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                <div>
                  <h3 className="text-lg font-bold text-[#1B1B1B]">
                    Review Submission
                  </h3>
                  <p className="text-xs text-[#C4C4C4] mt-1">
                    {selectedTask.title}
                  </p>
                </div>
                <button
                  onClick={() => setIsReviewModalOpen(false)}
                  className="p-2 hover:bg-gray-200 rounded-full transition-colors text-[#C4C4C4] hover:text-[#1B1B1B]"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 overflow-y-auto flex-1">
                <div className="space-y-4">
                  {selectedTask.submissions.length === 0 ? (
                    <div className="text-center py-12 text-[#C4C4C4]">
                      <Briefcase
                        size={48}
                        className="mx-auto mb-3 opacity-20"
                      />
                      <p className="text-sm font-semibold">
                        Belum ada submission untuk task ini.
                      </p>
                    </div>
                  ) : (
                    selectedTask.submissions.map((sub: any) => (
                      <div
                        key={sub.id}
                        className="border border-gray-100 rounded-2xl p-5 hover:shadow-md transition-all bg-white"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-[#FCC200]/15 text-[#B48A00] rounded-full flex items-center justify-center font-bold text-sm">
                              {sub.kolName.charAt(0)}
                            </div>
                            <div>
                              <p className="font-bold text-sm text-[#1B1B1B]">
                                {sub.kolName}
                              </p>
                              <p className="text-[11px] text-[#C4C4C4]">
                                Disubmit: {sub.submittedAt}
                              </p>
                            </div>
                          </div>
                          <SubmissionStatusBadge status={sub.status} />
                        </div>

                        <div className="bg-gray-50 rounded-xl p-4 mb-4">
                          <p className="text-xs font-bold text-[#C4C4C4] uppercase tracking-wide mb-2">
                            Link Bukti Pengerjaan
                          </p>
                          <a
                            href={sub.proofLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-sm font-semibold text-[#233982] hover:underline"
                          >
                            {sub.proofLink} <ExternalLink size={14} />
                          </a>
                        </div>

                        {sub.status === "REJECTED" && sub.feedback && (
                          <div className="bg-red-50 border border-red-100 rounded-xl p-4 mb-4">
                            <p className="text-xs font-bold text-red-600 uppercase tracking-wide mb-1 flex items-center gap-1">
                              <AlertCircle size={12} /> Alasan Penolakan
                            </p>
                            <p className="text-sm text-red-700">
                              {sub.feedback}
                            </p>
                          </div>
                        )}

                        {sub.status === "PENDING" && (
                          <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
                            {reviewingSubmissionId === sub.id ? (
                              <div className="w-full space-y-3">
                                <textarea
                                  value={reviewFeedback}
                                  onChange={(e) =>
                                    setReviewFeedback(e.target.value)
                                  }
                                  placeholder="Berikan alasan penolakan agar KOL bisa memperbaiki..."
                                  rows={2}
                                  className="w-full bg-red-50 border border-red-200 rounded-xl py-2 px-3 text-sm text-[#1B1B1B] focus:ring-2 focus:ring-red-200 focus:border-red-400 outline-none resize-none"
                                />
                                <div className="flex justify-end gap-2">
                                  <button
                                    onClick={() => {
                                      setReviewingSubmissionId(null);
                                      setReviewFeedback("");
                                    }}
                                    className="px-4 py-2 text-xs font-bold text-[#C4C4C4] hover:text-[#1B1B1B]"
                                  >
                                    Batal
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleReviewSubmission(sub.id, "REJECTED")
                                    }
                                    disabled={isSaving}
                                    className="px-4 py-2 text-xs font-bold text-white bg-red-600 rounded-lg hover:bg-red-700 flex items-center gap-1.5 disabled:opacity-50"
                                  >
                                    {isSaving ? (
                                      <Loader2
                                        className="animate-spin"
                                        size={14}
                                      />
                                    ) : (
                                      <XCircle size={14} />
                                    )}{" "}
                                    Tolak
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <>
                                <button
                                  onClick={() =>
                                    handleReviewSubmission(sub.id, "APPROVED")
                                  }
                                  disabled={isSaving}
                                  className="flex-1 px-4 py-2.5 text-xs font-bold text-white bg-green-600 rounded-xl hover:bg-green-700 transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
                                >
                                  {isSaving ? (
                                    <Loader2
                                      className="animate-spin"
                                      size={14}
                                    />
                                  ) : (
                                    <CheckCircle2 size={14} />
                                  )}{" "}
                                  Setujui & Cairkan
                                </button>
                                <button
                                  onClick={() =>
                                    setReviewingSubmissionId(sub.id)
                                  }
                                  className="flex-1 px-4 py-2.5 text-xs font-bold text-red-600 bg-red-50 border border-red-100 rounded-xl hover:bg-red-100 transition-all flex items-center justify-center gap-1.5"
                                >
                                  <XCircle size={14} /> Tolak
                                </button>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
