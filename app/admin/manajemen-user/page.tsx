/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Filter,
  UserPlus,
  MoreHorizontal,
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
} from "lucide-react";
import Sidebar from "@/components/admin/Sidebar";

const COLORS = {
  primary: "#FCC200",
  blueDark: "#233982",
  blue: "#4F619B",
  black: "#1B1B1B",
  gray: "#C4C4C4",
};

// --- Mock Data User ---
const mockUsers = [
  {
    id: 1,
    name: "Budi Santoso",
    email: "budi@medpel.com",
    role: "Jurnalis",
    status: "Active",
    joinDate: "12 Jan 2024",
    articles: 12,
  },
  {
    id: 2,
    name: "Siska Putri",
    email: "siska@medpel.com",
    role: "Jurnalis",
    status: "Pending",
    joinDate: "25 Okt 2024",
    articles: 0,
  },
  {
    id: 3,
    name: "Andi Wijaya",
    email: "andi@medpel.com",
    role: "Admin",
    status: "Active",
    joinDate: "05 Mei 2023",
    articles: 45,
  },
  {
    id: 4,
    name: "Rina Kartika",
    email: "rina@medpel.com",
    role: "Jurnalis",
    status: "Suspended",
    joinDate: "14 Feb 2023",
    articles: 8,
  },
  {
    id: 5,
    name: "Dewi Lestari",
    email: "dewi@medpel.com",
    role: "User",
    status: "Active",
    joinDate: "30 Agu 2024",
    articles: 0,
  },
  {
    id: 6,
    name: "Rian Hidayat",
    email: "rian@medpel.com",
    role: "Jurnalis",
    status: "Active",
    joinDate: "10 Sep 2024",
    articles: 5,
  },
];

