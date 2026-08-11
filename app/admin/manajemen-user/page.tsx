/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Filter,
  UserPlus,
  Shield,
  ShieldAlert,
  User,
  CheckCircle2,
  XCircle,
  Clock,
  Edit3,
  Trash2,
  X,
  Save,
  Download,
  Loader2,
} from "lucide-react";
import Sidebar from "@/components/admin/Sidebar";
import toast from "react-hot-toast";

const COLORS = {
  primary: "#FCC200",
  blueDark: "#233982",
  blue: "#4F619B",
  black: "#1B1B1B",
  gray: "#C4C4C4",
};

// --- Komponen Badge Role ---
const RoleBadge = ({ role }: { role: string }) => {
  const styles: Record<string, string> = {
    Admin: "bg-[#233982]/10 text-[#233982] border-[#233982]/20",
    Jurnalis: "bg-[#FCC200]/15 text-[#B48A00] border-[#FCC200]/30",
    KOL: "bg-purple-50 text-purple-600 border-purple-100",
    User: "bg-gray-100 text-gray-600 border-gray-200",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wide border ${
        styles[role] || styles.User
      }`}
    >
      {role}
    </span>
  );
};

// --- Komponen Badge Status ---
const StatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    Active: "bg-green-50 text-green-700 border-green-100",
    Suspended: "bg-red-50 text-red-700 border-red-100",
    Pending: "bg-yellow-50 text-yellow-700 border-yellow-100",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide border ${
        styles[status]
      }`}
    >
      {status === "Suspended"
        ? "Ditangguhkan"
        : status === "Pending"
          ? "Menunggu"
          : "Aktif"}
    </span>
  );
};

