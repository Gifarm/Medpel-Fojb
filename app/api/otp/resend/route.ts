import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendOtpEmail } from "@/lib/mailer";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email wajib diisi" }, { status: 400 });
    }

    // Cek apakah user ada
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json(
        { error: "User tidak ditemukan" },
        { status: 404 },
      );
    }

    // Hapus OTP lama (jika ada) agar tidak menumpuk
    await prisma.otp.deleteMany({ where: { email } });

    // Generate OTP 4 digit baru
    const otpCode = Math.floor(1000 + Math.random() * 9000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 menit

    // Simpan OTP baru ke database
    await prisma.otp.create({
      data: {
        email: user.email,
        code: otpCode,
        expiresAt,
        userId: user.id,
      },
    });

    // Kirim email ulang - wrap dengan try-catch karena return void
    try {
      await sendOtpEmail(user.email, otpCode);
    } catch (emailError) {
      console.error("Failed to send email:", emailError);
      return NextResponse.json(
        { error: "Gagal mengirim email" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "OTP baru telah dikirim ke email Anda",
      email: user.email,
    });
  } catch (error) {
    console.error("Resend OTP error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan pada server" },
      { status: 500 },
    );
  }
}
