/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { userId, name, email, currentPassword, newPassword } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "User ID diperlukan" },
        { status: 400 },
      );
    }

    const updateData: any = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;

    // Jika ada permintaan ganti password
    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json(
          { error: "Password lama diperlukan untuk mengganti password" },
          { status: 400 },
        );
      }

      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user) {
        return NextResponse.json(
          { error: "User tidak ditemukan" },
          { status: 404 },
        );
      }

      // Verifikasi password lama
      const isValid = await bcrypt.compare(currentPassword, user.password);
      if (!isValid) {
        return NextResponse.json(
          { error: "Password lama yang Anda masukkan salah" },
          { status: 401 },
        );
      }

      // Hash password baru
      updateData.password = await bcrypt.hash(newPassword, 10);
    }

    // Update data di database
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    return NextResponse.json({ success: true, data: updatedUser });
  } catch (error: any) {
    // Handle error jika email sudah digunakan oleh user lain
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Email sudah digunakan oleh akun lain" },
        { status: 409 },
      );
    }

    console.error("PATCH Profile Error:", error);
    return NextResponse.json(
      { error: "Gagal memperbarui profil" },
      { status: 500 },
    );
  }
}
