import { Dialog, Form } from "radix-ui";
import "./EventDialog.css";
import { X } from "lucide-react";
import type { FormEvent } from "react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EventDialog({ open, onOpenChange }: Props) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("Form submitted");
    console.log(event);
    onOpenChange(false);
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="Dialog_overlay" />
        <Dialog.Content className="Dialog_content">
          <div className="Dialog_header">
            <Dialog.Title className="Dialog_title">New Event</Dialog.Title>
            <Dialog.Close className="Dialog_close">
              <X />
            </Dialog.Close>
          </div>
          <Form.Root className="Form_root" onSubmit={handleSubmit}>
            <Form.Field name="title" className="Form_field">
              <Form.Control placeholder="Add title" className="Form_control" />
            </Form.Field>
            <Form.Field name="description" className="Form_field">
              <Form.Control
                placeholder="Add description"
                className="Form_control"
                asChild
              >
                <textarea />
              </Form.Control>
            </Form.Field>
            <Form.Submit>Save</Form.Submit>
          </Form.Root>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
