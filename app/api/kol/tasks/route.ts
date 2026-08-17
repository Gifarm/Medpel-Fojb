/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

// GET: Ambil daftar task yang tersedia untuk KOL
export async function GET(request: NextRequest) {
  try {
    const userId = request.cookies.get("auth_token")?.value;
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Ambil semua task yang ACTIVE
    const tasks = await prisma.task.findMany({
      where: { status: "ACTIVE" },
      orderBy: { createdAt: "desc" },
    });

    // Filter task yang kuotanya belum penuh DAN user belum pernah claim
    const availableTasks = [];
    for (const task of tasks) {
      if (task.claimed < task.quota) {
        const existingSubmission = await prisma.taskSubmission.findFirst({
          where: { taskId: task.id, kolId: userId },
        });

        // Jika belum pernah claim, masukkan ke daftar tersedia
        if (!existingSubmission) {
          availableTasks.push(task);
        }
      }
    }

    return NextResponse.json({ success: true, data: availableTasks });
  } catch (error) {
    console.error("GET KOL Tasks Error:", error);
    return NextResponse.json(
      { error: "Gagal mengambil daftar task" },
      { status: 500 },
    );
  }
}

// POST: Claim / Ambil Task
export async function POST(request: NextRequest) {
  try {
    const userId = request.cookies.get("auth_token")?.value;
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { taskId } = body;

    if (!taskId) {
      return NextResponse.json(
        { error: "Task ID diperlukan" },
        { status: 400 },
      );
    }

    // Gunakan transaction untuk memastikan data konsisten (atomic)
    const result = await prisma.$transaction(async (tx) => {
      const task = await tx.task.findUnique({ where: { id: taskId } });

      if (!task) throw new Error("Task tidak ditemukan");
      if (task.status !== "ACTIVE") throw new Error("Task tidak lagi aktif");
      if (task.claimed >= task.quota) throw new Error("Kuota task sudah habis");

      // Cek ulang apakah user sudah claim (mencegah double claim)
      const existingSubmission = await tx.taskSubmission.findFirst({
        where: { taskId, kolId: userId },
      });
      if (existingSubmission) {
        throw new Error("Anda sudah mengambil task ini sebelumnya");
      }

      // 1. Buat record submission dengan status CLAIMED (Perlu Disubmit)
      await tx.taskSubmission.create({
        data: {
          taskId,
          kolId: userId,
          status: "CLAIMED",
          proofLink: "",
        },
      });

      // 2. Tambah jumlah claimed pada task
      const updatedTask = await tx.task.update({
        where: { id: taskId },
        data: { claimed: { increment: 1 } },
      });

      // 3. Jika kuota sudah terpenuhi, ubah status task menjadi COMPLETED
      if (updatedTask.claimed >= updatedTask.quota) {
        await tx.task.update({
          where: { id: taskId },
          data: { status: "COMPLETED" },
        });
      }

      return updatedTask;
    });

    return NextResponse.json({
      success: true,
      message: "Task berhasil diambil",
      data: result,
    });
  } catch (error: any) {
    console.error("POST Claim Task Error:", error);
    return NextResponse.json(
      { error: error.message || "Gagal mengambil task" },
      { status: 400 },
    );
  }
}
