/* eslint-disable @next/next/no-img-element */
"use client";
import { cn } from "@/lib/utils";
import Upload from "rc-upload";
import { FaRegFilePdf } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import { SlCloudUpload } from "react-icons/sl";
interface Props {
  className?: string;
  value: File[];
  onChange: (files: File[]) => void;
}
const FileDropZone = ({ className, value, onChange }: Props) => {
  const addFiles = (newFiles: File[]) => {
    const merged = [...value, ...newFiles];
    onChange(merged);
  };

  const removeFile = (file: File) => {
    const filtered = value.filter((f) => f.name !== file.name);
    onChange(filtered);
  };
  return (
    <div>
      <Upload
        multiple
        accept="image/*, application/pdf"
        // action="/api/upload"
        // onStart={(file) => console.log("start", file)}
        // onProgress={(e, file) => console.log("progress", e.percent)}
        // onSuccess={(res, file) => console.log("success", res)}
        // onError={(err) => console.log("error", err)}
        beforeUpload={(file, fileList) => {
          addFiles(fileList as File[]);
          return false;
        }}
      >
        <div
          className={cn(
            "flex flex-col items-center justify-center gap-2",
            "border-2 border-dashed rounded-lg p-6",
            "cursor-pointer hover:bg-muted transition",
            className
          )}
        >
          <SlCloudUpload size={30} className="text-black/50" />
          <p className="text-sm font-medium">Drag & drop files here</p>
          <p className="text-xs text-muted-foreground">or click to browse</p>
        </div>
      </Upload>
      <div className="mt-3 flex items-center gap-2 flex-wrap">
        {value.map((file, index) => {
          if (file.type.startsWith("image/")) {
            return (
              <div key={`${file.name}-${index}`}>
                <div className="relative group border-black/20 border-2 rounded-md w-[80px]">
                  <div className="absolute inset-0 rounded-md flex items-center justify-center group-hover:visible invisible">
                    <IoClose
                      size={30}
                      className="text-red-700 cursor-pointer z-10"
                      onClick={() =>
                        removeFile(file)
                      }
                    />
                  </div>
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    className="w-full aspect-square object-cover group-hover:blur-xs rounded-sm"
                  />
                </div>
                <span className="text-xs text-muted-foreground flex items-center">
                  <p
                    className="max-w-[80px] truncate cursor-default"
                    title={file.name}
                  >
                    {file.name}
                  </p>
                </span>
              </div>
            );
          }
          return (
            <div key={`${file.name}-${index}`}>
              <div className="w-[80px] aspect-square flex items-center justify-center rounded-md border-2 border-black/10 bg-black/5 relative group">
                <div className="absolute inset-0 rounded-md flex items-center justify-center group-hover:visible invisible">
                  <IoClose
                    size={30}
                    className="text-red-700 cursor-pointer z-10"
                    onClick={() =>
                      removeFile(file)
                    }
                  />
                </div>
                <FaRegFilePdf size={30} className="group-hover:blur-xs" />
              </div>
              <span className="text-xs text-muted-foreground flex items-center">
                <p
                  className="max-w-[80px] truncate cursor-default"
                  title={file.name}
                >
                  {file.name}
                </p>
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FileDropZone;
