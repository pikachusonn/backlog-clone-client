/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CiCalendar } from "react-icons/ci";
import { IoIosBug, IoIosSearch } from "react-icons/io";
import { PiSlidersHorizontal } from "react-icons/pi";
import { MdLocalFireDepartment } from "react-icons/md";
import { BiTask } from "react-icons/bi";
import { TaskStatus } from "@/interface/common";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { getTasksOfProject } from "@/api/task";
import AssigneePopover from "./AssigneePopover";
import { getProjectDetails } from "@/api/project";
import { GoPlus } from "react-icons/go";
const KanbanBoard = ({ taskStatuses }: { taskStatuses: TaskStatus[] }) => {
  const param = useParams();
  const projectId = param.id as string;
  const { data: tasks } = useQuery({
    queryKey: ["tasks", projectId],
    queryFn: () => getTasksOfProject(projectId),
    enabled: !!projectId,
  });

  const { data: projectDetails } = useQuery({
    queryKey: ["project-details", projectId],
    queryFn: () => getProjectDetails(projectId),
    enabled: !!projectId,
  });

  return (
    <div className="flex flex-col gap-2 h-[calc(100vh-125px)]">
      <div className="flex items-center gap-2">
        <div className="relative">
          <IoIosSearch
            size={20}
            className="absolute top-1/2 -translate-y-1/2 left-2 text-muted-foreground"
          />
          <Input placeholder="Search" className="inset-0 w-[200px] pl-[30px]" />
        </div>
        <div className="flex items-center relative">
          {projectDetails?.projectCollaborators?.map((c, index) =>
            !!c?.targetAccount?.avatar ? (
              <img
                src={c?.targetAccount?.avatar}
                alt={c?.targetAccount?.email}
                className={`w-[30px] h-[30px] rounded-full object-cover border border-black/50 border-2 relative z-${index} left-[${
                  index * -10
                }px]
                } ${c?.projectRole === "OWNER" ? "border-orange-500" : ""}`}
                key={c?.id}
              />
            ) : (
              <span
                className="w-[30px] h-[30px] bg-orange-300 font-medium rounded-full text-sm aspect-square w-[24px] text-center flex items-center justify-center"
                key={c?.id}
              >
                S
              </span>
            )
          )}
        </div>
        <Button variant="outline" size="icon">
          <PiSlidersHorizontal />
        </Button>
      </div>
      <div className="flex flex-1 gap-3 items-stretch pb-2">
        {taskStatuses
          ?.sort(
            (a: TaskStatus, b: TaskStatus) => a.statusOrder - b.statusOrder
          )
          ?.map((taskStatus) => {
            console.log();

            const tasksOfStatus = tasks?.data.filter(
              (task: any) => task.taskStatusId === taskStatus.id
            );
            return (
              <div
                key={taskStatus.id}
                className="flex w-[280px] bg-neutral-100 rounded-md border border-neutral-2/5000 flex-col gap-2 pb-2"
              >
                <div className="flex flex-col gap-2 flex-1">
                  <div className="py-2 px-4 flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: taskStatus.color }}
                    ></div>
                    <span>{taskStatus.text}</span>
                    <span className="text-sm bg-gray-200 rounded-full px-3 font-medium">
                      {tasksOfStatus?.length}
                    </span>
                  </div>
                  <div className="bg-neutral-100 pb-2">
                    <div className="max-h-[calc(100dvh-234px)] p-1 flex flex-col gap-2 overflow-y-auto">
                      {tasksOfStatus?.map((task: any, indexTask: number) => (
                        <div
                          key={indexTask}
                          className="w-full bg-white rounded border p-3 flex flex-col gap-2"
                        >
                          <span>{task.name}</span>
                          {!!task.dueDate && (
                            <div className="flex items-center gap-2 border rounded w-fit px-2">
                              <CiCalendar />
                              <span className="text-sm">{task.dueDate}</span>
                              {indexTask === 2 && (
                                <MdLocalFireDepartment className="text-orange-500" />
                              )}
                            </div>
                          )}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {indexTask % 2 === 0 ? (
                                <BiTask className="text-blue-500" />
                              ) : (
                                <IoIosBug className="text-red-500" />
                              )}
                              <span className="text-sm">
                                BC-{indexTask + 1}
                              </span>
                            </div>
                            <AssigneePopover
                              assignee={task.assignee}
                              assigneeList={
                                projectDetails?.projectCollaborators
                              }
                              taskId={task.id}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                {taskStatus?.statusOrder === 0 && (
                  <div className=" hover:bg-neutral-200 rounded-md p-2 font-semibold mx-2 flex items-center gap-2 cursor-pointer">
                    <GoPlus />
                    Create
                  </div>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
};
export default KanbanBoard;
