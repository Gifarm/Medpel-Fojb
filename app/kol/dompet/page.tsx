/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Wallet,
  TrendingUp,
  Smartphone,
  User,
  Edit3,
  Save,
  X,
  CheckCircle2,
  ArrowDownLeft,
  Loader2,
  Copy,
} from "lucide-react";
import SidebarKOL from "@/components/kol/SidebarKOL";
import toast from "react-hot-toast";

export default function DompetKOLPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [walletData, setWalletData] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // State Modal Edit DANA
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({ danaName: "", danaPhone: "" });
  const [isSaving, setIsSaving] = useState(false);

  // Fetch Data Dompet dari API
  const fetchWalletData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/kol/wallet");
      const result = await res.json();
      if (result.success) {
        setWalletData(result.data.wallet);
        setTransactions(result.data.transactions);
      } else {
        toast.error(result.error || "Gagal memuat data dompet");
      }
    } catch (error) {
      console.error("Gagal memuat data dompet", error);
      toast.error("Gagal memuat data dompet");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWalletData();
  }, []);

  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const openEditModal = () => {
    if (walletData) {
      setEditForm({
        danaName: walletData.danaName || "",
        danaPhone: walletData.danaPhone || "",
      });
    }
    setIsEditModalOpen(true);
  };

  const handleSaveDana = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editForm.danaName.trim() || !editForm.danaPhone.trim()) {
      toast.error("Nama dan Nomor DANA wajib diisi!");
      return;
    }
    if (!/^\d{10,13}$/.test(editForm.danaPhone.replace(/\D/g, ""))) {
      toast.error("Nomor HP tidak valid (harus 10-13 digit angka)!");
      return;
    }

    setIsSaving(true);
    try {
      const res = await fetch("/api/kol/wallet", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          danaName: editForm.danaName,
          danaPhone: editForm.danaPhone,
        }),
      });

      const result = await res.json();
      if (result.success) {
        toast.success("Akun DANA berhasil diperbarui!");
        setIsEditModalOpen(false);
        fetchWalletData(); // Refresh data agar UI terupdate
      } else {
        toast.error(result.error || "Gagal memperbarui akun DANA");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan pada server");
    } finally {
      setIsSaving(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Nomor DANA berhasil disalin!");
  };

  if (isLoading || !walletData) {
    return (
      <div className="min-h-screen bg-[#f8faf9] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#233982]"></div>
      </div>
    );
  }

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
            <h2 className="text-xl font-bold text-[#1B1B1B]">Dompet Digital</h2>
            <p className="text-[11px] text-[#C4C4C4] font-semibold uppercase tracking-wider">
              Kelola saldo dan akun DANA untuk pencairan reward
            </p>
          </div>
        </header>

        <div className="p-8 max-w-[1200px] mx-auto space-y-8">
          {/* 1. Wallet Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Saldo Card */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-[#233982] to-[#4F619B] rounded-2xl p-6 text-white shadow-xl shadow-[#233982]/20 relative overflow-hidden"
            >
              <div className="absolute top-[-20%] right-[-10%] w-32 h-32 bg-[#FCC200]/20 rounded-full blur-2xl" />
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                  <Wallet size={18} className="text-[#FCC200]" />
                  <p className="text-xs font-bold uppercase tracking-wider text-white/80">
                    Saldo Saat Ini
                  </p>
                </div>
                <h3 className="text-4xl font-black mb-4">
                  {formatRupiah(walletData.balance)}
                </h3>
                <p className="text-[11px] text-white/60">
                  Saldo akan otomatis bertambah saat Admin menyetujui task kamu.
                </p>
              </div>
            </motion.div>

            {/* Total Pendapatan Card */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-[#FFFFFF] rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col justify-center"
            >
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp size={18} className="text-[#B48A00]" />
                <p className="text-xs font-bold uppercase tracking-wider text-[#C4C4C4]">
                  Total Pendapatan
                </p>
              </div>
              <h3 className="text-3xl font-black text-[#1B1B1B] mb-2">
                {formatRupiah(walletData.totalEarned)}
              </h3>
              <p className="text-[11px] text-[#C4C4C4]">
                Akumulasi reward dari semua task yang disetujui.
              </p>
            </motion.div>
          </div>

          {/* 2. Akun DANA Section */}
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-[#FFFFFF] rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
          >
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-[#FCC200]/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#FCC200] text-[#1B1B1B] flex items-center justify-center">
                  <Smartphone size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-[#1B1B1B]">
                    Akun DANA
                  </h3>
                  <p className="text-xs text-[#C4C4C4]">
                    Pastikan data ini benar agar pencairan berhasil
                  </p>
                </div>
              </div>
              <button
                onClick={openEditModal}
                className="px-4 py-2 bg-white border border-gray-200 text-[#1B1B1B] text-xs font-bold rounded-xl flex items-center gap-2 hover:bg-gray-50 transition-all"
              >
                <Edit3 size={14} /> Ubah Data
              </button>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <div className="flex items-center gap-2 mb-2">
                  <User size={14} className="text-[#C4C4C4]" />
                  <p className="text-[10px] font-bold text-[#C4C4C4] uppercase tracking-wide">
                    Nama Akun DANA
                  </p>
                </div>
                <p className="text-base font-bold text-[#1B1B1B]">
                  {walletData.danaName || "Belum diisi"}
                </p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Smartphone size={14} className="text-[#C4C4C4]" />
                    <p className="text-[10px] font-bold text-[#C4C4C4] uppercase tracking-wide">
                      Nomor HP DANA
                    </p>
                  </div>
                  {walletData.danaPhone && (
                    <button
                      onClick={() => copyToClipboard(walletData.danaPhone)}
                      className="p-1 text-[#4F619B] hover:bg-[#4F619B]/10 rounded transition-colors"
                      title="Salin Nomor"
                    >
                      <Copy size={14} />
                    </button>
                  )}
                </div>
                <p className="text-base font-bold text-[#233982] font-mono">
                  {walletData.danaPhone || "-"}
                </p>
              </div>
            </div>
          </motion.section>

          {/* 3. Riwayat Transaksi */}
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-[#FFFFFF] rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
          >
            <div className="p-6 border-b border-gray-100">
              <h3 className="font-bold text-lg text-[#1B1B1B]">
                Riwayat Pendapatan
              </h3>
              <p className="text-xs text-[#C4C4C4]">
                Daftar reward task yang telah disetujui Admin
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50/80 text-[11px] uppercase font-bold text-[#C4C4C4] tracking-wider border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4">Tanggal</th>
                    <th className="px-6 py-4">Nama Task</th>
                    <th className="px-6 py-4">Jenis</th>
                    <th className="px-6 py-4 text-right">Jumlah</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {transactions.length > 0 ? (
                    transactions.map((trx) => (
                      <tr
                        key={trx.id}
                        className="hover:bg-gray-50/50 transition-colors"
                      >
                        <td className="px-6 py-4 text-sm text-[#1B1B1B]">
                          {trx.date}
                        </td>
                        <td className="px-6 py-4 text-sm font-bold text-[#1B1B1B]">
                          {trx.taskTitle}
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-50 text-green-700 rounded-full text-[11px] font-bold uppercase tracking-wide border border-green-100">
                            <ArrowDownLeft size={12} /> Reward
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className="text-sm font-bold text-green-600">
                            + {formatRupiah(trx.amount)}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-6 py-8 text-center text-sm text-[#C4C4C4]"
                      >
                        Belum ada riwayat pendapatan. Selesaikan task untuk
                        mulai menghasilkan!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.section>
        </div>
      </main>

      {/* --- MODAL EDIT AKUN DANA --- */}
      <AnimatePresence>
        {isEditModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setIsEditModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-[#FCC200]/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#FCC200] text-[#1B1B1B] flex items-center justify-center">
                    <Smartphone size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#1B1B1B]">
                      Ubah Akun DANA
                    </h3>
                    <p className="text-xs text-[#C4C4C4]">
                      Sesuaikan dengan akun DANA kamu
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="p-2 hover:bg-gray-200 rounded-full transition-colors text-[#C4C4C4] hover:text-[#1B1B1B]"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSaveDana} className="p-6 space-y-5">
                <div>
                  <label className="block text-xs font-bold text-[#C4C4C4] uppercase tracking-wide mb-1.5">
                    Nama Sesuai DANA *
                  </label>
                  <input
                    type="text"
                    required
                    value={editForm.danaName}
                    onChange={(e) =>
                      setEditForm({ ...editForm, danaName: e.target.value })
                    }
                    placeholder="Contoh: Rina Kartika Sari"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 text-sm font-medium text-[#1B1B1B] focus:ring-2 focus:ring-[#233982]/20 focus:border-[#233982] outline-none transition-all"
                  />
                  <p className="text-[10px] text-[#C4C4C4] mt-1.5">
                    Pastikan nama sama persis dengan yang terdaftar di aplikasi
                    DANA.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#C4C4C4] uppercase tracking-wide mb-1.5">
                    Nomor HP DANA *
                  </label>
                  <input
                    type="tel"
                    required
                    value={editForm.danaPhone}
                    onChange={(e) =>
                      setEditForm({ ...editForm, danaPhone: e.target.value })
                    }
                    placeholder="Contoh: 081234567890"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 text-sm font-medium text-[#1B1B1B] focus:ring-2 focus:ring-[#233982]/20 focus:border-[#233982] outline-none transition-all font-mono"
                  />
                  <p className="text-[10px] text-[#C4C4C4] mt-1.5">
                    Nomor aktif yang terhubung dengan akun DANA.
                  </p>
                </div>

                <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 flex items-start gap-2">
                  <CheckCircle2
                    size={16}
                    className="text-blue-600 flex-shrink-0 mt-0.5"
                  />
                  <p className="text-[11px] text-blue-700 leading-relaxed">
                    Data ini akan digunakan oleh Admin untuk mentransfer reward
                    task kamu secara manual.
                  </p>
                </div>

                <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="px-5 py-2.5 text-sm font-bold text-[#C4C4C4] hover:text-[#1B1B1B] transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-5 py-2.5 text-sm font-bold text-white bg-[#233982] rounded-xl hover:bg-[#4F619B] transition-all shadow-md shadow-[#233982]/20 flex items-center gap-2 disabled:opacity-50"
                  >
                    {isSaving ? (
                      <Loader2 className="animate-spin" size={16} />
                    ) : (
                      <Save size={16} />
                    )}
                    {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
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
