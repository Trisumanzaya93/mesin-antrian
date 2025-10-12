// app/api/print/route.ts
import { NextResponse } from "next/server";
import escpos from "escpos";

// pastikan escpos pakai USB
escpos.USB = require("escpos-usb");

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { text } = body;

    const device  = new escpos.USB(); 

    const options = { encoding: "GB18030" }; // support charset China/UTF-8
    const printer = new escpos.Printer(device, options);
    console.log(device,printer,'asdas');
    
    device.open(() => {
      // if (err) {
      //   console.error("Failed to open USB printer:", err);
      //   return;
      // }
    
      printer
      .align("ct")
      .style("b")
      .size(1, 1)
      .text("=== PEMERINTAH DESA ===")
      .text("NEGARA RATU - NATAR")
      .text("----------------------------")
      .align("lt")
      .style("normal")
    //   .text(`Tanggal : ${tanggal}`)
    //   .text(`Jam     : ${jam}`)
      .text("----------------------------")
      .align("ct")
      .style("b")
      .size(2, 2)
      .text(`NOMOR ANTRIAN`)
      .text(`#${40}`) // ini nomor antrian dari FE
      .size(1, 1)
      .text("----------------------------")
      .style("normal")
      .text("Harap menunggu nomor anda dipanggil.")
      .text("Terima kasih atas kunjungannya.")
      .text("----------------------------")
      .align("ct")
      .text("Desa Negara Ratu, Kec. Natar")
      .text("Kabupaten Lampung Selatan")
      .text("============================")
      .cut()
      .close();
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
