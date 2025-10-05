import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/response";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const { status } = body;

    if (!status) {
      return errorResponse("Status wajib diisi", 400, null);
    }

    const updated = await prisma.queue.update({
      where: { id: Number(params.id) },
      data: { status },
    });

    return successResponse(updated, "Queue created successfully");
  } catch (err: any) {
    return errorResponse("Failed to create queue", 500, err);
  }
}
