/*eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET: Ambil semua tag
export async function GET() {
  try {
    const tags = await prisma.tag.findMany({
      include: {
        _count: {
          select: { articles: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const formatted = tags.map((t) => ({
      id: t.id,
      name: t.name,
      slug: t.slug,
      count: t._count.articles,
    }));

    return NextResponse.json({ success: true, data: formatted });
  } catch (error) {
    console.error("GET Tags Error:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data tag" },
      { status: 500 },
    );
  }
}

// POST: Tambah tag baru
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, slug } = body;

    const newTag = await prisma.tag.create({
      data: { name, slug },
    });

    return NextResponse.json({
      success: true,
      data: { id: newTag.id, name: newTag.name, slug: newTag.slug, count: 0 },
    });
  } catch (error: any) {
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Nama atau Slug tag sudah digunakan" },
        { status: 409 },
      );
    }
    console.error("POST Tag Error:", error);
    return NextResponse.json(
      { error: "Gagal menambahkan tag" },
      { status: 500 },
    );
  }
}

// PATCH: Update tag
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, name, slug } = body;

    const updated = await prisma.tag.update({
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
        { error: "Nama atau Slug tag sudah digunakan" },
        { status: 409 },
      );
    }
    console.error("PATCH Tag Error:", error);
    return NextResponse.json(
      { error: "Gagal memperbarui tag" },
      { status: 500 },
    );
  }
}

// DELETE: Hapus tag
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id)
      return NextResponse.json({ error: "ID diperlukan" }, { status: 400 });

    await prisma.tag.delete({ where: { id } });
    return NextResponse.json({
      success: true,
      message: "Tag berhasil dihapus",
    });
  } catch (error) {
    console.error("DELETE Tag Error:", error);
    return NextResponse.json({ error: "Gagal menghapus tag" }, { status: 500 });
  }
}
