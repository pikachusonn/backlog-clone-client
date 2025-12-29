import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CiCalendar } from "react-icons/ci";
import { IoIosBug, IoIosSearch } from "react-icons/io";
import { PiSlidersHorizontal } from "react-icons/pi";
import { MdLocalFireDepartment } from "react-icons/md";
import { BiTask } from "react-icons/bi";
import CommonTooltip from "../../common/CommonTooltip";
const KanbanBoard = () => {
  return (
    <div className="flex flex-col gap-2 h-[calc(100vh-125px)]">
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
          <div className="w-[30px] h-[30px] bg-green-700 rounded-full text-white flex items-center justify-center font-medium text-lg left-[-5px] relative z-10 border border-white">
            H
          </div>
          <div className="w-[30px] h-[30px] bg-sky-700 rounded-full text-white flex items-center justify-center font-medium text-lg left-[-10px] relative z-20">
            K
          </div>
        </div>
        <Button variant="outline" size="icon">
          <PiSlidersHorizontal />
        </Button>
      </div>
      <div className="flex flex-1 gap-3 items-stretch pb-2">
        {Array.from({ length: 3 }).map((_, indexStatus) => (
          <div
            key={indexStatus}
            className="flex w-[280px] bg-neutral-100 rounded-md border border-neutral-2/5000 flex-col gap-2"
          >
            <div className="py-2 px-4 flex items-center gap-3">
              <div className="bg-sky-700 w-3 h-3 rounded-full"></div>
              <span>TO DO</span>
              <span className="text-sm bg-gray-200 rounded-full px-3 font-medium">
                5
              </span>
            </div>
            <div className="bg-neutral-100 pb-2">
              <div className="max-h-[calc(100dvh-234px)] p-1 flex flex-col gap-2 overflow-y-auto">
                {Array.from({ length: 15 }).map((_, indexTask) => (
                  <div
                    key={indexTask}
                    className="w-full bg-white rounded border p-3 flex flex-col gap-2"
                  >
                    <span>Task name</span>
                    <div className="flex items-center gap-2 border rounded w-fit px-2">
                      <CiCalendar />
                      <span className="text-sm">2025-12-29</span>
                      {indexTask === 2 && (
                        <MdLocalFireDepartment className="text-orange-500" />
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {indexTask % 2 === 0 ? (
                          <BiTask className="text-blue-500" />
                        ) : (
                          <IoIosBug className="text-red-500" />
                        )}
                        <span className="text-sm">
                          BC{indexStatus}-{indexTask + 1}
                        </span>
                      </div>
                      <CommonTooltip
                        trigger={
                          <span className="bg-orange-300 font-medium rounded-full text-sm aspect-square w-[24px] text-center flex items-center justify-center">
                            S
                          </span>
                        }
                        content="Assignee: Chu Sơn"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default KanbanBoard;
