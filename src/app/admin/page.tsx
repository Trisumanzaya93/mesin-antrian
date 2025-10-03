import { AppSidebar } from "@/components/app-sidebar"
import AntrianTable from "@/components/queue-table"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

//handle button logi

const rows: AntrianRow[] = [
    { id: 1, antrian: "A001", jenisPelayanan: "CS", namaPemohon: "Budi", status: "menunggu" },
    { id: 2, antrian: "A001", jenisPelayanan: "CS", namaPemohon: "Budi", status: "selesai" },
    { id: 3, antrian: "A001", jenisPelayanan: "CS", namaPemohon: "Budi", status: "menunggu" },
    { id: 4, antrian: "A001", jenisPelayanan: "CS", namaPemohon: "Budi", status: "dipanggil" },
    { id: 5, antrian: "A001", jenisPelayanan: "CS", namaPemohon: "Budi", status: "menunggu" },
    { id: 6, antrian: "A001", jenisPelayanan: "CS", namaPemohon: "Budi", status: "selesai" },
    { id: 7, antrian: "A001", jenisPelayanan: "CS", namaPemohon: "Budi", status: "menunggu" },
    { id: 8, antrian: "A001", jenisPelayanan: "CS", namaPemohon: "Budi", status: "menunggu" },
    // ...
  ];

export default function Page() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/">
                  Pelayanan
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Form Pelayanan</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <div className="flex flex-1  flex-col p-16">
            <div className="mb-4">
                <Label className="mb-4">Jenis Pelayanan</Label>
                <Input/>
            </div>
            <div className="mb-4">
                <Label className="mb-4">Nama Pemohon</Label>
                <Input/>
            </div>
            <div className="mb-4 ml-auto">
                <Button variant='outline' className=" px-20">Cetak</Button>
            </div>
            <div className="mb-4">
                <Label className="mb-4 ">list Pelayanan</Label>
                <Input/>
            </div>
            <div>
            <AntrianTable rows={rows}/>
            </div>
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <div className="bg-muted/50 aspect-video rounded-xl" />
            <div className="bg-muted/50 aspect-video rounded-xl" />
            <div className="bg-muted/50 aspect-video rounded-xl" />
          </div>
          <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min" />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
