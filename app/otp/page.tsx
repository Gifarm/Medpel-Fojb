import { Suspense } from "react";
import OtpVerificationContent from "./OtpVerificationContent";

export default function OtpPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-[#FFFEF5] via-[#FFFFFF] to-[#F0F4FF] flex items-center justify-center p-4">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-[#FCC200] border-t-transparent rounded-full animate-spin" />
            <p className="text-[#233982] font-bold animate-pulse">
              Memuat halaman verifikasi...
            </p>
          </div>
        </div>
      }
    >
      <OtpVerificationContent />
    </Suspense>
  );
}
