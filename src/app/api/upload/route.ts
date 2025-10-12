import { NextRequest, NextResponse } from "next/server";
import { writeFile, readdir, unlink } from "fs/promises";
import path from "path";
import { successResponse, errorResponse } from "@/lib/response";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ success: false, message: "No file uploaded" }, { status: 400 });
    }

    const videoDir = path.join(process.cwd(), "public", "video");

    // 🔍 Cek apakah folder sudah berisi file video
    const existingFiles = await readdir(videoDir);
    for (const existingFile of existingFiles) {
      await unlink(path.join(videoDir, existingFile));
      console.log("🗑️ Deleted old video:", existingFile);
    }

    // 🧩 Dapatkan ekstensi asli (misal: .mp4)
    const ext = path.extname(file.name);
    const filename = `video${ext}`; // simpan dengan nama tetap "video"

    // 🔄 Simpan file baru
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filePath = path.join(videoDir, filename);

    await writeFile(filePath, buffer);

    return successResponse({ url: `/video/${filename}` }, "Video uploaded successfully");
  } catch (err: any) {
    return errorResponse("Upload failed", 500, err);
  }
}

export async function GET() {
  try {
    const videoDir = path.join(process.cwd(), "public", "video");
    const files = await readdir(videoDir);

    if (files.length === 0) {
      return errorResponse("video not found", 404, null);
    }

    // Ambil hanya 1 file pertama — karena kamu hanya simpan satu video saja
    const filename = files[0];
    const videoUrl = `/video/${filename}`;

    return successResponse({ url: `/video/${filename}` }, "get video successfully");
  } catch (err) {
    return errorResponse("get video failed", 500, err);
  }
}
