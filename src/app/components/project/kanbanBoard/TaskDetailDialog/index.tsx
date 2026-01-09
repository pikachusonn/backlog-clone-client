/* eslint-disable @next/next/no-img-element */
import CommonDialog from "@/app/components/common/CommonDialog";
import { Attachment, Task } from "@/interface/kanban";
import { FaRegFilePdf } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";

interface Props {
  open: boolean;
  onOpenChange: (open: any) => void; // eslint-disable-line @typescript-eslint/no-explicit-any
  onCancel: () => void;
  onSave: () => void;
  task: Task;
}

const TaskDetailDialog = ({
  open,
  task,
  onOpenChange,
  onCancel,
  onSave,
}: Props) => {
  const removeFile = (attachment: Attachment) => {
    console.log(attachment);
  };
  return (
    <CommonDialog
      title={task?.name}
      titleClassName="text-lg font-medium"
      //   description={task?.description}
      open={open}
      onOpenChange={onOpenChange}
      content={
        <div className="flex items-start">
          <div className="w-[70%] flex flex-col gap-2">
            <>
              <h5 className="font-medium">Description</h5>
              <p className="whitespace-pre-wrap">{task?.description}</p>
            </>
            <>
              <h5 className="font-medium">
                Attachments ({task?.attachments?.length})
              </h5>
              <div className="flex gap-2">
                {task?.attachments?.map((attachment) => {
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
            </>
          </div>
        </div>
      }
      contentClassName="!max-w-[800px] !w-[800px]"
      onCancel={onCancel}
      onSave={onSave}
    />
  );
};

export default TaskDetailDialog;
