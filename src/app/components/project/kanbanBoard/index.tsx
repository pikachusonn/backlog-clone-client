import { Input } from "@/components/ui/input";
import { IoIosSearch } from "react-icons/io";

const KanbanBoard = () => {
  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <IoIosSearch
          size={20}
          className="absolute top-1/2 -translate-y-1/2 left-2 text-muted-foreground"
        />
        <Input placeholder="Search" className="inset-0 w-[200px] pl-[30px]" />
      </div>
      <div className="flex items-center relative">
        <div className="w-[30px] h-[30px] bg-red-500 rounded-full text-white flex items-center justify-center font-medium text-lg border border-white">
          S
        </div>
        <div className="w-[30px] h-[30px] bg-green-600 rounded-full text-white flex items-center justify-center font-medium text-lg left-[-10px] relative z-10 border border-white">
          H
        </div>
        <div className="w-[30px] h-[30px] bg-yellow-500 rounded-full text-white flex items-center justify-center font-medium text-lg left-[-20px] relative z-20">
          K
        </div>
      </div>
    </div>
  );
};
export default KanbanBoard;
