"use client";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { CiCalendar } from "react-icons/ci";
import { FaThreads } from "react-icons/fa6";
import { IoChatbubblesOutline, IoNotificationsOutline } from "react-icons/io5";
import AppSidebar from "../common/Sidebar";
import { useQuery } from "@tanstack/react-query";
import { getParticipatedProjects } from "@/api/project";
const CommonLayout = ({
  children,
  activeProjectId,
}: {
  children: React.ReactNode;
  activeProjectId?: string;
}) => {
  const items = [
    {
      title: "Notifications",
      url: "#",
      icon: <IoNotificationsOutline />,
    },
    {
      title: "Chat",
      url: "#",
      icon: <IoChatbubblesOutline />,
      items: [
        {
          title: "Dashboard",
          url: "#",
        },
        {
          title: "Overview",
          url: "#",
        },
        {
          title: "Analytics",
          url: "#",
        },
      ],
    },
    {
      title: "Threads",
      url: "#",
      icon: <FaThreads />,
    },
    {
      title: "Calendar",
      url: "#",
      icon: <CiCalendar />,
    },
  ];

  return (
    <SidebarProvider>
      <AppSidebar
        items={items}
        activeProjectId={activeProjectId}
      />
      <main className="w-full">
        {/* <SidebarTrigger/> */}
        <div className="w-full">{children}</div>
      </main>
    </SidebarProvider>
  );
};

export default CommonLayout;
