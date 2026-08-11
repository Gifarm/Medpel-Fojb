/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: NextRequest,
  context: { params: any }, // Compatible dengan Next.js 14 & 15
) {
  try {
    const params = await context.params;
    const id = params.id;
    const { status } = await req.json();

    const statusMap: Record<string, string> = {
      Approved: "APPROVED",
      Rejected: "REJECTED",
      "Needs Revision": "NEEDS_REVISION",
      Pending: "PENDING",
    };

    const dbStatus = statusMap[status] || status.toUpperCase();

    const updatedArticle = await prisma.article.update({
      where: { id },
      data: { status: dbStatus as any },
    });

    return NextResponse.json({ success: true, article: updatedArticle });
  } catch (error) {
    console.error("Error updating article:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
