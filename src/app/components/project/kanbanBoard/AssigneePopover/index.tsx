/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { updateTask, updateTaskAssignee } from "@/api/task";
import CommonTooltip from "@/app/components/common/CommonTooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { CiUser } from "react-icons/ci";
interface Props {
  assignee: any;
  assigneeList?: any[];
  taskId: string;
  popoverTrigger: React.ReactNode;
}
const AssigneePopover = ({ assignee, assigneeList, taskId, popoverTrigger }: Props) => {
  const queryClient = useQueryClient();
  const param = useParams();
  const projectId = param.id as string;
  const updateAssigneeMutation = useMutation({
    mutationFn: ({
      taskId,
      assigneeId,
    }: {
      taskId: string;
      assigneeId: string;
    }) =>
      updateTask(taskId, {
        assigneeId,
      }),
    onSuccess: (response) => {
      queryClient.setQueryData(["taskDetail", taskId], (old: any) => {
        if (!old) return old;
        return response;
      });

      queryClient.setQueryData(["tasks", projectId], (oldData: any) => {
        if (!oldData) {
          return [];
        }
        return {
          ...oldData,
          data: oldData?.data?.map((task: any) => {
            if (task.id === taskId) {
              return { ...task, assignee: response?.assignee };
            }
            return task;
          }),
        };
      });
    },
  });
  return (
    <Popover>
      <CommonTooltip
        trigger={
          <PopoverTrigger asChild data-no-dnd={true}>
            {popoverTrigger}
          </PopoverTrigger>
        }
        content={`Assignee: ${assignee?.targetAccount?.email}`}
      />
      <PopoverContent className="w-[250px] flex flex-col p-1 gap-1">
        {assigneeList?.map((assigneeItem) => {
          return (
            <div
              key={assigneeItem.id}
              className={`flex items-center gap-2 hover:bg-neutral-300 rounded-md cursor-pointer p-2 ${
                assigneeItem.id === assignee?.id ? "bg-neutral-200" : ""
              }`}
              onClick={(e) => {
                e.stopPropagation();
                if (assigneeItem.id === assignee?.id) return;
                updateAssigneeMutation.mutate({
                  taskId,
                  assigneeId: assigneeItem.id,
                });
              }}
            >
              <img
                src={assigneeItem?.targetAccount?.avatar}
                alt={assigneeItem?.targetAccount?.name}
                className="rounded-full aspect-square w-[28px] object-cover object-center border border-black/50"
              />
              <span>{assigneeItem?.targetAccount?.email}</span>
            </div>
          );
        })}
      </PopoverContent>
    </Popover>
  );
};

export default AssigneePopover;
