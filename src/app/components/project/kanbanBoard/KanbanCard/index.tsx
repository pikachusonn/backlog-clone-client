/* eslint-disable @next/next/no-img-element */
"use client";
import { ProjectDetails, TaskStatus } from "@/interface/common";
import { Task } from "@/interface/kanban";
import { format, isPast } from "date-fns";
import { BiTask } from "react-icons/bi";
import { CiCalendar, CiUser } from "react-icons/ci";
import { IoIosBug } from "react-icons/io";
import { MdLocalFireDepartment } from "react-icons/md";
import AssigneePopover from "../AssigneePopover";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import {
  TASK_PRIORITY,
  TASK_PRIORITY_OPTIONS,
  TASK_TYPE,
} from "@/constant/task";
import { FaChevronUp } from "react-icons/fa6";
import { cn } from "@/lib/utils";
import styles from "../styles.module.css";
import { useMemo } from "react";

interface Props {
  task: Task;
  indexTask: number;
  projectDetails?: ProjectDetails;
  taskStatuses: TaskStatus[];
  setEditTask: (task: Task) => void;
}
const KanbanCard = ({
  task,
  indexTask,
  projectDetails,
  taskStatuses,
  setEditTask,
}: Props) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id: task.id, data: task });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition: isDragging
      ? "none"
      : "transform 100ms cubic-bezier(0.22, 1, 0.36, 1)",
    boxShadow: isDragging ? "0 0 15px 0 rgba(0, 0, 0, 0.2)" : "none",
    border: isDragging ? "1px solid #919191" : "1px solid #e0e0e0",
  };

  const priorityIndex = Math.max(
    0,
    TASK_PRIORITY_OPTIONS.findIndex((option) => option.value === task.priority)
  );
  const currentStatus = useMemo(() => {
    return taskStatuses?.find(
      (status: TaskStatus) => status.id === task.taskStatusId
    );
  }, [taskStatuses, task.taskStatusId]);
  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      key={indexTask}
      style={style}
      className="w-full bg-white rounded border p-3 flex flex-col gap-2 cursor-pointer relative"
      onClick={() => {
        setEditTask(task);
      }}
    >
      <span>{task.name}</span>
      {!!task.dueDate && (
        <div className="flex items-center gap-2 border rounded w-fit px-2">
          <CiCalendar />
          <span className="text-sm">
            {format(new Date(task.dueDate), "MMM dd, yyyy")}
          </span>
          {isPast(new Date(task.dueDate)) && !currentStatus?.isDoneStatus && (
            <MdLocalFireDepartment className="text-orange-500" />
          )}
        </div>
      )}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {task.type === TASK_TYPE.TASK ? (
            <BiTask className="text-blue-500" />
          ) : (
            <IoIosBug className="text-red-500" />
          )}
          <div className={styles.selectIcon}>
            {Array.from({ length: priorityIndex + 1 }).map((_, index) => (
              <FaChevronUp
                key={index}
                className={cn(
                  "relative",
                  styles.selectIcon,
                  {
                    "text-green-500": task.priority === TASK_PRIORITY.LOW,
                    "text-blue-500": task.priority === TASK_PRIORITY.MEDIUM,
                    "text-red-500": task.priority === TASK_PRIORITY.HIGH,
                  },

                  {
                    "bottom-[3px]": index === 2,
                    "top-[3px]":
                      index === 0 && task.priority === TASK_PRIORITY.HIGH,
                  },
                  {
                    "bottom-[2px]":
                      index === 1 && task.priority === TASK_PRIORITY.MEDIUM,
                    "top-[2px]":
                      index === 0 && task.priority === TASK_PRIORITY.MEDIUM,
                  }
                )}
              />
            ))}
          </div>
        </div>
        <AssigneePopover
          assignee={task.assignee}
          assigneeList={projectDetails?.projectCollaborators}
          taskId={task.id}
          popoverTrigger={
            task.assignee ? (
              task.assignee?.targetAccount?.avatar ? (
                <img
                  data-dnd-ignore
                  src={task.assignee?.targetAccount?.avatar}
                  alt={task.assignee?.targetAccount?.email}
                  className="rounded-full aspect-square w-[28px] object-cover object-center border border-black/50"
                  onClick={(e) => e.stopPropagation()}
                />
              ) : (
                <span
                  data-dnd-ignore
                  className="bg-orange-300 font-medium rounded-full text-sm aspect-square w-[24px] text-center flex items-center justify-center"
                >
                  S
                </span>
              )
            ) : (
              <span className="bg-gray-300 font-medium rounded-full text-sm aspect-square w-[24px] text-center flex items-center justify-center">
                <CiUser />
              </span>
            )
          }
        />
      </div>
    </div>
  );
};

export default KanbanCard;
