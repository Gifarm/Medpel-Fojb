import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    console.log("📊 Fetching dashboard data...");

    // 1. Ambil total Jurnalis
    const totalJurnalis = await prisma.user.count({
      where: { role: "JURNALIS" },
    });
    console.log("✅ Total Jurnalis:", totalJurnalis);

    // 2. Ambil total artikel yang Pending Review
    const pendingReview = await prisma.article.count({
      where: { status: "PENDING_REVIEW" },
    });
    console.log("✅ Pending Review:", pendingReview);

    // 3. Ambil total artikel yang Published
    const publishedArticles = await prisma.article.count({
      where: { status: "PUBLISHED" },
    });
    console.log("✅ Published Articles:", publishedArticles);

    // 4. Ambil daftar artikel terbaru yang Pending Review
    const recentPendingArticles = await prisma.article.findMany({
      where: { status: "PENDING_REVIEW" },
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        author: {
          select: { name: true, email: true },
        },
        category: {
          select: { name: true },
        },
      },
    });
    console.log("✅ Recent Pending Articles:", recentPendingArticles.length);

    // 5. Ambil data untuk Chart Status Artikel
    const draftCount = await prisma.article.count({
      where: { status: "DRAFT" },
    });

    const articleStatusData = [
      { name: "Published", value: publishedArticles, color: "#233982" },
      { name: "Pending", value: pendingReview, color: "#FCC200" },
      { name: "Draft", value: draftCount, color: "#C4C4C4" },
    ];

    return NextResponse.json({
      success: true,
      data: {
        stats: {
          totalJurnalis,
          pendingReview,
          publishedArticles,
          visitorToday: 0,
          securityAlerts: 0,
        },
        recentPendingArticles: recentPendingArticles.map((art) => ({
          id: art.id,
          title: art.title,
          author: art.author.name,
          date: new Date(art.createdAt).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
          }),
          category: art.category.name,
          priority: "Medium",
        })),
        articleStatusData,
      },
    });
  } catch (error) {
    console.error("❌ Dashboard Admin API Error:", error);

    // Log error detail untuk debugging
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }

    return NextResponse.json(
      {
        error: "Gagal mengambil data dashboard",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
