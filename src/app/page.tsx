'use client'

import { LoginForm } from "@/components/login-form";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { GrUserAdmin } from "react-icons/gr";
import { FaTv } from "react-icons/fa";
import { useRouter } from 'next/navigation';

//text to speech

//id, nomor antrian, jenis pelayanan ,nama pemohon, status 

//status in progress selesai diambil

//yang tampil dilayar status selesai 

//ketika admin ganti status dari selesai ke diambil keluar text to speech

//confirm display nomor antrian itu berdasarkan status terakhir atau gimana

export default function Home() {
  const router = useRouter()
  return (
    <div className="font-mono h-screen bg-[#E6F0FA] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20"
    >
      
      <Image
          className="dark:invert"
          src="/siger.png"
          alt="siger"
          width={180}
          height={38}
          priority
        />
      <p className="text-4xl font-bold text-[#1e293bff]">Sistem Antrian </p>
      <p className="text-4xl font-bold text-[#1e293bff] mb-16">Desa Negara Ratu </p>
      <div className="w-full font-bold gap-28 flex justify-center items-center">
          <button onClick={() => router.push('/dashboard/antrian')} className="bg-[url('/siger.png')] relative bg-center bg-repeat bg-size-[60px] text-center text-xl border-gray-200 px-12 py-12 border-2 rounded-2xl shadow-xl bg-[#E6F0FA]">
          <div className="absolute inset-0  bg-[#E6F0FA] opacity-70" />
          <div className="z-10 relative text-black">

            <GrUserAdmin className="text-9xl mb-4"/>
            <p>Admin</p>
          </div>
          </button>
          <button onClick={() => router.push('/display')} className="bg-[url('/siger.png')] relative bg-center bg-repeat bg-size-[60px] text-center text-xl border-gray-200 border-2 px-12 py-12 rounded-2xl shadow-xl bg-[#E6F0FA]">
          <div className="absolute inset-0  bg-[#E6F0FA] opacity-70" />
          <div className="z-10 relative text-black">
          <FaTv className="text-9xl mb-4"/>
            <p>Display</p>
          </div>
          </button>
      </div>
    </div>
  );
}
