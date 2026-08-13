import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // 1. Stats Dasar
    const totalUsers = await prisma.user.count();
    const totalComments = await prisma.comment.count();
    const publishedArticles = await prisma.article.count({
      where: { status: "PUBLISHED" },
    });

    const articlesWithViews = await prisma.article.findMany({
      where: { status: "PUBLISHED" },
      select: { views: true },
    });
    const totalViews = articlesWithViews.reduce(
      (sum, article) => sum + article.views,
      0,
    );

    // 2. Top 5 Artikel Terpopuler
    const topArticles = await prisma.article.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { views: "desc" },
      take: 5,
      select: { title: true, views: true },
    });
    const topArticlesData = topArticles.map((a) => ({
      name: a.title.length > 25 ? a.title.substring(0, 25) + "..." : a.title,
      views: a.views,
    }));

    // 3. Top 5 Kategori Teraktif
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { articles: true },
        },
      },
      orderBy: {
        articles: {
          _count: "desc",
        },
      },
      take: 5,
    });
    const maxCatCount =
      categories.length > 0 ? categories[0]._count.articles : 1;
    const topCategories = categories.map((c) => ({
      name: c.name,
      count: c._count.articles,
      percentage: Math.round((c._count.articles / maxCatCount) * 100),
    }));

    // 4. Top 5 Jurnalis
    const jurnalisUsers = await prisma.user.findMany({
      where: { role: "JURNALIS" },
      include: {
        _count: {
          select: { articles: true },
        },
        articles: {
          where: { status: "PUBLISHED" },
          select: { views: true },
        },
      },
      orderBy: {
        articles: {
          _count: "desc",
        },
      },
      take: 5,
    });

    const topJurnalis = jurnalisUsers.map((u, index) => {
      const totalViews = u.articles.reduce((sum, a) => sum + a.views, 0);
      return {
        name: u.name,
        articles: u._count.articles,
        views: totalViews,
        rank: index + 1,
      };
    });

    // Catatan: Data pertumbuhan (growth) dan perangkat (device) memerlukan tabel analytics khusus.
    // Untuk saat ini, kita kembalikan data mock yang realistis agar grafik tetap tampil indah.
    const growthData = [
      { month: "Jan", articles: 45, users: 120 },
      { month: "Feb", articles: 52, users: 145 },
      { month: "Mar", articles: 61, users: 180 },
      { month: "Apr", articles: 58, users: 210 },
      { month: "Mei", articles: 75, users: 260 },
      { month: "Jun", articles: 89, users: 310 },
    ];

    const deviceData = [
      { name: "Mobile", value: 65, color: "#233982" },
      { name: "Desktop", value: 25, color: "#FCC200" },
      { name: "Tablet", value: 10, color: "#C4C4C4" },
    ];

    return NextResponse.json({
      success: true,
      data: {
        stats: {
          totalViews,
          publishedArticles,
          totalUsers,
          totalComments,
        },
        growthData,
        deviceData,
        topArticlesData,
        topCategories,
        topJurnalis,
      },
    });
  } catch (error) {
    console.error("GET Statistics Error:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data statistik" },
      { status: 500 },
    );
  }
}
