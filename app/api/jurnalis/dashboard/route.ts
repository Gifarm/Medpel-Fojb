import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

export async function GET() {
  try {
    // 1. Ambil user ID dari cookie autentikasi
    const cookieStore = await cookies();
    const userId = cookieStore.get("auth_token")?.value;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Verifikasi user adalah Jurnalis (atau Admin yang sedang melihat)
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true, name: true },
    });

    if (!user || (user.role !== "JURNALIS" && user.role !== "ADMIN")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // 3. Ambil semua artikel milik user ini
    const articles = await prisma.article.findMany({
      where: { authorId: userId },
      select: {
        id: true,
        title: true,
        status: true,
        views: true,
        createdAt: true,
        category: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    // 4. Hitung Statistik
    const totalArticles = articles.length;
    const pendingReview = articles.filter(
      (a) => a.status === "PENDING_REVIEW",
    ).length;
    const published = articles.filter((a) => a.status === "PUBLISHED").length;
    const totalViews = articles.reduce((sum, a) => sum + a.views, 0);

    // Mapping status database ke format frontend
    const statusMap: Record<string, string> = {
      DRAFT: "Draft",
      PENDING_REVIEW: "Review",
      NEEDS_REVISION: "Revision",
      PUBLISHED: "Published",
      REJECTED: "Rejected",
    };

    // 5. Data Artikel Terbaru (Max 5)
    const recentArticles = articles.slice(0, 5).map((a) => ({
      id: a.id,
      title: a.title,
      category: a.category?.name || "Umum",
      status: statusMap[a.status] || "Draft",
      date: new Date(a.createdAt).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
      views: a.views,
    }));

    // 6. Data Notifikasi (Artikel yang perlu revisi atau baru diterbitkan)
    const notifications = articles
      .filter((a) => a.status === "NEEDS_REVISION" || a.status === "PUBLISHED")
      .slice(0, 5)
      .map((a) => ({
        id: a.id,
        type: a.status === "NEEDS_REVISION" ? "warning" : "success",
        title:
          a.status === "NEEDS_REVISION"
            ? "Perlu Revisi"
            : "Artikel Diterbitkan",
        message:
          a.status === "NEEDS_REVISION"
            ? "Admin meminta revisi pada artikel ini. Silakan periksa dan perbarui."
            : "Artikel Anda telah disetujui dan tayang di halaman utama.",
        date: new Date(a.createdAt).toLocaleDateString("id-ID", {
          day: "numeric",
          month: "short",
        }),
        article:
          a.title.length > 25 ? a.title.substring(0, 25) + "..." : a.title,
      }));

    // 7. Data Grafik Performa (Top 5 artikel berdasarkan views)
    const chartData = [...articles]
      .sort((a, b) => b.views - a.views)
      .slice(0, 5)
      .map((a, index) => ({
        name: a.title.length > 15 ? a.title.substring(0, 15) + "..." : a.title,
        views: a.views,
      }));

    return NextResponse.json({
      success: true,
      data: {
        stats: { totalArticles, pendingReview, published, totalViews },
        recentArticles,
        notifications,
        chartData:
          chartData.length > 0
            ? chartData
            : [{ name: "Belum ada data", views: 0 }],
      },
    });
  } catch (error) {
    console.error("Jurnalis Dashboard API Error:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data dashboard" },
      { status: 500 },
    );
  }
}
