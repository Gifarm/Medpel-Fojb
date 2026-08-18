import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

// GET: Ambil data dompet dan riwayat transaksi KOL
export async function GET(request: NextRequest) {
  try {
    const userId = request.cookies.get("auth_token")?.value;
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 1. Ambil atau Buat Wallet
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

    // 2. Hitung Total Pendapatan (dari submission yang APPROVED)
    const approvedSubmissions = await prisma.taskSubmission.findMany({
      where: { kolId: userId, status: "APPROVED" },
      include: { task: { select: { reward: true } } },
    });

    const totalEarned = approvedSubmissions.reduce(
      (sum, sub) => sum + sub.task.reward,
      0,
    );

    // 3. Ambil Riwayat Transaksi (Submission yang APPROVED)
    const transactions = await prisma.taskSubmission.findMany({
      where: { kolId: userId, status: "APPROVED" },
      include: {
        task: { select: { title: true, reward: true } },
      },
      orderBy: { updatedAt: "desc" },
    });

    const formattedTransactions = transactions.map((trx) => ({
      id: trx.id,
      date: trx.updatedAt.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
      taskTitle: trx.task.title,
      amount: trx.task.reward,
      type: "REWARD",
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
        transactions: formattedTransactions,
      },
    });
  } catch (error) {
    console.error("GET KOL Wallet Error:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data dompet" },
      { status: 500 },
    );
  }
}

// PATCH: Update data akun DANA (Nama & Nomor HP)
export async function PATCH(request: NextRequest) {
  try {
    const userId = request.cookies.get("auth_token")?.value;
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { danaName, danaPhone } = body;

    if (!danaName?.trim() || !danaPhone?.trim()) {
      return NextResponse.json(
        { error: "Nama dan Nomor DANA wajib diisi" },
        { status: 400 },
      );
    }

    // Update atau Create wallet jika belum ada
    await prisma.kOLWallet.upsert({
      where: { userId },
      update: {
        accountName: danaName.trim(),
        phoneNumber: danaPhone.trim(),
      },
      create: {
        userId,
        accountName: danaName.trim(),
        phoneNumber: danaPhone.trim(),
        balance: 0,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Akun DANA berhasil diperbarui",
    });
  } catch (error) {
    console.error("PATCH KOL Wallet Error:", error);
    return NextResponse.json(
      { error: "Gagal memperbarui akun DANA" },
      { status: 500 },
    );
  }
}
