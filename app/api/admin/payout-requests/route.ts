/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

// GET: Ambil daftar permintaan pencairan
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || "PENDING";

    const requests = await prisma.payoutRequest.findMany({
      where: { status: status as any },
      include: {
        kol: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy:
        status === "PENDING" ? { requestedAt: "asc" } : { processedAt: "desc" },
    });

    // Gabungkan dengan data dompet DANA agar Admin bisa verifikasi
    const formattedData = await Promise.all(
      requests.map(async (req) => {
        const wallet = await prisma.kOLWallet.findUnique({
          where: { userId: req.kolId },
        });
        return {
          id: req.id,
          kolName: req.kol.name,
          email: req.kol.email,
          amount: req.amount,
          status: req.status,
          requestedAt: req.requestedAt.toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
          }),
          processedAt: req.processedAt
            ? req.processedAt.toLocaleDateString("id-ID", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })
            : "-",
          danaName: wallet?.accountName || req.kol.name,
          danaPhone: wallet?.phoneNumber || "-",
        };
      }),
    );

    return NextResponse.json({ success: true, data: formattedData });
  } catch (error) {
    console.error("GET Payout Requests Error:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data" },
      { status: 500 },
    );
  }
}

// PATCH: Konfirmasi bahwa Admin sudah mentransfer dana
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { requestId } = body;

    if (!requestId) {
      return NextResponse.json(
        { error: "ID permintaan diperlukan" },
        { status: 400 },
      );
    }

    const payoutRequest = await prisma.payoutRequest.findUnique({
      where: { id: requestId },
      include: { kol: true },
    });

    if (!payoutRequest || payoutRequest.status !== "PENDING") {
      return NextResponse.json(
        { error: "Permintaan tidak valid atau sudah diproses" },
        { status: 400 },
      );
    }

    // 1. Kurangi saldo KOL di database
    await prisma.kOLWallet.update({
      where: { userId: payoutRequest.kolId },
      data: {
        balance: { decrement: payoutRequest.amount },
      },
    });

    // 2. Update status permintaan menjadi PAID
    await prisma.payoutRequest.update({
      where: { id: requestId },
      data: {
        status: "PAID",
        processedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Pencairan berhasil dikonfirmasi",
    });
  } catch (error) {
    console.error("PATCH Payout Request Error:", error);
    return NextResponse.json(
      { error: "Gagal memproses pencairan" },
      { status: 500 },
    );
  }
}
