/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function PATCH(request: NextRequest) {
  try {
    // 1. Ambil user ID dari cookie
    const userId = request.cookies.get("auth_token")?.value;
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, email, oldPassword, newPassword } = body;

    const updateData: any = {};

    // 2. Update Nama
    if (name && name.trim() !== "") {
      updateData.name = name.trim();
    }

    // 3. Update Email (dengan validasi unik)
    if (email && email.trim() !== "") {
      const existingUser = await prisma.user.findUnique({
        where: { email: email.trim() },
      });
      if (existingUser && existingUser.id !== userId) {
        return NextResponse.json(
          { error: "Email sudah digunakan oleh akun lain" },
          { status: 409 },
        );
      }
      updateData.email = email.trim();
    }

    // 4. Update Password
    if (newPassword) {
      if (!oldPassword) {
        return NextResponse.json(
          { error: "Password lama wajib diisi untuk mengganti password" },
          { status: 400 },
        );
      }
      if (newPassword.length < 8) {
        return NextResponse.json(
          { error: "Password baru minimal 8 karakter" },
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

      const isValid = await bcrypt.compare(oldPassword, user.password);
      if (!isValid) {
        return NextResponse.json(
          { error: "Password lama yang Anda masukkan salah" },
          { status: 401 },
        );
      }

      updateData.password = await bcrypt.hash(newPassword, 10);
    }

    // 5. Cek apakah ada data yang benar-benar diubah
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: "Tidak ada data yang diubah" },
        { status: 400 },
      );
    }

    // 6. Simpan ke database
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
    console.error("PATCH Profile Error:", error);
    return NextResponse.json(
      { error: "Gagal memperbarui profil", details: error.message },
      { status: 500 },
    );
  }
}
