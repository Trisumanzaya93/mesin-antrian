"use client";

import React, { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import { motion } from "framer-motion";
import Speech from "speak-tts";


let speech: Speech = null;
const initSpeech = async () => {
  if (typeof window === "undefined") return; // ⬅️ mencegah jalan di server
  if (!speech) {
    speech = new Speech();
    }
  console.log(speech, 'useEffect');
  if (speech.hasBrowserSupport()) {
    console.log("Speech synthesis supported 🎉");

    await speech.init({
        volume: 1,
        lang: "id-ID", // bahasa Indonesia
        rate: 1,
        pitch: 1,
        // voice: "Google Bahasa Indonesia",
        splitSentences: true,
      });
      await speech.setVoice("fiona");
      console.log("Speech initialized", speech);
      
      return speech;
  } else {
    console.log("Speech synthesis not supported in this browser");
  }
};

export type AntrianRow = {
  id: number;
  antrian: string; // nomor antrian
  jenisPelayanan: string;
  namaPemohon: string;
  status: "menunggu" | "dipanggil" | "selesai" | string;
};

type Props = {
  rows: Array<AntrianRow>;
  className?: string;
};

export default function AntrianTable({ rows, className = "" }: Props) {
  const [query, setQuery] = React.useState("");

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) =>
      [String(r.id), r.antrian, r.jenisPelayanan, r.namaPemohon, r.status]
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [rows, query]);

  const statusToColor = (s: string) => {
    switch (s) {
      case "menunggu":
        return "bg-yellow-100 text-yellow-800";
      case "dipanggil":
        return "bg-blue-100 text-blue-800";
      case "selesai":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  

speech = 
  useEffect(() => {
    initSpeech()
  }, [])

  
  const speakText = ( antrian: string, namaPemohon: string) => () => {
    
    if (typeof window === "undefined" || !speech) return;
    console.log(speech,'<<<<<');
    const text = `Nomor Antrian ${antrian} atas nama ${namaPemohon}`;
    if (!speech.speaking()) {
      speech
        .speak({
          text,
          queue: false,
          listeners: {
            onstart: () => console.log("Mulai bicara..."),
            onend: () => console.log("Selesai bicara"),
            onresume: () => console.log("Lanjut bicara"),
            onpause: () => console.log("Pause bicara"),
          },
        })
        .catch((e: any) => console.error("TTS Error:", e));
    }
  };
  

  return (
    <Card className={`w-full ${className} border-0 shadow-none`}>
      <CardHeader className="flex items-center border-0 justify-between gap-4 p-4">
        <div>
          <CardTitle className="text-lg border-0">Daftar Antrian</CardTitle>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 border border-slate-200 rounded-md px-2 py-1">
            <Search className="w-4 h-4 text-slate-500" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari id, antrian, nama, atau status"
              className="!border-0 shadow-none p-0 min-w-[220px]"
            />
          </div>
          <Button size="sm">Export</Button>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left table-auto">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-sm font-medium">ID</th>
                <th className="px-4 py-3 text-sm font-medium">Nomor Antrian</th>
                <th className="px-4 py-3 text-sm font-medium">
                  Jenis Pelayanan
                </th>
                <th className="px-4 py-3 text-sm font-medium">Nama Pemohon</th>
                <th className="px-4 py-3 text-sm font-medium">Status</th>
                <th className="px-4 py-3 text-sm font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-6 text-center text-sm text-slate-500"
                  >
                    Tidak ada data
                  </td>
                </tr>
              )}

              {filtered.map((row) => (
                <motion.tr
                  key={row.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.18 }}
                  className="border-b last:border-0 even:bg-white"
                >
                  <td className="px-4 py-3 align-middle text-sm">{row.id}</td>
                  <td className="px-4 py-3 align-middle text-sm font-medium">
                    {row.antrian}
                  </td>
                  <td className="px-4 py-3 align-middle text-sm">
                    {row.jenisPelayanan}
                  </td>
                  <td className="px-4 py-3 align-middle text-sm">
                    {row.namaPemohon}
                  </td>
                  <td className="px-4 py-3 align-middle text-sm">
                    <span
                      className={`inline-flex items-center gap-2 px-2 py-1 rounded-full text-xs font-medium ${statusToColor(
                        row.status
                      )}`}
                    >
                      {row.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 align-middle text-sm">
                    {row.status === "menunggu" && (
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          className="bg-blue-100 hover:bg-blue-200 hover:text-blue-800 text-blue-800"
                          size="sm"
                          onClick={speakText(row.antrian, row.namaPemohon)}
                        >
                          Panggil
                        </Button>
                      </div>
                    )}
                    {row.status === "dipanggil" && (
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          className="bg-green-100 text-green-800 hover:bg-green-200 hover:text-green-800"
                          size="sm"
                        >
                          Selesai
                        </Button>
                        <Button
                          variant="outline"
                          className="hover:bg-red-200 bg-red-100 text-red-800 hover:text-red-800 "
                          size="sm"
                        >
                          Panggil Ulang
                        </Button>
                      </div>
                    )}

                    {/* <div className="flex items-center gap-2">
                      <Button size="sm">Lihat</Button>
                      <Button size="sm" variant="ghost">Panggil</Button>
                    </div> */}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