export default function ManajemenUserPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // --- BARU: State untuk Pagination ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // State untuk Tambah User
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "MEMBER",
  });

  // Fungsi Fetch Data (dipisah agar bisa dipanggil manual)
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        search: searchQuery,
        role: roleFilter,
        status: statusFilter,
      });
      const res = await fetch(`/api/admin/users?${params.toString()}`);
      const result = await res.json();
      if (result.success) {
        setUsers(result.data);
      }
    } catch (error) {
      console.error("Gagal memuat data user", error);
      toast.error("Gagal memuat data user");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch Data User dari API dengan Debounce
  useEffect(() => {
    setCurrentPage(1); // <-- Reset ke halaman 1 setiap filter/pencarian berubah
    const timer = setTimeout(fetchData, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, roleFilter, statusFilter]);

  // Stats Data (Otomatis update real-time berdasarkan state 'users')
  const stats = [
    {
      label: "Total Pengguna",
      val: users.length.toString(),
      icon: User,
      color: "text-[#233982]",
      bg: "bg-[#233982]/10",
    },
    {
      label: "Pengguna Aktif",
      val: users.filter((u) => u.status === "Active").length.toString(),
      icon: CheckCircle2,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      label: "Ditangguhkan",
      val: users.filter((u) => u.status === "Suspended").length.toString(),
      icon: ShieldAlert,
      color: "text-red-600",
      bg: "bg-red-50",
    },
    {
      label: "Menunggu Verifikasi",
      val: users.filter((u) => u.status === "Pending").length.toString(),
      icon: Clock,
      color: "text-yellow-600",
      bg: "bg-yellow-50",
    },
  ];

  // --- 1. OPTIMISTIC UI UPDATE UNTUK EDIT ---
  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    setIsSaving(true);

    const formData = new FormData(e.target as HTMLFormElement);
    const updatedData = {
      id: selectedUser.id,
      role: formData.get("role") as string,
      status: formData.get("status") as string,
    };

    const originalUsers = [...users];
    const updatedUsers = users.map((u) =>
      u.id === selectedUser.id
        ? { ...u, role: updatedData.role, status: updatedData.status }
        : u,
    );
    setUsers(updatedUsers);

    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });

      const result = await res.json();
      if (!result.success) {
        setUsers(originalUsers);
        toast.error(result.error || "Gagal memperbarui data");
      } else {
        toast.success("Data pengguna berhasil diperbarui!");
        setSelectedUser(null);
      }
    } catch (error) {
      setUsers(originalUsers);
      toast.error("Terjadi kesalahan jaringan. Perubahan dibatalkan.");
    } finally {
      setIsSaving(false);
    }
  };

  // --- 2. FUNGSI TAMBAH USER (DIPERBAIKI: Langsung fetch tanpa refresh) ---
  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });

      const result = await res.json();
      if (result.success) {
        toast.success("Pengguna baru berhasil ditambahkan!");
        setIsAddModalOpen(false);
        setNewUser({ name: "", email: "", password: "", role: "MEMBER" });

        // LANGSUNG panggil fetchData() agar user baru langsung muncul di tabel
        await fetchData();
      } else {
        toast.error(result.error || "Gagal menambahkan pengguna");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan pada server");
    } finally {
      setIsSaving(false);
    }
  };

  // --- 3. FUNGSI EXPORT CSV ---
  const handleExportCSV = () => {
    if (users.length === 0) {
      toast.error("Tidak ada data untuk diexport");
      return;
    }

    const headers = [
      "Nama",
      "Email",
      "Role",
      "Status",
      "Jumlah Artikel",
      "Tanggal Bergabung",
    ];

    const rows = users.map((u) => [
      `"${u.name}"`,
      `"${u.email}"`,
      `"${u.role}"`,
      `"${u.status}"`,
      `"${u.articles}"`,
      `"${u.joinDate}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8,\uFEFF" +
      headers.join(",") +
      "\n" +
      rows.map((e) => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `data_user_medpel_${new Date().toISOString().slice(0, 10)}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("File CSV berhasil diunduh!");
  };

  // --- Logika Pagination ---
  const totalPages = Math.ceil(users.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUsers = users.slice(startIndex, endIndex);

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
            <h2 className="text-xl font-bold text-[#1B1B1B]">Manajemen User</h2>
            <p className="text-[11px] text-[#C4C4C4] font-semibold uppercase tracking-wider">
              Kelola akses, peran, dan status akun pengguna
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleExportCSV}
              className="px-4 py-2 bg-white border border-gray-200 text-[#1B1B1B] text-xs font-bold rounded-xl flex items-center gap-2 hover:bg-gray-50 transition-all"
            >
              <Download size={16} />
              Export CSV
            </button>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2 bg-[#233982] text-white text-xs font-bold rounded-xl flex items-center gap-2 hover:bg-[#4F619B] transition-all shadow-md shadow-[#233982]/20"
            >
              <UserPlus size={16} />
              Tambah User
            </button>
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
                  <h3 className="text-2xl font-bold text-[#1B1B1B]">
                    {stat.val}
                  </h3>
                </div>
              </motion.div>
            ))}
          </div>

          {/* 2. Filter & Search Bar */}
          <div className="bg-[#FFFFFF] p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-96">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#C4C4C4]"
                size={18}
              />
              <input
                type="text"
                placeholder="Cari nama atau email pengguna..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-[#233982]/20 focus:border-[#233982] transition-all outline-none"
              />
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:flex-none">
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="appearance-none w-full md:w-40 bg-gray-50 border border-gray-200 rounded-xl py-2.5 pl-4 pr-10 text-sm font-semibold text-[#1B1B1B] focus:ring-2 focus:ring-[#233982]/20 outline-none cursor-pointer"
                >
                  <option value="All">Semua Role</option>
                  <option value="Admin">Admin</option>
                  <option value="Jurnalis">Jurnalis</option>
                  <option value="KOL">KOL</option>
                  <option value="MEMBER">User</option>
                </select>
                <Filter
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#C4C4C4] pointer-events-none"
                  size={14}
                />
              </div>
              <div className="relative flex-1 md:flex-none">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="appearance-none w-full md:w-44 bg-gray-50 border border-gray-200 rounded-xl py-2.5 pl-4 pr-10 text-sm font-semibold text-[#1B1B1B] focus:ring-2 focus:ring-[#233982]/20 outline-none cursor-pointer"
                >
                  <option value="All">Semua Status</option>
                  <option value="Active">Aktif</option>
                  <option value="Suspended">Ditangguhkan</option>
                  <option value="Pending">Menunggu</option>
                </select>
                <Filter
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#C4C4C4] pointer-events-none"
                  size={14}
                />
              </div>
            </div>
          </div>

          {/* 3. Data Table */}
          <div className="bg-[#FFFFFF] rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50/80 text-[11px] uppercase font-bold text-[#C4C4C4] tracking-wider border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4">Identitas Pengguna</th>
                    <th className="px-6 py-4">Peran (Role)</th>
                    <th className="px-6 py-4">Status Akun</th>
                    <th className="px-6 py-4">Kontribusi</th>
                    <th className="px-6 py-4">Tanggal Bergabung</th>
                    <th className="px-6 py-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {isLoading ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#233982] mx-auto"></div>
                      </td>
                    </tr>
                  ) : currentUsers.length > 0 ? (
                    currentUsers.map((user) => (
                      <motion.tr
                        key={user.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="group hover:bg-[#233982]/[0.02] transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div>
                              <p className="font-bold text-sm text-[#1B1B1B] group-hover:text-[#233982] transition-colors">
                                {user.name}
                              </p>
                              <p className="text-[11px] text-[#C4C4C4]">
                                {user.email}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <RoleBadge role={user.role} />
                        </td>
                        <td className="px-6 py-4">
                          <StatusBadge status={user.status} />
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-xs font-bold text-[#1B1B1B]">
                            {user.articles} Artikel
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-xs font-medium text-[#1B1B1B]">
                            {user.joinDate}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setSelectedUser(user)}
                              className="p-2 text-[#4F619B] hover:bg-[#4F619B]/10 rounded-lg transition-all"
                              title="Edit User"
                            >
                              <Edit3 size={18} />
                            </button>
                            <button
                              onClick={async () => {
                                const newStatus =
                                  user.status === "Suspended"
                                    ? "Active"
                                    : "Suspended";
                                const originalUsers = [...users];
                                setUsers(
                                  users.map((u) =>
                                    u.id === user.id
                                      ? { ...u, status: newStatus }
                                      : u,
                                  ),
                                );
                                try {
                                  await fetch("/api/admin/users", {
                                    method: "PATCH",
                                    headers: {
                                      "Content-Type": "application/json",
                                    },
                                    body: JSON.stringify({
                                      id: user.id,
                                      status: newStatus,
                                    }),
                                  });
                                  toast.success(
                                    `Status berhasil diubah menjadi ${newStatus === "Active" ? "Aktif" : "Ditangguhkan"}`,
                                  );
                                } catch (err) {
                                  setUsers(originalUsers);
                                  toast.error("Gagal mengubah status");
                                }
                              }}
                              className={`p-2 rounded-lg transition-all ${user.status === "Suspended" ? "text-green-600 hover:bg-green-50" : "text-red-600 hover:bg-red-50"}`}
                              title={
                                user.status === "Suspended"
                                  ? "Aktifkan Kembali"
                                  : "Tangguhkan"
                              }
                            >
                              {user.status === "Suspended" ? (
                                <CheckCircle2 size={18} />
                              ) : (
                                <ShieldAlert size={18} />
                              )}
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center justify-center text-[#C4C4C4]">
                          <User size={48} className="mb-3 opacity-20" />
                          <p className="font-semibold text-sm">
                            Tidak ada pengguna yang ditemukan
                          </p>
                          <p className="text-xs mt-1">
                            Coba ubah kata kunci pencarian atau filter.
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* --- BARU: Pagination Controls --- */}
            <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
              <p className="text-xs text-[#C4C4C4]">
                Menampilkan {users.length > 0 ? startIndex + 1 : 0} -{" "}
                {Math.min(endIndex, users.length)} dari {users.length} pengguna
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 text-xs font-bold text-[#C4C4C4] border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Sebelumnya
                </button>
                <span className="text-xs font-bold text-[#1B1B1B] px-2">
                  Halaman {currentPage} dari {totalPages || 1}
                </span>
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages || totalPages === 0}
                  className="px-3 py-1.5 text-xs font-bold text-[#C4C4C4] border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Selanjutnya
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* --- MODAL EDIT USER --- */}
      <AnimatePresence>
        {selectedUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedUser(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                <div>
                  <h3 className="text-lg font-bold text-[#1B1B1B]">
                    Edit Pengguna
                  </h3>
                  <p className="text-xs text-[#C4C4C4] mt-1">
                    Ubah peran atau status akun {selectedUser.name}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedUser(null)}
                  className="p-2 hover:bg-gray-200 rounded-full transition-colors text-[#C4C4C4] hover:text-[#1B1B1B]"
                >
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleSaveUser} className="p-6 space-y-5">
                <div>
                  <label className="block text-xs font-bold text-[#C4C4C4] uppercase tracking-wide mb-1.5">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    defaultValue={selectedUser.name}
                    disabled
                    className="w-full bg-gray-100 border border-gray-200 rounded-xl py-2.5 px-4 text-sm font-medium text-[#C4C4C4] cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#C4C4C4] uppercase tracking-wide mb-1.5">
                    Alamat Email
                  </label>
                  <input
                    type="email"
                    defaultValue={selectedUser.email}
                    disabled
                    className="w-full bg-gray-100 border border-gray-200 rounded-xl py-2.5 px-4 text-sm font-medium text-[#C4C4C4] cursor-not-allowed"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#C4C4C4] uppercase tracking-wide mb-1.5">
                      Peran (Role)
                    </label>
                    <select
                      name="role"
                      defaultValue={selectedUser.role}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 text-sm font-medium text-[#1B1B1B] focus:ring-2 focus:ring-[#233982]/20 focus:border-[#233982] outline-none transition-all appearance-none"
                    >
                      <option value="MEMBER">User</option>
                      <option value="Jurnalis">Jurnalis</option>
                      <option value="KOL">KOL</option>
                      <option value="Admin">Admin</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#C4C4C4] uppercase tracking-wide mb-1.5">
                      Status
                    </label>
                    <select
                      name="status"
                      defaultValue={selectedUser.status}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 text-sm font-medium text-[#1B1B1B] focus:ring-2 focus:ring-[#233982]/20 focus:border-[#233982] outline-none transition-all appearance-none"
                    >
                      <option value="Active">Aktif</option>
                      <option value="Suspended">Ditangguhkan</option>
                      <option value="Pending">Menunggu</option>
                    </select>
                  </div>
                </div>
                <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-100 mt-6">
                  <button
                    type="button"
                    onClick={() => setSelectedUser(null)}
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
                    Simpan Perubahan
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- MODAL TAMBAH USER --- */}
      <AnimatePresence>
        {isAddModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setIsAddModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                <div>
                  <h3 className="text-lg font-bold text-[#1B1B1B]">
                    Tambah Pengguna Baru
                  </h3>
                  <p className="text-xs text-[#C4C4C4] mt-1">
                    Buat akun baru untuk sistem
                  </p>
                </div>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="p-2 hover:bg-gray-200 rounded-full transition-colors text-[#C4C4C4] hover:text-[#1B1B1B]"
                >
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleAddUser} className="p-6 space-y-5">
                <div>
                  <label className="block text-xs font-bold text-[#C4C4C4] uppercase tracking-wide mb-1.5">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    required
                    value={newUser.name}
                    onChange={(e) =>
                      setNewUser({ ...newUser, name: e.target.value })
                    }
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 text-sm font-medium text-[#1B1B1B] focus:ring-2 focus:ring-[#233982]/20 focus:border-[#233982] outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#C4C4C4] uppercase tracking-wide mb-1.5">
                    Alamat Email
                  </label>
                  <input
                    type="email"
                    required
                    value={newUser.email}
                    onChange={(e) =>
                      setNewUser({ ...newUser, email: e.target.value })
                    }
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 text-sm font-medium text-[#1B1B1B] focus:ring-2 focus:ring-[#233982]/20 focus:border-[#233982] outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#C4C4C4] uppercase tracking-wide mb-1.5">
                    Password Sementara
                  </label>
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={newUser.password}
                    onChange={(e) =>
                      setNewUser({ ...newUser, password: e.target.value })
                    }
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 text-sm font-medium text-[#1B1B1B] focus:ring-2 focus:ring-[#233982]/20 focus:border-[#233982] outline-none transition-all"
                  />
                  <p className="text-[10px] text-[#C4C4C4] mt-1">
                    Minimal 8 karakter. User akan diminta mengganti saat login
                    pertama.
                  </p>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#C4C4C4] uppercase tracking-wide mb-1.5">
                    Peran (Role)
                  </label>
                  <select
                    value={newUser.role}
                    onChange={(e) =>
                      setNewUser({ ...newUser, role: e.target.value })
                    }
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 text-sm font-medium text-[#1B1B1B] focus:ring-2 focus:ring-[#233982]/20 focus:border-[#233982] outline-none transition-all appearance-none"
                  >
                    <option value="MEMBER">Member</option>
                    <option value="JURNALIS">Jurnalis</option>
                    <option value="KOL">KOL</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </div>
                <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-100 mt-6">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
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
                      <UserPlus size={16} />
                    )}
                    Buat Akun
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
