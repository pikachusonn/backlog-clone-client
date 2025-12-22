/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import Image from "next/image";
import { BsExclamationLg, BsThreeDots } from "react-icons/bs";
import { SiRiotgames } from "react-icons/si";
import { ChevronRight } from "lucide-react";
import CorporationMenu from "./CorporationMenu";
import styles from "./style.module.css";
import CollapsedProjectPopover from "./CollapsedProjectPopover";
import { useRouter, useSearchParams } from "next/navigation";
interface SidebarSubItem {
  title: string;
  url: string;
}

interface SidebarItem {
  title: string;
  url: string;
  icon: React.ReactNode;
  items?: SidebarSubItem[];
}

const AppSidebar = ({
  items,
  projects,
  activeProjectId,
}: {
  items: SidebarItem[];
  projects?: any[];
  activeProjectId?: string;
}) => {
  const { open } = useSidebar();
  const router = useRouter();
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader
        className={`${!open && styles.collapsedSidebarHeader} border-b`}
      >
        {open ? (
          <div className="flex gap-[8px] items-center p-2 rounded-md">
            <SiRiotgames size={30} className="text-red-600" />
            <div className="flex-1 flex flex-col">
              <p className="text-base/4 font-medium">PREMIER</p>
              <p className="text-sm/4">A league of its own</p>
            </div>
            <CorporationMenu />
          </div>
        ) : (
          <SiRiotgames size={20} className="text-red-600" />
        )}
      </SidebarHeader>
      <SidebarContent className="mt-2">
        <SidebarGroup className="border-y py-4">
          {/* <SidebarGroupLabel>Application</SidebarGroupLabel> */}
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const hasNestedItems = item.items && item.items.length > 0;

                if (hasNestedItems) {
                  return (
                    <Collapsible
                      key={item.title}
                      asChild
                      defaultOpen={false}
                      className="group/collapsible"
                    >
                      <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton tooltip={item.title}>
                            {item.icon}
                            <span className="font-semibold">{item.title}</span>
                            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {item.items!.map((subItem) => (
                              <SidebarMenuSubItem key={subItem.title}>
                                <SidebarMenuSubButton asChild>
                                  <a href={subItem.url}>
                                    <span>{subItem.title}</span>
                                  </a>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </SidebarMenuItem>
                    </Collapsible>
                  );
                }

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild tooltip={item.title}>
                      <a href={item.url}>
                        {item.icon}
                        <span className="font-semibold">{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="border-y py-2 px-0">
          {/* <SidebarGroupLabel>Application</SidebarGroupLabel> */}
          <SidebarGroupContent>
            <SidebarMenu className="flex flex-col gap-2">
              {projects &&
                projects.length > 0 &&
                projects.map((project, index) => (
                  <div
                    className={`flex gap-3 items-center w-full ${
                      activeProjectId === index.toString()
                        ? "bg-neutral-800 text-white"
                        : "hover:bg-accent"
                    } cursor-pointer p-2`}
                    key={index}
                    onClick={() => {
                      router.push(`/project/${index}`);
                    }}
                  >
                    {open ? (
                      <img
                        src={project.image}
                        alt={project.name}
                        className={`rounded-full object-cover object-center w-[35px] h-[35px] border border-neutral-400 shadow-lg`}
                      />
                    ) : (
                      <CollapsedProjectPopover
                        popOverTrigger={
                          <img
                            src={project.image}
                            alt={project.name}
                            className={`rounded-full object-cover object-center w-[30px] h-[30px] border border-neutral-400 shadow-lg`}
                          />
                        }
                      />
                    )}
                    {open && (
                      <>
                        <div className="flex-1 flex-col">
                          <p className="text-sm font-medium leading-4">
                            {project.name}
                          </p>
                          <span
                            className={`text-xs leading-4 text-muted-foreground ${
                              activeProjectId === index.toString()
                                ? "text-white"
                                : ""
                            }`}
                          >
                            1 new update
                          </span>
                        </div>
                        <BsThreeDots size={20} />
                      </>
                    )}
                  </div>
                ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t">
        <div
          className={`${
            open
              ? "flex items-center justify-between p-2 hover:bg-neutral-200/50 cursor-pointer rounded-md"
              : "flex items-center justify-center"
          }`}
        >
          {open ? (
            <>
              <div className="flex items-center gap-2">
                <img
                  src="https://ui.shadcn.com/avatars/shadcn.jpg"
                  alt="avatar"
                  className="rounded-md object-cover object-center w-[35px] h-[35px]"
                />
                <div>
                  <p className="text-sm font-medium leading-4">Priscilla</p>
                  <p className="text-sm font-light leading-4">
                    prisci@gmail.com
                  </p>
                </div>
              </div>
              <BsExclamationLg size={25} />
            </>
          ) : (
            <img
              src="https://ui.shadcn.com/avatars/shadcn.jpg"
              alt="avatar"
              className="rounded-md object-cover object-center w-[35px] h-[35px]"
            />
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
