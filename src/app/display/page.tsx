"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import AntrianTable from "@/components/queue-table";
import Image from "next/image";
import { AnimatedNumber } from "@/components/ui/animated-number";
type Queue = {
  id: number;
  nomorAntrian: string;
  jenisPelayanan: string;
  namaPemohon: string;
  status: string;
  createdAt: string;
  updatedAt: string;
};

export default function DisplayPage() {
  const [queues, setQueues] = useState<Queue[]>([]);
  const [antrian, setAntrian] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [displayData, setDisplayData] = useState({
    header: "PEMERINTAH DESA NEGARA RATU ",
    subHeader: "Jl. Basuki Rahmat No. 45 Samarinda Kalimantan Timur",
    imageUrl: "/display/banner.jpg", // contoh file lokal
    agendaKadis: [
      { title: "Rapat Bersama Pejabat Daerah", time: "07:00 - 10:00" },
      { title: "Evaluasi Proyek Sekolah", time: "11:00 - 12:30" },
    ],
    agendaDisdikbud: [
      { title: "Sosialisasi Kurikulum Merdeka", time: "13:30 - 15:00" },
      { title: "Pelatihan Guru SD", time: "15:30 - 17:00" },
    ],
    runningText:
      "Selamat Datang di Dinas Pendidikan dan Kebudayaan Kalimantan Timur | Layanan Prima untuk Masyarakat | Selamat Datang di Dinas Pendidikan dan Kebudayaan Kalimantan Timur | Layanan Prima untuk Masyarakat |",
  });

  const getAntrian = (data: Array<Queue>) => {
    if (!data) return;
  
    const antrian = data.filter((item) => item.status === "Siap");
  
    if (antrian.length !== 0) {
      const sorted = antrian.sort(
        (a, b) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
      );
      const dataAntrian = sorted[sorted.length - 1];
      setAntrian(parseInt(dataAntrian.nomorAntrian))
    }
  }

  const fetchQueues = async (): Promise<void> => {
    try {
      const res = await fetch("/api/display/queue");
      const json = await res.json();

      if (!json.success)
        throw new Error(json.message || "Failed to fetch data");

      setQueues(json.data);
      getAntrian(json.data)
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
    }
  };

  // // nanti bisa di-fetch dari API
  // useEffect(() => {
  //   // fetch("/api/display-setting").then(...);
  //   fetchQueues();
  // }, []);
  
  useEffect(() => {
    fetchQueues();
    // const interval = setInterval(fetchQueues, 5000); // update tiap 3 detik
    // return () => clearInterval(interval);
  }, []);

  
  // const [isFullscreenEnabled, setIsFullscreenEnabled] = useState(false);

  useEffect(() => {
    const enableFullscreen = async () => {
      if (!document.fullscreenElement) {
        try {
          await document.documentElement.requestFullscreen();
          // setIsFullscreenEnabled(true);
        } catch (err) {
          console.warn("Fullscreen gagal:", err);
        }
      }
    };

    // hanya aktifkan setelah user klik pertama
    const handleClick = () => {
      enableFullscreen();
      document.removeEventListener("click", handleClick);
    };

    document.addEventListener("click", handleClick);

    return () => document.removeEventListener("click", handleClick);
  }, []);

  return (
    <div className="flex flex-col h-screen text-white overflow-hidden">
      {/* Background Gradient */}
      <div className="h-screen w-screen absolute overflow-hidden -z-10">
      <div className="absolute inset-0 bg-[#E6F0FA] -z-10" />

      {/* Blurred Color Spots */}
      <div className="absolute -top-40 left-40 w-[800px] h-[800px] rounded-full bg-white opacity-60 blur-[150px] -z-10" />
      <div className="absolute top-1/2 right-20 w-[900px] h-[900px] rounded-full bg-[#E6F0FA] opacity-70 blur-[180px] -z-10" />
      <div className="absolute bottom-0 left-1/3 w-[700px] h-[700px] rounded-full bg-blue-500 opacity-50 blur-[160px] -z-10" />
      </div>
      {/* HEADER */}
      <header className="bg-blue-900 py-3 px-6 text-center shadow-lg flex justify-center  rounded-b-2xl">
        
      <Image
          className="mr-8 w-14 h-16 object-fit"
          src="/Lampung_coa.png"
          alt="logo"
          width={65}
          height={40}
        />
        <div>
        <h1 className="text-2xl font-bold tracking-wide uppercase">
          PEMERINTAH DESA NEGARA RATU
        </h1>
        <p className="text-sm opacity-80"> Jl. LPTP NO. 1 Negararatu, Kec. Natar Kab. Lampung Selatan. Kode pos 35362.</p>
        </div>
      </header>

      {/* CONTENT */}
      <main className="flex-1 grid grid-cols-12 grid-rows-2 gap-10 p-4 mt-8">
        {/* Left (Image) */}
        
        <Card className="col-span-2 bg-[#E6F0FA] flex p-0 justify-center items-center">
          
      <Image
          className=" w-full min-h-full object-cover"
          src="/bupati.png"
          alt="logo"
          width={700}
          height={500}
        />
          </Card>
        <Card className="col-span-4 overflow-hidden mr-10 p-0">
            
          <video
            src="/video/video.mp4" // letakkan file di public/videos/display.mp4
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover shadow-lg"
          />
        </Card>
        {/* Right (Agenda) */}

          <Card className=" col-span-4 bg-white text-black">
            {/* dibagi dua sama data desa */}
            <CardContent className="p-0 flex flex-col items-center h-full">
              <h2 className="font-bold text-2xl">Nomor Antrian</h2>
              <div className="h-full w-full flex justify-center items-center text-9xl font-bold">
                <AnimatedNumber value={antrian}/>
              </div>
            </CardContent>
          </Card>
          
          <Card className="col-span-2 bg-[#E6F0FA] flex justify-center items-center ">
      <Image
          className=" w-full object-"
          src="/camat.png"
          alt="logo"
          width={350}
          height={350}
        />
          </Card>

        <Card className="col-span-full max-h-80 overflow-hidden h-full p-4">
          <CardContent className="p-0 pb-4">
            <AntrianTable
              rows={queues}
              isLoading={false}
              refetch={fetchQueues}
              isHeader={false}
            />
          </CardContent>
        </Card>
        
      </main>

      {/* RUNNING TEXT */}
      <footer className="bg-black py-2 overflow-hidden border-t border-gray-700">
        <motion.div
          className="whitespace-nowrap text-lg text-yellow-400 font-semibold"
          animate={{ x: ["100%", "-100%"] }}
          transition={{
            x: { repeat: Infinity, duration: 40, ease: "linear" },
          }}
        >
          {displayData.runningText}
        </motion.div>
      </footer>
    </div>
  );
}
