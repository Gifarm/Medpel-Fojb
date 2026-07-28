import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Email tidak valid"),
  password: z.string().min(1, "Password wajib diisi"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validated = loginSchema.parse(body);

    // 1. Cek apakah user ada di database
    const user = await prisma.user.findUnique({
      where: { email: validated.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Email tidak terdaftar" },
        { status: 401 },
      );
    }

    // 2. Cek apakah password cocok
    const isPasswordValid = await bcrypt.compare(
      validated.password,
      user.password,
    );

    if (!isPasswordValid) {
      return NextResponse.json({ error: "Password salah" }, { status: 401 });
    }

    // 3. Cek apakah email sudah terverifikasi
    if (!user.isVerified) {
      return NextResponse.json(
        {
          error:
            "Email belum terverifikasi. Silakan verifikasi OTP terlebih dahulu.",
          needVerification: true,
          email: user.email,
        },
        { status: 403 },
      );
    }

    // 4. Login berhasil - return data user (tanpa password)
    return NextResponse.json({
      success: true,
      message: "Login berhasil",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
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
