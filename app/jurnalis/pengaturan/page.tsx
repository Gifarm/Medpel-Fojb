/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Lock,
  Save,
  Camera,
  Eye,
  EyeOff,
  FileText,
  Shield,
} from "lucide-react";
import SidebarJurnalis from "@/components/jurnalis/Sidebar"; // Sesuaikan path
import toast from "react-hot-toast";

// --- Komponen Input Field Kustom (Mendukung Text, Password, Textarea) ---
const InputField = ({
  icon: Icon,
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  disabled = false,
  rightIcon: RightIcon,
  onRightIconClick,
  rows,
}: any) => (
  <div className="mb-5">
    <label className="block text-xs font-bold text-[#C4C4C4] uppercase tracking-wide mb-1.5">
      {label}
    </label>
    <div className="relative group">
      {Icon && type !== "textarea" && (
        <Icon
          className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${
            disabled
              ? "text-[#C4C4C4]"
              : "text-[#C4C4C4] group-focus-within:text-[#233982]"
          }`}
          size={18}
        />
      )}
      {type === "textarea" ? (
        <textarea
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          rows={rows || 3}
          className={`w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 ${
            Icon ? "pl-12" : ""
          } text-sm font-medium text-[#1B1B1B] focus:ring-2 focus:ring-[#FCC200]/20 focus:border-[#FCC200] outline-none transition-all resize-none ${
            disabled ? "cursor-not-allowed text-[#C4C4C4]" : ""
          }`}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full bg-gray-50 border border-gray-200 rounded-xl py-3 ${
            Icon ? "pl-12" : "pl-4"
          } ${RightIcon ? "pr-12" : "pr-4"} text-sm font-medium text-[#1B1B1B] focus:ring-2 focus:ring-[#FCC200]/20 focus:border-[#FCC200] outline-none transition-all ${
            disabled ? "cursor-not-allowed text-[#C4C4C4]" : ""
          }`}
        />
      )}
      {RightIcon && type !== "textarea" && (
        <button
          type="button"
          onClick={onRightIconClick}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-[#C4C4C4] hover:text-[#233982] transition-colors duration-300 focus:outline-none"
          tabIndex={-1}
        >
          <RightIcon size={18} />
        </button>
      )}
    </div>
  </div>
);

