'use client'

import * as React from "react"

import { SearchForm } from "@/components/search-form"
import { VersionSwitcher } from "@/components/version-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"

// This is sample data.
const data = {
  versions: ["1.0.1", "1.1.0-alpha", "2.0.0-beta1"],
  navMain: [
    {
      title: "Dashboard Antrian",
      items: [
        {
          title: "Form Antrian",
          url: "/dashboard/antrian",
        },
        {
          title: "Setting Display",
          url: "/dashboard/display",
        }
      ],
    },
  ],
}

export function AppSidebar({ ...props }: any) {
  const [indexActive, setIndexActive] = React.useState(0)

  return (
    <Sidebar {...props}>
      <SidebarContent className="bg-[#E6F0FA]">
        {data.navMain.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel className="text-[#37474F] text-lg font-bold mt-2">{item.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items.map((item, idx) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={indexActive === idx} className="font-semibold">
                      <button onClick={() =>{
                        setIndexActive(idx)
                        console.log(props);
                        
                        props.router.push(item.url)
                      }}>{item.title}</button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
