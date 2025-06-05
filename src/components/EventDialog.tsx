import { Dialog } from "radix-ui";
import "./EventDialog.css";
import { X } from "lucide-react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EventDialog({ open, onOpenChange }: Props) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="Dialog_overlay" />
        <Dialog.Content className="Dialog_content">
          <Dialog.Close className="Dialog_close">
            <X />
          </Dialog.Close>
          <Dialog.Title>Add title</Dialog.Title>
          <Dialog.Description>Add description</Dialog.Description>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
