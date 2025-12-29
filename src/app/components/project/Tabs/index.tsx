import { Tabs, TabsContent, TabsTrigger, TabsList } from "@/components/ui/tabs";
import KanbanBoard from "../kanbanBoard";

const ProjectTabs = () => {
  const tabs = [
    {
      name: "Overview",
      value: "overview",
      content: "Overview of the project",
    },
    {
      name: "Kanban board",
      value: "kanban-board",
      content: <KanbanBoard />,
    },
    {
      name: "Timeline",
      value: "timeline",
      content: "Timeline of the project",
    },
    {
      name: "Files",
      value: "files",
      content: "Files of the project",
    },
    {
      name: "Settings",
      value: "settings",
      content: "Settings of the project",
    },
  ];
  return (
    <div className="w-full flex-1">
      <Tabs defaultValue="overview" className="gap-4 w-full">
        <TabsList className="bg-background rounded-none border-b p-0 w-full justify-start">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="bg-background data-[state=active]:border-primary dark:data-[state=active]:border-primary h-full rounded-none border-0 border-b-2 border-transparent data-[state=active]:shadow-none flex-none px-[15px]"
            >
              {tab.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {tabs.map((tab) => (
          <TabsContent key={tab.value} value={tab.value} className="px-[16px]">
            {tab.content}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default ProjectTabs;
