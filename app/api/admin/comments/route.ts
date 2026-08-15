/* eslint-disable @typescript-eslint/no-explicit-any*/
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { CommentStatus } from "@prisma/client";

// GET: Ambil daftar komentar dengan filter
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "All";

    const where: any = {};

    if (search) {
      where.OR = [
        { content: { contains: search } },
        { user: { name: { contains: search } } },
        { article: { title: { contains: search } } },
      ];
    }

    if (status !== "All") {
      where.status = status;
    }

    const comments = await prisma.comment.findMany({
      where,
      include: {
        user: {
          select: { name: true, role: true },
        },
        article: {
          select: { title: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Map data database ke format yang diharapkan frontend
    const formattedComments = comments.map((c) => {
      let displayRole = c.user.role;
      if (c.user.role === "MEMBER") displayRole = "MEMBER";

      return {
        id: c.id,
        user: c.user.name,
        userRole: displayRole,
        comment: c.content,
        articleTitle: c.article.title,
        date: new Date(c.createdAt).toLocaleString("id-ID", {
          day: "numeric",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
        status: c.status, // PENDING, APPROVED, REJECTED, HIDDEN
        reports: 0, // Bisa dikembangkan nanti dengan model Report terpisah
      };
    });

    return NextResponse.json({ success: true, data: formattedComments });
  } catch (error) {
    console.error("GET Comments Error:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data komentar" },
      { status: 500 },
    );
  }
}

// PATCH: Update status komentar (Approve, Hide, Reject)
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json(
        { error: "ID dan Status diperlukan" },
        { status: 400 },
      );
    }

    await prisma.comment.update({
      where: { id },
      data: { status: status as CommentStatus },
    });

    return NextResponse.json({
      success: true,
      message: "Status komentar berhasil diperbarui",
    });
  } catch (error) {
    console.error("PATCH Comment Error:", error);
    return NextResponse.json(
      { error: "Gagal memperbarui status komentar" },
      { status: 500 },
    );
  }
}
