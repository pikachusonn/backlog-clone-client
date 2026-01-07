import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SelectItem as SelectItemType } from "@/interface/common";
interface Props {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  selectItems: SelectItemType[];
  content?: React.ReactNode;
  triggerClass?: string;
  popupClass?: string;
}

const CommonSelect = ({ placeholder, selectItems, content, triggerClass, popupClass, value, onChange }: Props) => {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className={`w-full ${triggerClass}`}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      {content || (
        <SelectContent className={`${popupClass}`}>
          {/* <SelectGroup></SelectGroup> */}
          {selectItems.map((item, index) => (
            <SelectItem key={index} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      )}
    </Select>
  );
};

export default CommonSelect;
