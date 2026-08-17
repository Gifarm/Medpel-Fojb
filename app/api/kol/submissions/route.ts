import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

// GET: Ambil daftar submission milik KOL yang login
export async function GET(request: NextRequest) {
  try {
    const userId = request.cookies.get("auth_token")?.value;
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const submissions = await prisma.taskSubmission.findMany({
      where: { kolId: userId },
      include: {
        task: {
          select: {
            title: true,
            reward: true,
          },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    const formattedSubmissions = submissions.map((sub) => ({
      id: sub.id,
      taskId: sub.taskId,
      title: sub.task.title,
      reward: sub.task.reward,
      status: sub.status,
      proofLink: sub.proofLink || "",
      feedback: sub.feedback || "",
      updatedAt: sub.updatedAt.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
    }));

    return NextResponse.json({ success: true, data: formattedSubmissions });
  } catch (error) {
    console.error("GET KOL Submissions Error:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data task saya" },
      { status: 500 },
    );
  }
}

// PATCH: Update submission (Submit bukti pengerjaan atau revisi)
export async function PATCH(request: NextRequest) {
  try {
    const userId = request.cookies.get("auth_token")?.value;
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { submissionId, proofLink } = body;

    if (!submissionId || !proofLink?.trim()) {
      return NextResponse.json(
        { error: "Link bukti pengerjaan wajib diisi" },
        { status: 400 },
      );
    }

    // Pastikan submission milik user ini
    const submission = await prisma.taskSubmission.findUnique({
      where: { id: submissionId },
    });

    if (!submission || submission.kolId !== userId) {
      return NextResponse.json(
        { error: "Unauthorized atau data tidak ditemukan" },
        { status: 403 },
      );
    }

    // Update submission: ubah link dan set status ke PENDING
    await prisma.taskSubmission.update({
      where: { id: submissionId },
      data: {
        proofLink: proofLink.trim(),
        status: "PENDING",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Bukti pengerjaan berhasil dikirim",
    });
  } catch (error) {
    console.error("PATCH KOL Submission Error:", error);
    return NextResponse.json(
      { error: "Gagal mengirim bukti pengerjaan" },
      { status: 500 },
    );
  }
}
