/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET: Ambil daftar user dengan filter
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const role = searchParams.get("role") || "All";
    const status = searchParams.get("status") || "All";

    const where: any = {};

    if (search && search.trim() !== "") {
      where.OR = [
        { name: { contains: search.trim() } },
        { email: { contains: search.trim() } },
      ];
    }

    if (role !== "All") {
      // Map frontend "User" ke schema "MEMBER"
      const dbRole = role === "User" ? "MEMBER" : role.toUpperCase();
      where.role = dbRole;
    }

    if (status === "Active") {
      where.isVerified = true;
      where.isSuspended = false;
    } else if (status === "Pending") {
      where.isVerified = false;
    } else if (status === "Suspended") {
      where.isSuspended = true;
    }

    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isVerified: true,
        isSuspended: true,
        createdAt: true,
        _count: {
          select: { articles: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Map data database ke format yang diharapkan frontend
    const formattedUsers = users.map((user) => {
      let displayStatus = "Active";
      if (user.isSuspended) displayStatus = "Suspended";
      else if (!user.isVerified) displayStatus = "Pending";

      let displayRole = user.role;
      if (user.role === "MEMBER") displayRole = "MEMBER";
      else if (user.role === "ADMIN") displayRole = "ADMIN";
      else if (user.role === "JURNALIS") displayRole = "JURNALIS";
      else if (user.role === "KOL") displayRole = "KOL";

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: displayRole,
        status: displayStatus,
        joinDate: new Date(user.createdAt).toLocaleDateString("id-ID", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
        articles: user._count.articles,
      };
    });

    return NextResponse.json({ success: true, data: formattedUsers });
  } catch (error) {
    console.error("GET Users Error:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data user" },
      { status: 500 },
    );
  }
}

// PATCH: Update role atau status user
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, role, status } = body;

    const updateData: any = {};

    if (role) {
      const dbRole = role === "User" ? "MEMBER" : role.toUpperCase();
      updateData.role = dbRole;
    }

    if (status) {
      if (status === "Active") {
        updateData.isVerified = true;
        updateData.isSuspended = false;
      } else if (status === "Pending") {
        updateData.isVerified = false;
        updateData.isSuspended = false;
      } else if (status === "Suspended") {
        updateData.isSuspended = true;
      }
    }

    await prisma.user.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      message: "User berhasil diperbarui",
    });
  } catch (error) {
    console.error("PATCH User Error:", error);
    return NextResponse.json(
      { error: "Gagal memperbarui user" },
      { status: 500 },
    );
  }
}

// ... (kode GET dan PATCH yang sudah ada tetap dipertahankan di atas) ...

import bcrypt from "bcryptjs"; // Pastikan sudah di-import di bagian atas file

// POST: Tambah User Baru
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password, role } = body;

    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { error: "Semua field wajib diisi" },
        { status: 400 },
      );
    }

    // Cek apakah email sudah terdaftar
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { error: "Email sudah terdaftar" },
        { status: 409 },
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Buat user baru (default isVerified: false agar statusnya "Pending" sampai diverifikasi, atau true jika ingin langsung Active)
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role as any, // MEMBER, JURNALIS, KOL, atau ADMIN
        isVerified: false, // Status akan terbaca sebagai "Pending" di frontend
        isSuspended: false,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isVerified: true,
        isSuspended: true,
        createdAt: true,
      },
    });

    // Format agar sesuai dengan struktur data di frontend
    let displayRole = newUser.role;
    if (newUser.role === "MEMBER") displayRole = "MEMBER";
    else if (newUser.role === "ADMIN") displayRole = "ADMIN";

    const formattedUser = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: displayRole,
      status: "Pending", // Karena isVerified = false
      joinDate: new Date(newUser.createdAt).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
      articles: 0,
    };

    return NextResponse.json({
      success: true,
      data: formattedUser,
      message: "User berhasil dibuat",
    });
  } catch (error) {
    console.error("POST User Error:", error);
    return NextResponse.json(
      { error: "Gagal menambahkan pengguna" },
      { status: 500 },
    );
  }
}
// ... (kode GET, POST, dan PATCH yang sudah ada tetap dipertahankan di atas) ...

// DELETE: Hapus user secara permanen
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "ID pengguna diperlukan" },
        { status: 400 },
      );
    }

    // Hapus user dari database
    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Pengguna berhasil dihapus",
    });
  } catch (error) {
    console.error("DELETE User Error:", error);
    return NextResponse.json(
      { error: "Gagal menghapus pengguna" },
      { status: 500 },
    );
  }
}
