import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    // 1. Validasi User & Role
    const userId = request.cookies.get("auth_token")?.value;
    const role = request.cookies.get("user_role")?.value;

    if (!userId || role !== "KOL") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Ambil atau Buat Data Wallet
    let wallet = await prisma.kOLWallet.findUnique({
      where: { userId },
    });

    if (!wallet) {
      const user = await prisma.user.findUnique({ where: { id: userId } });
      wallet = await prisma.kOLWallet.create({
        data: {
          userId,
          accountName: user?.name || "KOL User",
          phoneNumber: "",
          balance: 0,
        },
      });
    }

    // Hitung Total Pendapatan (dari submission yang APPROVED)
    const approvedSubmissions = await prisma.taskSubmission.findMany({
      where: { kolId: userId, status: "APPROVED" },
      include: { task: { select: { reward: true } } },
    });

    const totalEarned = approvedSubmissions.reduce(
      (sum, sub) => sum + sub.task.reward,
      0,
    );

    // 3. Ambil Available Tasks (Status ACTIVE dan kuota belum penuh)
    const availableTasks = await prisma.task.findMany({
      where: {
        status: "ACTIVE",
      },
      orderBy: { createdAt: "desc" },
      take: 5, // Tampilkan 5 task terbaru
    });

    // 4. Ambil Recent Submissions milik KOL ini
    const recentSubmissions = await prisma.taskSubmission.findMany({
      where: { kolId: userId },
      include: {
        task: { select: { title: true, reward: true } },
      },
      orderBy: { updatedAt: "desc" },
      take: 5,
    });

    const formattedSubmissions = recentSubmissions.map((sub) => ({
      id: sub.id,
      taskTitle: sub.task.title,
      status: sub.status,
      reward: sub.task.reward,
      feedback: sub.feedback || "",
      date: sub.updatedAt.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
    }));

    return NextResponse.json({
      success: true,
      data: {
        wallet: {
          balance: wallet.balance,
          totalEarned,
          danaName: wallet.accountName,
          danaPhone: wallet.phoneNumber,
        },
        availableTasks: availableTasks.map((t) => ({
          id: t.id,
          title: t.title,
          description: t.description,
          reward: t.reward,
          quota: t.quota,
          claimed: t.claimed,
        })),
        recentSubmissions: formattedSubmissions,
      },
    });
  } catch (error) {
    console.error("GET KOL Dashboard Error:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data dashboard KOL" },
      { status: 500 },
    );
  }
}
