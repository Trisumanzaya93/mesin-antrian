"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { FileUpload } from "@/components/ui/file-upload";
import { toast } from "sonner";


export default function SettingDisplayPage() {
  const [image, setImage] = useState<string | null>(null);
  const [file, setFile] = useState<File>();
  const [runningText, setRunningText] = useState("");
  const [settings, setSettings] = useState<{ key: string; value: string }[]>([
    // { key: "Data Penduduk", value: "1600 orang" },
  ]);

  const handleImageUpload = (files: File[]) => {
    const file = files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      console.log(file);
      setFile(file)
      setImage(url);
    }
  };

  const handleAddRow = () => {
    setSettings([...settings, { key: "", value: "" }]);
  };

  const handleChange = (index: number, field: "key" | "value", value: string) => {
    const newSettings = [...settings];
    newSettings[index][field] = value;
    setSettings(newSettings);
  };

  const handleSave = () => async () => {
    if (!file) return toast.error('input tidak boleh kosong');
    const formData = new FormData();
    formData.append("file", file);

    await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    toast.success("sukses memperbarui video");
  };

  const onSubmitDisplay = () => async () => {
    const body = {
      runningText,
      content: settings,
    };

    const newBody = Object.entries(body)
      .filter(([_, v]) => v != null && v !== "" && v.length !== 0)
      .reduce(
        (acc, [k, v]) => ({
          ...acc,
          [k]:v,
        }),
        {}
      );
      
    await fetch("/api/display/setting", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...newBody
      }),
    });
    
    toast.success("sukses memperbarui display");
    try {
      
    } catch (error) {
      toast.error('gagal memperbarui display');
      
    }

  }

  return (
    <div className="space-y-6 px-16 pt-16">
      {/* Upload Foto */}
      <Card>
        <CardHeader>
          <CardTitle>Upload Video</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FileUpload onChange={handleImageUpload}  />
          {/* <Input type="file" accept="image/*" onChange={handleImageUpload} /> */}
          {image && <video src={image} autoPlay muted className="w-full rounded-md border" />}
          
          <div className="flex gap-3 mt-4">
            <Button onClick={handleSave()}>Simpan</Button>
          </div>
          
        </CardContent>
      </Card>

      {/* Running Text */}

      {/* Form Table */}
      <Card>
        <CardHeader>
          <CardTitle>Text Berjalan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Input
            placeholder="Masukkan teks berjalan..."
            value={runningText}
            onChange={(e) => setRunningText(e.target.value)}
          />
        </CardContent>
        <CardHeader>
          <CardTitle>Konten</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableBody>
              {settings.map((row, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Input
                      value={row.key}
                      onChange={(e) => handleChange(i, "key", e.target.value)}
                      placeholder="contoh: Data Penduduk"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={row.value}
                      onChange={(e) => handleChange(i, "value", e.target.value)}
                      placeholder="contoh: 1500 orang"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="flex gap-3 mt-4">
            <Button variant="outline" onClick={handleAddRow}>Tambah Baris</Button>
            <Button onClick={onSubmitDisplay()}>Simpan</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
