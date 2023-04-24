export type Event = {
  title: string;
  url: string;
  startRecur: string | Date;
  endRecur: string | Date;
  daysOfWeek: Array<string>;
  startTime: string;
  endTime: string;
};
