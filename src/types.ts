export type Event = {
  title: string;
  backgroundColor: string;
  url: string;
  rrule: {
    dtstart: string | Date;
    until: string | Date;
    freq: string;
    interval: number;
    byweekday: Array<string>;
  };
  extendedProps: {
    localisation: string;
    time: string;
    image: string;
  };
  localisation: string;
  duration: string;
  exdate: Array<string>;
  getexdate: Array<string>;
  display: string;
  startday: string | Date;
  startTime: string;
  endday: string;
  repertoire: string;
  getbyweekday: string;
  textColor: string;
  borderColor: string;
};
