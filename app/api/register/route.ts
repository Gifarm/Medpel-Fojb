import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { sendOtpEmail } from "@/lib/mailer";

const registerSchema = z.object({
  name: z.string().min(3, "Nama minimal 3 karakter"),
  email: z.string().email("Email tidak valid"),
  password: z.string().min(8, "Password minimal 8 karakter"),
  role: z.enum(["MEMBER", "JURNALIS", "KOL"]),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validated = registerSchema.parse(body);

    const existingUser = await prisma.user.findUnique({
      where: { email: validated.email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email sudah terdaftar" },
        { status: 400 },
      );
    }

    const hashedPassword = await bcrypt.hash(validated.password, 10);

    // 🔥 UBAH DI SINI: Generate OTP 4 digit (1000 - 9999)
    const otpCode = Math.floor(1000 + Math.random() * 9000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 menit

    const user = await prisma.user.create({
      data: {
        name: validated.name,
        email: validated.email,
        password: hashedPassword,
        role: validated.role,
        isVerified: false,
      },
    });

    await prisma.otp.create({
      data: {
        email: user.email,
        code: otpCode,
        expiresAt,
        userId: user.id,
      },
    });

    await sendOtpEmail(user.email, otpCode);

    console.log("\n========================================");
    console.log("📧 OTP UNTUK:", user.email);
    console.log("🔢 Kode OTP (4 Digit):", otpCode);
    console.log("========================================\n");

    return NextResponse.json({
      success: true,
      email: user.email,
      message: "Registrasi berhasil. Silakan cek email Anda.",
    });
  } catch (error) {
    console.error("Register error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { error: "Terjadi kesalahan pada server" },
      { status: 500 },
    );
  }
}
