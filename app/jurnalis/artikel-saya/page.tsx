/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  FileText,
  Edit3,
  Trash2,
  Eye,
  Plus,
  Filter,
  ChevronLeft,
  ChevronRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Loader2,
  AlertTriangle,
  X,
} from "lucide-react";
import SidebarJurnalis from "@/components/jurnalis/Sidebar";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const StatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    Published: "bg-green-50 text-green-700 border-green-100",
    Review: "bg-yellow-50 text-yellow-700 border-yellow-100",
    Revision: "bg-red-50 text-red-700 border-red-100",
    Draft: "bg-gray-100 text-gray-600 border-gray-200",
    Rejected: "bg-gray-100 text-gray-500 border-gray-200",
  };
  const icons: Record<string, any> = {
    Published: CheckCircle2,
    Review: Clock,
    Revision: AlertCircle,
    Draft: FileText,
    Rejected: XCircle,
  };
  const labels: Record<string, string> = {
    Published: "Diterbitkan",
    Review: "Menunggu Review",
    Revision: "Perlu Revisi",
    Draft: "Draft",
    Rejected: "Ditolak",
  };
  const Icon = icons[status] || FileText;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide border ${styles[status]}`}
    >
      <Icon size={12} />
      {labels[status]}
    </span>
  );
};

export default function ArtikelSayaPage() {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // State Filter & Pagination
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // State Data
  const [articles, setArticles] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  // State Modals
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [articleToDelete, setArticleToDelete] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [previewArticle, setPreviewArticle] = useState<any>(null);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);

  // Fetch Data
  // Fetch Data dari API
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        search: searchQuery,
        status: statusFilter,
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
      });

      // Tambahkan console.log ini sementara untuk debugging jika masih error
      console.log(
        "Fetching URL:",
        `/api/jurnalis/articles?${params.toString()}`,
      );

      const res = await fetch(`/api/jurnalis/articles?${params.toString()}`);
      const result = await res.json();

      if (result.success) {
        setArticles(result.data);
        setTotalPages(result.pagination.totalPages);
      } else {
        toast.error(result.error || "Gagal memuat data artikel");
      }
    } catch (error) {
      console.error("Gagal memuat data artikel", error);
      toast.error("Gagal memuat data artikel");
    } finally {
      setIsLoading(false);
    }
  };

  // PERBAIKAN 2: Pisahkan useEffect agar tidak infinite loop
  // 1. Reset halaman ke 1 HANYA ketika search atau filter berubah
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

  // 2. Fetch data ketika search, filter, ATAU halaman berubah
  useEffect(() => {
    const timer = setTimeout(fetchData, 200); // Debounce 200ms
    return () => clearTimeout(timer);
  }, [searchQuery, statusFilter, currentPage]);

  // Fetch detail artikel untuk Preview Modal
  const handleOpenPreview = async (id: string) => {
    setIsLoadingPreview(true);
    setPreviewArticle(null);
    try {
      const res = await fetch(`/api/jurnalis/articles?id=${id}`);
      const result = await res.json();
      if (result.success) {
        setPreviewArticle(result.data);
      } else {
        toast.error("Gagal memuat detail artikel");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan saat memuat preview");
    } finally {
      setIsLoadingPreview(false);
    }
  };

  const openDeleteModal = (article: any) => {
    setArticleToDelete(article);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setArticleToDelete(null);
  };

  const handleDelete = async () => {
    if (!articleToDelete) return;
    setIsDeleting(true);
    try {
      const res = await fetch(
        `/api/jurnalis/articles?id=${articleToDelete.id}`,
        { method: "DELETE" },
      );
      const result = await res.json();
      if (result.success) {
        toast.success("Artikel berhasil dihapus!");
        closeDeleteModal();
        fetchData();
      } else {
        toast.error(result.error || "Gagal menghapus artikel");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan pada server");
    } finally {
      setIsDeleting(false);
    }
  };

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
            <h2 className="text-xl font-bold text-[#1B1B1B]">Artikel Saya</h2>
            <p className="text-[11px] text-[#C4C4C4] font-semibold uppercase tracking-wider">
              Kelola, pantau status, dan edit semua karya Anda
            </p>
          </div>
          <button
            onClick={() => router.push("/jurnalis/tulis-artikel")}
            className="px-5 py-2.5 bg-[#233982] text-white text-xs font-bold rounded-xl flex items-center gap-2 hover:bg-[#4F619B] transition-all shadow-md shadow-[#233982]/20"
          >
            <Plus size={16} /> Tulis Artikel Baru
          </button>
        </header>

        <div className="p-8 max-w-[1600px] mx-auto space-y-8">
          {/* Filter & Search Bar */}
          <div className="bg-[#FFFFFF] p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-96">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#C4C4C4]"
                size={18}
              />
              <input
                type="text"
                placeholder="Cari judul artikel..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-[#FCC200]/20 focus:border-[#FCC200] transition-all outline-none"
              />
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:flex-none">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="appearance-none w-full md:w-48 bg-gray-50 border border-gray-200 rounded-xl py-2.5 pl-4 pr-10 text-sm font-semibold text-[#1B1B1B] focus:ring-2 focus:ring-[#FCC200]/20 outline-none cursor-pointer"
                >
                  <option value="All">Semua Status</option>
                  <option value="Published">Diterbitkan</option>
                  <option value="Review">Menunggu Review</option>
                  <option value="Revision">Perlu Revisi</option>
                  <option value="Draft">Draft</option>
                  <option value="Rejected">Ditolak</option>
                </select>
                <Filter
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#C4C4C4] pointer-events-none"
                  size={16}
                />
              </div>
            </div>
          </div>

          {/* Data Table */}
          <div className="bg-[#FFFFFF] rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50/80 text-[11px] uppercase font-bold text-[#C4C4C4] tracking-wider border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4">Judul & Kategori</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Terakhir Diupdate</th>
                    <th className="px-6 py-4">Views</th>
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
                  ) : articles.length > 0 ? (
                    articles.map((article) => (
                      <motion.tr
                        key={article.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="group hover:bg-[#FCC200]/[0.03] transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <p className="font-bold text-sm text-[#1B1B1B] line-clamp-1 group-hover:text-[#233982] transition-colors">
                              {article.title}
                            </p>
                            <span className="text-[10px] font-semibold text-[#4F619B] bg-[#4F619B]/10 px-2 py-0.5 rounded-md w-fit mt-1.5">
                              {article.category}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <StatusBadge status={article.status} />
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-xs font-medium text-[#1B1B1B]">
                            {article.date}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#1B1B1B]">
                            <Eye size={14} className="text-[#4F619B]" />
                            {article.views > 0
                              ? article.views.toLocaleString()
                              : "-"}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleOpenPreview(article.id)}
                              className="p-2 text-[#4F619B] hover:bg-[#4F619B]/10 rounded-lg transition-all"
                              title="Preview"
                            >
                              <Eye size={18} />
                            </button>
                            <button
                              onClick={() =>
                                router.push(
                                  `/jurnalis/tulis-artikel?edit=${article.id}`,
                                )
                              }
                              className="p-2 text-[#233982] hover:bg-[#233982]/10 rounded-lg transition-all"
                              title="Edit"
                            >
                              <Edit3 size={18} />
                            </button>
                            {(article.status === "Draft" ||
                              article.status === "Rejected") && (
                              <button
                                onClick={() => openDeleteModal(article)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                title="Hapus"
                              >
                                <Trash2 size={18} />
                              </button>
                            )}
                          </div>
                        </td>
                      </motion.tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center justify-center text-[#C4C4C4]">
                          <FileText size={48} className="mb-3 opacity-20" />
                          <p className="font-semibold text-sm">
                            Tidak ada artikel yang ditemukan
                          </p>
                          <p className="text-xs mt-1">
                            Coba ubah kata kunci pencarian atau filter status.
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
              <p className="text-xs text-[#C4C4C4]">
                Menampilkan halaman {currentPage} dari {totalPages}
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1 || isLoading}
                  className="p-2 text-[#C4C4C4] hover:bg-gray-100 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={18} />
                </button>
                <span className="text-xs font-bold text-[#1B1B1B] px-2">
                  {currentPage} / {totalPages || 1}
                </span>
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={
                    currentPage === totalPages || totalPages === 0 || isLoading
                  }
                  className="p-2 text-[#C4C4C4] hover:bg-gray-100 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* --- MODAL PREVIEW ARTIKEL --- */}
      <AnimatePresence>
        {previewArticle && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 md:p-8"
            onClick={() => setPreviewArticle(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-[#233982]/10 text-[#233982] rounded-lg flex items-center justify-center">
                    <Eye size={16} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#1B1B1B]">
                      Preview Artikel
                    </h3>
                    <p className="text-[10px] text-[#C4C4C4]">
                      Status: {previewArticle.status}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setPreviewArticle(null)}
                  className="p-2 hover:bg-gray-200 rounded-full transition-colors text-[#C4C4C4] hover:text-[#1B1B1B]"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-8 md:p-12 overflow-y-auto flex-1 bg-white">
                {isLoadingPreview ? (
                  <div className="flex items-center justify-center h-64">
                    <Loader2
                      className="animate-spin text-[#233982]"
                      size={32}
                    />
                  </div>
                ) : (
                  <div className="max-w-3xl mx-auto">
                    {previewArticle.coverImage && (
                      <div className="w-full h-64 md:h-80 rounded-2xl overflow-hidden mb-8 shadow-lg">
                        <img
                          src={previewArticle.coverImage}
                          alt="Cover"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex items-center gap-3 mb-4">
                      <span className="px-3 py-1 bg-[#233982]/10 text-[#233982] text-xs font-bold rounded-full">
                        {previewArticle.categoryName || "Umum"}
                      </span>
                      {previewArticle.tags?.length > 0 && (
                        <div className="flex gap-2">
                          {previewArticle.tags
                            .slice(0, 3)
                            .map((tag: string) => (
                              <span
                                key={tag}
                                className="text-xs text-[#C4C4C4] font-medium"
                              >
                                #{tag}
                              </span>
                            ))}
                        </div>
                      )}
                    </div>
                    <h1 className="text-3xl md:text-4xl font-black text-[#1B1B1B] leading-tight mb-6">
                      {previewArticle.title}
                    </h1>
                    <div
                      className="prose prose-lg max-w-none text-[#1B1B1B]/80 leading-relaxed"
                      dangerouslySetInnerHTML={{
                        __html:
                          previewArticle.content ||
                          "<p class='text-gray-400'>Tidak ada konten.</p>",
                      }}
                    />
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- MODAL KONFIRMASI HAPUS (Tetap sama seperti sebelumnya) --- */}
      <AnimatePresence>
        {isDeleteModalOpen && articleToDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={closeDeleteModal}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="px-6 py-5 border-b border-gray-100 bg-red-50/50 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-red-100 text-red-600 flex items-center justify-center flex-shrink-0">
                  <AlertTriangle size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#1B1B1B]">
                    Hapus Artikel?
                  </h3>
                  <p className="text-xs text-[#C4C4C4] mt-1">
                    Tindakan ini tidak dapat dibatalkan
                  </p>
                </div>
              </div>
              <div className="p-6">
                <p className="text-sm text-[#1B1B1B] mb-4">
                  Anda yakin ingin menghapus artikel{" "}
                  <span className="font-bold text-[#233982]">
                    {articleToDelete.title}
                  </span>{" "}
                  secara permanen?
                </p>
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                  <p className="text-xs text-yellow-800">
                    <span className="font-bold">Perhatian:</span> Artikel yang
                    dihapus tidak dapat dikembalikan.
                  </p>
                </div>
              </div>
              <div className="px-6 py-5 border-t border-gray-100 bg-gray-50/50 flex items-center justify-end gap-3">
                <button
                  onClick={closeDeleteModal}
                  className="px-5 py-2.5 text-sm font-bold text-[#C4C4C4] hover:text-[#1B1B1B] transition-colors"
                  disabled={isDeleting}
                >
                  Batal
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="px-5 py-2.5 text-sm font-bold text-white bg-red-600 rounded-xl hover:bg-red-700 transition-all shadow-md shadow-red-600/20 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isDeleting ? (
                    <Loader2 className="animate-spin" size={16} />
                  ) : (
                    <Trash2 size={16} />
                  )}
                  Ya, Hapus Artikel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
