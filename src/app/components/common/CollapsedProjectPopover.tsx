import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import * as HoverCardPrimitive from "@radix-ui/react-hover-card";

interface CollapsedProjectPopoverProps {
  popOverTrigger: React.ReactNode;
}
const CollapsedProjectPopover = ({
  popOverTrigger,
}: CollapsedProjectPopoverProps) => {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>{popOverTrigger}</HoverCardTrigger>
      <HoverCardContent
        side="right"
        align="start"
        sideOffset={15}
        className="relative"
      >
        <HoverCardPrimitive.Arrow
          width={20}
          height={10}
          className="fill-background stroke-border rounded-md"
        />
        <div className="">
          <p>Project Name</p>
          <p>Project Description</p>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

export default CollapsedProjectPopover;
