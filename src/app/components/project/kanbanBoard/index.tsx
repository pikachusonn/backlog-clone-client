"use client";
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IoIosSearch } from "react-icons/io";
import { PiSlidersHorizontal } from "react-icons/pi";
import { TaskStatus } from "@/interface/common";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { getTasksOfProject, updateTaskStatus } from "@/api/task";
import { getProjectDetails } from "@/api/project";
import { useEffect, useState } from "react";
import {
  DndContext,
  DragOverlay,
  MouseSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import KanbanBoardColumn from "./KanbanBoardColumn";
import KanbanCard from "./KanbanCard";
import { SafePointerSensor } from "./PointSensor";
import toast from "react-hot-toast";
import { Task } from "@/interface/kanban";
import TaskDetailDialog from "./TaskDetailDialog";
const KanbanBoard = ({ taskStatuses }: { taskStatuses: TaskStatus[] }) => {
  const param = useParams();
  const [openAddTaskDialog, setOpenAddTaskDialog] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const projectId = param.id as string;
  const { data: tasks } = useQuery({
    queryKey: ["tasks", projectId],
    queryFn: () => getTasksOfProject(projectId),
    enabled: !!projectId,
  });

  const { mutate: updateTaskStatusMutation } = useMutation({
    mutationFn: ({ taskId, statusId }: { taskId: string; statusId: string }) =>
      updateTaskStatus({ taskId, statusId }),
    onSuccess: (response, variables) => {
      console.log(response, variables);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const { data: projectDetails } = useQuery({
    queryKey: ["project-details", projectId],
    queryFn: () => getProjectDetails(projectId),
    enabled: !!projectId,
  });

  const sensors = useSensors(
    useSensor(SafePointerSensor),
    // useSensor(MouseSensor, {
    //   activationConstraint: {
    //     distance: 5,
    //   },
    // })
  );

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
                className={`w-[30px] h-[30px] rounded-full object-cover border border-black/50 border-2 relative z-${index} 
                } ${c?.projectRole === "OWNER" ? "border-orange-500" : ""}`}
                key={c?.id}
                style={{ left: `${index * -10}px` }}
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
      <DndContext
        sensors={sensors}
        onDragStart={({ active }) => {
          setActiveTaskId(active.id as string);
        }}
        onDragEnd={({ active, over }) => {
          setActiveTaskId(null);
          if (!over) return;
          queryClient.setQueryData(["tasks", projectId], (old: any) => {
            if (!old?.data) return old;
            const task = old.data.find((t: any) => t.id === active.id);
            if (!task || task.taskStatusId === over.id) {
              return old;
            }
            return {
              ...old,
              data: old.data.map((t: any) =>
                t.id === active.id
                  ? { ...t, taskStatusId: over.id as string }
                  : t
              ),
            };
          });
          if (over.id !== active?.data?.current?.taskStatusId) {
            updateTaskStatusMutation({
              taskId: active.id as string,
              statusId: over.id as string,
            });
          }
        }}
        onDragCancel={() => setActiveTaskId(null)}
      >
        <div className="flex flex-1 gap-3 items-stretch pb-2">
          {taskStatuses
            ?.sort(
              (a: TaskStatus, b: TaskStatus) => a.statusOrder - b.statusOrder
            )
            ?.map((taskStatus) => {
              const tasksOfStatus = tasks?.data.filter(
                (task: any) => task.taskStatusId === taskStatus.id
              );
              return (
                <KanbanBoardColumn
                  openAddTaskDialog={openAddTaskDialog}
                  projectId={projectId}
                  projectDetails={projectDetails}
                  setOpenAddTaskDialog={setOpenAddTaskDialog}
                  taskStatus={taskStatus}
                  tasksOfStatus={tasksOfStatus}
                  key={taskStatus.id}
                  setEditTask={setEditTask}
                />
              );
            })}
        </div>
        <DragOverlay>
          {activeTaskId ? (
            <KanbanCard
              task={tasks?.data.find((t: any) => t.id === activeTaskId)}
              indexTask={-1}
              projectDetails={projectDetails}
              taskStatuses={taskStatuses}
              setEditTask={setEditTask}
            />
          ) : null}
        </DragOverlay>
      </DndContext>
      {!!editTask && (
        <TaskDetailDialog
          open={!!editTask}
          projectDetails={projectDetails}
          onOpenChange={setEditTask}
          onCancel={() => setEditTask(null)}
          onSave={() => setEditTask(null)}
          task={editTask}
        />
      )}
    </div>
  );
};
export default KanbanBoard;
