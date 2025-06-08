import supabase from "../lib/supabase-client";
import { EventDialog } from "./EventDialog";
import "./Table.css";
import { useEffect, useState, type MouseEvent } from "react";
import { getTime } from "../lib/utilities";
import { MOCK_EVENT_ENTRIES } from "../lib/mock-events";

const rows = Array.from({ length: 24 }, (_, index) => {
  return {
    time: index * 60,
  };
});

interface EventTableEntry {
  id: number;
  title: string;
  description: string;
  startTime: number;
}

interface EventTable {
  [key: number]: EventTableEntry[];
}

// TODO:
// 1. display EventEntry for each event in database
// 2. display EventEntry for event being edited immediately after EventDialog pops up

export function Table() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [eventEntries, setEventEntries] =
    useState<EventTable>(MOCK_EVENT_ENTRIES);

  const handleOpenChange = (open: boolean) => {
    setIsDialogOpen(open);
  };

  const handleCellClick = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    const cell = target.closest(".Table_upperCell, .Table_lowerCell");

    if (cell) {
      handleOpenChange(true);
      if (cell.classList.contains("Table_upperCell")) {
        setStartTime(parseInt(cell.parentElement?.dataset.time || "0"));
      } else if (cell.classList.contains("Table_lowerCell")) {
        setStartTime(parseInt(cell.parentElement?.dataset.time || "0") + 30);
      }
    }
  };

  useEffect(() => {
    const fetchEvents = async () => {
      const { data, error } = await supabase.from("events").select("*");
      if (error) throw error;

      console.log(data);
      // TODO save data into events state
    };

    fetchEvents();
  }, []);

  return (
    <>
      <div className="Table" onClick={handleCellClick}>
        {rows.map((row) => (
          <div key={row.time} className="Table_row" data-time={row.time}>
            <div className="Table_header">{getTime(row.time)}</div>
            <div className="Table_upperCell">
              {eventEntries[row.time] && eventEntries[row.time].length > 0
                ? eventEntries[row.time].map((entry) => (
                    <div className="Table_eventEntry" key={entry.id}>
                      {`${entry.title}, ${getTime(row.time)}`}
                    </div>
                  ))
                : ""}
            </div>
            <div className="Table_lowerCell">
              {eventEntries[row.time + 30] && eventEntries[row.time].length > 0
                ? eventEntries[row.time + 30].map((entry) => (
                    <div className="Table_eventEntry" key={entry.id}>
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
        startTime={startTime}
      />
    </>
  );
}
