"use client";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
} from "@/components/ui/popover";
import { IoIosCheckboxOutline } from "react-icons/io";
import { AiOutlineCloseSquare } from "react-icons/ai";
interface IProps {
  value: string | number;
  onSave: (value: string | number) => void;
}

const NoBorderInput = ({ value, onSave }: IProps) => {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState<string | number>(value);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverAnchor asChild>
        <Input
          autoFocus={false}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onFocus={() => setOpen(true)}
          onBlur={(e) => {
            // Close only if focus truly leaves input + popover
            if (!e.currentTarget.contains(e.relatedTarget as Node)) {
              setOpen(false);
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              setOpen(false);
              e.currentTarget.blur();
              onSave(inputValue);
            }
          }}
          className="max-w-[98%] text-start pl-0 border border-transparent shadow-none focus:border focus:pl-2 focus:border-gray-200 focus:outline-none focus:ring-0"
        />
      </PopoverAnchor>

      <PopoverContent
        align="end"
        side="bottom"
        className="w-full flex justify-end bg-transparent border-none shadow-none p-1"
        // sideOffset={2}
        onOpenAutoFocus={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <AiOutlineCloseSquare
          size={30}
          className="text-red-700 shadow-md"
          onClick={() => {
            setOpen(false);
            setInputValue(value);
          }}
        />
        <IoIosCheckboxOutline
          size={30}
          className="text-green-700 shadow-md"
          onClick={() => {
            setOpen(false);
            onSave(inputValue);
          }}
        />
      </PopoverContent>
    </Popover>
  );
};

export default NoBorderInput;
