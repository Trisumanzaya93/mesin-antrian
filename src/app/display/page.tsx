"use client";

import { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import AntrianTable from "@/components/queue-table";
import Image from "next/image";
import { AnimatedNumber } from "@/components/ui/animated-number";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
type Queue = {
  id: number;
  nomorAntrian: string;
  jenisPelayanan: string;
  namaPemohon: string;
  status: string;
  createdAt: string;
  updatedAt: string;
};

type Display = {
  runningText: string;
  content: object;
};

export default function DisplayPage() {
  const [queues, setQueues] = useState<Queue[]>([]);
  const [antrian, setAntrian] = useState(0);
  const [video, setVideo] = useState("");
  const [display, setDisplay] = useState<Display>({
    runningText: "",
    content: {},
  });
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

  const plugin = useRef(Autoplay({ delay: 2000, stopOnInteraction: true }));

  const getAntrian = (data: Array<Queue>) => {
    if (!data) return;

    const antrian = data.filter((item) => item.status === "Siap");

    if (antrian.length !== 0) {
      const sorted = antrian.sort(
        (a, b) =>
          new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
      );
      const dataAntrian = sorted[sorted.length - 1];
      setAntrian(parseInt(dataAntrian.nomorAntrian));
    }
  };

  const fetchQueues = async (): Promise<void> => {
    try {
      const res = await fetch("/api/display/queue");
      const json = await res.json();

      if (!json.success)
        throw new Error(json.message || "Failed to fetch data");

      setQueues(json.data);
      getAntrian(json.data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
    }
  };

  const fetchVideo = async (): Promise<void> => {
    try {
      const res = await fetch("/api/upload");
      const json = await res.json();

      const displayData = await fetch("/api/display/setting");
      const data = await displayData.json();

      if (!json.success || !data.success)
        throw new Error(json.message || "Failed to fetch data");

      setVideo(json.data.url);
      setDisplay(data.data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
    }
  };

  // // nanti bisa di-fetch dari API
  useEffect(() => {
    fetchVideo();
  }, []);

  useEffect(() => {
    // fetchQueues();
    const interval = setInterval(fetchQueues, 15000); // update tiap 3 detik
    return () => clearInterval(interval);
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
          <p className="text-sm opacity-80">
            Jl. LPTP NO. 1 Negararatu, Kec. Natar Kab. Lampung Selatan. Kode pos
            35362.
          </p>
        </div>
      </header>

      {/* CONTENT */}
      <main className="flex-1 grid grid-cols-6 row-span-4 gap-5 p-4 pt-8">
        {/* Left (Image) */}

        <Card className="col-span-1 bg-[#E6F0FA] flex p-0 justify-end items-end bg-[url('/siger.png')] relative bg-center bg-repeat bg-size-[60px]">
        <div className="absolute inset-0  bg-[#E6F0FA] opacity-70" />
          <Image
            className="z-10 w-full min-h-full object-cover"
            src="/bupati.png"
            alt="logo"
            width={500}
            height={500}
          />
        </Card>
        <Card className="col-span-2 overflow-hidden mr-10 p-0">
          {video && (
            <video
              src={`${video}?cacheBust=${Date.now()}`} // letakkan file di public/videos/display.mp4
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover shadow-lg"
            />
          )}
        </Card>
        {/* Right (Agenda) */}

        <div className=" col-span-1 flex flex-col text-black py-10">
          {/* dibagi dua sama data desa */}
          {/* <Card className="h-1/2">
            <CardContent className="w-full p-0 flex flex-col items-center h-1/2">
              <h2 className="font-bold text-2xl">Data Desa</h2> */}
            <Carousel
              className="w-full max-w-xs h-full"
              plugins={[plugin.current]}
            >
              <CarouselContent className="h-full">
                {Array.isArray(display.content) &&
                  display.content.map((val, index) => (
                    <CarouselItem key={index} className="h-full">
                      <div className="p-1">
                        <Card className="bg-transparent">
                          <CardContent className="flex aspect-square items-center justify-center">
                            <div className="w-full p-6 flex flex-col gap-6 justify-center  rounded-lg bg-white text-start">
                              <h2 className="font-bold text-lg">{val.key}</h2>
                              <h2 className="text-lg mt-auto ">{val.value}</h2>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </CarouselItem>
                  ))}
              </CarouselContent>
              {/* <CarouselPrevious />
              <CarouselNext /> */}
            </Carousel>
          {/* {Array.isArray(display.content) &&
                display.content.map((val) => (
                  <div className="w-full flex justify-center">
                    <h2 className=" text-lg">{val.key} :</h2>
                    <h2 className="text-lg ml-2">{val.value}</h2>
                  </div>
                ))}
            </CardContent>
          </Card> */}
        </div>
        <div className="col-span-1 bg-none py-10">
          <div className="z-10 p-0 flex flex-col justify-center items-center h-full bg-white text-black rounded-lg">
            <h2 className="font-bold text-2xl text-center">Nomor Antrian</h2>
            <div className=" text-[300px] font-bold ">
              <AnimatedNumber value={antrian}  />
            </div>
          </div>
        </div>

        <Card className="col-span-1 bg-[#E6F0FA] flex justify-center items-center bg-[url('/siger.png')] relative bg-center bg-repeat bg-size-[60px] ">
        <div className="absolute inset-0  bg-[#E6F0FA] opacity-70" />
          <Image
            className="z-10 w-full object-"
            src="/camat.png"
            alt="logo"
            width={350}
            height={350}
          />
        </Card>

        <Card className="col-span-full max-h-70 overflow-hidden h-full p-4">
          <CardContent className="p-0">
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
      <footer className="bg-black py-2 overflow-hidden border-t border-gray-700 mt-auto">
        <motion.div
          className="whitespace-nowrap text-lg text-yellow-400 font-semibold"
          animate={{ x: ["100%", "-100%"] }}
          transition={{
            x: { repeat: Infinity, duration: 40, ease: "linear" },
          }}
        >
          {display.runningText}
        </motion.div>
      </footer>
    </div>
  );
}
