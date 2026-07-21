"use client";

import {
  ChevronRight,
  ChevronDown,
  Bookmark,
  Share2,
  Users,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 pt-20 pb-10">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <h1 className="text-lg font-bold tracking-tight text-[#233982]">
                Med<span className="text-[#FCC200]">Pel</span>
              </h1>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed">
              Wadah aspirasi dan informasi terpercaya bagi seluruh pelajar di
              Indonesia untuk masa depan yang lebih cerah.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-gray-800 mb-6">Navigasi</h4>
            <ul className="space-y-4 text-sm text-gray-500">
              {[
                "Beranda",
                "Kategori",
                "Tag Populer",
                "Tentang Kami",
                "Kontak",
              ].map((item) => (
                <li
                  key={item}
                  className="hover:text-[#FCC200] cursor-pointer transition-colors"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-gray-800 mb-6">Sosial Media</h4>
            <ul className="space-y-4 text-sm text-gray-500">
              {["Instagram", "Tiktok", "Youtube", "Whatsapp"].map((item) => (
                <li
                  key={item}
                  className="hover:text-[#FCC200] cursor-pointer transition-colors"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-gray-800 mb-6">Newsletter</h4>
            <p className="text-xs text-gray-500 mb-4">
              Dapatkan update berita pilihan setiap pagi.
            </p>
            <div className="flex bg-gray-100 p-1 rounded-xl">
              <input
                type="text"
                placeholder="Email Anda"
                className="bg-transparent border-none outline-none text-xs px-3 w-full"
              />
              <button className="bg-[#FCC200] text-[#1B1B1B] p-2 rounded-lg hover:bg-[#FDCE33] transition-colors">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
        <div className="pt-10 border-t border-gray-50 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-400 font-medium">
            © 2026 MedPel Indonesia. All rights reserved.
          </p>
          <div className="flex gap-6 text-gray-400">
            <Share2
              size={18}
              className="hover:text-[#233982] cursor-pointer transition-colors"
            />
            <Users
              size={18}
              className="hover:text-[#233982] cursor-pointer transition-colors"
            />
          </div>
        </div>
      </div>
    </footer>
  );
}
