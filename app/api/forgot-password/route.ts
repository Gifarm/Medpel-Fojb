import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { sendResetPasswordEmail } from "@/lib/mailer";

const forgotPasswordSchema = z.object({
  email: z.string().email("Format email tidak valid"),
});

// Helper untuk generate password acak (10 karakter alfanumerik)
const generateRandomPassword = () => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let password = "";
  for (let i = 0; i < 10; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validated = forgotPasswordSchema.parse(body);

    const user = await prisma.user.findUnique({
      where: { email: validated.email },
    });

    // 🔒 SECURITY BEST PRACTICE:
    // Selalu return pesan sukses yang sama, meski email tidak terdaftar.
    // Ini mencegah peretas melakukan "Email Enumeration" (menebak email mana yang ada di database).
    if (user) {
      const newPassword = generateRandomPassword();
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Update password di database
      await prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword },
      });

      // Kirim email berisi password baru
      await sendResetPasswordEmail(user.email, newPassword);
    }

    return NextResponse.json({
      success: true,
      message:
        "Jika email terdaftar, kami telah mengirimkan password baru ke email Anda.",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
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
