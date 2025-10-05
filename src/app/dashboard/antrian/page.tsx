"use client";

import { AppSidebar } from "@/components/app-sidebar";
import AntrianTable from "@/components/queue-table";
import { IoMdCloseCircle } from "react-icons/io";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Queue = {
  id: number;
  nomorAntrian: string;
  jenisPelayanan: string;
  namaPemohon: string;
  status: string;
  createdAt: string;
};

export default function Page() {
  const [queues, setQueues] = useState<Queue[]>([]);
  const [loading, setLoading] = useState(true);
  const [namaPemohon, setNamaPemohon] = useState("");
  const [jenisPelayanan, setJenisPelayanan] = useState("");
  const [error, setError] = useState<string | null>(null);

  const fetchQueues = async (): Promise<void> => {
    try {
      setLoading(true);
      const res = await fetch("/api/queue");
      const json = await res.json();

      if (!json.success)
        throw new Error(json.message || "Failed to fetch data");

      setQueues(json.data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!namaPemohon || !jenisPelayanan) {
      toast.error("kolom input tidak boleh kosong");
      return;
    }
    try {
      setLoading(true);
      const res = await fetch("/api/queue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          namaPemohon,
          jenisPelayanan,
          status: "Proses",
        }),
      });
      const json = await res.json();
      if (!json.success)
        throw new Error(json.message || "Gagal membuat antrian");
      toast.success("sukses membuat antrian");
      setNamaPemohon("");
      setJenisPelayanan("");
      fetchQueues();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueues();
  }, []);
  return (
    <div>
        <form onSubmit={handleSubmit} className="flex  flex-col pt-16 px-16">
      <Card>
        <CardHeader>
          <CardTitle>Form Antrian</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="mb-4">
            <Label className="mb-4">Jenis Pelayanan</Label>
            <Select value={jenisPelayanan} onValueChange={(e) => setJenisPelayanan(e)}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Permohonan KTP">Surat Permohonan KTP</SelectItem>
                <SelectItem value="Surat Permohonan KK">Surat Permohonan KK</SelectItem>
                <SelectItem value="Surat Keterangan Usaha">Surat Keterangan Usaha</SelectItem>
                <SelectItem value="Surat Keterangan Domisili">Surat Keterangan Domisili</SelectItem>
                <SelectItem value="Surat Keterangan Tidak Mampu">Surat Keterangan Tidak Mampu</SelectItem>
                <SelectItem value="Surat keterangan Izin Keramaian">Surat keterangan Izin Keramaian</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="mb-8">
            <Label className="mb-4">Nama Pemohon</Label>
            <Input
              id="namaPemohon"
              value={namaPemohon}
              onChange={(e) => setNamaPemohon(e.target.value)}
            />
          </div>
          <div className="mb-4 w-full flex">
            <Button
              type="submit"
              variant="outline"
              className="bg-blue-700 hover:bg-blue-800 text-white hover:text-white shadow-lg ml-auto px-20"
            >
              Cetak
            </Button>
          </div>
        </CardContent>
      </Card>
        </form>
        <div className="px-16">
          <AntrianTable
            rows={queues}
            isLoading={loading}
            refetch={fetchQueues}
          />
        </div>
    </div>
  );
}
