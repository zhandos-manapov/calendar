import { EventEmitter, Injectable } from '@angular/core';
import { CalendarEvent, eventDB, EventDB, uuidv4 } from '../db/eventDB';
import { of } from 'rxjs';

// This is EventDbService.
// It is an abstraction on top of localstorage.
// It provides user-defined methods for performing CRUD operations on events.
// All methods return Observable as I wanted to imitate API calls.

@Injectable({
  providedIn: 'root',
})
export class EventDbService {
  private readonly dataKey = 'eventDB';
  private eventDB: EventDB = eventDB;

  constructor() {
    const eventDBstr = localStorage.getItem(this.dataKey);
    if (eventDBstr) {
      this.eventDB = JSON.parse(eventDBstr) as EventDB;

      for (const key in this.eventDB) {
        let calendarEvents = this.eventDB[key];
        calendarEvents = calendarEvents.map((ev) => {
          return {
            ...ev,
            startDate: new Date(ev.startDate),
            endDate: new Date(ev.endDate),
          };
        });
        this.eventDB[key] = calendarEvents;
      }
    } else {
      localStorage.setItem(this.dataKey, JSON.stringify(this.eventDB));
    }
  }

  getAllEvents() {
    return of(this.eventDB);
  }

  getEventsOfDay(dateAsKey: string) {
    const calendarEvents = this.eventDB[dateAsKey] ?? [];
    const sorted = calendarEvents.sort((eventA, eventB) => {
      return eventA.startDate.getTime() - eventB.startDate.getTime();
    });
    this.eventDB[dateAsKey] = sorted;
    return of(sorted);
  }

  updateEvent(eventToUpdate: CalendarEvent) {
    const dateKey = eventToUpdate.startDate.toLocaleDateString();
    let calendarEvents = this.eventDB[dateKey];
    calendarEvents = calendarEvents.filter((event) => {
      return event.id !== eventToUpdate.id;
    });
    calendarEvents.push(eventToUpdate);
    this.eventDB[dateKey] = calendarEvents;
    localStorage.setItem(this.dataKey, JSON.stringify(this.eventDB));
    return of(true);
  }

  createEvent(event: CalendarEvent) {
    const dateKey = event.startDate.toLocaleDateString();
    event.id = uuidv4();
    let calendarEvents = this.eventDB[dateKey] ?? [];
    calendarEvents.push(event);
    this.eventDB[dateKey] = calendarEvents;
    localStorage.setItem(this.dataKey, JSON.stringify(this.eventDB));
    return of(true);
  }

  deleteEvent(event: CalendarEvent) {
    const dateKey = event.startDate.toLocaleDateString();
    let calendarEvents = this.eventDB[dateKey];
    calendarEvents = calendarEvents.filter((ev) => {
      return event.id !== ev.id;
    });
    this.eventDB[dateKey] = calendarEvents;
    localStorage.setItem(this.dataKey, JSON.stringify(this.eventDB));
    return of(true);
  }
}
