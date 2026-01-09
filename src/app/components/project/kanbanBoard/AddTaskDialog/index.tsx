/* eslint-disable @next/next/no-img-element */
import { createTask } from "@/api/task";
import { CommonDatePicker } from "@/app/components/common/CommonDatePicker";
import CommonSelect from "@/app/components/common/CommonSelect";
import FileDropZone from "@/app/components/common/FileDropZone";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SelectContent, SelectItem } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  TASK_PRIORITY,
  TASK_PRIORITY_OPTIONS,
  TASK_TYPE,
  TASK_TYPE_OPTIONS,
} from "@/constant/task";
import { SelectItem as SelectItemType } from "@/interface/common";
import { ICreateTaskPayload } from "@/interface/kanban";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { BiTask } from "react-icons/bi";
import { FaChevronUp } from "react-icons/fa6";
import { IoIosBug } from "react-icons/io";
import z from "zod";
import styles from "../styles.module.css";
interface AssigneeOption extends SelectItemType {
  avatarUrl?: string;
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dialogTrigger: React.ReactNode;
  assigneeOptions: AssigneeOption[];
  onCancel: () => void;
  onSave: () => void;
  projectId: string;
}
const AddTaskDialog = ({
  open,
  onOpenChange,
  dialogTrigger,
  onCancel,
  onSave,
  assigneeOptions,
  projectId,
}: Props) => {
  const queryClient = useQueryClient();
  const createTaskSchema = z.object({
    taskName: z.string().min(1, { message: "Task name is required" }),
    assignee: z.string().min(1, { message: "Assignee is required" }),
    description: z.string().optional(),
    attachments: z.array(z.instanceof(File)).optional().nullable(),
    startDate: z.date().optional(),
    dueDate: z.date().optional(),
    priority: z.enum(TASK_PRIORITY),
    type: z.enum(TASK_TYPE),
  });

  const form = useForm<z.infer<typeof createTaskSchema>>({
    resolver: zodResolver(createTaskSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      priority: TASK_PRIORITY.MEDIUM,
      type: TASK_TYPE.TASK,
    },
  });

  const { mutate: createTaskMutation } = useMutation({
    mutationFn: (payload: ICreateTaskPayload) => createTask(payload),
    onSuccess: (response) => {
      queryClient.setQueryData(["tasks", projectId], (oldData: any) => {
        return {
          ...oldData,
          data: [...oldData.data, response],
        };
      });
      onSave();
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const handleSubmit = (data: z.infer<typeof createTaskSchema>) => {
    console.log(data);
    //todo: upload attachments to cloud
    const attachments = data.attachments?.map((attachment: File) => {
      return {
        fileName: attachment.name,
        fileUrl:
          "https://www.youtube.com/watch?v=__Cf1wA_lf8&list=RD__Cf1wA_lf8&start_radio=1", //mock url due to not having an actual cloud set up
        fileType: attachment.type,
      };
    });

    const payload: ICreateTaskPayload = {
      projectId,
      assigneeId: data.assignee,
      taskName: data.taskName,
      attachments: attachments || [],
      startDate: data.startDate?.toISOString(),
      dueDate: data.dueDate?.toISOString(),
      description: data.description,
      priority: data.priority,
      type: data.type,
    };

    createTaskMutation(payload);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{dialogTrigger}</DialogTrigger>

      <DialogContent className="!max-w-[800px] !w-[800px]">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="flex flex-col gap-4"
          >
            <DialogHeader>
              <DialogTitle> {"Create a new task"}</DialogTitle>
              <DialogDescription>
                Be sure to hit the save button when you&apos;re done.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-4 w-full">
              <div className="flex items-center gap-2">
                <FormField
                  control={form.control}
                  name="taskName"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <div>
                          <Label htmlFor="taskName">
                            Task name<span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="taskName"
                            placeholder="Task name"
                            className="mt-1"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="assignee"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <div className="flex-1">
                          <Label htmlFor="assignee">
                            Assignee<span className="text-red-500">*</span>
                          </Label>
                          <CommonSelect
                            value={field.value}
                            onChange={field.onChange}
                            triggerClass="mt-1"
                            selectItems={assigneeOptions}
                            placeholder="Select Assignee"
                            content={
                              <SelectContent side="bottom">
                                {assigneeOptions.map((item, index) => (
                                  <SelectItem key={index} value={item.value}>
                                    <img
                                      src={item.avatarUrl}
                                      alt={item.label}
                                      className="w-[30px] aspect-square object-cover object-center rounded-full border-2 border-black/30"
                                    />
                                    {item.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            }
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          placeholder="Description"
                          className="mt-1 w-full min-h-[100px]"
                          value={field.value || ""}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                          ref={field.ref}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="w-full">
                <FormField
                  control={form.control}
                  name="attachments"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <div>
                          <Label htmlFor="attachments">Attachments</Label>
                          <FileDropZone
                            className="mt-1 w-full"
                            value={(field.value as File[]) || []}
                            onChange={field.onChange}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex items-center gap-2">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <CommonDatePicker
                          placeholder="Start date"
                          label="Start date"
                          allowInput={false}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dueDate"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <CommonDatePicker
                          placeholder="Due date"
                          label="Due date"
                          allowInput={false}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex items-center gap-2">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <div className="flex-1">
                          <Label htmlFor="type">
                            Task Type<span className="text-red-500">*</span>
                          </Label>
                          <CommonSelect
                            value={field.value}
                            onChange={field.onChange}
                            triggerClass="mt-1"
                            selectItems={TASK_TYPE_OPTIONS}
                            placeholder="Select Task Type"
                            content={
                              <SelectContent side="bottom">
                                {TASK_TYPE_OPTIONS.map((item, index) => (
                                  <SelectItem key={index} value={item.value}>
                                    {item.value === TASK_TYPE.TASK ? (
                                      <BiTask className="text-blue-500" />
                                    ) : (
                                      <IoIosBug className="text-red-500" />
                                    )}
                                    {item.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            }
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="priority"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <div className="flex-1">
                          <Label htmlFor="type">
                            Task Priority<span className="text-red-500">*</span>
                          </Label>
                          <CommonSelect
                            value={field.value}
                            onChange={field.onChange}
                            triggerClass="mt-1"
                            selectItems={TASK_PRIORITY_OPTIONS}
                            placeholder="Select Task Type"
                            content={
                              <SelectContent side="bottom">
                                {TASK_PRIORITY_OPTIONS.map((item, index) => (
                                  <SelectItem key={index} value={item.value}>
                                    <div
                                      className={cn(
                                        "flex flex-col",
                                        styles.selectIcon
                                      )}
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
                                                  item.value ===
                                                  TASK_PRIORITY.LOW,
                                                "text-blue-500":
                                                  item.value ===
                                                  TASK_PRIORITY.MEDIUM,
                                                "text-red-500":
                                                  item.value ===
                                                  TASK_PRIORITY.HIGH,
                                              },
                                              {
                                                "bottom-[3px]": index === 2,
                                                "top-[3px]":
                                                  index === 0 &&
                                                  item.value ===
                                                    TASK_PRIORITY.HIGH,
                                              },
                                              {
                                                "bottom-[2px]":
                                                  index === 1 &&
                                                  item.value ===
                                                    TASK_PRIORITY.MEDIUM,
                                                "top-[2px]":
                                                  index === 0 &&
                                                  item.value ===
                                                    TASK_PRIORITY.MEDIUM,
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
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" onClick={onCancel}>
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddTaskDialog;
