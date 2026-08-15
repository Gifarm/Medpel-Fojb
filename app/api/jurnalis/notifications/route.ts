/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

// GET: Ambil daftar notifikasi milik Jurnalis yang login
export async function GET(request: NextRequest) {
  try {
    const userId = request.cookies.get("auth_token")?.value;
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const filter = searchParams.get("filter") || "all"; // all, unread, action_required

    const where: any = { userId };

    if (filter === "unread") {
      where.isRead = false;
    } else if (filter === "action_required") {
      where.isRead = false;
      where.type = "revision";
    }

    const notifications = await prisma.notification.findMany({
      where,
      include: {
        article: { select: { title: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    // Format tanggal relatif sederhana
    const getRelativeTime = (date: Date) => {
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.round(diffMs / 60000);
      const diffHours = Math.round(diffMs / 3600000);
      const diffDays = Math.round(diffMs / 86400000);

      if (diffMins < 60) return `${diffMins} Menit lalu`;
      if (diffHours < 24) return `${diffHours} Jam lalu`;
      return `${diffDays} Hari lalu`;
    };

    const formattedNotifs = notifications.map((n) => ({
      id: n.id,
      type: n.type,
      title: n.title,
      message: n.message,
      articleTitle: n.article?.title || null,
      date: getRelativeTime(n.createdAt),
      isRead: n.isRead,
    }));

    return NextResponse.json({ success: true, data: formattedNotifs });
  } catch (error) {
    console.error("GET Notifications Error:", error);
    return NextResponse.json(
      { error: "Gagal mengambil notifikasi" },
      { status: 500 },
    );
  }
}

// PATCH: Tandai notifikasi sebagai sudah dibaca
export async function PATCH(request: NextRequest) {
  try {
    const userId = request.cookies.get("auth_token")?.value;
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { id, markAll } = body;

    if (markAll) {
      await prisma.notification.updateMany({
        where: { userId, isRead: false },
        data: { isRead: true },
      });
    } else if (id) {
      await prisma.notification.update({
        where: { id, userId },
        data: { isRead: true },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PATCH Notification Error:", error);
    return NextResponse.json(
      { error: "Gagal memperbarui notifikasi" },
      { status: 500 },
    );
  }
}

// DELETE: Hapus notifikasi
export async function DELETE(request: NextRequest) {
  try {
    const userId = request.cookies.get("auth_token")?.value;
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id)
      return NextResponse.json({ error: "ID diperlukan" }, { status: 400 });

    await prisma.notification.delete({
      where: { id, userId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE Notification Error:", error);
    return NextResponse.json(
      { error: "Gagal menghapus notifikasi" },
      { status: 500 },
    );
  }
}