export default function PengaturanAkunJurnalis() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // State Show/Hide Password
  const [showOldPass, setShowOldPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  // State Form Data
  const [profile, setProfile] = useState({
    name: "Siska Putri",
    email: "siska@mediapelajar.id",
    role: "Jurnalis",
    bio: "Pelajar SMA 1 Jakarta. Suka menulis tentang teknologi, sains, dan isu sosial remaja.",
  });

  const [passwords, setPasswords] = useState({
    oldPass: "",
    newPass: "",
    confirmPass: "",
  });

  const handleProfileChange = (field: string, val: string) => {
    setProfile({ ...profile, [field]: val });
  };

  const handlePasswordChange = (field: string, val: string) => {
    setPasswords({ ...passwords, [field]: val });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    // Validasi sederhana password
    if (passwords.newPass && passwords.newPass !== passwords.confirmPass) {
      toast.error("Password baru dan konfirmasi password tidak cocok!");
      return;
    }

    setIsSaving(true);
    // Simulasi API Call
    setTimeout(() => {
      setIsSaving(false);
      toast.success("Profil jurnalis berhasil diperbarui!");
      // Reset field password setelah sukses
      setPasswords({ oldPass: "", newPass: "", confirmPass: "" });
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
            <h2 className="text-xl font-bold text-[#1B1B1B]">
              Pengaturan Akun
            </h2>
            <p className="text-[11px] text-[#C4C4C4] font-semibold uppercase tracking-wider">
              Kelola identitas publik dan keamanan akun Jurnalis Anda
            </p>
          </div>
        </header>

        <div className="p-8 max-w-[900px] mx-auto space-y-8 pb-24">
          <form onSubmit={handleSave}>
            {/* 1. Avatar & Informasi Dasar */}
            <motion.section
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#FFFFFF] rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8"
            >
              <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-100">
                <div className="w-10 h-10 rounded-xl bg-[#FCC200]/15 text-[#B48A00] flex items-center justify-center">
                  <User size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-[#1B1B1B]">
                    Informasi Profil
                  </h3>
                  <p className="text-xs text-[#C4C4C4]">
                    Data identitas yang akan tampil di artikel Anda
                  </p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-8 items-start">
                {/* Form Fields */}
                <div className="flex-1 w-full">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                    <InputField
                      icon={User}
                      label="Nama Lengkap / Nama Pena"
                      value={profile.name}
                      onChange={(e: any) =>
                        handleProfileChange("name", e.target.value)
                      }
                      placeholder="Masukkan nama lengkap"
                    />
                    <InputField
                      icon={Mail}
                      label="Alamat Email"
                      type="email"
                      value={profile.email}
                      onChange={(e: any) =>
                        handleProfileChange("email", e.target.value)
                      }
                      placeholder="contoh@email.com"
                    />
                  </div>

                  <InputField
                    label="Bio Jurnalis (Publik)"
                    type="textarea"
                    rows={3}
                    value={profile.bio}
                    onChange={(e: any) =>
                      handleProfileChange("bio", e.target.value)
                    }
                    placeholder="Ceritakan sedikit tentang diri Anda dan topik yang sering Anda tulis..."
                    description="Bio ini akan ditampilkan di halaman profil penulis pada setiap artikel Anda."
                  />

                  <InputField
                    label="Peran (Role)"
                    value={profile.role}
                    onChange={() => {}}
                    placeholder="Jurnalis"
                    disabled={true}
                  />
                </div>
              </div>
            </motion.section>

            {/* 2. Keamanan & Ganti Password */}
            <motion.section
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-[#FFFFFF] rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8 mt-6"
            >
              <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-100">
                <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
                  <Lock size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-[#1B1B1B]">
                    Keamanan Akun
                  </h3>
                  <p className="text-xs text-[#C4C4C4]">
                    Ubah password untuk menjaga keamanan akun Anda
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                <InputField
                  icon={Lock}
                  label="Password Lama"
                  type={showOldPass ? "text" : "password"}
                  value={passwords.oldPass}
                  onChange={(e: any) =>
                    handlePasswordChange("oldPass", e.target.value)
                  }
                  placeholder="Masukkan password saat ini"
                  rightIcon={showOldPass ? EyeOff : Eye}
                  onRightIconClick={() => setShowOldPass(!showOldPass)}
                />
                {/* Spacer untuk layout grid */}
                <div className="hidden md:block" />

                <InputField
                  icon={Lock}
                  label="Password Baru"
                  type={showNewPass ? "text" : "password"}
                  value={passwords.newPass}
                  onChange={(e: any) =>
                    handlePasswordChange("newPass", e.target.value)
                  }
                  placeholder="Minimal 8 karakter"
                  rightIcon={showNewPass ? EyeOff : Eye}
                  onRightIconClick={() => setShowNewPass(!showNewPass)}
                />
                <InputField
                  icon={Lock}
                  label="Konfirmasi Password Baru"
                  type={showConfirmPass ? "text" : "password"}
                  value={passwords.confirmPass}
                  onChange={(e: any) =>
                    handlePasswordChange("confirmPass", e.target.value)
                  }
                  placeholder="Ulangi password baru"
                  rightIcon={showConfirmPass ? EyeOff : Eye}
                  onRightIconClick={() => setShowConfirmPass(!showConfirmPass)}
                />
              </div>
            </motion.section>

            {/* 3. Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center justify-end gap-4 mt-8"
            >
              <button
                type="button"
                className="px-6 py-3 text-sm font-bold text-[#C4C4C4] hover:text-[#1B1B1B] bg-white border border-gray-200 rounded-xl transition-all hover:bg-gray-50"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="px-8 py-3 bg-[#233982] text-white text-sm font-bold rounded-xl flex items-center gap-2 hover:bg-[#4F619B] transition-all shadow-md shadow-[#233982]/20 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        repeat: Infinity,
                        duration: 1,
                        ease: "linear",
                      }}
                    >
                      <Lock size={16} />
                    </motion.div>
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    Simpan Perubahan
                  </>
                )}
              </button>
            </motion.div>
          </form>
        </div>
      </main>
    </div>
  );
}
