import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/response";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const now = new Date();

    // jam reset = 6 pagi
    const resetHour = 6;
    const resetDate = new Date(now);
    resetDate.setHours(0, 0, 0, 0);

    // kalau sekarang sebelum jam 6 → pakai reset dari kemarin
    if (now < resetDate) {
      resetDate.setDate(resetDate.getDate() - 1);
    }

    // cari nomor terakhir setelah jam reset
    const lastQueue = await prisma.queue.findFirst({
      where: {
        createdAt: {
          gte: resetDate,
        },
      },
      orderBy: { id: "desc" },
    });

    const nextNomor = lastQueue ? parseInt(lastQueue.nomorAntrian) + 1 : 1;
    console.log(nextNomor, lastQueue);
    
    const queue = await prisma.queue.create({
      data: {
        nomorAntrian: `${nextNomor}`,
        jenisPelayanan: body.jenisPelayanan,
        namaPemohon: body.namaPemohon,
        status: body.status,
      },
    });

    return successResponse(queue, "Queue created successfully");
  } catch (err: any) {
    return errorResponse("Failed to create queue", 500, err);
  }
}


export async function GET() {
  try {
    // ambil waktu saat ini (local)
    const now = new Date();

    // hitung awal hari (jam 00:00)
    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);

    // ambil semua antrian yang dibuat hari ini
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
          status: "asc", // proses di bawah, siap di atas (siap > proses)
        },
        {
          createdAt: "desc", // yang duluan dibuat tampil duluan
        },
      ],
    });

    return successResponse(queues, "List antrian hari ini");
  } catch (error) {
    console.error(error);
    return errorResponse("Gagal mengambil data antrian", 500, error);
  }
}