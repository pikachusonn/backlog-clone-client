import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface CommonTooltipProps {
  trigger: string | React.ReactNode;
  content: string | React.ReactNode;
}

const CommonTooltip = ({ trigger, content }: CommonTooltipProps) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>{trigger}</TooltipTrigger>
      <TooltipContent>{content}</TooltipContent>
    </Tooltip>
  );
};

export default CommonTooltip;
