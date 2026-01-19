import CommonDialog from "@/app/components/common/CommonDialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import { SketchPicker } from "react-color";
import { useState } from "react";
import { GoCopy } from "react-icons/go";
import toast from "react-hot-toast";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTaskStatus } from "@/api/taskStatus";
import { CreateTaskStatusDto, TaskStatus } from "@/interface/setting";
import { useParams } from "next/navigation";

interface IProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCancel: () => void;
  onSave: () => void;
}

const CreateStatusDialog = ({
  open,
  onOpenChange,
  onCancel,
  onSave,
}: IProps) => {
  const queryClient = useQueryClient();
  const param = useParams();
  const projectId = param.id as string;
  const newStatusSchema = z.object({
    text: z.string().min(1, { message: "Status name is required" }),
    color: z.string().min(1, { message: "Color is required" }),
  });

  type NewStatusSchemaType = z.infer<typeof newStatusSchema>;
  const form = useForm<NewStatusSchemaType>({
    resolver: zodResolver(newStatusSchema),
    defaultValues: {
      color: "#3b90db",
    },
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const createTaskStatusMutation = useMutation({
    mutationFn: (createTaskStatusDto: CreateTaskStatusDto) =>
      createTaskStatus(projectId, createTaskStatusDto),
    onSuccess: (result) => {
      queryClient.setQueryData(
        ["taskStatuses", projectId],
        (old: TaskStatus[]) =>
          [...old, result]?.map((stat: TaskStatus) => {
            return {
              ...stat,
              statusOrder: stat.isDoneStatus
                ? stat.statusOrder + 1
                : stat.statusOrder,
            };
          })
      );
      onSave();
    },
  });
  return (
    <CommonDialog
      title="Create new status"
      description="Statuses capture the stages of your working process. Add more statuses to represent different stages in your team's process."
      open={open}
      onOpenChange={onOpenChange}
      onCancel={onCancel}
      onSave={() => {
        form.handleSubmit((data) =>
          createTaskStatusMutation.mutate({
            text: data.text,
            color: data.color,
          })
        )();
      }}
      content={
        <Form {...form}>
          <form
            className="flex flex-col gap-4"
            onSubmit={form.handleSubmit((data) =>
              createTaskStatusMutation.mutate({
                text: data.text,
                color: data.color,
              })
            )}
          >
            <FormField
              control={form.control}
              name="text"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color</FormLabel>
                  <FormControl>
                    <>
                      <div className="flex items-center justify-between border p-2 rounded-md">
                        <div className="flex items-center gap-4">
                          <Popover>
                            <PopoverTrigger>
                              <div
                                className={`w-6 h-6 rounded-xs border border-gray-300 cursor-pointer`}
                                style={{ backgroundColor: field.value }}
                              ></div>
                            </PopoverTrigger>
                            <PopoverContent
                              side="bottom"
                              align="start"
                              sideOffset={20}
                              alignOffset={-10}
                              className="flex items-center justify-center w-fit p-0"
                            >
                              <SketchPicker
                                color={field.value}
                                onChange={(color) => {
                                  field.onChange(color.hex);
                                }}
                              />
                            </PopoverContent>
                          </Popover>

                          <span>{field.value}</span>
                        </div>
                        <GoCopy
                          className="text-[#23c6fc] cursor-pointer"
                          onClick={() => {
                            navigator.clipboard.writeText(field.value);
                            toast.success("Copied to clipboard");
                          }}
                          size={20}
                        />
                      </div>
                    </>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      }
    />
  );
};

export default CreateStatusDialog;
