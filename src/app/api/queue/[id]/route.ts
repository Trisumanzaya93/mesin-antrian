import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/response";

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> } // ⬅️ perhatikan ini
) {
  try {
    const body = await req.json();
    const { status } = body;
    const { id } = await context.params;

    if (!status) {
      return errorResponse("Status wajib diisi", 400, null);
    }

    const updated = await prisma.queue.update({
      where: { id: Number(id) },
      data: { status },
    });

    return successResponse(updated, "Queue created successfully");
  } catch (err: any) {
    return errorResponse("Failed to create queue", 500, err);
  }
}
