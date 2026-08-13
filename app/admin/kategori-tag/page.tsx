/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Plus,
  Edit3,
  Trash2,
  X,
  Save,
  Folder,
  Hash,
  Layers,
  TrendingUp,
  Loader2,
} from "lucide-react";
import Sidebar from "@/components/admin/Sidebar";
import toast from "react-hot-toast";

export default function KategoriTagPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // State Data
  const [categories, setCategories] = useState<any[]>([]);
  const [tags, setTags] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // State Search
  const [searchCat, setSearchCat] = useState("");
  const [searchTag, setSearchTag] = useState("");

  // State Modal
  const [modalType, setModalType] = useState<"category" | "tag" | null>(null);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [formData, setFormData] = useState({ name: "", slug: "" });

  // Fungsi Fetch Data
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [catRes, tagRes] = await Promise.all([
        fetch("/api/admin/categories"),
        fetch("/api/admin/tags"),
      ]);

      const catData = await catRes.json();
      const tagData = await tagRes.json();

      if (catData.success) setCategories(catData.data);
      if (tagData.success) setTags(tagData.data);
    } catch (error) {
      console.error("Gagal memuat data", error);
      toast.error("Gagal memuat data kategori & tag");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter Data
  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(searchCat.toLowerCase()),
  );

  const filteredTags = tags.filter((t) =>
    t.name.toLowerCase().includes(searchTag.toLowerCase()),
  );

  // Stats Data (Dinamis)
  const sortedCategories = [...categories].sort((a, b) => b.count - a.count);
  const sortedTags = [...tags].sort((a, b) => b.count - a.count);

  const stats = [
    {
      label: "Total Kategori",
      val: categories.length,
      icon: Folder,
      color: "text-[#233982]",
      bg: "bg-[#233982]/10",
    },
    {
      label: "Total Tag",
      val: tags.length,
      icon: Hash,
      color: "text-[#FCC200]",
      bg: "bg-[#FCC200]/15",
    },
    {
      label: "Kategori Terpopuler",
      val: sortedCategories[0]?.name || "-",
      icon: TrendingUp,
      color: "text-green-600",
      bg: "bg-green-50",
      isText: true,
    },
    {
      label: "Tag Terpopuler",
      val: sortedTags[0]?.name || "-",
      icon: Layers,
      color: "text-blue-600",
      bg: "bg-blue-50",
      isText: true,
    },
  ];

  // Handlers
  const openModal = (
    type: "category" | "tag",
    mode: "add" | "edit",
    item?: any,
  ) => {
    setModalType(type);
    setModalMode(mode);
    setSelectedItem(item || null);
    setFormData({ name: item?.name || "", slug: item?.slug || "" });
  };

  const closeModal = () => {
    setModalType(null);
    setModalMode("add");
    setSelectedItem(null);
    setFormData({ name: "", slug: "" });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setFormData({
      name: val,
      slug: val
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, ""),
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const method = modalMode === "add" ? "POST" : "PATCH";
      const url =
        modalType === "category" ? "/api/admin/categories" : "/api/admin/tags";
      const body =
        modalMode === "add" ? formData : { id: selectedItem.id, ...formData };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const result = await res.json();

      if (result.success) {
        toast.success(
          modalMode === "add"
            ? "Berhasil ditambahkan!"
            : "Berhasil diperbarui!",
        );
        closeModal();
        await fetchData(); // Refresh data agar count dan list terbaru muncul
      } else {
        toast.error(result.error || "Gagal menyimpan data");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan pada server");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (type: "category" | "tag", id: string) => {
    if (
      !confirm(
        `Yakin ingin menghapus ${type === "category" ? "kategori" : "tag"} ini?`,
      )
    )
      return;

    try {
      const url =
        type === "category"
          ? `/api/admin/categories?id=${id}`
          : `/api/admin/tags?id=${id}`;
      const res = await fetch(url, { method: "DELETE" });
      const result = await res.json();

      if (result.success) {
        toast.success("Berhasil dihapus!");
        await fetchData(); // Refresh data
      } else {
        toast.error(result.error || "Gagal menghapus data");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan pada server");
    }
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
        <header className="h-20 bg-[#FFFFFF]/80 backdrop-blur-md border-b border-gray-200/60 sticky top-0 z-30 px-8 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-[#1B1B1B]">Kategori & Tag</h2>
            <p className="text-[11px] text-[#C4C4C4] font-semibold uppercase tracking-wider">
              Kelola pengelompokan dan label artikel
            </p>
          </div>
        </header>

        <div className="p-8 max-w-[1600px] mx-auto space-y-8">
          {/* 1. Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
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
                  <h3
                    className={`text-xl font-bold text-[#1B1B1B] ${stat.isText ? "text-base" : ""}`}
                  >
                    {stat.val}
                  </h3>
                </div>
              </motion.div>
            ))}
          </div>

          {/* 2. Split View: Kategori & Tag */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* --- MANAJEMEN KATEGORI --- */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-[#FFFFFF] rounded-2xl border border-gray-100 shadow-sm flex flex-col h-[600px]"
            >
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#233982]/10 text-[#233982] flex items-center justify-center">
                      <Folder size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-[#1B1B1B]">
                        Kategori
                      </h3>
                      <p className="text-[11px] text-[#C4C4C4]">
                        Pengelompokan utama artikel
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => openModal("category", "add")}
                    className="px-4 py-2 bg-[#233982] text-white text-xs font-bold rounded-xl flex items-center gap-2 hover:bg-[#4F619B] transition-all shadow-md shadow-[#233982]/20"
                  >
                    <Plus size={16} /> Tambah
                  </button>
                </div>
                <div className="relative">
                  <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#C4C4C4]"
                    size={16}
                  />
                  <input
                    type="text"
                    placeholder="Cari kategori..."
                    value={searchCat}
                    onChange={(e) => setSearchCat(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-[#233982]/20 focus:border-[#233982] transition-all outline-none"
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {isLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <Loader2
                      className="animate-spin text-[#233982]"
                      size={32}
                    />
                  </div>
                ) : filteredCategories.length > 0 ? (
                  filteredCategories.map((cat) => (
                    <div
                      key={cat.id}
                      className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors group border border-transparent hover:border-gray-100"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-[#233982]/5 text-[#233982] rounded-lg flex items-center justify-center">
                          <Folder size={18} />
                        </div>
                        <div>
                          <p className="font-bold text-sm text-[#1B1B1B]">
                            {cat.name}
                          </p>
                          <p className="text-[10px] text-[#C4C4C4] font-mono">
                            /{cat.slug}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[11px] font-bold text-[#4F619B] bg-[#4F619B]/10 px-2.5 py-1 rounded-md">
                          {cat.count} Artikel
                        </span>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => openModal("category", "edit", cat)}
                            className="p-1.5 text-[#4F619B] hover:bg-[#4F619B]/10 rounded-lg transition-all"
                          >
                            <Edit3 size={14} />
                          </button>
                          <button
                            onClick={() => handleDelete("category", cat.id)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-[#C4C4C4]">
                    <Folder size={40} className="mb-2 opacity-20" />
                    <p className="text-sm font-semibold">
                      Kategori tidak ditemukan
                    </p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* --- MANAJEMEN TAG --- */}
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-[#FFFFFF] rounded-2xl border border-gray-100 shadow-sm flex flex-col h-[600px]"
            >
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#FCC200]/15 text-[#B48A00] flex items-center justify-center">
                      <Hash size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-[#1B1B1B]">Tag</h3>
                      <p className="text-[11px] text-[#C4C4C4]">
                        Label spesifik untuk artikel
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => openModal("tag", "add")}
                    className="px-4 py-2 bg-[#FCC200] text-[#1B1B1B] text-xs font-bold rounded-xl flex items-center gap-2 hover:bg-[#FDCE33] transition-all shadow-md shadow-[#FCC200]/20"
                  >
                    <Plus size={16} /> Tambah
                  </button>
                </div>
                <div className="relative">
                  <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#C4C4C4]"
                    size={16}
                  />
                  <input
                    type="text"
                    placeholder="Cari tag..."
                    value={searchTag}
                    onChange={(e) => setSearchTag(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-[#FCC200]/20 focus:border-[#FCC200] transition-all outline-none"
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {isLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <Loader2
                      className="animate-spin text-[#FCC200]"
                      size={32}
                    />
                  </div>
                ) : filteredTags.length > 0 ? (
                  filteredTags.map((tag) => (
                    <div
                      key={tag.id}
                      className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors group border border-transparent hover:border-gray-100"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-[#FCC200]/10 text-[#B48A00] rounded-lg flex items-center justify-center">
                          <Hash size={18} />
                        </div>
                        <div>
                          <p className="font-bold text-sm text-[#1B1B1B]">
                            #{tag.name}
                          </p>
                          <p className="text-[10px] text-[#C4C4C4] font-mono">
                            /{tag.slug}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[11px] font-bold text-[#B48A00] bg-[#FCC200]/15 px-2.5 py-1 rounded-md">
                          {tag.count} Artikel
                        </span>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => openModal("tag", "edit", tag)}
                            className="p-1.5 text-[#4F619B] hover:bg-[#4F619B]/10 rounded-lg transition-all"
                          >
                            <Edit3 size={14} />
                          </button>
                          <button
                            onClick={() => handleDelete("tag", tag.id)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-[#C4C4C4]">
                    <Hash size={40} className="mb-2 opacity-20" />
                    <p className="text-sm font-semibold">Tag tidak ditemukan</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      {/* --- MODAL TAMBAH/EDIT --- */}
      <AnimatePresence>
        {modalType && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${modalType === "category" ? "bg-[#233982]/10 text-[#233982]" : "bg-[#FCC200]/15 text-[#B48A00]"}`}
                  >
                    {modalType === "category" ? (
                      <Folder size={20} />
                    ) : (
                      <Hash size={20} />
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#1B1B1B]">
                      {modalMode === "add" ? "Tambah" : "Edit"}{" "}
                      {modalType === "category" ? "Kategori" : "Tag"}
                    </h3>
                    <p className="text-xs text-[#C4C4C4] mt-0.5">
                      Isi detail di bawah ini
                    </p>
                  </div>
                </div>
                <button
                  onClick={closeModal}
                  className="p-2 hover:bg-gray-200 rounded-full transition-colors text-[#C4C4C4] hover:text-[#1B1B1B]"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSave} className="p-6 space-y-5">
                <div>
                  <label className="block text-xs font-bold text-[#C4C4C4] uppercase tracking-wide mb-1.5">
                    Nama
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder={
                      modalType === "category"
                        ? "Contoh: Teknologi"
                        : "Contoh: AI"
                    }
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 text-sm font-medium text-[#1B1B1B] focus:ring-2 focus:ring-[#233982]/20 focus:border-[#233982] outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#C4C4C4] uppercase tracking-wide mb-1.5">
                    Slug (URL)
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#C4C4C4] text-sm">
                      /
                    </span>
                    <input
                      type="text"
                      value={formData.slug}
                      onChange={handleInputChange}
                      required
                      placeholder="auto-generated"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 pl-8 pr-4 text-sm font-mono font-medium text-[#4F619B] focus:ring-2 focus:ring-[#233982]/20 focus:border-[#233982] outline-none transition-all"
                    />
                  </div>
                  <p className="text-[10px] text-[#C4C4C4] mt-1.5">
                    Slug akan otomatis terbuat dari nama yang Anda input.
                  </p>
                </div>

                <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-100 mt-6">
                  <button
                    type="button"
                    onClick={closeModal}
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
                      <Save size={16} />
                    )}
                    Simpan
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
