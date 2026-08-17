/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import React, { useState, useEffect } from "react";
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
  Search,
} from "lucide-react";
import Sidebar from "@/components/admin/Sidebar";
import toast from "react-hot-toast";

// --- KOMPONEN BADGE ---
const PayoutStatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    PENDING: "bg-yellow-50 text-yellow-700 border-yellow-100",
    PAID: "bg-green-50 text-green-700 border-green-100",
  };
  const labels: Record<string, string> = {
    PENDING: "Menunggu Konfirmasi",
    PAID: "Sudah Ditransfer",
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
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);
  const [paidRequests, setPaidRequests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // State Modal & Form
  const [isPayoutModalOpen, setIsPayoutModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch Data dari API
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [pendingRes, paidRes] = await Promise.all([
        fetch("/api/admin/payout-requests?status=PENDING"),
        fetch("/api/admin/payout-requests?status=PAID"),
      ]);

      const pendingData = await pendingRes.json();
      const paidData = await paidRes.json();

      if (pendingData.success) setPendingRequests(pendingData.data);
      if (paidData.success) setPaidRequests(paidData.data);
    } catch (error) {
      console.error("Gagal memuat data pencairan", error);
      toast.error("Gagal memuat data pencairan");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Hitung Statistik Real-time
  const pendingCount = pendingRequests.length;
  const totalPendingAmount = pendingRequests.reduce(
    (sum, r) => sum + r.amount,
    0,
  );
  const totalPaidAmount = paidRequests.reduce((sum, r) => sum + r.amount, 0);

  // Handler Buka Modal
  const openPayoutModal = (req: any) => {
    setSelectedRequest(req);
    setIsPayoutModalOpen(true);
  };

  // Handler Konfirmasi Pencairan (Setelah Admin Transfer Manual)
  const handleConfirmPayout = async () => {
    if (!selectedRequest) return;

    setIsProcessing(true);
    try {
      const res = await fetch("/api/admin/payout-requests", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId: selectedRequest.id }),
      });

      const result = await res.json();
      if (result.success) {
        toast.success(
          `Berhasil mencairkan ${formatRupiah(selectedRequest.amount)} ke ${selectedRequest.kolName}!`,
        );
        setIsPayoutModalOpen(false);
        setSelectedRequest(null);
        fetchData(); // Refresh data agar tabel dan stats terupdate
      } else {
        toast.error(result.error || "Gagal memproses pencairan");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan pada server");
    } finally {
      setIsProcessing(false);
    }
  };

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
  const filteredRequests = pendingRequests.filter(
    (r) =>
      r.kolName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.danaPhone.includes(searchQuery),
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
              Verifikasi dan proses permintaan pencairan reward dari KOL
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
                  Permintaan Pending
                </p>
                <h3 className="text-2xl font-bold text-[#1B1B1B]">
                  {pendingCount} KOL
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
                  Total Menunggu Cair
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

          {/* 2. Daftar Permintaan Pencairan (Pending) */}
          <div className="bg-[#FFFFFF] rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-lg text-[#1B1B1B]">
                  Permintaan Pencairan Baru
                </h3>
                <p className="text-xs text-[#C4C4C4]">
                  KOL yang mengajukan pencairan dan menunggu verifikasi Admin
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
                    <th className="px-6 py-4">Jumlah Pencairan</th>
                    <th className="px-6 py-4">Tanggal Pengajuan</th>
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
                  ) : filteredRequests.length > 0 ? (
                    filteredRequests.map((req) => (
                      <motion.tr
                        key={req.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="group hover:bg-[#233982]/[0.02] transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-[#FCC200]/15 text-[#B48A00] rounded-full flex items-center justify-center font-bold text-sm">
                              {req.kolName.charAt(0)}
                            </div>
                            <div>
                              <p className="font-bold text-sm text-[#1B1B1B]">
                                {req.kolName}
                              </p>
                              <p className="text-[11px] text-[#C4C4C4]">
                                {req.email}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm font-bold text-[#1B1B1B]">
                            {req.danaName}
                          </p>
                          <p className="text-[11px] text-[#4F619B] font-mono">
                            {req.danaPhone}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm font-bold text-[#233982]">
                            {formatRupiah(req.amount)}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-xs font-medium text-[#1B1B1B]">
                            {req.requestedAt}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => openPayoutModal(req)}
                              className="px-3 py-1.5 text-xs font-bold text-white bg-[#233982] hover:bg-[#4F619B] rounded-lg transition-all flex items-center gap-1.5 shadow-sm shadow-[#233982]/20"
                            >
                              <Eye size={14} /> Verifikasi & Cairkan
                            </button>
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
                            Tidak ada permintaan pencairan baru
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* 3. Riwayat Pencairan (Paid) */}
          <div className="bg-[#FFFFFF] rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h3 className="font-bold text-lg text-[#1B1B1B]">
                Riwayat Pencairan
              </h3>
              <p className="text-xs text-[#C4C4C4]">
                Log transaksi pencairan reward yang telah dikonfirmasi
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50/80 text-[11px] uppercase font-bold text-[#C4C4C4] tracking-wider border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4">Tanggal Proses</th>
                    <th className="px-6 py-4">Nama KOL</th>
                    <th className="px-6 py-4">Nomor DANA</th>
                    <th className="px-6 py-4">Jumlah</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {paidRequests.length > 0 ? (
                    paidRequests.map((req) => (
                      <tr
                        key={req.id}
                        className="hover:bg-gray-50/50 transition-colors"
                      >
                        <td className="px-6 py-4 text-sm text-[#1B1B1B]">
                          {req.processedAt}
                        </td>
                        <td className="px-6 py-4 text-sm font-bold text-[#1B1B1B]">
                          {req.kolName}
                        </td>
                        <td className="px-6 py-4 text-sm text-[#4F619B] font-mono">
                          {req.danaPhone}
                        </td>
                        <td className="px-6 py-4 text-sm font-bold text-green-600">
                          {formatRupiah(req.amount)}
                        </td>
                        <td className="px-6 py-4">
                          <PayoutStatusBadge status={req.status} />
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
        {isPayoutModalOpen && selectedRequest && (
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
                      Verifikasi data sebelum transfer manual
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
                      {selectedRequest.kolName}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-[#C4C4C4] uppercase tracking-wide">
                      Nama Pemilik DANA
                    </p>
                    <p className="text-sm font-bold text-[#1B1B1B]">
                      {selectedRequest.danaName}
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-bold text-[#C4C4C4] uppercase tracking-wide">
                        Nomor DANA
                      </p>
                      <p className="text-sm font-bold text-[#233982] font-mono">
                        {selectedRequest.danaPhone}
                      </p>
                    </div>
                    <button
                      onClick={() => copyToClipboard(selectedRequest.danaPhone)}
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
                    {formatRupiah(selectedRequest.amount)}
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
                    konfirmasi. Saldo KOL akan otomatis terpotong setelah ini.
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