// --- Komponen Badge Role ---
const RoleBadge = ({ role }: { role: string }) => {
  const styles: Record<string, string> = {
    Admin: "bg-[#233982]/10 text-[#233982] border-[#233982]/20",
    Jurnalis: "bg-[#FCC200]/15 text-[#B48A00] border-[#FCC200]/30",
    User: "bg-gray-100 text-gray-600 border-gray-200",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wide border ${styles[role]}`}
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
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide border ${styles[status]}`}
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

  // Filter Data
  const filteredUsers = useMemo(() => {
    return mockUsers.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRole = roleFilter === "All" || user.role === roleFilter;
      const matchesStatus =
        statusFilter === "All" || user.status === statusFilter;
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [searchQuery, roleFilter, statusFilter]);

  // Stats Data
  const stats = [
    {
      label: "Total Pengguna",
      val: mockUsers.length.toString(),
      icon: User,
      color: "text-[#233982]",
      bg: "bg-[#233982]/10",
    },
    {
      label: "Pengguna Aktif",
      val: mockUsers.filter((u) => u.status === "Active").length.toString(),
      icon: CheckCircle2,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      label: "Ditangguhkan",
      val: mockUsers.filter((u) => u.status === "Suspended").length.toString(),
      icon: ShieldAlert,
      color: "text-red-600",
      bg: "bg-red-50",
    },
    {
      label: "Menunggu Verifikasi",
      val: mockUsers.filter((u) => u.status === "Pending").length.toString(),
      icon: Clock,
      color: "text-yellow-600",
      bg: "bg-yellow-50",
    },
  ];

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    // Di sini nanti logika update ke backend
    setSelectedUser(null);
  };

  return (
    <div className="min-h-screen bg-[#f8faf9] font-sans text-[#1B1B1B] overflow-x-hidden flex">
      {/* --- SIDEBAR --- */}
      <Sidebar
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
            <h2 className="text-xl font-bold text-[#1B1B1B]">Manajemen User</h2>
            <p className="text-[11px] text-[#C4C4C4] font-semibold uppercase tracking-wider">
              Kelola akses, peran, dan status akun pengguna
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 bg-white border border-gray-200 text-[#1B1B1B] text-xs font-bold rounded-xl flex items-center gap-2 hover:bg-gray-50 transition-all">
              <Download size={16} />
              Export CSV
            </button>
            <button className="px-4 py-2 bg-[#233982] text-white text-xs font-bold rounded-xl flex items-center gap-2 hover:bg-[#4F619B] transition-all shadow-md shadow-[#233982]/20">
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
                  <option value="User">User</option>
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
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <motion.tr
                        key={user.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="group hover:bg-[#233982]/[0.02] transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {/* <div className="w-10 h-10 bg-[#233982]/10 text-[#233982] rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0">
                              {user.name.charAt(0)}
                            </div> */}
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
                              className={`p-2 rounded-lg transition-all ${
                                user.status === "Suspended"
                                  ? "text-green-600 hover:bg-green-50"
                                  : "text-red-600 hover:bg-red-50"
                              }`}
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
                            <button
                              className="p-2 text-gray-400 hover:bg-gray-100 hover:text-red-600 rounded-lg transition-all"
                              title="Hapus"
                            >
                              <Trash2 size={18} />
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

            {/* Pagination (Dummy) */}
            <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
              <p className="text-xs text-[#C4C4C4]">
                Menampilkan {filteredUsers.length} dari {mockUsers.length}{" "}
                pengguna
              </p>
              <div className="flex items-center gap-2">
                <button
                  className="px-3 py-1.5 text-xs font-bold text-[#C4C4C4] border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                  disabled
                >
                  Sebelumnya
                </button>
                <button className="px-3 py-1.5 text-xs font-bold text-[#233982] bg-[#233982]/10 border border-[#233982]/20 rounded-lg">
                  1
                </button>
                <button className="px-3 py-1.5 text-xs font-bold text-[#C4C4C4] border border-gray-200 rounded-lg hover:bg-gray-50">
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
              {/* Modal Header */}
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

              {/* Modal Body */}
              <form onSubmit={handleSaveUser} className="p-6 space-y-5">
                <div>
                  <label className="block text-xs font-bold text-[#C4C4C4] uppercase tracking-wide mb-1.5">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    defaultValue={selectedUser.name}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 text-sm font-medium text-[#1B1B1B] focus:ring-2 focus:ring-[#233982]/20 focus:border-[#233982] outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#C4C4C4] uppercase tracking-wide mb-1.5">
                    Alamat Email
                  </label>
                  <input
                    type="email"
                    defaultValue={selectedUser.email}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 text-sm font-medium text-[#1B1B1B] focus:ring-2 focus:ring-[#233982]/20 focus:border-[#233982] outline-none transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#C4C4C4] uppercase tracking-wide mb-1.5">
                      Peran (Role)
                    </label>
                    <select
                      defaultValue={selectedUser.role}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 text-sm font-medium text-[#1B1B1B] focus:ring-2 focus:ring-[#233982]/20 focus:border-[#233982] outline-none transition-all appearance-none"
                    >
                      <option value="User">User</option>
                      <option value="Jurnalis">Jurnalis</option>
                      <option value="Admin">Admin</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#C4C4C4] uppercase tracking-wide mb-1.5">
                      Status
                    </label>
                    <select
                      defaultValue={selectedUser.status}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 text-sm font-medium text-[#1B1B1B] focus:ring-2 focus:ring-[#233982]/20 focus:border-[#233982] outline-none transition-all appearance-none"
                    >
                      <option value="Active">Aktif</option>
                      <option value="Suspended">Ditangguhkan</option>
                      <option value="Pending">Menunggu</option>
                    </select>
                  </div>
                </div>

                {/* Modal Footer */}
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
                    className="px-5 py-2.5 text-sm font-bold text-white bg-[#233982] rounded-xl hover:bg-[#4F619B] transition-all shadow-md shadow-[#233982]/20 flex items-center gap-2"
                  >
                    <Save size={16} /> Simpan Perubahan
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
