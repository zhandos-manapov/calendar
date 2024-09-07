import { filter, Subject, takeUntil, tap } from 'rxjs'

import { Injectable, OnDestroy } from '@angular/core'
import { Store } from '@ngxs/store'

import { EventDB, eventDb } from '../db/eventDB'
import { SetEvents } from '../state/events/events.actions'
import { EventsState } from '../state/events/events.state'

@Injectable()
export class LocalStorageHandler implements OnDestroy {
  private readonly DATA_KEY = 'eventDB'

  private readonly destroy$ = new Subject<void>()

  private readonly events$ = this.store.select(EventsState.events)

  private readonly saveToLocalStorage$ = this.events$.pipe(
    filter((events) => Object.keys(events).length > 0),
    tap((events) => {
      localStorage.setItem(this.DATA_KEY, JSON.stringify(events))
    })
  )

  constructor(private readonly store: Store) {
    this.saveToLocalStorage$.pipe(takeUntil(this.destroy$)).subscribe()
    this.initFromLocalStorage()
  }

  private initFromLocalStorage() {
    const eventDBstr = localStorage.getItem(this.DATA_KEY)
    const events: EventDB = eventDBstr ? JSON.parse(eventDBstr) : {}
    if (Object.keys(events).length > 0) {
      for (const key in events) {
        let calendarEvents = events[key]
        calendarEvents = calendarEvents.map((ev) => {
          return {
            ...ev,
            startDate: new Date(ev.startDate),
            endDate: new Date(ev.endDate)
          }
        })
        events[key] = calendarEvents
      }

      this.store.dispatch(new SetEvents(events))
    } else {
      this.store.dispatch(new SetEvents(eventDb))
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }
}
