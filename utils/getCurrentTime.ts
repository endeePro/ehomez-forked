function getCurrentTimeWithAMPM(inComingDate: string | number | Date): string {
  const date: Date = new Date(inComingDate);

  let hours: number = date.getHours();
  const minutes: number = date.getMinutes();
  const ampm: string = hours >= 12 ? "PM" : "AM";

  hours = hours % 12;
  hours = hours ? hours : 12;

  const formattedHours: string = hours < 10 ? "0" + hours : hours.toString();
  const formattedMinutes: string =
    minutes < 10 ? "0" + minutes : minutes.toString();

  return `${formattedHours}:${formattedMinutes} ${ampm}`;
}

export { getCurrentTimeWithAMPM };
