"use client";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { CiCalendar } from "react-icons/ci";
import { FaThreads } from "react-icons/fa6";
import { IoChatbubblesOutline, IoNotificationsOutline } from "react-icons/io5";
import AppSidebar from "../common/Sidebar";
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

  const projects = [
    {
      name: "Project 1",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSioUd0qWL9XkRAGsjyeMDJ5N6nK0uJ0zzjtg&s",
    },
    {
      name: "Project 2",
      image: "https://pbs.twimg.com/media/G0gq3CLW4AAYUWy.png",
    },
    {
      name: "Project 3",
      image: "https://pbs.twimg.com/media/G0dDozkWcAAaG65.jpg",
    },
  ];
  return (
    <SidebarProvider>
      <AppSidebar items={items} projects={projects} activeProjectId={activeProjectId} />
      <main className="w-full">
        {/* <SidebarTrigger/> */}
        <div className="w-full">{children}</div>
      </main>
    </SidebarProvider>
  );
};

export default CommonLayout;
