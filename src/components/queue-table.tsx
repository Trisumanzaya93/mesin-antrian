"use client";

import React, { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import { motion } from "framer-motion";
import Speech from "speak-tts";
import { Skeleton } from "./ui/skeleton";
import { toast } from 'sonner';


let speech = null as unknown as any;
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
        pitch: 0,
        // voice: "Google Bahasa Indonesia",
        splitSentences: true,
      });
      // await speech.setVoice("Google Bahasa Indonesia");
      
      return speech;
  } else {
    console.log("Speech synthesis not supported in this browser");
  }
};

type Queue = {
  id: number;
  nomorAntrian: string;
  jenisPelayanan: string;
  namaPemohon: string;
  status: string;
  createdAt: string;
}

type Props = {
  rows: Array<Queue>,
  isLoading: boolean,
  className?: string,
  isHeader?: boolean
  refetch: () => Promise<void>,
};

export default function AntrianTable({ rows, isLoading, refetch ,isHeader = true, className = "" }: Props) {
  const [query, setQuery] = React.useState("");
  const [disabled, setDisabled] = React.useState(false);

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) =>
      [String(r.id), r.nomorAntrian, r.jenisPelayanan, r.namaPemohon, r.status]
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [rows, query]);

  const statusToColor = (s: string) => {
    switch (s) {
      case "Proses":
        return "bg-yellow-100 text-yellow-800";
      case "Siap":
        return "bg-blue-100 text-blue-800";
      case "Selesai":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  
  useEffect(() => {
    initSpeech()
  }, [])
  
  const speakText = ( antrian: string, namaPemohon: string) => {
    if (typeof window === "undefined" || !speech) return;
    const text = `Nomor Antrian ${antrian} atas nama ${namaPemohon}`;
    if (!speech.speaking()) {
      speech
        .speak({
          text,
          queue: false,
          listeners: {
            onstart: () => setDisabled(true),
            onend: () => setDisabled(false),
            onresume: () => console.log("Lanjut bicara"),
            onpause: () => console.log("Pause bicara"),
          },
        })
        .catch((e: any) => console.error("TTS Error:", e));
    }
  };

  const handleOnCall = (props: Queue) => async () => {
    try {
      const res = await fetch(`/api/queue/${props.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: 'Siap' }),
      });
      
      toast.success('status telah diperbarui');

      speakText(props.nomorAntrian, props.namaPemohon)
      await refetch()
    } catch (error) {
      toast.error('status gagal diperbarui'||error);
    }
  }

  const handleOnSuccess = (props: Queue) => async () => {
    try {
      const res = await fetch(`/api/queue/${props.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: 'Selesai' }),
      });
      
      toast.success('status telah diperbarui');
      
      await refetch()
    } catch (error) {
      console.log(error);
      
      toast.error('status gagal diperbarui'||error);
    }
  }
  
  

  return (
    <Card className={`w-full ${className} border-0 shadow-none p-0`}>
      {isHeader && <CardHeader className="flex items-center border-0 justify-between gap-4 p-4">
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
              className="!border-0 shadow-none p-0 min-w-[220px] active:border-none"
            />
          </div>
        </div>
      </CardHeader>}
      

      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left table-auto">
            <thead className="bg-[#E6F0FA]">
              <tr>
                <th className="px-4 py-3 text-sm font-medium">No</th>
                <th className="px-4 py-3 text-sm font-medium">Nomor Antrian</th>
                <th className="px-4 py-3 text-sm font-medium">
                  Jenis Pelayanan
                </th>
                <th className="px-4 py-3 text-sm font-medium">Nama Pemohon</th>
                <th className="px-4 py-3 text-sm font-medium">Status</th>
                {isHeader && <th className="px-4 py-3 text-sm font-medium">Aksi</th>}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && !isLoading && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-6 text-center text-sm text-slate-500"
                  >
                    Tidak ada data
                  </td>
                </tr>
              )}
              
              {isLoading && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-6 text-center text-sm text-slate-500"
                  >
                    <Skeleton className="h-10 w-full mb-4"/>
                    <Skeleton className="h-10 w-full mb-4"/>
                    <Skeleton className="h-10 w-full mb-4"/>
                    <Skeleton className="h-10 w-full mb-4"/>
                    <Skeleton className="h-10 w-full mb-4"/>
                  </td>
                </tr>
              )}

              {filtered.map((row: Queue, idx: number) => (
                <motion.tr
                  key={row.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.18 }}
                  className="border-b last:border-0 even:bg-white"
                >
                  <td className="px-4 py-3 align-middle text-sm">{idx + 1}</td>
                  <td className="px-4 py-3 align-middle text-sm font-medium">
                    {row.nomorAntrian}
                  </td>
                  <td className="px-4 py-3 align-middle text-sm">
                    {row.jenisPelayanan}
                  </td>
                  <td className="px-4 py-3 align-middle text-sm">
                    {row.namaPemohon}
                  </td>
                  <td className="px-4 py-3 align-middle text-sm text-center">
                    <div className={`w-20 text-center rounded-full ${statusToColor(
                        row.status
                      )}`}>
                    <p
                      className={`inline-flex items-center gap-2 px-2 py-1   text-xs font-medium `}
                    >
                      {row.status}
                    </p>

                    </div>
                  </td>
                  {isHeader && <td className="px-4 py-3 align-middle text-sm">
                    {row.status === "Proses" && (
                      <div className="flex items-center gap-2">
                        <Button
                          disabled={disabled}
                          variant="outline"
                          className="bg-blue-100 hover:bg-blue-200 hover:text-blue-800 text-blue-800"
                          size="sm"
                          onClick={handleOnCall(row)}
                        >
                          Siap
                        </Button>
                      </div>
                    )}
                    {row.status === "Siap" && (
                      <div className="flex items-center gap-2">
                        <Button
                          onClick={handleOnSuccess(row)}
                          variant="outline"
                          className="bg-green-100 text-green-800 hover:bg-green-200 hover:text-green-800"
                          size="sm"
                        >
                          Selesai
                        </Button>
                        <Button
                          disabled={disabled}
                          onClick={() => speakText(row.nomorAntrian, row.namaPemohon)}
                          variant="outline"
                          className="hover:bg-red-200 bg-red-100 text-red-800 hover:text-red-800 "
                          size="sm"
                        >
                          Panggil
                        </Button>
                      </div>
                    )}

                    {/* <div className="flex items-center gap-2">
                      <Button size="sm">Lihat</Button>
                      <Button size="sm" variant="ghost">Panggil</Button>
                    </div> */}
                  </td>}
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
