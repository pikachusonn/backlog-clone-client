/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import CommonDialog from "@/app/components/common/CommonDialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Attachment, IUpdateTaskPayload, Task } from "@/interface/kanban";
import { format } from "date-fns";
import { FaChevronDown, FaChevronUp, FaRegFilePdf } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import PriorityTag from "../PriorityTag";
import {
  TASK_PRIORITY,
  TASK_PRIORITY_OPTIONS,
  TASK_TYPE,
  TASK_TYPE_OPTIONS,
} from "@/constant/task";
import { IoIosBug } from "react-icons/io";
import AssigneePopover from "../AssigneePopover";
import { ProjectDetails } from "@/interface/common";
import { CommonDatePicker } from "@/app/components/common/CommonDatePicker";
import CommonSelect from "@/app/components/common/CommonSelect";
import { SelectContent, SelectItem } from "@/components/ui/select";
import styles from "../styles.module.css";
import { cn } from "@/lib/utils";
import { BiTask } from "react-icons/bi";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getTaskById, updateTask } from "@/api/task";
import { Input } from "@/components/ui/input";
import NoBorderInput from "@/app/components/common/NoBorderInput";
import NoBorderTextArea from "@/app/components/common/NoBorderTextArea";
import FileDropZone from "@/app/components/common/FileDropZone";
import Upload from "rc-upload";
import { SlCloudUpload } from "react-icons/sl";
interface Props {
  open: boolean;
  projectDetails?: ProjectDetails;
  onOpenChange: (open: any) => void; // eslint-disable-line @typescript-eslint/no-explicit-any
  onCancel: () => void;
  onSave: () => void;
  task: Task;
}

