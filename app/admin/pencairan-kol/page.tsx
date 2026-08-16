/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Wallet,
  CheckCircle2,
  Clock,
  Banknote,
  Eye,
  X,
  Loader2,
  Copy,
  ExternalLink,
  Search,
  Filter,
} from "lucide-react";
import Sidebar from "@/components/admin/Sidebar";
import toast from "react-hot-toast";

// --- WARNA TEMA ---
const COLORS = {
  primary: "#FCC200",
  blueDark: "#233982",
  blue: "#4F619B",
  black: "#1B1B1B",
  gray: "#C4C4C4",
};

// --- DUMMY DATA ---
const initialKolWallets = [
  {
    id: "W001",
    kolName: "Rina Kartika",
    email: "rina@mediapelajar.id",
    danaPhone: "081234567890",
    danaName: "Rina Kartika Sari",
    balance: 150000,
    status: "PENDING", // Menunggu dicairkan
    lastActivity: "28 Okt 2024",
  },
  {
    id: "W002",
    kolName: "Dimas Prasetyo",
    email: "dimas@mediapelajar.id",
    danaPhone: "089876543210",
    danaName: "Dimas Prasetyo",
    balance: 75000,
    status: "PAID", // Sudah dicairkan
    lastActivity: "25 Okt 2024",
  },
  {
    id: "W003",
    kolName: "Budi Santoso",
    email: "budi@mediapelajar.id",
    danaPhone: "085678901234",
    danaName: "Budi Santoso",
    balance: 200000,
    status: "PENDING",
    lastActivity: "29 Okt 2024",
  },
  {
    id: "W004",
    kolName: "Siska Putri",
    email: "siska@mediapelajar.id",
    danaPhone: "081122334455",
    danaName: "Siska Putri Anggraini",
    balance: 50000,
    status: "PENDING",
    lastActivity: "30 Okt 2024",
  },
];

const initialPayoutHistory = [
  {
    id: "P001",
    kolName: "Dimas Prasetyo",
    danaPhone: "089876543210",
    amount: 75000,
    date: "26 Okt 2024",
    method: "Transfer DANA Manual",
  },
  {
    id: "P002",
    kolName: "Andi Wijaya",
    danaPhone: "081299887766",
    amount: 120000,
    date: "20 Okt 2024",
    method: "Transfer DANA Manual",
  },
];

