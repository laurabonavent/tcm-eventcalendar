import { Calendar } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import listPlugin from '@fullcalendar/list';
import timeGridPlugin from '@fullcalendar/timegrid';

import type { Event } from './types';

window.Webflow ||= [];
window.Webflow.push(() => {
  const calendarElement = document.querySelector<HTMLDivElement>('[data-element="calendar"]');
  if (!calendarElement) return;

  const events = getEvents();
  console.log({ events });

  const calendar = new Calendar(calendarElement, {
    plugins: [dayGridPlugin, timeGridPlugin, listPlugin],
    initialView: 'dayGridMonth',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,listPlugin',
    },

    events,
    /*eventClick(data) {
      alert(`User clicked the event ${data.event.title}`);
    },*/
  });

  calendar.render();
});

const getEvents = (): Event[] => {
  const scripts = document.querySelectorAll<HTMLScriptElement>('[data-element="event-data"]');
  //const scriptsArray = Object.entries(scripts);
  const events = [...scripts].map((script) => {
    const event: Event = JSON.parse(script.textContent!);
    console.log(event.startRecur);
    //event.startRecur = new Date(event.startRecur);
    //event.endRecur = new Date(event.endRecur);

    return event;
  });

  return events;
};
