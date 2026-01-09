"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ProjectDetails, TaskStatus } from "@/interface/common";
import { Task } from "@/interface/kanban";
import { GoPlus } from "react-icons/go";
import { useDroppable } from "@dnd-kit/core";
import KanbanCard from "../KanbanCard";
import { cn } from "@/lib/utils";
import AddTaskDialog from "../AddTaskDialog";

const KanbanBoardColumn = ({
  taskStatus,
  tasksOfStatus,
  projectDetails,
  openAddTaskDialog,
  setOpenAddTaskDialog,
  projectId,
  setEditTask,
}: {
  taskStatus: TaskStatus;
  tasksOfStatus: Task[];
  projectDetails?: ProjectDetails;
  openAddTaskDialog: boolean;
  setOpenAddTaskDialog: (open: boolean) => void;
  projectId: string;
  setEditTask: (task: Task) => void;
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: taskStatus.id,
  });
  return (
    <div
      key={taskStatus.id}
      ref={setNodeRef}
      className={cn(
        "flex w-[280px] bg-neutral-100 rounded-md border border-neutral-2/5000 flex-col gap-2 pb-2",
        isOver && "bg-sky-500/10 border-sky-500"
      )}
    >
      <div className="flex flex-col gap-2 flex-1">
        <div className="py-2 px-4 flex items-center gap-3">
          {/* <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: taskStatus.color }}
          ></div> */}
          <div
            className="w-3 h-3 rounded-full"
            style={{
              backgroundColor: taskStatus.color,
              boxShadow: `0 0 5px 1px ${taskStatus.color}`,
            }}
          ></div>
          <span>{taskStatus.text}</span>
          <span className="text-sm bg-gray-200 rounded-full px-3 font-medium">
            {tasksOfStatus?.length}
          </span>
        </div>
        <div className="pb-2">
          <div className="max-h-[calc(100dvh-290px)] p-1 flex flex-col gap-2 overflow-y-auto overflow-x-hidden">
            {tasksOfStatus?.map((task: any, indexTask: number) => (
              <KanbanCard
                task={task}
                indexTask={indexTask}
                projectDetails={projectDetails}
                key={task.id}
                taskStatuses={projectDetails?.taskStatuses || []}
                setEditTask={setEditTask}
              />
            ))}
          </div>
        </div>
      </div>
      {taskStatus?.statusOrder === 0 && (
        <AddTaskDialog
          open={openAddTaskDialog}
          onOpenChange={setOpenAddTaskDialog}
          projectId={projectId}
          assigneeOptions={
            projectDetails?.projectCollaborators?.map((c) => ({
              label: c?.targetAccount?.email,
              value: c?.id,
              avatarUrl: c?.targetAccount?.avatar,
            })) || []
          }
          dialogTrigger={
            <div className=" hover:bg-neutral-200 rounded-md p-2 font-semibold mx-2 flex items-center gap-2 cursor-pointer">
              <GoPlus />
              Create
            </div>
          }
          onCancel={() => {
            setOpenAddTaskDialog(false);
          }}
          onSave={() => {
            setOpenAddTaskDialog(false);
          }}
        />
      )}
    </div>
  );
};

export default KanbanBoardColumn;