// --- KOMPONEN BADGE ---
const PayoutStatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    PENDING: "bg-yellow-50 text-yellow-700 border-yellow-100",
    PAID: "bg-green-50 text-green-700 border-green-100",
  };
  const labels: Record<string, string> = {
    PENDING: "Menunggu Pencairan",
    PAID: "Sudah Dicairkan",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide border ${styles[status]}`}
    >
      {status === "PENDING" ? <Clock size={12} /> : <CheckCircle2 size={12} />}
      {labels[status]}
    </span>
  );
};

export default function PencairanKOLPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // State Data
  const [kolWallets, setKolWallets] = useState(initialKolWallets);
  const [payoutHistory, setPayoutHistory] = useState(initialPayoutHistory);

  // State Modal & Form
  const [isPayoutModalOpen, setIsPayoutModalOpen] = useState(false);
  const [selectedKol, setSelectedKol] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Hitung Statistik Dummy
  const pendingKolCount = kolWallets.filter(
    (k) => k.status === "PENDING",
  ).length;
  const totalPendingAmount = kolWallets
    .filter((k) => k.status === "PENDING")
    .reduce((sum, k) => sum + k.balance, 0);
  const totalPaidAmount = payoutHistory.reduce((sum, p) => sum + p.amount, 0);

  // Handler Buka Modal Pencairan
  const openPayoutModal = (kol: any) => {
    setSelectedKol(kol);
    setIsPayoutModalOpen(true);
  };

  // Handler Konfirmasi Pencairan
  const handleConfirmPayout = () => {
    if (!selectedKol) return;

    setIsProcessing(true);
    setTimeout(() => {
      // 1. Update status KOL menjadi PAID dan reset balance jadi 0
      setKolWallets((prev) =>
        prev.map((k) =>
          k.id === selectedKol.id ? { ...k, status: "PAID", balance: 0 } : k,
        ),
      );

      // 2. Tambahkan ke riwayat pencairan
      const newHistory: any = {
        id: `P00${payoutHistory.length + 1}`,
        kolName: selectedKol.kolName,
        danaPhone: selectedKol.danaPhone,
        amount: selectedKol.balance,
        date: new Date().toLocaleDateString("id-ID", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
        method: "Transfer DANA Manual",
      };
      setPayoutHistory([newHistory, ...payoutHistory]);

      setIsPayoutModalOpen(false);
      setSelectedKol(null);
      setIsProcessing(false);
      toast.success(
        `Berhasil mencairkan ${formatRupiah(selectedKol.balance)} ke ${selectedKol.kolName}!`,
      );
    }, 1500);
  };

  // Handler Copy Nomor DANA
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Nomor DANA berhasil disalin!");
  };

  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Filter KOL berdasarkan pencarian
  const filteredKolWallets = kolWallets.filter(
    (k) =>
      k.kolName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      k.danaPhone.includes(searchQuery),
  );

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
            <h2 className="text-xl font-bold text-[#1B1B1B]">Pencairan KOL</h2>
            <p className="text-[11px] text-[#C4C4C4] font-semibold uppercase tracking-wider">
              Kelola pembayaran reward ke dompet digital KOL
            </p>
          </div>
        </header>

        <div className="p-8 max-w-[1600px] mx-auto space-y-8">
          {/* 1. Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#FFFFFF] p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4"
            >
              <div className="w-12 h-12 rounded-xl bg-yellow-50 text-yellow-600 flex items-center justify-center">
                <Clock size={22} />
              </div>
              <div>
                <p className="text-[11px] font-semibold text-[#C4C4C4] uppercase tracking-wide">
                  Menunggu Pencairan
                </p>
                <h3 className="text-2xl font-bold text-[#1B1B1B]">
                  {pendingKolCount} KOL
                </h3>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-[#FFFFFF] p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4"
            >
              <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
                <Banknote size={22} />
              </div>
              <div>
                <p className="text-[11px] font-semibold text-[#C4C4C4] uppercase tracking-wide">
                  Total Saldo Terkunci
                </p>
                <h3 className="text-2xl font-bold text-[#1B1B1B]">
                  {formatRupiah(totalPendingAmount)}
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
                <CheckCircle2 size={22} />
              </div>
              <div>
                <p className="text-[11px] font-semibold text-[#C4C4C4] uppercase tracking-wide">
                  Total Sudah Dicairkan
                </p>
                <h3 className="text-2xl font-bold text-[#1B1B1B]">
                  {formatRupiah(totalPaidAmount)}
                </h3>
              </div>
            </motion.div>
          </div>

          {/* 2. Daftar KOL Menunggu Pencairan */}
          <div className="bg-[#FFFFFF] rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-lg text-[#1B1B1B]">
                  Daftar KOL & Dompet Digital
                </h3>
                <p className="text-xs text-[#C4C4C4]">
                  KOL yang memiliki saldo reward dan siap dicairkan
                </p>
              </div>
              <div className="relative w-full md:w-64">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#C4C4C4]"
                  size={16}
                />
                <input
                  type="text"
                  placeholder="Cari nama atau nomor DANA..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-[#233982]/20 focus:border-[#233982] outline-none"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50/80 text-[11px] uppercase font-bold text-[#C4C4C4] tracking-wider border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4">Nama KOL</th>
                    <th className="px-6 py-4">Akun DANA</th>
                    <th className="px-6 py-4">Saldo Reward</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredKolWallets.length > 0 ? (
                    filteredKolWallets.map((kol) => (
                      <motion.tr
                        key={kol.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="group hover:bg-[#233982]/[0.02] transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div>
                              <p className="font-bold text-sm text-[#1B1B1B]">
                                {kol.kolName}
                              </p>
                              <p className="text-[11px] text-[#C4C4C4]">
                                {kol.email}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm font-bold text-[#1B1B1B]">
                            {kol.danaName}
                          </p>
                          <p className="text-[11px] text-[#4F619B] font-mono">
                            {kol.danaPhone}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <p
                            className={`text-sm font-bold ${kol.balance > 0 ? "text-[#233982]" : "text-[#C4C4C4]"}`}
                          >
                            {formatRupiah(kol.balance)}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <PayoutStatusBadge status={kol.status} />
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            {kol.status === "PENDING" && kol.balance > 0 && (
                              <button
                                onClick={() => openPayoutModal(kol)}
                                className="px-3 py-1.5 text-xs font-bold text-white bg-[#233982] hover:bg-[#4F619B] rounded-lg transition-all flex items-center gap-1.5 shadow-sm shadow-[#233982]/20"
                              >
                                <Wallet size={14} /> Cairkan
                              </button>
                            )}
                            {kol.status === "PAID" && (
                              <span className="text-[11px] text-[#C4C4C4] font-medium">
                                Selesai
                              </span>
                            )}
                          </div>
                        </td>
                      </motion.tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center justify-center text-[#C4C4C4]">
                          <Wallet size={48} className="mb-3 opacity-20" />
                          <p className="font-semibold text-sm">
                            Tidak ada data KOL yang ditemukan
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* 3. Riwayat Pencairan */}
          <div className="bg-[#FFFFFF] rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h3 className="font-bold text-lg text-[#1B1B1B]">
                Riwayat Pencairan
              </h3>
              <p className="text-xs text-[#C4C4C4]">
                Log transaksi pencairan reward yang telah dilakukan
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50/80 text-[11px] uppercase font-bold text-[#C4C4C4] tracking-wider border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4">Tanggal</th>
                    <th className="px-6 py-4">Nama KOL</th>
                    <th className="px-6 py-4">Nomor DANA</th>
                    <th className="px-6 py-4">Jumlah</th>
                    <th className="px-6 py-4">Metode</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {payoutHistory.length > 0 ? (
                    payoutHistory.map((history) => (
                      <tr
                        key={history.id}
                        className="hover:bg-gray-50/50 transition-colors"
                      >
                        <td className="px-6 py-4 text-sm text-[#1B1B1B]">
                          {history.date}
                        </td>
                        <td className="px-6 py-4 text-sm font-bold text-[#1B1B1B]">
                          {history.kolName}
                        </td>
                        <td className="px-6 py-4 text-sm text-[#4F619B] font-mono">
                          {history.danaPhone}
                        </td>
                        <td className="px-6 py-4 text-sm font-bold text-green-600">
                          {formatRupiah(history.amount)}
                        </td>
                        <td className="px-6 py-4 text-sm text-[#C4C4C4]">
                          {history.method}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-6 py-8 text-center text-sm text-[#C4C4C4]"
                      >
                        Belum ada riwayat pencairan.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {/* --- MODAL KONFIRMASI PENCAIRAN --- */}
      <AnimatePresence>
        {isPayoutModalOpen && selectedKol && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setIsPayoutModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-[#233982]/5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#233982] text-white flex items-center justify-center">
                    <Wallet size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#1B1B1B]">
                      Konfirmasi Pencairan
                    </h3>
                    <p className="text-xs text-[#C4C4C4]">
                      Verifikasi data sebelum transfer
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsPayoutModalOpen(false)}
                  className="p-2 hover:bg-gray-200 rounded-full transition-colors text-[#C4C4C4] hover:text-[#1B1B1B]"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 space-y-5">
                {/* Info KOL */}
                <div className="bg-gray-50 rounded-2xl p-4 space-y-3">
                  <div>
                    <p className="text-[10px] font-bold text-[#C4C4C4] uppercase tracking-wide">
                      Nama KOL
                    </p>
                    <p className="text-sm font-bold text-[#1B1B1B]">
                      {selectedKol.kolName}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-[#C4C4C4] uppercase tracking-wide">
                      Nama Pemilik DANA
                    </p>
                    <p className="text-sm font-bold text-[#1B1B1B]">
                      {selectedKol.danaName}
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-bold text-[#C4C4C4] uppercase tracking-wide">
                        Nomor DANA
                      </p>
                      <p className="text-sm font-bold text-[#233982] font-mono">
                        {selectedKol.danaPhone}
                      </p>
                    </div>
                    <button
                      onClick={() => copyToClipboard(selectedKol.danaPhone)}
                      className="p-2 bg-white border border-gray-200 rounded-lg text-[#4F619B] hover:bg-gray-100 transition-all"
                      title="Salin Nomor"
                    >
                      <Copy size={14} />
                    </button>
                  </div>
                </div>

                {/* Total Amount */}
                <div className="bg-[#FCC200]/10 border border-[#FCC200]/20 rounded-2xl p-4 text-center">
                  <p className="text-[10px] font-bold text-[#B48A00] uppercase tracking-wide mb-1">
                    Total Akan Dicairkan
                  </p>
                  <h2 className="text-3xl font-black text-[#233982]">
                    {formatRupiah(selectedKol.balance)}
                  </h2>
                </div>

                {/* Warning Note */}
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 flex items-start gap-2">
                  <Eye
                    size={16}
                    className="text-blue-600 flex-shrink-0 mt-0.5"
                  />
                  <p className="text-[11px] text-blue-700 leading-relaxed">
                    Pastikan Anda telah mentransfer dana secara manual melalui
                    aplikasi DANA ke nomor di atas sebelum mengklik tombol
                    konfirmasi.
                  </p>
                </div>
              </div>

              <div className="px-6 py-5 border-t border-gray-100 bg-gray-50/50 flex items-center justify-end gap-3">
                <button
                  onClick={() => setIsPayoutModalOpen(false)}
                  className="px-5 py-2.5 text-sm font-bold text-[#C4C4C4] hover:text-[#1B1B1B] transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={handleConfirmPayout}
                  disabled={isProcessing}
                  className="px-5 py-2.5 text-sm font-bold text-white bg-green-600 rounded-xl hover:bg-green-700 transition-all shadow-md shadow-green-600/20 flex items-center gap-2 disabled:opacity-50"
                >
                  {isProcessing ? (
                    <Loader2 className="animate-spin" size={16} />
                  ) : (
                    <CheckCircle2 size={16} />
                  )}
                  {isProcessing ? "Memproses..." : "Ya, Sudah Ditransfer"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
