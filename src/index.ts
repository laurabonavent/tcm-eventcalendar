import 'tippy.js/themes/light.css';
import 'tippy.js/themes/translucent.css';
import 'tippy.js/dist/svg-arrow.css';
import 'tippy.js/animations/scale.css';

import { Calendar } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import listPlugin from '@fullcalendar/list';
import rrulePlugin from '@fullcalendar/rrule';
import timeGridPlugin from '@fullcalendar/timegrid';
import tippy, { roundArrow } from 'tippy.js';

import type { Event } from './types';

window.Webflow ||= [];
window.Webflow.push(() => {
  const calendarElement = document.querySelector<HTMLDivElement>('[data-element="calendar"]');
  if (!calendarElement) return;

  const events = getEvents();

  const calendar = new Calendar(calendarElement, {
    plugins: [dayGridPlugin, rrulePlugin, listPlugin],

    initialView: 'dayGridMonth',
    fixedWeekCount: false,
    showNonCurrentDates: true,
    slotMinTime: '08:00:00',
    height: 'auto',
    headerToolbar: {
      left: 'prev,next',
      center: 'title',
      right: 'dayGridMonth,listMonth',
    },

    buttonText: {
      month: 'Mois',
      list: 'Liste',
    },

    windowResize: function () {
      console.log(window.innerWidth);
      //alert('The calendar has adjusted to a window resize. Current view: ' + arg.view.type);
      if (window.innerWidth > 1000) {
        calendar.changeView('dayGridMonth');
      } else if (window.innerWidth < 1000) {
        calendar.changeView('listMonth');
      }
    },

    events,

    eventTimeFormat: {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      meridiem: false,
    },

    slotLabelFormat: {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      meridiem: false,
    },

    eventMouseEnter(data) {
      tippy(data.el, {
        content:
          '<div style="padding:15px; border-left:2px solid' +
          data.event.backgroundColor +
          '"><img src="' +
          data.event.extendedProps.image +
          '"></img><p style="color:black; font-family:Red Hat Display, sans-serif; font-size:1.25rem; line-height:125%; margin:5px 0px;">' +
          data.event.title +
          '</p> <div> <img style="margin-right:5px; width:14px;"src="https://uploads-ssl.webflow.com/63e60ae0d172c02222cc9e79/641e2de18be4f26e9913a9e2_clock%201.svg"></img>' +
          data.event.extendedProps.time +
          '</div> <div> <img style="margin-right:5px; width:14px;" src="https://uploads-ssl.webflow.com/63e60ae0d172c02222cc9e79/64428f103066897c24b1e742_location%20on-sharp-24px.svg"></img>' +
          data.event.extendedProps.localisation +
          '</div></div>',
        //content: data.event.title + ' // ' + data.event.extendedProps.localisation,
        placement: 'bottom',
        arrow: roundArrow,
        theme: 'light',
        allowHTML: true,
        animation: 'scale',
      });
    },
  });

  calendar.render();
});

const getEvents = (): Event[] => {
  const scripts = document.querySelectorAll<HTMLScriptElement>('[data-element="event-data"]');

  const events = [...scripts].map((script) => {
    const event: Event = JSON.parse(script.textContent!);

    //add background to event
    event.display = 'block';

    // hide time (+CSS)
    event.startTime = '10:00:00';
    event.allDay = false;
    //event.displayEventTime = false;

    //apostrophe display
    event.title = event.title.replace(/&#39;/g, "'");

    //black text color
    event.textColor = 'black';

    // get all the collection dates in date format
    const startDate = new Date(event.startday);
    const endDate = new Date(event.endday);

    //START DATE
    //day
    const startDay = startDate.getDate();
    let startDayOk;
    if (startDay < 10) {
      startDayOk = ('0' + startDay).slice(-2);
    } else {
      startDayOk = startDay;
    }

    // month
    const startMonth = startDate.getMonth() + 1;
    let startMonthOk;

    if (startMonth < 10) {
      startMonthOk = ('0' + startMonth).slice(-2);
    } else {
      startMonthOk = startMonth;
    }
    //year
    const startYear = startDate.getFullYear();

    //assign to dtstart
    event.rrule.dtstart = startYear + '-' + startMonthOk + '-' + startDayOk;

    // END DATE
    //day
    const endDay = endDate.getDate();
    let endDayOk;
    if (endDay < 10) {
      endDayOk = ('0' + endDay).slice(-2);
    } else {
      endDayOk = endDay;
    }

    // month
    const endMonth = endDate.getMonth() + 1;
    let endMonthOk;
    if (endMonth < 10) {
      endMonthOk = ('0' + endMonth).slice(-2);
    } else {
      endMonthOk = endMonth;
    }
    //year
    const endYear = endDate.getFullYear();

    //assign to until
    event.rrule.until = endYear + '-' + endMonthOk + '-' + endDayOk;

    //WEEKDAYS
    const weekDays = event.getbyweekday;
    const weekDaysArray = weekDays.split(',');

    if (weekDaysArray.length > 0) {
      for (let i = 0; i < weekDaysArray.length; i++) {
        event.rrule.byweekday = weekDaysArray;
      }
    } else {
      event.rrule.byweekday = ['su,mo,tu,we,th,fr,sa'];
    }

    // FREQUENCY
    if (event.rrule.freq === '') {
      event.rrule.freq = 'daily';
    }

    // INTERVAL
    if (event.rrule.interval === null) {
      event.rrule.interval = 1;
    }

    //EXCEPTION DATES
    const exDateArray = event.getexdate;
    const noEmpty = Array.from(exDateArray.filter((e) => e));

    if (noEmpty.length > 0) {
      for (let i = 0; i < noEmpty.length; i++) {
        const exDate = new Date(noEmpty[i]);

        //day
        const exDay = exDate.getDate();
        let exDayOk;
        if (exDay < 10) {
          exDayOk = ('0' + exDay).slice(-2);
        } else {
          exDayOk = exDay;
        }

        // month
        const exMonth = exDate.getMonth() + 1;
        let exMonthOk;
        if (exMonth < 10) {
          exMonthOk = ('0' + exMonth).slice(-2);
        } else {
          exMonthOk = exMonth;
        }

        //year
        const exYear = exDate.getFullYear();

        const fullExDate = exYear + '-' + exMonthOk + '-' + exDayOk + 'T' + event.startTime;

        //assign to ex date
        event.exdate.push(fullExDate);
      }
    } else {
      //delete event.exdate;
    }

    //BACKGROUND COLOR :
    if (event.repertoire === 'Spectacles') {
      event.backgroundColor = '#fffc80';
      event.borderColor = '#fffc80';
    } else if (event.repertoire === 'Évènements') {
      event.backgroundColor = '#dcfdff';
      event.borderColor = '#dcfdff';
    } else if (event.repertoire === 'Jeunesse') {
      event.backgroundColor = '#45d8b5';
      event.borderColor = '#45d8b5';
    } else if (event.repertoire === 'Expositions') {
      event.backgroundColor = '#ffd9ab';
      event.borderColor = '#ffd9ab';
    } else if (event.repertoire === 'Ateliers') {
      event.backgroundColor = '#ffe9fb';
      event.borderColor = '#ffe9fb';
    }

    return event;
  });

  return events;
};
