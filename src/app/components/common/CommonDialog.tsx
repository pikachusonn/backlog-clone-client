import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
interface Props {
  open: boolean;
  onOpenChange: (open: any) => void; // eslint-disable-line @typescript-eslint/no-explicit-any
  dialogTrigger?: React.ReactNode;
  content: React.ReactNode;
  contentClassName?: string;
  onCancel: () => void;
  onSave: () => void;
  title: string | React.ReactNode;
  description?: string;
  titleClassName?: string;
  hideFooter?: boolean;
}
const CommonDialog = ({
  open,
  onOpenChange,
  dialogTrigger,
  content,
  contentClassName,
  onCancel,
  title,
  description,
  onSave,
  titleClassName,
  hideFooter = false,
}: Props) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {!!dialogTrigger && <DialogTrigger>{dialogTrigger}</DialogTrigger>}
      <DialogContent className={contentClassName}>
        <DialogHeader>
          <DialogTitle className={titleClassName}>{title}</DialogTitle>
          {!!description && (
            <DialogDescription>{description}</DialogDescription>
          )}
        </DialogHeader>
        {content}
        {!hideFooter && (
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            </DialogClose>
            <Button onClick={onSave}>Save</Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CommonDialog;
