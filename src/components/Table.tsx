import supabase from "../lib/supabase-client";
import { EventDialog } from "./EventDialog";
import "./Table.css";
import { useEffect, useState, type MouseEvent } from "react";
import { getTime } from "../lib/utilities";

const rows = Array.from({ length: 24 }, (_, index) => {
  return {
    time: index * 60,
  };
});

export interface EventTableEntry {
  id?: number;
  title?: string;
  description?: string;
  startTime: number;
}

export interface EventTable {
  [key: number]: EventTableEntry[];
}

export function Table() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<EventTableEntry | null>(
    null
  );
  const [eventEntries, setEventEntries] = useState<EventTable>({});
  const [startTime, setStartTime] = useState<number | null>(null);

  const handleOpenChange = (open: boolean) => {
    setIsDialogOpen(open);
  };

  const handleCellClick = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    const cell = target.closest(
      ".Table_upperCell, .Table_lowerCell"
    ) as HTMLElement;

    if (cell) {
      setCurrentEvent(null);
      handleOpenChange(true);
      setStartTime(parseInt(cell.dataset.startTime || "0"));
    }
  };

  const handleEventEntryClick = (event: MouseEvent) => {
    const entryElem = event.currentTarget as HTMLElement;
    setCurrentEvent({
      id: parseInt(entryElem.dataset.id || "0"),
      title: entryElem.dataset.title || "",
      description: entryElem.dataset.description || "",
      startTime: parseInt(entryElem.dataset.start_time || "0") + 30,
    });
    setIsDialogOpen(true);
    event.stopPropagation();
  };

  const fetchEvents = async () => {
    const { data, error } = await supabase.from("events").select("*");
    if (error) throw error;

    const newEventEntries: EventTable = {};
    for (const event of data) {
      const originDate = new Date(event.created_at);
      if (originDate.getDate() !== new Date().getDate()) {
        continue;
      }

      const { id, title, description, start_time: startTime } = event;
      if (newEventEntries[startTime]) {
        newEventEntries[startTime].push({ id, title, description, startTime });
      } else {
        newEventEntries[startTime] = [{ id, title, description, startTime }];
      }
    }

    setEventEntries(newEventEntries);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <>
      <div className="Table" onClick={handleCellClick}>
        {rows.map((row) => (
          <div key={row.time} className="Table_row">
            <div className="Table_header">{getTime(row.time)}</div>
            <div className="Table_upperCell" data-start-time={row.time}>
              {eventEntries[row.time] && eventEntries[row.time].length > 0
                ? eventEntries[row.time].map((entry) => (
                    <div
                      className="Table_eventEntry"
                      key={entry.id}
                      onClick={handleEventEntryClick}
                      data-title={entry.title}
                      data-description={entry.description}
                      data-start-time={entry.startTime}
                      data-id={entry.id}
                    >
                      {`${entry.title}, ${getTime(row.time)}`}
                    </div>
                  ))
                : ""}
            </div>
            <div className="Table_lowerCell" data-start-time={row.time + 30}>
              {eventEntries[row.time + 30] &&
              eventEntries[row.time + 30].length > 0
                ? eventEntries[row.time + 30].map((entry) => (
                    <div
                      className="Table_eventEntry"
                      key={entry.id}
                      onClick={handleEventEntryClick}
                      data-title={entry.title}
                      data-description={entry.description}
                      data-start-time={entry.startTime}
                      data-id={entry.id}
                    >
                      {`${entry.title}, ${getTime(row.time)}`}
                    </div>
                  ))
                : ""}
            </div>
          </div>
        ))}
      </div>
      <EventDialog
        open={isDialogOpen}
        onOpenChange={handleOpenChange}
        fetchEvents={fetchEvents}
        currentEvent={currentEvent}
        setCurrentEvent={setCurrentEvent}
        defaultStartTime={startTime}
      />
    </>
  );
}
