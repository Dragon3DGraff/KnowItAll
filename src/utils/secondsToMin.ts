export const secondsToMin = (time: number): string => {
  const minutesNum = Math.floor(time / 60);
  const minutes = `${Math.floor(time / 60)}`.padStart(2, "0");
  const seconds = `${time - minutesNum * 60}`.padStart(2, "0");
  return `${minutes}:${seconds}`;
};
