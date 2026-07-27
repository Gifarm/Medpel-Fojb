import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { email, code } = await req.json();

    const otpRecord = await prisma.otp.findFirst({
      where: { email, code },
      include: { user: true },
    });

    if (!otpRecord) {
      return NextResponse.json(
        { error: "Kode OTP tidak valid" },
        { status: 400 },
      );
    }

    if (otpRecord.expiresAt < new Date()) {
      return NextResponse.json(
        { error: "Kode OTP telah kedaluwarsa" },
        { status: 400 },
      );
    }

    // Verifikasi berhasil: Update user & hapus OTP
    await prisma.user.update({
      where: { id: otpRecord.userId },
      data: { isVerified: true },
    });

    await prisma.otp.delete({ where: { id: otpRecord.id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
