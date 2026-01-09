import { TASK_PRIORITY } from "@/constant/task";
import styles from "../styles.module.css"
import { FaChevronUp } from "react-icons/fa6";
import { cn } from "@/lib/utils";
interface Props {
    priorityIndex: number;
    priority: TASK_PRIORITY;
}

const PriorityTag = ({ priorityIndex, priority }: Props) => {
  return (
    <div className={styles.selectIcon}>
      {Array.from({ length: priorityIndex + 1 }).map((_, index) => (
        <FaChevronUp
          key={index}
          className={cn(
            "relative",
            styles.selectIcon,
            {
              "text-green-500": priority === TASK_PRIORITY.LOW,
              "text-blue-500": priority === TASK_PRIORITY.MEDIUM,
              "text-red-500": priority === TASK_PRIORITY.HIGH,
            },

            {
              "bottom-[3px]": index === 2,
              "top-[3px]": index === 0 && priority === TASK_PRIORITY.HIGH,
            },
            {
              "bottom-[2px]":
                index === 1 && priority === TASK_PRIORITY.MEDIUM,
              "top-[2px]":
                index === 0 && priority === TASK_PRIORITY.MEDIUM,
            }
          )}
        />
      ))}
    </div>
  );
};

export default PriorityTag