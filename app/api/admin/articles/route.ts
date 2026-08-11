/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET: Ambil daftar artikel dengan filter
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "All";

    const where: any = {};

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { author: { name: { contains: search, mode: "insensitive" } } },
      ];
    }

    if (status !== "All") {
      // Map status frontend ke enum database
      const statusMap: Record<string, string> = {
        Pending: "PENDING_REVIEW",
        "Needs Revision": "NEEDS_REVISION",
        Approved: "PUBLISHED",
        Rejected: "REJECTED",
      };
      where.status = statusMap[status] || status;
    }

    const articles = await prisma.article.findMany({
      where,
      select: {
        id: true,
        title: true,
        excerpt: true,
        content: true,
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
    });

    // Map status database ke format frontend
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

    return NextResponse.json({ success: true, data: formattedArticles });
  } catch (error) {
    console.error("GET Articles Error:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data artikel" },
      { status: 500 },
    );
  }
}

// PATCH: Update status artikel (Approve, Reject, Revisi)
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, status, revisionNote } = body;

    // Map status frontend ke enum database
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

    await prisma.article.update({
      where: { id },
      data: { status: dbStatus as any },
    });

    // TODO: Jika status "Needs Revision", kirim notifikasi ke jurnalis
    // if (status === "Needs Revision" && revisionNote) {
    //   await prisma.notification.create({
    //     data: {
    //       userId: article.authorId,
    //       type: "revision",
    //       message: revisionNote,
    //       articleId: id,
    //     },
    //   });
    // }

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
