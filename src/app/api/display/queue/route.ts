import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { errorResponse, successResponse } from "@/lib/response";

export async function GET() {
  try {
    // Ambil antrian dengan status 'siap' dan 'proses'
    const queues = await prisma.queue.findMany({
      where: {
        status: {
          in: ["siap", "proses"], // hanya dua status ini
        },
        createdAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)), // hari ini saja
        },
      },
      orderBy: [
        {
          status: "desc", // proses di bawah, siap di atas (siap > proses)
        },
        {
          createdAt: "asc", // yang duluan dibuat tampil duluan
        },
      ],
    });
    
    return successResponse(queues, "List display antrian hari ini");
  } catch (err: any) {
    return errorResponse("Failed to fetch display queue", 500, err);
  }
}
