/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    // 1. Ambil user ID dari cookie (gunakan request.cookies, bukan cookies() dari next/headers)
    const userId = request.cookies.get("auth_token")?.value;

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized - Silakan login" },
        { status: 401 },
      );
    }

    // 2. Verifikasi user
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true, name: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User tidak ditemukan" },
        { status: 404 },
      );
    }

    if (user.role !== "JURNALIS" && user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Hanya Jurnalis yang bisa membuat artikel" },
        { status: 403 },
      );
    }

    const body = await request.json();
    console.log(" Received article data:", {
      title: body.title,
      category: body.categoryId,
      tags: body.tagNames,
      status: body.status,
    });

    const {
      title,
      content,
      excerpt,
      categoryId,
      tagNames,
      coverImage,
      status,
    } = body;

    if (!title || !content || !categoryId) {
      return NextResponse.json(
        {
          error: "Judul, isi artikel, dan kategori wajib diisi",
          received: {
            title: !!title,
            content: !!content,
            categoryId: !!categoryId,
          },
        },
        { status: 400 },
      );
    }

    // 3. Generate slug
    const slug =
      title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "") +
      "-" +
      Date.now().toString(36);

    // 4. Pastikan kategori ada
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      return NextResponse.json(
        { error: "Kategori tidak valid" },
        { status: 400 },
      );
    }

    // 5. Siapkan tag operations
    const tagOperations = (tagNames || []).map((name: string) => {
      const tagSlug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      return {
        where: { slug: tagSlug },
        create: { name, slug: tagSlug },
      };
    });

    // 6. Simpan artikel
    const article = await prisma.article.create({
      data: {
        title,
        slug,
        content,
        excerpt:
          excerpt ||
          content.replace(/<[^>]*>/g, "").substring(0, 150) +
            (content.length > 150 ? "..." : ""),
        coverImage: coverImage || null,
        status: status === "Draft" ? "DRAFT" : "PENDING_REVIEW",
        authorId: userId,
        categoryId,
        tags: {
          connectOrCreate: tagOperations,
        },
      },
      include: {
        author: { select: { name: true } },
        category: { select: { name: true } },
        tags: true,
      },
    });

    console.log("✅ Article created:", article.id);

    return NextResponse.json({
      success: true,
      data: article,
      message: "Artikel berhasil disimpan",
    });
  } catch (error: any) {
    console.error("❌ Create Article Error:", error);
    console.error("Error details:", {
      message: error.message,
      code: error.code,
      meta: error.meta,
    });

    return NextResponse.json(
      {
        error: "Gagal membuat artikel",
        details: error.message,
      },
      { status: 500 },
    );
  }
}
