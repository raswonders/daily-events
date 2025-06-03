import "./Table.css";

const rows = Array.from({ length: 24 }, (_, index) => {
  return {
    time: index * 60,
    events: [],
  };
});

function getTime(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const minutesRemaining = minutes % 60;
  return `${hours}:${minutesRemaining.toString().padStart(2, "0")}`;
}

export function Table() {
  return (
    <div className="Table">
      {rows.map((row) => (
        <div key={row.time} className="Table_row">
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
  );
}
