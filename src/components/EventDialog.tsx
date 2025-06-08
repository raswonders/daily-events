import { Dialog, Form } from "radix-ui";
import "./EventDialog.css";
import { X } from "lucide-react";
import { type FormEvent } from "react";
import supabase from "../lib/supabase-client";
import type { EventTableEntry } from "./Table";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fetchEvents: () => void;
  currentEvent: EventTableEntry | null;
  setCurrentEvent: (event: EventTableEntry | null) => void;
  defaultStartTime: number | null;
}

export function EventDialog({
  open,
  onOpenChange,
  fetchEvents,
  currentEvent,
  defaultStartTime,
  setCurrentEvent,
}: Props) {
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!currentEvent) {
      const formData = new FormData(event.currentTarget);
      const title = formData.get("title") || "(no-title)";
      const description = formData.get("description");

      const { error } = await supabase.from("events").insert({
        title,
        description,
        start_time: defaultStartTime,
      });

      if (error) throw error;
    } else if (currentEvent) {
      const { error } = await supabase
        .from("events")
        .update(currentEvent)
        .eq("id", currentEvent.id);

      if (error) throw error;
    }

    await fetchEvents();
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
              <Form.Control
                placeholder="Add title"
                className="Form_control"
                value={currentEvent?.title}
                onChange={(event) => {
                  setCurrentEvent({
                    ...currentEvent,
                    title: event.target.value,
                  });
                }}
              />
            </Form.Field>
            <Form.Field name="description" className="Form_field">
              <Form.Control
                placeholder="Add description"
                className="Form_control"
                asChild
              >
                <textarea
                  value={currentEvent?.description}
                  onChange={(event) => {
                    setCurrentEvent({
                      ...currentEvent,
                      description: event.target.value,
                    });
                  }}
                />
              </Form.Control>
            </Form.Field>
            <Form.Submit>Save</Form.Submit>
          </Form.Root>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
