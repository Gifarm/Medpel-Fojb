/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

// GET: Ambil semua task beserta submission-nya
export async function GET(request: NextRequest) {
  try {
    const tasks = await prisma.task.findMany({
      include: {
        submissions: {
          include: {
            kol: {
              select: {
                id: true,
                name: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const formattedTasks = tasks.map((task: any) => ({
      id: task.id,
      title: task.title,
      description: task.description,
      reward: task.reward,
      quota: task.quota,
      claimed: task.claimed,
      status: task.status,
      createdAt: task.createdAt.toISOString().split("T")[0],
      submissions: task.submissions.map((sub: any) => ({
        id: sub.id,
        taskId: sub.taskId,
        kolId: sub.kolId,
        kolName: sub.kol.name,
        proofLink: sub.proofLink,
        status: sub.status,
        feedback: sub.feedback || "",
        submittedAt: sub.createdAt.toISOString().split("T")[0],
      })),
    }));

    return NextResponse.json({ success: true, data: formattedTasks });
  } catch (error) {
    console.error("GET Tasks Error:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data task" },
      { status: 500 },
    );
  }
}

// POST: Buat task baru
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, reward, quota } = body;

    if (!title || !description || !reward || !quota) {
      return NextResponse.json(
        { error: "Semua field wajib diisi" },
        { status: 400 },
      );
    }

    const newTask = await prisma.task.create({
      data: {
        title,
        description,
        reward: parseInt(reward),
        quota: parseInt(quota),
        claimed: 0,
        status: "ACTIVE",
      },
    });

    return NextResponse.json({ success: true, data: newTask });
  } catch (error) {
    console.error("POST Task Error:", error);
    return NextResponse.json({ error: "Gagal membuat task" }, { status: 500 });
  }
}
