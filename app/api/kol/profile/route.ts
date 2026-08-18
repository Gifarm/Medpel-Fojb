/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

// GET: Ambil data profil dan wallet KOL
export async function GET(request: NextRequest) {
  try {
    const userId = request.cookies.get("auth_token")?.value;
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        name: true,
        email: true,
        role: true,
        instagramUsername: true,
        tiktokUsername: true,
      },
    });

    if (!user)
      return NextResponse.json(
        { error: "User tidak ditemukan" },
        { status: 404 },
      );

    let wallet = await prisma.kOLWallet.findUnique({ where: { userId } });
    if (!wallet) {
      wallet = await prisma.kOLWallet.create({
        data: { userId, accountName: user.name, phoneNumber: "", balance: 0 },
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        profile: {
          name: user.name,
          email: user.email,
          role: user.role,
          instagramUsername: user.instagramUsername || "",
          tiktokUsername: user.tiktokUsername || "",
        },
        wallet: {
          accountName: wallet.accountName,
          phoneNumber: wallet.phoneNumber,
        },
      },
    });
  } catch (error) {
    console.error("GET KOL Profile Error:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data profil" },
      { status: 500 },
    );
  }
}

// PATCH: Update profil, password, sosmed, dan wallet DANA
export async function PATCH(request: NextRequest) {
  try {
    const userId = request.cookies.get("auth_token")?.value;
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const {
      name,
      email,
      oldPassword,
      newPassword,
      instagramUsername,
      tiktokUsername,
      danaName,
      danaPhone,
    } = body;

    const userUpdate: any = {};
    const walletUpdate: any = {};

    if (name && name.trim() !== "") userUpdate.name = name.trim();

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
      userUpdate.email = email.trim();
    }

    // BARU: Validasi & Update Username Sosmed (Wajib untuk KOL)
    if (instagramUsername !== undefined) {
      if (!instagramUsername.trim())
        return NextResponse.json(
          { error: "Username Instagram wajib diisi!" },
          { status: 400 },
        );
      userUpdate.instagramUsername = instagramUsername.trim().replace(/^@/, ""); // Hapus @ jika user mengetiknya
    }
    if (tiktokUsername !== undefined) {
      if (!tiktokUsername.trim())
        return NextResponse.json(
          { error: "Username TikTok wajib diisi!" },
          { status: 400 },
        );
      userUpdate.tiktokUsername = tiktokUsername.trim().replace(/^@/, "");
    }

    if (newPassword) {
      if (!oldPassword)
        return NextResponse.json(
          { error: "Password lama wajib diisi" },
          { status: 400 },
        );
      if (newPassword.length < 8)
        return NextResponse.json(
          { error: "Password baru minimal 8 karakter" },
          { status: 400 },
        );

      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user)
        return NextResponse.json(
          { error: "User tidak ditemukan" },
          { status: 404 },
        );

      const isValid = await bcrypt.compare(oldPassword, user.password);
      if (!isValid)
        return NextResponse.json(
          { error: "Password lama salah" },
          { status: 401 },
        );

      userUpdate.password = await bcrypt.hash(newPassword, 10);
    }

    if (danaName || danaPhone) {
      if (!danaName?.trim() || !danaPhone?.trim()) {
        return NextResponse.json(
          { error: "Nama dan Nomor DANA wajib diisi" },
          { status: 400 },
        );
      }
      walletUpdate.accountName = danaName.trim();
      walletUpdate.phoneNumber = danaPhone.trim();
    }

    if (
      Object.keys(userUpdate).length === 0 &&
      Object.keys(walletUpdate).length === 0
    ) {
      return NextResponse.json(
        { error: "Tidak ada data yang diubah" },
        { status: 400 },
      );
    }

    if (Object.keys(userUpdate).length > 0) {
      await prisma.user.update({ where: { id: userId }, data: userUpdate });
    }

    if (Object.keys(walletUpdate).length > 0) {
      await prisma.kOLWallet.upsert({
        where: { userId },
        update: walletUpdate,
        create: {
          userId,
          accountName: walletUpdate.accountName,
          phoneNumber: walletUpdate.phoneNumber,
          balance: 0,
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: "Profil berhasil diperbarui",
    });
  } catch (error: any) {
    console.error("PATCH KOL Profile Error:", error);
    return NextResponse.json(
      { error: "Gagal memperbarui profil", details: error.message },
      { status: 500 },
    );
  }
}
