/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

// GET: Ambil daftar artikel dengan filter, search, dan pagination
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "All";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const where: any = {};

    // PERBAIKAN 1: Hapus mode: "insensitive" untuk MySQL
    if (search && search.trim() !== "") {
      where.OR = [
        { title: { contains: search.trim() } },
        { author: { name: { contains: search.trim() } } },
      ];
    }

    if (status !== "All") {
      const statusMap: Record<string, string> = {
        Pending: "PENDING_REVIEW",
        "Needs Revision": "NEEDS_REVISION",
        Approved: "PUBLISHED",
        Rejected: "REJECTED",
        Draft: "DRAFT",
      };
      where.status = statusMap[status] || status;
    }

    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        where,
        select: {
          id: true,
          title: true,
          excerpt: true,
          content: true,
          coverImage: true, // PERBAIKAN 2: Tambahkan coverImage
          status: true,
          createdAt: true,
          author: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
          category: {
            select: {
              name: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.article.count({ where }),
    ]);

    const statusMap: Record<string, string> = {
      DRAFT: "Draft",
      PENDING_REVIEW: "Pending",
      NEEDS_REVISION: "Needs Revision",
      PUBLISHED: "Approved",
      REJECTED: "Rejected",
    };

    const formattedArticles = articles.map((article) => ({
      id: article.id,
      title: article.title,
      excerpt: article.excerpt || "",
      content: article.content,
      coverImage: article.coverImage || null, // PERBAIKAN 3: Return coverImage
      author: article.author.name,
      authorRole:
        article.author.role === "JURNALIS" ? "Jurnalis" : article.author.role,
      authorId: article.author.id,
      date: new Date(article.createdAt).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
      category: article.category?.name || "Uncategorized",
      status: statusMap[article.status] || article.status,
    }));

    return NextResponse.json({
      success: true,
      data: formattedArticles,
      pagination: {
        total,
        page,
        limit,
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
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, status, revisionNote } = body;

    const statusMap: Record<string, string> = {
      Pending: "PENDING_REVIEW",
      "Needs Revision": "NEEDS_REVISION",
      Approved: "PUBLISHED",
      Rejected: "REJECTED",
    };

    const dbStatus = statusMap[status];
    if (!dbStatus) {
      return NextResponse.json(
        { error: "Status tidak valid" },
        { status: 400 },
      );
    }

    // 1. Ambil data artikel untuk mendapatkan authorId dan judul
    const article = await prisma.article.findUnique({
      where: { id },
      select: { authorId: true, title: true },
    });

    if (!article) {
      return NextResponse.json(
        { error: "Artikel tidak ditemukan" },
        { status: 404 },
      );
    }

    // 2. Update status artikel
    await prisma.article.update({
      where: { id },
      data: { status: dbStatus as any },
    });

    // 3. Buat Notifikasi untuk Jurnalis (jika status berubah ke Publish, Reject, atau Revisi)
    let notifType = "";
    let notifTitle = "";
    let notifMessage = "";

    if (dbStatus === "PUBLISHED") {
      notifType = "success";
      notifTitle = "Artikel Disetujui & Diterbitkan";
      notifMessage = `Selamat! Artikel "${article.title}" telah disetujui dan tayang di Media Pelajar.`;
    } else if (dbStatus === "REJECTED") {
      notifType = "revision";
      notifTitle = "Artikel Ditolak";
      notifMessage = `Maaf, artikel "${article.title}" ditolak oleh admin. Silakan perbaiki dan kirim ulang.`;
    } else if (dbStatus === "NEEDS_REVISION") {
      notifType = "revision";
      notifTitle = "Perlu Tindakan: Revisi";
      notifMessage =
        revisionNote ||
        `Admin meminta revisi pada artikel "${article.title}". Silakan cek dan perbaiki.`;
    }

    if (notifType) {
      await prisma.notification.create({
        data: {
          userId: article.authorId,
          articleId: id,
          type: notifType,
          title: notifTitle,
          message: notifMessage,
          isRead: false,
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: "Status artikel berhasil diperbarui",
    });
  } catch (error) {
    console.error("PATCH Article Error:", error);
    return NextResponse.json(
      { error: "Gagal memperbarui status artikel" },
      { status: 500 },
    );
  }
}
