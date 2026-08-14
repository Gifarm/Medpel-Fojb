import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // 1. Featured Article (Artikel terbaru yang PUBLISHED)
    const featuredArticle = await prisma.article.findFirst({
      where: { status: "PUBLISHED" },
      orderBy: { createdAt: "desc" },
      include: {
        author: { select: { name: true } },
        category: { select: { name: true } },
      },
    });

    // 2. Latest Articles (6 artikel terbaru)
    const latestArticles = await prisma.article.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { createdAt: "desc" },
      take: 6,
      include: {
        author: { select: { name: true } },
        category: { select: { name: true } },
      },
    });

    // 3. Top Categories (dengan jumlah artikel published)
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: {
            articles: {
              where: { status: "PUBLISHED" },
            },
          },
        },
      },
      orderBy: {
        articles: {
          _count: "desc",
        },
      },
      take: 8, // Ambil 8 kategori teratas
    });

    // 4. Trending Tags (4 tag dengan artikel terbanyak)
    const tags = await prisma.tag.findMany({
      take: 4,
      orderBy: {
        articles: {
          _count: "desc",
        },
      },
      include: {
        _count: {
          select: { articles: true },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        featuredArticle: featuredArticle
          ? {
              id: featuredArticle.id,
              title: featuredArticle.title,
              category: featuredArticle.category?.name || "Umum",
              author: featuredArticle.author?.name || "Tim Redaksi",
              date: new Date(featuredArticle.createdAt).toLocaleDateString(
                "id-ID",
                {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                },
              ),
              // Fallback ke /kegiatan1.jpeg jika coverImage masih null/kosong
              image: featuredArticle.coverImage || "/kegiatan1.jpeg",
              views: featuredArticle.views,
            }
          : null,
        latestArticles: latestArticles.map((a) => ({
          id: a.id,
          title: a.title,
          category: a.category?.name || "Umum",
          author: a.author?.name || "Tim Redaksi",
          date: new Date(a.createdAt).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
          }),
          // Fallback ke /kegiatan1.jpeg jika coverImage masih null/kosong
          image: a.coverImage || "/kegiatan1.jpeg",
          views: a.views.toLocaleString(),
        })),
        categories: categories.map((c) => ({
          name: c.name,
          count: c._count.articles,
        })),
        trendingTags: tags.map((t) => ({
          tag: `#${t.name}`,
          count: `${t._count.articles} Postingan`,
        })),
      },
    });
  } catch (error) {
    console.error("Home API Error:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data homepage" },
      { status: 500 },
    );
  }
}
