export function getTime(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const minutesRemaining = minutes % 60;
  return `${hours.toString().padStart(2, "0")}:${minutesRemaining
    .toString()
    .padStart(2, "0")}`;
}
