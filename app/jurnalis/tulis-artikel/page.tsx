/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Save,
  Eye,
  Send,
  Image as ImageIcon,
  X,
  Bold,
  Italic,
  List,
  Link,
  Type,
  Tag,
  Folder,
  Upload,
  FileText,
  Calendar,
  Clock,
} from "lucide-react";
import SidebarJurnalis from "@/components/jurnalis/Sidebar"; // Sesuaikan path
import toast from "react-hot-toast";

export default function TulisArtikelPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // State Form
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [coverImage, setCoverImage] = useState<string | null>(null);

  // Hitung Kata
  const wordCount =
    content.trim() === "" ? 0 : content.trim().split(/\s+/).length;

  // Handler Tambah Tag
  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim() !== "") {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  // Handler Simpan/Kirim
  const handleSubmit = (status: "Draft" | "Review") => {
    if (!title || !content) {
      toast.error("Judul dan isi artikel wajib diisi!");
      return;
    }

    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success(
        status === "Draft"
          ? "Artikel berhasil disimpan sebagai Draft!"
          : "Artikel berhasil dikirim untuk review Admin!",
      );
      if (status === "Review") {
        // Reset form atau redirect
      }
    }, 1000);
  };

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
            <h2 className="text-xl font-bold text-[#1B1B1B]">Tulis Artikel</h2>
            <p className="text-[11px] text-[#C4C4C4] font-semibold uppercase tracking-wider">
              Buat karya jurnalistik berkualitas untuk pelajar Indonesia
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsPreviewOpen(true)}
              className="px-4 py-2 bg-white border border-gray-200 text-[#1B1B1B] text-xs font-bold rounded-xl flex items-center gap-2 hover:bg-gray-50 transition-all"
            >
              <Eye size={16} /> Preview
            </button>
            <button
              onClick={() => handleSubmit("Draft")}
              disabled={isSaving}
              className="px-4 py-2 bg-white border border-gray-200 text-[#4F619B] text-xs font-bold rounded-xl flex items-center gap-2 hover:bg-gray-50 transition-all"
            >
              <Save size={16} /> Simpan Draft
            </button>
            <button
              onClick={() => handleSubmit("Review")}
              disabled={isSaving}
              className="px-5 py-2 bg-[#233982] text-white text-xs font-bold rounded-xl flex items-center gap-2 hover:bg-[#4F619B] transition-all shadow-md shadow-[#233982]/20 disabled:opacity-70"
            >
              {isSaving ? "Mengirim..." : "Kirim untuk Review"}
              {!isSaving && <Send size={16} />}
            </button>
          </div>
        </header>

        <div className="p-8 max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* --- KOLOM KIRI: AREA MENULIS (2/3) --- */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-2 space-y-6"
            >
              {/* Judul Artikel */}
              <div className="bg-[#FFFFFF] rounded-2xl border border-gray-100 shadow-sm p-6">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Tulis judul artikel yang menarik di sini..."
                  className="w-full text-3xl font-black text-[#1B1B1B] placeholder-[#C4C4C4] border-none outline-none bg-transparent"
                />
                <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-100 text-xs text-[#C4C4C4] font-medium">
                  <span className="flex items-center gap-1.5">
                    <Calendar size={14} />{" "}
                    {new Date().toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock size={14} /> {Math.ceil(wordCount / 200)} menit baca
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Type size={14} /> {wordCount} kata
                  </span>
                </div>
              </div>

              {/* Editor Konten */}
              <div className="bg-[#FFFFFF] rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col min-h-[500px]">
                {/* Toolbar Editor (Visual) */}
                <div className="flex items-center gap-1 p-3 border-b border-gray-100 bg-gray-50/50">
                  {[Bold, Italic, List, Link, ImageIcon].map((Icon, i) => (
                    <button
                      key={i}
                      className="p-2 text-[#C4C4C4] hover:text-[#233982] hover:bg-[#233982]/10 rounded-lg transition-all"
                    >
                      <Icon size={16} />
                    </button>
                  ))}
                  <div className="w-px h-5 bg-gray-200 mx-2" />
                  <select className="text-xs font-semibold text-[#1B1B1B] bg-white border border-gray-200 rounded-lg px-3 py-1.5  outline-none focus:ring-2 focus:ring-[#233982]/20">
                    <option>Paragraf</option>
                    <option>Heading 2</option>
                    <option>Heading 3</option>
                    <option>Quote</option>
                  </select>
                </div>

                {/* Text Area */}
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Mulai tulis cerita, fakta, atau opini Anda di sini. Biarkan kata-kata mengalir..."
                  className="flex-1 w-full p-8 text-base text-[#1B1B1B]/90 leading-relaxed placeholder-[#C4C4C4] border-none outline-none resize-none bg-transparent font-serif"
                  style={{ minHeight: "400px" }}
                />
              </div>
            </motion.div>

            {/* --- KOLOM KANAN: PENGATURAN PUBLIKASI (1/3) --- */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-6"
            >
              {/* Upload Cover Image */}
              <div className="bg-[#FFFFFF] rounded-2xl border border-gray-100 shadow-sm p-6">
                <h3 className="font-bold text-sm text-[#1B1B1B] mb-4 flex items-center gap-2">
                  <ImageIcon size={16} className="text-[#4F619B]" /> Gambar
                  Cover
                </h3>
                {coverImage ? (
                  <div className="relative group rounded-xl overflow-hidden border border-gray-200">
                    <img
                      src={coverImage}
                      alt="Cover"
                      className="w-full h-48 object-cover"
                    />
                    <button
                      onClick={() => setCoverImage(null)}
                      className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-[#233982]/30 hover:bg-[#233982]/[0.02] transition-all group">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload
                        size={24}
                        className="text-[#C4C4C4] group-hover:text-[#233982] mb-2 transition-colors"
                      />
                      <p className="text-xs text-[#C4C4C4] group-hover:text-[#1B1B1B] transition-colors">
                        <span className="font-bold">Klik untuk unggah</span>{" "}
                        atau drag & drop
                      </p>
                      <p className="text-[10px] text-[#C4C4C4] mt-1">
                        PNG, JPG (Maks. 2MB)
                      </p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) setCoverImage(URL.createObjectURL(file));
                      }}
                    />
                  </label>
                )}
              </div>

              {/* Kategori & Tag */}
              <div className="bg-[#FFFFFF] rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
                <div>
                  <h3 className="font-bold text-sm text-[#1B1B1B] mb-3 flex items-center gap-2">
                    <Folder size={16} className="text-[#4F619B]" /> Kategori
                  </h3>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 text-sm font-medium text-[#1B1B1B] focus:ring-2 focus:ring-[#233982]/20 focus:border-[#233982] outline-none transition-all appearance-none cursor-pointer"
                  >
                    <option value="">Pilih Kategori...</option>
                    <option value="Pendidikan">Pendidikan</option>
                    <option value="Teknologi">Teknologi</option>
                    <option value="Budaya">Budaya & Seni</option>
                    <option value="Sains">Sains & Lingkungan</option>
                    <option value="Prestasi">Prestasi & Lomba</option>
                  </select>
                </div>

                <div>
                  <h3 className="font-bold text-sm text-[#1B1B1B] mb-3 flex items-center gap-2">
                    <Tag size={16} className="text-[#4F619B]" /> Tag
                  </h3>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#FCC200]/15 text-[#B48A00] rounded-lg text-xs font-bold border border-[#FCC200]/30"
                      >
                        #{tag}
                        <button
                          onClick={() => removeTag(tag)}
                          className="hover:text-red-600 transition-colors"
                        >
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleAddTag}
                    placeholder="Ketik tag dan tekan Enter..."
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 text-sm font-medium text-[#1B1B1B] focus:ring-2 focus:ring-[#233982]/20 focus:border-[#233982] outline-none transition-all"
                  />
                  <p className="text-[10px] text-[#C4C4C4] mt-1.5">
                    Tekan Enter untuk menambahkan tag baru.
                  </p>
                </div>
              </div>

              {/* Info Box */}
              <div className="bg-[#233982]/5 border border-[#233982]/10 rounded-2xl p-5">
                <div className="flex items-start gap-3">
                  <FileText
                    size={20}
                    className="text-[#233982] flex-shrink-0 mt-0.5"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-[#233982] mb-1">
                      Tips Artikel Diterima
                    </h4>
                    <p className="text-[11px] text-[#4F619B] leading-relaxed">
                      Pastikan artikel memiliki minimal 300 kata, menggunakan
                      bahasa yang baik dan benar, serta menyertakan sumber
                      referensi yang jelas.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      {/* --- MODAL PREVIEW ARTIKEL --- */}
      <AnimatePresence>
        {isPreviewOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 md:p-8"
            onClick={() => setIsPreviewOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col"
            >
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-[#233982]/10 text-[#233982] rounded-lg flex items-center justify-center">
                    <Eye size={16} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#1B1B1B]">
                      Preview Pembaca
                    </h3>
                    <p className="text-[10px] text-[#C4C4C4]">
                      Tampilan artikel sebelum dipublikasikan
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsPreviewOpen(false)}
                  className="p-2 hover:bg-gray-200 rounded-full transition-colors text-[#C4C4C4] hover:text-[#1B1B1B]"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Modal Body (Simulasi Tampilan Artikel) */}
              <div className="p-8 md:p-12 overflow-y-auto flex-1 bg-white">
                <div className="max-w-3xl mx-auto">
                  {/* Cover Image */}
                  {coverImage && (
                    <div className="w-full h-64 md:h-80 rounded-2xl overflow-hidden mb-8 shadow-lg">
                      <img
                        src={coverImage}
                        alt="Cover Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {/* Meta Info */}
                  <div className="flex items-center gap-3 mb-4">
                    {category && (
                      <span className="px-3 py-1 bg-[#233982]/10 text-[#233982] text-xs font-bold rounded-full">
                        {category}
                      </span>
                    )}
                    {tags.length > 0 && (
                      <div className="flex gap-2">
                        {tags.slice(0, 3).map((tag) => (
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

                  {/* Title */}
                  <h1 className="text-3xl md:text-4xl font-black text-[#1B1B1B] leading-tight mb-6">
                    {title || "Judul Artikel Anda..."}
                  </h1>

                  {/* Author Info */}
                  <div className="flex items-center gap-3 pb-8 mb-8 border-b border-gray-100">
                    <div className="w-10 h-10 bg-[#233982] text-white rounded-full flex items-center justify-center font-bold text-sm">
                      J
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#1B1B1B]">
                        Jurnalis Media Pelajar
                      </p>
                      <p className="text-xs text-[#C4C4C4]">
                        {new Date().toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}{" "}
                        • {Math.ceil(wordCount / 200)} menit baca
                      </p>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="prose prose-lg max-w-none text-[#1B1B1B]/80 leading-relaxed font-serif whitespace-pre-wrap">
                    {content ||
                      "Isi artikel Anda akan muncul di sini. Mulai menulis di editor untuk melihat preview secara real-time..."}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
