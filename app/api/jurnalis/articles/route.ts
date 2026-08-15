/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

// ==========================================
// GET: Ambil daftar artikel (dengan Pagination) ATAU detail 1 artikel
export async function GET(request: NextRequest) {
  try {
    const userId = request.cookies.get("auth_token")?.value;
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    // 1. Jika ada ID, ambil detail satu artikel untuk mode Edit atau Preview
    if (id) {
      const article = await prisma.article.findUnique({
        where: { id, authorId: userId },
        include: {
          category: { select: { id: true, name: true } },
          tags: { select: { name: true } },
        },
      });

      if (!article) {
        return NextResponse.json(
          { error: "Artikel tidak ditemukan" },
          { status: 404 },
        );
      }

      return NextResponse.json({
        success: true,
        data: {
          id: article.id,
          title: article.title,
          content: article.content,
          categoryId: article.categoryId,
          categoryName: article.category.name,
          tags: article.tags.map((t) => t.name),
          coverImage: article.coverImage,
          status: article.status,
        },
      });
    }

    // 2. Ambil daftar artikel dengan Pagination, Search, dan Filter
    const status = searchParams.get("status");
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const where: any = { authorId: userId };

    if (status && status !== "All") {
      const statusMap: Record<string, string> = {
        Published: "PUBLISHED",
        Review: "PENDING_REVIEW",
        Revision: "NEEDS_REVISION",
        Draft: "DRAFT",
        Rejected: "REJECTED",
      };
      if (statusMap[status]) where.status = statusMap[status];
    }

    // PERBAIKAN: Hapus mode: "insensitive" untuk MySQL
    if (search && search.trim() !== "") {
      where.title = {
        contains: search.trim(),
        // Hapus baris berikut untuk MySQL:
        // mode: "insensitive"
      };
    }

    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        where,
        select: {
          id: true,
          title: true,
          status: true,
          views: true,
          updatedAt: true,
          category: { select: { name: true } },
        },
        orderBy: { updatedAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.article.count({ where }),
    ]);

    // PERBAIKAN: Mapping status yang benar
    const statusMapOutput: Record<string, string> = {
      DRAFT: "Draft",
      PENDING_REVIEW: "Review",
      NEEDS_REVISION: "Revision",
      PUBLISHED: "Published",
      REJECTED: "Rejected",
    };

    const formattedArticles = articles.map((a) => ({
      id: a.id,
      title: a.title,
      category: a.category?.name || "Umum",
      status: statusMapOutput[a.status] || "Draft",
      date: new Date(a.updatedAt).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
      views: a.views,
    }));

    return NextResponse.json({
      success: true,
      data: formattedArticles,
      pagination: {
        total,
        page,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("GET Articles Error:", error);
    return NextResponse.json(
      {
        error: "Gagal mengambil data artikel",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

// ==========================================
// POST: Buat artikel baru
// ==========================================
export async function POST(request: NextRequest) {
  try {
    const userId = request.cookies.get("auth_token")?.value;
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });
    if (!user || (user.role !== "JURNALIS" && user.role !== "ADMIN")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
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
        { error: "Judul, isi artikel, dan kategori wajib diisi" },
        { status: 400 },
      );
    }

    const slug =
      title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "") +
      "-" +
      Date.now().toString(36);

    const tagOperations = (tagNames || []).map((name: string) => {
      const tagSlug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      return { where: { slug: tagSlug }, create: { name, slug: tagSlug } };
    });

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
        status:
          status === "DRAFT" || status === "DRAFT" ? "DRAFT" : "PENDING_REVIEW",
        authorId: userId,
        categoryId,
        tags: { connectOrCreate: tagOperations },
      },
    });

    return NextResponse.json({ success: true, data: article });
  } catch (error: any) {
    console.error("POST Article Error:", error);
    return NextResponse.json(
      { error: "Gagal membuat artikel", details: error.message },
      { status: 500 },
    );
  }
}

// ==========================================
// PUT: Update artikel yang sudah ada (Mode Edit)
// ==========================================
export async function PUT(request: NextRequest) {
  try {
    const userId = request.cookies.get("auth_token")?.value;
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id)
      return NextResponse.json(
        { error: "ID artikel diperlukan" },
        { status: 400 },
      );

    // Verifikasi kepemilikan
    const existingArticle = await prisma.article.findUnique({
      where: { id },
      select: { authorId: true, status: true },
    });

    if (!existingArticle || existingArticle.authorId !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
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
        { error: "Judul, isi artikel, dan kategori wajib diisi" },
        { status: 400 },
      );
    }

    // Update slug jika judul berubah
    const slug =
      title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "") +
      "-" +
      Date.now().toString(36);

    const tagOperations = (tagNames || []).map((name: string) => {
      const tagSlug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      return { where: { slug: tagSlug }, create: { name, slug: tagSlug } };
    });

    const updatedArticle = await prisma.article.update({
      where: { id },
      data: {
        title,
        slug,
        content,
        excerpt:
          excerpt ||
          content.replace(/<[^>]*>/g, "").substring(0, 150) +
            (content.length > 150 ? "..." : ""),
        coverImage: coverImage || null,
        // Jika sedang edit, pertahankan statusnya kecuali user secara eksplisit mengubahnya
        status: status
          ? status === "DRAFT" || status === "DRAFT"
            ? "DRAFT"
            : "PENDING_REVIEW"
          : existingArticle.status,
        categoryId,
        tags: { set: [], connectOrCreate: tagOperations }, // Reset tags lama, hubungkan yang baru
      },
    });

    return NextResponse.json({ success: true, data: updatedArticle });
  } catch (error: any) {
    console.error("PUT Article Error:", error);
    return NextResponse.json(
      { error: "Gagal memperbarui artikel", details: error.message },
      { status: 500 },
    );
  }
}

// ==========================================
// DELETE: Hapus artikel (Hanya Draft atau Rejected)
// ==========================================
export async function DELETE(request: NextRequest) {
  try {
    const userId = request.cookies.get("auth_token")?.value;
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id)
      return NextResponse.json(
        { error: "ID artikel diperlukan" },
        { status: 400 },
      );

    const article = await prisma.article.findUnique({
      where: { id },
      select: { authorId: true, status: true },
    });
    if (!article || article.authorId !== userId)
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    if (article.status !== "DRAFT" && article.status !== "REJECTED") {
      return NextResponse.json(
        { error: "Hanya artikel Draft atau Ditolak yang dapat dihapus" },
        { status: 400 },
      );
    }

    await prisma.article.delete({ where: { id } });
    return NextResponse.json({
      success: true,
      message: "Artikel berhasil dihapus",
    });
  } catch (error) {
    console.error("DELETE Article Error:", error);
    return NextResponse.json(
      { error: "Gagal menghapus artikel" },
      { status: 500 },
    );
  }
}