const TaskDetailDialog = ({
  open,
  projectDetails,
  task,
  onOpenChange,
  onCancel,
  onSave,
}: Props) => {
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const queryClient = useQueryClient();
  const removeFile = (attachment: Attachment) => {
    console.log(attachment);
  };

  const tabs = [
    {
      name: "All",
      value: "all",
      content: "All activities of the task",
    },
    {
      name: "Comments",
      value: "comments",
      content: "Comments of the task",
    },
    {
      name: "History",
      value: "history",
      content: "History of the task",
    },
    {
      name: "Worklog",
      value: "worklog",
      content: "Worklog of the task",
    },
  ];

  const { data: taskDetails, isLoading: isLoadingTaskDetails } = useQuery({
    queryKey: ["taskDetail", task.id],
    queryFn: () => getTaskById(task.id),
    enabled: open,
  });

  const handleUpdateTask = useMutation({
    mutationFn: (payload: IUpdateTaskPayload) => updateTask(task.id, payload),
    onSuccess: (response: Task) => {
      console.log(response);
      queryClient.setQueryData(["taskDetail", task.id], (old: any) => {
        if (!old) return old;
        return response;
      });

      queryClient.setQueryData(["tasks", projectDetails?.id], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          data: old?.data?.map((taskItem: Task) => {
            if (taskItem?.id === task?.id) {
              return response;
            }
            return taskItem;
          }),
        };
      });
    },
  });

  const addFiles = (files: File[]) => {
    const attachments = [
      taskDetails?.attachments,
      ...files?.map((file: File) => ({
        fileName: file.name,
        fileUrl:
          "https://static.wikia.nocookie.net/darkestdungeon_gamepedia/images/6/6e/Darkest_Dungeon_cover_art.png/revision/latest/scale-to-width-down/268?cb=20180812060448",
        fileType: file.type,
      })),
    ];
    handleUpdateTask.mutate({
      attachments: attachments,
    });
  };
  return (
    <CommonDialog
      hideFooter
      title={
        <NoBorderInput
          value={taskDetails?.name}
          onSave={(value: string | number) => {
            handleUpdateTask.mutate({
              name: value as string,
            });
          }}
        />
      }
      titleClassName="text-lg font-medium"
      //   description={task?.description}
      open={open}
      onOpenChange={onOpenChange}
      content={
        <div className="flex items-start">
          <div className="w-[60%] flex flex-col gap-4">
            <>
              <h5 className="font-medium">Description</h5>
              <NoBorderTextArea
                value={taskDetails?.description}
                onSave={(value: string | number) => {
                  handleUpdateTask.mutate({
                    description: value as string,
                  });
                }}
              />
            </>
            <>
              <h5 className="font-medium">
                Attachments ({taskDetails?.attachments?.length})
              </h5>
              <div className="flex gap-2">
                {taskDetails?.attachments?.map((attachment) => {
                  if (attachment.fileType.startsWith("image/")) {
                    return (
                      <div key={attachment.id}>
                        <div className="relative group border-black/20 border-2 rounded-md w-[80px]">
                          <div className="absolute inset-0 rounded-md flex items-center justify-center group-hover:visible invisible">
                            <IoClose
                              size={30}
                              className="text-red-700 cursor-pointer z-10"
                              onClick={() => removeFile(attachment)}
                            />
                          </div>
                          <img
                            src={attachment.fileUrl}
                            alt={attachment.fileName}
                            className="w-full aspect-square object-cover group-hover:blur-xs rounded-sm"
                          />
                        </div>
                        <span className="text-xs text-muted-foreground flex items-center">
                          <p
                            className="max-w-[80px] truncate cursor-default"
                            title={attachment.fileName}
                          >
                            {attachment.fileName}
                          </p>
                        </span>
                      </div>
                    );
                  }
                  return (
                    <div key={attachment.id}>
                      <div className="w-[80px] aspect-square flex items-center justify-center rounded-md border-2 border-black/10 bg-black/5 relative group">
                        <div className="absolute inset-0 rounded-md flex items-center justify-center group-hover:visible invisible">
                          <IoClose
                            size={30}
                            className="text-red-700 cursor-pointer z-10"
                            onClick={() => removeFile(attachment)}
                          />
                        </div>
                        <FaRegFilePdf
                          size={30}
                          className="group-hover:blur-xs"
                        />
                      </div>
                      <span className="text-xs text-muted-foreground flex items-center">
                        <p
                          className="max-w-[80px] truncate cursor-default"
                          title={attachment.fileName}
                        >
                          {attachment.fileName}
                        </p>
                      </span>
                    </div>
                  );
                })}
              </div>
              <Upload
                multiple
                accept="image/*, application/pdf"
                // action="/api/upload"
                // onStart={(file) => console.log("start", file)}
                // onProgress={(e, file) => console.log("progress", e.percent)}
                // onSuccess={(res, file) => console.log("success", res)}
                // onError={(err) => console.log("error", err)}
                beforeUpload={(file, fileList) => {
                  // addFiles(fileList as File[]);
                  return false;
                }}
              >
                <div
                  className={cn(
                    "flex flex-col items-center justify-center gap-2",
                    "border-2 border-dashed rounded-lg p-6",
                    "cursor-pointer hover:bg-muted transition"
                    // className
                  )}
                >
                  <SlCloudUpload size={30} className="text-black/50" />
                  <p className="text-sm font-medium">Drag & drop files here</p>
                  <p className="text-xs text-muted-foreground">
                    or click to browse
                  </p>
                </div>
              </Upload>
            </>
            <>
              <h5 className="font-medium">Subtasks</h5>
              <div>
                <span className="px-5 py-2 rounded-md cursor-pointer hover:bg-gray-200 text-black/50">
                  Add a subtask
                </span>
              </div>
            </>
            <>
              <h5 className="font-medium">Activities</h5>
              <Tabs className="gap-4">
                <TabsList className="bg-background rounded-none border px-2 justify-start rounded-sm">
                  {tabs.map((tab) => (
                    <TabsTrigger
                      key={tab.value}
                      value={tab.value}
                      className="bg-background data-[state=active]:border-sky-600 data-[state=active]:text-sky-600 data-[state=active]:bg-sky-600/10 dark:data-[state=active]:border-primary h-full rounded-sm border-transparent data-[state=active]:shadow-none flex-none px-[15px]"
                    >
                      {tab.name}
                    </TabsTrigger>
                  ))}
                </TabsList>
                {tabs.map((tab) => (
                  <TabsContent
                    key={tab.value}
                    value={tab.value}
                    className="px-[16px]"
                  >
                    {tab.content}
                  </TabsContent>
                ))}
              </Tabs>
            </>
          </div>
          <div className="flex-1 px-2">
            <div className="border rounded-sm p-4 flex flex-col gap-4">
              <span className="font-semibold">Detail</span>

              {/* Each row is a flex container */}
              <div className="flex flex-col gap-6">
                {/* Assignee */}
                <div className="flex items-center gap-2">
                  <span className="w-[100px] font-medium">Assignee</span>
                  <AssigneePopover
                    assignee={taskDetails?.assignee}
                    assigneeList={projectDetails?.projectCollaborators}
                    taskId={taskDetails?.id}
                    popoverTrigger={
                      <div className="flex items-center justify-between flex-1 hover:bg-gray-100 cursor-pointer py-1 px-2 rounded-sm">
                        <div className="flex items-center gap-2">
                          <img
                            src={taskDetails?.assignee?.targetAccount?.avatar}
                            className="w-[25px] aspect-square object-cover object-center rounded-full border-2 border-gray-400"
                          />
                          <span className="truncate max-w-[100px]">
                            {taskDetails?.assignee?.targetAccount?.email}
                          </span>
                        </div>
                        <FaChevronDown className="text-gray-500" size={10} />
                      </div>
                    }
                  />
                </div>

                {/* Start date */}
                <div className="flex items-center gap-2">
                  <span className="w-[100px] font-medium">Start date</span>
                  <CommonDatePicker
                    value={
                      taskDetails?.startDate
                        ? new Date(taskDetails?.startDate)
                        : undefined
                    }
                    className="!w-[140px]"
                    placeholder="Select start date"
                    onChange={(value: Date | undefined) => {
                      if (!value) return;
                      handleUpdateTask.mutate({
                        startDate: new Date(value).toISOString(),
                      });
                    }}
                  />
                </div>

                {/* Due date */}
                <div className="flex items-center gap-2">
                  <span className="w-[100px] font-medium">Due date</span>
                  <CommonDatePicker
                    value={
                      taskDetails?.dueDate
                        ? new Date(taskDetails?.dueDate)
                        : undefined
                    }
                    className="!w-[140px]"
                    placeholder="Select due date"
                    onChange={(value: Date | undefined) => {
                      if (!value) return;
                      handleUpdateTask.mutate({
                        dueDate: new Date(value).toISOString(),
                      });
                    }}
                  />
                </div>

                {/* Priority */}
                <div className="flex items-center gap-2">
                  <span className="w-[100px] font-medium">Priority</span>
                  {/* <PriorityTag
                    priorityIndex={2}
                    priority={TASK_PRIORITY.HIGH}
                  />
                  <span className="text-sm">{TASK_PRIORITY.HIGH}</span> */}
                  <CommonSelect
                    value={taskDetails?.priority}
                    onChange={(value: string) => {
                      handleUpdateTask.mutate({
                        priority: value as TASK_PRIORITY,
                      });
                    }}
                    triggerClass="mt-1 !w-[140px]"
                    selectItems={TASK_PRIORITY_OPTIONS}
                    placeholder="Select Task Priority"
                    content={
                      <SelectContent side="bottom">
                        {TASK_PRIORITY_OPTIONS.map((item, index) => (
                          <SelectItem key={index} value={item.value}>
                            <div
                              className={cn("flex flex-col", styles.selectIcon)}
                            >
                              {Array.from({ length: index + 1 }).map(
                                (_, index) => (
                                  <FaChevronUp
                                    key={index}
                                    className={cn(
                                      "relative",
                                      styles.selectIcon,
                                      {
                                        "text-green-500":
                                          item.value === TASK_PRIORITY.LOW,
                                        "text-blue-500":
                                          item.value === TASK_PRIORITY.MEDIUM,
                                        "text-red-500":
                                          item.value === TASK_PRIORITY.HIGH,
                                      },
                                      {
                                        "bottom-[3px]": index === 2,
                                        "top-[3px]":
                                          index === 0 &&
                                          item.value === TASK_PRIORITY.HIGH,
                                      },
                                      {
                                        "bottom-[2px]":
                                          index === 1 &&
                                          item.value === TASK_PRIORITY.MEDIUM,
                                        "top-[2px]":
                                          index === 0 &&
                                          item.value === TASK_PRIORITY.MEDIUM,
                                      }
                                    )}
                                    // size={50}
                                  />
                                )
                              )}
                            </div>
                            {item.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    }
                  />
                </div>

                {/* Task type */}
                <div className="flex items-center gap-2">
                  <span className="w-[100px] font-medium">Task type</span>
                  <CommonSelect
                    value={taskDetails?.type}
                    onChange={(value: string) => {
                      handleUpdateTask.mutate({
                        type: value as TASK_TYPE,
                      });
                    }}
                    triggerClass="mt-1 !w-[140px]"
                    selectItems={TASK_TYPE_OPTIONS}
                    placeholder="Select Task Type"
                    content={
                      <SelectContent side="bottom">
                        {TASK_TYPE_OPTIONS.map((item, index) => (
                          <SelectItem key={index} value={item.value}>
                            <div
                              className={cn(
                                "flex flex-col",
                                styles.selectIconTaskType
                              )}
                            >
                              {item.value === TASK_TYPE.BUG ? (
                                <IoIosBug className="text-red-500" size={30} />
                              ) : (
                                <BiTask className="text-blue-500" size={30} />
                              )}
                            </div>
                            {item.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      }
      contentClassName="!max-w-[1000px] !w-[1000px]"
      onCancel={onCancel}
      onSave={onSave}
    />
  );
};

export default TaskDetailDialog;
