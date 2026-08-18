/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Lock,
  Save,
  Smartphone,
  Eye,
  EyeOff,
  Loader2,
  Wallet,
  // Instagram,
  Video,
} from "lucide-react";
import SidebarKOL from "@/components/kol/SidebarKOL";
import toast from "react-hot-toast";

// --- Komponen Input Field Kustom ---
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

export default function PengaturanKOLPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [showOldPass, setShowOldPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    role: "KOL",
    instagramUsername: "",
    tiktokUsername: "",
  });

  const [danaWallet, setDanaWallet] = useState({
    accountName: "",
    phoneNumber: "",
  });

  const [passwords, setPasswords] = useState({
    oldPass: "",
    newPass: "",
    confirmPass: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/kol/profile");
        const result = await res.json();
        if (result.success) {
          setProfile({
            name: result.data.profile.name || "",
            email: result.data.profile.email || "",
            role: result.data.profile.role || "KOL",
            instagramUsername: result.data.profile.instagramUsername || "",
            tiktokUsername: result.data.profile.tiktokUsername || "",
          });
          setDanaWallet({
            accountName: result.data.wallet.accountName || "",
            phoneNumber: result.data.wallet.phoneNumber || "",
          });
        } else {
          toast.error(result.error || "Gagal memuat data profil");
        }
      } catch (error) {
        toast.error("Gagal memuat data profil");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleProfileChange = (field: string, val: string) => {
    setProfile({ ...profile, [field]: val });
  };

  const handleDanaChange = (field: string, val: string) => {
    setDanaWallet({ ...danaWallet, [field]: val });
  };

  const handlePasswordChange = (field: string, val: string) => {
    setPasswords({ ...passwords, [field]: val });
  };

  const handleSaveAll = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validasi Password
    if (passwords.newPass || passwords.confirmPass) {
      if (passwords.newPass !== passwords.confirmPass) {
        toast.error("Password baru dan konfirmasi password tidak cocok!");
        return;
      }
      if (passwords.newPass.length < 8) {
        toast.error("Password baru minimal 8 karakter!");
        return;
      }
      if (!passwords.oldPass) {
        toast.error("Password lama wajib diisi untuk mengganti password!");
        return;
      }
    }

    // Validasi DANA
    if (!danaWallet.accountName.trim() || !danaWallet.phoneNumber.trim()) {
      toast.error("Nama dan Nomor DANA wajib diisi!");
      return;
    }
    if (!/^\d{10,13}$/.test(danaWallet.phoneNumber.replace(/\D/g, ""))) {
      toast.error("Nomor HP DANA tidak valid (harus 10-13 digit angka)!");
      return;
    }

    // BARU: Validasi Username Sosmed (Wajib untuk KOL)
    if (!profile.instagramUsername.trim()) {
      toast.error("Username Instagram wajib diisi!");
      return;
    }
    if (!profile.tiktokUsername.trim()) {
      toast.error("Username TikTok wajib diisi!");
      return;
    }

    setIsSaving(true);

    try {
      const res = await fetch("/api/kol/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: profile.name,
          email: profile.email,
          instagramUsername: profile.instagramUsername,
          tiktokUsername: profile.tiktokUsername,
          oldPassword: passwords.oldPass,
          newPassword: passwords.newPass,
          danaName: danaWallet.accountName,
          danaPhone: danaWallet.phoneNumber,
        }),
      });

      const result = await res.json();
      if (result.success) {
        toast.success("Profil dan Akun DANA berhasil diperbarui!");
        setPasswords({ oldPass: "", newPass: "", confirmPass: "" });
      } else {
        toast.error(result.error || "Gagal memperbarui profil");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan pada server");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
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
        <header className="h-20 bg-[#FFFFFF]/80 backdrop-blur-md border-b border-gray-200/60 sticky top-0 z-30 px-8 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-[#1B1B1B]">
              Pengaturan Akun
            </h2>
            <p className="text-[11px] text-[#C4C4C4] font-semibold uppercase tracking-wider">
              Kelola identitas, akun DANA, dan sosial media Anda
            </p>
          </div>
        </header>

        <div className="p-8 max-w-[900px] mx-auto space-y-8 pb-24">
          <form onSubmit={handleSaveAll}>
            {/* 1. Informasi Profil Dasar & Sosmed */}
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
                    Informasi Profil & Sosial Media
                  </h3>
                  <p className="text-xs text-[#C4C4C4]">
                    Data identitas dan akun media sosial Anda (Wajib diisi)
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                <InputField
                  icon={User}
                  label="Nama Lengkap"
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

                {/* BARU: Input Instagram */}
                <InputField
                  // icon={Instagram}
                  label="Username Instagram"
                  value={profile.instagramUsername}
                  onChange={(e: any) =>
                    handleProfileChange("instagramUsername", e.target.value)
                  }
                  placeholder="contoh: @rinakartika (tanpa @)"
                />

                {/* BARU: Input TikTok */}
                <InputField
                  icon={Video}
                  label="Username TikTok"
                  value={profile.tiktokUsername}
                  onChange={(e: any) =>
                    handleProfileChange("tiktokUsername", e.target.value)
                  }
                  placeholder="contoh: @rinakartika (tanpa @)"
                />

                <InputField
                  icon={User}
                  label="Peran (Role)"
                  value={profile.role}
                  onChange={() => {}}
                  placeholder="KOL"
                  disabled={true}
                />
              </div>
            </motion.section>

            {/* 2. Akun DANA */}
            <motion.section
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-[#FFFFFF] rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8 mt-6"
            >
              <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-100">
                <div className="w-10 h-10 rounded-xl bg-[#233982]/10 text-[#233982] flex items-center justify-center">
                  <Wallet size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-[#1B1B1B]">
                    Akun DANA
                  </h3>
                  <p className="text-xs text-[#C4C4C4]">
                    Pastikan data ini benar agar Admin dapat mencairkan reward
                    Anda
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                <InputField
                  icon={User}
                  label="Nama Pemilik DANA"
                  value={danaWallet.accountName}
                  onChange={(e: any) =>
                    handleDanaChange("accountName", e.target.value)
                  }
                  placeholder="Sesuai dengan nama di aplikasi DANA"
                />
                <InputField
                  icon={Smartphone}
                  label="Nomor HP DANA"
                  type="tel"
                  value={danaWallet.phoneNumber}
                  onChange={(e: any) =>
                    handleDanaChange("phoneNumber", e.target.value)
                  }
                  placeholder="Contoh: 081234567890"
                />
              </div>
            </motion.section>

            {/* 3. Keamanan & Ganti Password */}
            <motion.section
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
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

            {/* 4. Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-center justify-end gap-4 mt-8"
            >
              <button
                type="button"
                onClick={() =>
                  setPasswords({ oldPass: "", newPass: "", confirmPass: "" })
                }
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
                    <Loader2 className="animate-spin" size={16} /> Menyimpan...
                  </>
                ) : (
                  <>
                    <Save size={16} /> Simpan Perubahan
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
