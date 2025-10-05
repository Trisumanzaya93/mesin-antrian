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
    <div className="font-mono h-screen bg-white items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20"
      style={{
        
        backgroundImage: `src('/siger.png')`,
      }}
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
      <div className="w-full font-bold gap-28 flex justify-center text-white items-center">
          <button onClick={() => router.push('/dashboard/antrian')} className="text-center text-xl border-gray-200 px-12 py-12 border-2 rounded-2xl shadow-xl bg-[#38bdf8ff]">
            <GrUserAdmin className="text-9xl mb-4"/>
            <p>Admin</p>
          </button>
          <button onClick={() => router.push('/display')} className="text-center text-xl border-gray-200 border-2 px-12 py-12 rounded-2xl shadow-xl bg-[#38bdf8ff]">
          <FaTv className="text-9xl mb-4"/>
            <p>Display</p>
          </button>
      </div>
    </div>
  );
}
