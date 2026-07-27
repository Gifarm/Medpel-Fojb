/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Users,
  TrendingUp,
  Target,
  Zap,
  Globe,
  MessageCircle,
  Award,
  BarChart3,
  Smartphone,
  CheckCircle2,
  ArrowRight,
  Mail,
} from "lucide-react";
import Navbar from "@/components/ui/navbar";
import Footer from "@/components/ui/footer";

// SVG Icons Components
const InstagramIcon = ({
  size = 20,
  className = "",
}: {
  size?: number;
  className?: string;
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const LinkedinIcon = ({
  size = 20,
  className = "",
}: {
  size?: number;
  className?: string;
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const App = () => {
  const stats = [
    {
      value: "212 Juta",
      label: "Pengguna Internet",
      sublabel: "Total pengguna internet Indonesia",
      icon: Globe,
      color: "from-blue-500 to-blue-600",
    },
    {
      value: "27,94%",
      label: "Gen Z Indonesia",
      sublabel: "Dari total populasi Indonesia",
      icon: Users,
      color: "from-yellow-500 to-orange-500",
    },
    {
      value: "72%+",
      label: "Pengaruh Beli",
      sublabel: "Gen Z pengaruhi keputusan beli keluarga",
      icon: TrendingUp,
      color: "from-purple-500 to-purple-600",
    },
    {
      value: "70-98%",
      label: "Open Rate WA",
      sublabel: "Open rate WhatsApp komunitas OSIS",
      icon: MessageCircle,
      color: "from-emerald-500 to-emerald-600",
    },
  ];

  const advantages = [
    {
      icon: Target,
      title: "Segmentasi Spesifik",
      desc: "Segmentasi yang tidak bisa dilakukan Meta Ads atau TikTok Ads — kami dapat menarget pelajar per kota/wilayah secara spesifik.",
    },
    {
      icon: Zap,
      title: "Open Rate Tinggi",
      desc: "WhatsApp Group OSIS memiliki open rate 70-98%, tidak terpengaruh algoritma platform mana pun.",
    },
    {
      icon: Award,
      title: "Dual Channel",
      desc: "Exposure di media informatif DAN komunitas peer-to-peer dalam satu pembelian.",
    },
    {
      icon: CheckCircle2,
      title: "Konten Terpercaya",
      desc: "Konten dari akun OSIS dipercaya pelajar seperti rekomendasi teman, bukan iklan biasa.",
    },
    {
      icon: BarChart3,
      title: "Jaringan Luas",
      desc: "Satu pintu untuk seluruh jaringan pelajar Jawa Barat di 27 Kab/Kota.",
    },
  ];

  const channels = [
    {
      icon: Smartphone,
      name: "Media Channel",
      handle: "@medpel.id",
      desc: "Akun media informasi pelajar. Konten lifestyle, edukasi, dan event. Ideal untuk brand awareness.",
      color: "bg-[#233982]",
    },
    {
      icon: Users,
      name: "Community Channel",
      handle: "@forumosisjabar.id",
      desc: "Akun komunitas OSIS dengan trust peer-to-peer tinggi. Ideal untuk kampanye yang membutuhkan kepercayaan komunitas.",
      color: "bg-[#1e3a8a]",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFFEF5] via-[#FFFFFF] to-[#F0F4FF] font-sans text-gray-900 selection:bg-yellow-100">
      {/* Background Ornaments */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-[#FCC200]/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-[#4F619B]/5 rounded-full blur-[100px]" />
      </div>

      <Navbar />

      <main className="relative z-10 pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12 sm:mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#FCC200]/10 rounded-full mb-4">
              <Award className="text-[#FCC200]" size={18} />
              <span className="text-xs font-bold text-[#233982] uppercase tracking-wider">
                Tentang Kami
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#233982] mb-4 leading-tight">
              Media Pelajar <span className="text-[#FCC200]">Network</span>
            </h1>
            <p className="text-lg sm:text-xl font-bold text-gray-700 mb-4">
              Student Advertising Network terbesar di Jawa Barat
            </p>
            <p className="text-sm sm:text-base text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Media Pelajar Network adalah Student Advertising Network —
              jaringan media dan komunitas pelajar yang terhubung melalui Forum
              OSIS Jawa Barat. Kami menyediakan akses langsung ke pasar pelajar
              di 27 Kab/Kota Jawa Barat melalui dua tipe channel.
            </p>
          </motion.div>

          {/* Channels Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-16"
          >
            {channels.map((channel, index) => (
              <div
                key={index}
                className={`${channel.color} rounded-3xl p-6 sm:p-8 text-white shadow-xl hover:shadow-2xl transition-shadow duration-300`}
              >
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center flex-shrink-0">
                    <channel.icon size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold mb-1">
                      {channel.name}
                    </h3>
                    <p className="text-white/80 font-bold text-sm">
                      {channel.handle}
                    </p>
                  </div>
                </div>
                <p className="text-white/90 text-sm sm:text-base leading-relaxed">
                  {channel.desc}
                </p>
              </div>
            ))}
          </motion.div>

          {/* Advantages Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-16"
          >
            <div className="flex items-center gap-3 mb-8">
              <h2 className="text-2xl sm:text-3xl font-black text-[#233982]">
                Keunggulan Utama
              </h2>
            </div>

            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-lg border border-gray-100">
              <ul className="space-y-4">
                {advantages.map((adv, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-[#FCC200]/20 to-[#FCC200]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <adv.icon className="text-[#233982]" size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#233982] mb-1">
                        {adv.title}
                      </h4>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {adv.desc}
                      </p>
                    </div>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Why Student Market Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mb-16"
          >
            <div className="flex items-center gap-3 mb-8">
              <h2 className="text-2xl sm:text-3xl font-black text-[#233982]">
                Pasar Pelajar?
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-3xl p-6 sm:p-8 text-center shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300 group"
                >
                  <div
                    className={`w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center group-hover:scale-110 transition-transform`}
                  >
                    <stat.icon className="text-white" size={28} />
                  </div>
                  <div
                    className={`text-3xl sm:text-4xl font-black bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-2`}
                  >
                    {stat.value}
                  </div>
                  <h3 className="font-bold text-[#233982] mb-1">
                    {stat.label}
                  </h3>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    {stat.sublabel}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default App;
