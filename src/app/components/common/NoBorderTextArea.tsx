import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import { AiOutlineCloseSquare } from "react-icons/ai";
import { IoIosCheckboxOutline } from "react-icons/io";

interface IProps {
  value: string | number;
  onSave: (value: string | number) => void;
}

const NoBorderTextArea = ({ value, onSave }: IProps) => {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState<string | number>(value);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverAnchor asChild>
        <Textarea
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
          className="resize-none max-w-[98%] max-h-[150px] text-start pl-0 border border-transparent shadow-none focus:border focus:pl-2 focus:border-gray-200 focus:outline-none focus:ring-0 customScrollbar"
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
          className="text-red-700 shadow-md"
          size={30}
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

export default NoBorderTextArea;
