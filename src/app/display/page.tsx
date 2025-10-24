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
  const [video, setVideo] = useState("asdasdsa");
  const [display, setDisplay] = useState<Display>({
    runningText: "text-berjalannnnnnn",
    content: [
      {
        key: 'key',
        value: 'value.'
      },
      {
        key: 'Lorem Ipsum is',
        value: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.'
      },
      {
        key: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy',
        value: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.'
      },
      {
        key: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy',
        value: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.'
      },
      {
        key: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy',
        value: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.'
      },
    ],
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
  // useEffect(() => {
  //   fetchVideo();
  // }, []);

  // useEffect(() => {
  //   // fetchQueues();
  //   const interval = setInterval(fetchQueues, 15000); // update tiap 3 detik
  //   return () => clearInterval(interval);
  // }, []);

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
      <main className="px-16">
        <div className="flex justify-between items-center min-h-1/2 py-10">
          <div className="w-[15%] p-3 bg-[#E6F0FA] flex justify-end items-end bg-[url('/siger.png')] relative bg-center bg-repeat bg-size-[60px]">
            <div className="absolute inset-0  bg-[#E6F0FA] opacity-70" />
            <Image
              className="z-10 w-full object-cover"
              src="/bupati.png"
              alt="logo"
              width={500}
              height={500}
            />
          </div>
          <div className="max-h-full max-w-[25%] p-0 rounded-2xl overflow-hidden">
            {video && (
              <video
                src='/video/video.mp4' // letakkan file di public/videos/display.mp4
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-fit shadow-lg"
              />
            )}
          </div>
          {/* Right (Agenda) */}

          <div className="flex flex-col text-black rounded-lg overflow-hidden">
            <Carousel
              className="w-full max-w-xs "
              plugins={[plugin.current]}
            >
              <CarouselContent className="flex items-center">
                {Array.isArray(display.content) &&
                  display.content.map((val, index) => (
                    <CarouselItem key={index} className="max-h-[450px] overflow-hidden">
                      <div className="w-full max-h-full p-6 flex flex-col gap-6 justify-center rounded-lg bg-white text-start">
                        <h2 className="font-bold text-lg text-center">{val.key}</h2>
                        <h2 className="text-lg overflow-hidden">{val.value}</h2>
                      </div>
                    </CarouselItem>
                  ))}
              </CarouselContent>
            </Carousel>
          </div>
          <div className="w-[10%] h-full">
            <div className="flex flex-col py-5 gap-3 justify-center items-center h-full bg-white text-black rounded-lg">
              <h2 className="font-bold text-2xl text-center">Nomor Antrian</h2>
              <div className=" text-9xl font-bold ">
                <AnimatedNumber value={antrian} />
              </div>
            </div>
          </div>

          <Card className="w-[15%] p-3 bg-[#E6F0FA] flex justify-center items-center bg-[url('/siger.png')] relative bg-center bg-repeat bg-size-[60px] ">
            <div className="absolute inset-0  bg-[#E6F0FA] opacity-70" />
            <Image
              className="z-10 w-full object-cover"
              src="/camat.png"
              alt="logo"
              width={350}
              height={350}
            />
          </Card>

        </div>
        {/* Left (Image) */}


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
