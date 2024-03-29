import 'tippy.js/themes/light.css';
import 'tippy.js/themes/translucent.css';
import 'tippy.js/dist/svg-arrow.css';
import 'tippy.js/animations/scale.css';

import { Calendar } from '@fullcalendar/core';
import frLocale from '@fullcalendar/core/locales/fr';
import allLocales from '@fullcalendar/core/locales-all';
import dayGridPlugin from '@fullcalendar/daygrid';
import listPlugin from '@fullcalendar/list';
import rrulePlugin from '@fullcalendar/rrule';
import timeGridPlugin from '@fullcalendar/timegrid';
import tippy, { roundArrow } from 'tippy.js';

import type { Categorie, Event } from './types';

window.Webflow ||= [];
window.Webflow.push(() => {
  const calendarElement = document.querySelector<HTMLDivElement>('[data-element="calendar"]');
  if (!calendarElement) return;

  const events = getEvents();

  const calendar = new Calendar(calendarElement, {
    plugins: [dayGridPlugin, rrulePlugin, listPlugin],

    locale: 'fr',
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
  calendar.setOption('locale', 'fr');

  calendar.render();
});

const getEvents = (): Event[] => {
  const scripts = document.querySelectorAll<HTMLScriptElement>('[data-element="event-data"]');

  const categoriesElement = document.querySelectorAll<HTMLScriptElement>(
    '[data-element="categorie-data"]'
  );

  const categories = [...categoriesElement].map((script) => {
    const categorie: Categorie = JSON.parse(script.textContent!);
    return categorie;
  });
  const bgColorsArr = Object.values(categories);

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
    if (event.getbyweekday === '') {
      event.rrule.byweekday = ['su', 'mo', 'tu', 'we', 'th', 'fr', 'sa'];
    } else if (
      event.getbyweekday.includes('su') === false &&
      event.getbyweekday.includes('mo') === false &&
      event.getbyweekday.includes('tu') === false &&
      event.getbyweekday.includes('we') === false &&
      event.getbyweekday.includes('th') === false &&
      event.getbyweekday.includes('fr') === false &&
      event.getbyweekday.includes('sa') === false
    ) {
      event.rrule.byweekday = ['su,mo,tu,we,th,fr,sa'];
    } else if (event.getbyweekday !== '') {
      const weekDays = event.getbyweekday;
      const weekDaysArray = weekDays.split(',');

      event.rrule.byweekday = weekDaysArray;
    }

    // FREQUENCY
    if (event.rrule.freq === '') {
      event.rrule.freq = 'daily';
    }

    // INTERVAL
    const intervalNumber = parseInt(event.getInterval);
    if (Number.isNaN(intervalNumber)) {
      event.rrule.interval = 1;
    } else {
      event.rrule.interval = parseInt(event.getInterval);
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

        const fullExDate = exYear + '-' + exMonthOk + '-' + exDayOk;
        //assign to ex date
        event.exdate.push(fullExDate);
      }
    } else {
      //delete event.exdate;
    }

    //BACKGROUND COLOR :
    for (let i = 0; i < bgColorsArr.length; i++) {
      if (event.repertoire === 'Spectacles') {
        if (bgColorsArr[i].name.indexOf('Spectacles') === 0) {
          event.backgroundColor = bgColorsArr[i].color;
          event.borderColor = bgColorsArr[i].color;
        }
      } else if (event.repertoire === 'Jeunesse') {
        if (bgColorsArr[i].name.indexOf('Jeunesse') === 0) {
          event.backgroundColor = bgColorsArr[i].color;
          event.borderColor = bgColorsArr[i].color;
        }
      } else if (event.repertoire === 'Adulte') {
        if (bgColorsArr[i].name.indexOf('Adulte') === 0) {
          event.backgroundColor = bgColorsArr[i].color;
          event.borderColor = bgColorsArr[i].color;
        }
      } else if (event.repertoire === 'Gala') {
        if (bgColorsArr[i].name.indexOf('Gala') === 0) {
          event.backgroundColor = bgColorsArr[i].color;
          event.borderColor = bgColorsArr[i].color;
        }
      } else if (event.repertoire === 'Inscription') {
        if (bgColorsArr[i].name.indexOf('Inscription') === 0) {
          event.backgroundColor = bgColorsArr[i].color;
          event.borderColor = bgColorsArr[i].color;
        }
      } else if (event.repertoire === 'Cours') {
        if (bgColorsArr[i].name.indexOf('Cours') === 0) {
          event.backgroundColor = bgColorsArr[i].color;
          event.borderColor = bgColorsArr[i].color;
        }
      } else if (event.repertoire === 'Ateliers') {
        if (bgColorsArr[i].name.indexOf('Ateliers') === 0) {
          event.backgroundColor = bgColorsArr[i].color;
          event.borderColor = bgColorsArr[i].color;
        }
      } else if (event.repertoire === 'Expositions') {
        if (bgColorsArr[i].name.indexOf('Expositions') === 0) {
          event.backgroundColor = bgColorsArr[i].color;
          event.borderColor = bgColorsArr[i].color;
        }
      } else if (event.repertoire === 'Évènements') {
        if (bgColorsArr[i].name.indexOf('Évènements') === 0) {
          event.backgroundColor = bgColorsArr[i].color;
          event.borderColor = bgColorsArr[i].color;
        }
      } else if (event.repertoire === '100e') {
        if (bgColorsArr[i].name.indexOf('100e') === 0) {
          event.backgroundColor = bgColorsArr[i].color;
          event.borderColor = bgColorsArr[i].color;
        }
      }
    }

    return event;
  });

  return events;
};
