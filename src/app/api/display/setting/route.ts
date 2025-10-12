import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { errorResponse, successResponse } from "@/lib/response";

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    console.log(body,'>>>>');
    
    const updated = await prisma.displaySetting.upsert({
      where: { id: 1 },
      update: {
        ...body
      },
      create: {
        id: 1,
        runningText:'',
        content:[]
      },
    });

  return successResponse(updated, "Display setting updated successfully");
} catch (err: any) {
  return errorResponse("Failed to update display setting", 500, err);
}
}

export async function GET() {
  try {
    const setting = await prisma.displaySetting.findUnique({
      where: { id: 1 },
    });

  return successResponse(setting, "Display setting fetched successfully");
} catch (err: any) {
  return errorResponse("Failed to get display setting", 500, err);
}
}
