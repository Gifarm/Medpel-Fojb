/* eslint-disable prefer-const */
import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

// PATCH: Review submission (Approve / Reject)
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { submissionId, action, feedback } = body;

    if (!submissionId || !action) {
      return NextResponse.json(
        { error: "Data tidak lengkap" },
        { status: 400 },
      );
    }

    if (action === "REJECTED" && !feedback?.trim()) {
      return NextResponse.json(
        { error: "Feedback wajib diisi jika menolak" },
        { status: 400 },
      );
    }

    // 1. Ambil data submission untuk mengetahui taskId, kolId, dan reward
    const submission = await prisma.taskSubmission.findUnique({
      where: { id: submissionId },
      include: {
        task: true,
        kol: true,
      },
    });

    if (!submission) {
      return NextResponse.json(
        { error: "Submission tidak ditemukan" },
        { status: 404 },
      );
    }

    // 2. Update status submission
    await prisma.taskSubmission.update({
      where: { id: submissionId },
      data: {
        status: action,
        feedback: action === "REJECTED" ? feedback : null,
      },
    });

    // 3. Jika APPROVED, tambah claimed task dan saldo KOL
    if (action === "APPROVED") {
      await prisma.task.update({
        where: { id: submission.taskId },
        data: {
          claimed: { increment: 1 },
        },
      });

      // Cek atau buat wallet KOL (Catatan: Prisma mengubah KOLWallet menjadi kOLWallet)
      let wallet = await prisma.kOLWallet.findUnique({
        where: { userId: submission.kolId },
      });

      if (!wallet) {
        await prisma.kOLWallet.create({
          data: {
            userId: submission.kolId,
            accountName: submission.kol.name, // Default nama user
            phoneNumber: "", // Akan diisi oleh KOL nanti
            balance: submission.task.reward,
          },
        });
      } else {
        await prisma.kOLWallet.update({
          where: { userId: submission.kolId },
          data: {
            balance: { increment: submission.task.reward },
          },
        });
      }

      // 4. Cek apakah kuota task sudah terpenuhi
      const updatedTask = await prisma.task.findUnique({
        where: { id: submission.taskId },
      });
      if (updatedTask && updatedTask.claimed >= updatedTask.quota) {
        await prisma.task.update({
          where: { id: submission.taskId },
          data: { status: "COMPLETED" },
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: "Submission berhasil diupdate",
    });
  } catch (error) {
    console.error("PATCH Submission Error:", error);
    return NextResponse.json(
      { error: "Gagal mengupdate submission" },
      { status: 500 },
    );
  }
}
