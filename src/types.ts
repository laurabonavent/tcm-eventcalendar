export type Event = {
  title: string;
  url: string;
  start: string | Date;
  end: string | Date;
  daysOfWeek: Array<string>;
  startTime: string;
  endTime: string;
};
