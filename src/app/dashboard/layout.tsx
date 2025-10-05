// app/layout.tsx
"use client";

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useRouter } from "next/navigation";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [path, setPath] = useState<RegExpMatchArray | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (pathname) {
      const matches = pathname.match(/[^/]+/g);
      setPath(matches);
    }
  }, [pathname]);

  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <SidebarProvider>
          <Toaster richColors theme="light" position="top-center" />
          <AppSidebar className="bg-[#E6F0FA]" router={router} />
          <SidebarInset>
            <nav
              style={{
                position: "sticky",
                top: 0,
                zIndex: 100,
              }}
            >
              <div className="flex h-16 shrink-0 items-center gap-2 border-b px-4 bg-[#E6F0FA]">
                <SidebarTrigger className="-ml-1" />
                <Separator
                  orientation="vertical"
                  className="mr-2 data-[orientation=vertical]:h-4"
                />
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem>
                      <BreadcrumbPage className="font-bold">
                        {path ? path[path.length - 1].toUpperCase() : ""}
                      </BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </div>
            </nav>
            {children}
          </SidebarInset>
        </SidebarProvider>
      </body>
    </html>
  );
}
