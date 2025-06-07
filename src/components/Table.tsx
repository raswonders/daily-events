import { EventDialog } from "./EventDialog";
import "./Table.css";
import { useState, type MouseEvent } from "react";

const rows = Array.from({ length: 24 }, (_, index) => {
  return {
    time: index * 60,
    events: [],
  };
});

function getTime(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const minutesRemaining = minutes % 60;
  return `${hours.toString().padStart(2, "0")}:${minutesRemaining
    .toString()
    .padStart(2, "0")}`;
}

export function Table() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);

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

  return (
    <>
      <div className="Table" onClick={handleCellClick}>
        {rows.map((row) => (
          <div key={row.time} className="Table_row" data-time={row.time}>
            <div className="Table_header">{getTime(row.time)}</div>
            <div className="Table_upperCell">
              {row.events.length > 0 && row.events}
            </div>
            <div className="Table_lowerCell">
              {row.events.length > 0 && row.events}
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
