/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET: Ambil semua kategori
export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { articles: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const formatted = categories.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      count: c._count.articles,
    }));

    return NextResponse.json({ success: true, data: formatted });
  } catch (error) {
    console.error("GET Categories Error:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data kategori" },
      { status: 500 },
    );
  }
}

// POST: Tambah kategori baru
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, slug } = body;

    const newCategory = await prisma.category.create({
      data: { name, slug },
    });

    return NextResponse.json({
      success: true,
      data: {
        id: newCategory.id,
        name: newCategory.name,
        slug: newCategory.slug,
        count: 0,
      },
    });
  } catch (error: any) {
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Nama atau Slug kategori sudah digunakan" },
        { status: 409 },
      );
    }
    console.error("POST Category Error:", error);
    return NextResponse.json(
      { error: "Gagal menambahkan kategori" },
      { status: 500 },
    );
  }
}

// PATCH: Update kategori
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, name, slug } = body;

    const updated = await prisma.category.update({
      where: { id },
      data: { name, slug },
    });

    return NextResponse.json({
      success: true,
      data: { id: updated.id, name: updated.name, slug: updated.slug },
    });
  } catch (error: any) {
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Nama atau Slug kategori sudah digunakan" },
        { status: 409 },
      );
    }
    console.error("PATCH Category Error:", error);
    return NextResponse.json(
      { error: "Gagal memperbarui kategori" },
      { status: 500 },
    );
  }
}

// DELETE: Hapus kategori
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id)
      return NextResponse.json({ error: "ID diperlukan" }, { status: 400 });

    await prisma.category.delete({ where: { id } });
    return NextResponse.json({
      success: true,
      message: "Kategori berhasil dihapus",
    });
  } catch (error) {
    console.error("DELETE Category Error:", error);
    return NextResponse.json(
      { error: "Gagal menghapus kategori" },
      { status: 500 },
    );
  }
}
