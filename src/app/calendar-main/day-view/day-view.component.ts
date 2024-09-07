import { BehaviorSubject, combineLatest, map, of, switchMap, tap } from 'rxjs'

import { CdkDragEnd, CdkDragStart, DragDropModule, DragRef, Point } from '@angular/cdk/drag-drop'
import { CommonModule } from '@angular/common'
import { ChangeDetectionStrategy, Component, Input } from '@angular/core'
import { MatRippleModule } from '@angular/material/core'
import { MatDialog } from '@angular/material/dialog'
import { MatIconModule } from '@angular/material/icon'
import { MatSnackBar } from '@angular/material/snack-bar'
import { Store } from '@ngxs/store'

import { CalendarEvent, EventGroups } from '../../db/eventDB'
import { CalendarService } from '../../services/calendar.service'
import { UpdateEvent } from '../../state/events/events.actions'
import { EventsState } from '../../state/events/events.state'
import { EventFormComponent } from './event-form/event-form.component'

export type EventFormDialogData = EditEventFromData | CreateEventFormData

type EditEventFromData = {
  edit: true
  event: CalendarEvent
}

type CreateEventFormData = {
  edit: false
  hourSlot: Date
}

@Component({
  selector: 'app-day-view',
  templateUrl: './day-view.component.html',
  styleUrl: './day-view.component.scss',
  standalone: true,
  imports: [CommonModule, DragDropModule, MatIconModule, MatRippleModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DayViewComponent {
  private readonly TOTAL_MINUTES = 24 * 60
  private readonly CONTAINER_HEIGHT = 800 - 32

  private readonly activeDay$ = this.store.select(EventsState.activeDay)
  private readonly events$ = this.store.select(EventsState.events)

  readonly timezone = this.getTimezone()

  private readonly eventsOfDay$ = combineLatest([this.events$, this.activeDay$]).pipe(
    map(([events, activeDay]) => {
      const calendarEvents = events[activeDay.toLocaleDateString()] ?? []
      const sorted = calendarEvents.sort((eventA, eventB) => eventA.startDate.getTime() - eventB.startDate.getTime())
      return sorted
    })
  )

  readonly eventGroups$ = this.eventsOfDay$.pipe(
    map((eventsOfDay) => this.calendarService.groupEvents(eventsOfDay, []))
  )

  readonly weekdayAndDate$ = this.activeDay$.pipe(
    map((activeDay) => {
      const arr = activeDay.toString().split(' ')
      return `${arr?.[0]} ${arr?.[2]}`
    })
  )

  readonly hoursOfDay$ = this.activeDay$.pipe(map((activeDay) => this.calendarService.getHoursOfDay(activeDay)))

  constructor(
    private readonly calendarService: CalendarService,
    private readonly matDialog: MatDialog,
    private readonly snackBar: MatSnackBar,
    private readonly store: Store
  ) {}

  private getTimezone() {
    let arr = new Date().toString().split(' ')
    return arr[5]
  }

  getHourString(date: Date) {
    const arr = date.toLocaleTimeString().split(':')
    const h = arr[0]
    const period = arr.pop()?.split(' ').pop()
    return `${h} ${period}`
  }

  getHourWithMinutes(date: Date) {
    const arr = date.toLocaleTimeString().split(':')
    const h = arr[0]
    const m = arr[1]
    const period = arr.pop()?.split(' ').pop()
    return `${h}:${m} ${period}`
  }

  // Return dynamic styles for each event
  getEventStyle(eventGroups: EventGroups, event: CalendarEvent, idx: number) {
    const top = this.getTopOffset(event)
    const height = this.getHeight(event)
    let widthPercentage = this.getWidthPercentage(eventGroups)
    const eventCount = eventGroups.events.length

    const isLast = idx === eventCount - 1
    if (isLast) {
      widthPercentage = 1 / eventCount
    }

    const styles = {
      width: `calc((100% - 80px) * ${widthPercentage})`,
      top: top + 'px',
      height: height + 'px',
      // left: `calc(96px + 100% * ${idx / eventCount})`,
      'z-index': 5 + idx
    }
    if (isLast) {
      return { ...styles, right: 0 }
    }
    return { ...styles, left: `calc(80px + 100% * ${idx / eventCount})` }
  }

  private getTopOffset(event: CalendarEvent) {
    const eventStartDate = new Date(event.startDate)
    const start = new Date(eventStartDate.getFullYear(), eventStartDate.getMonth(), eventStartDate.getDate())

    const minutesPassed = this.calendarService.getDiffInMinutes(start, eventStartDate)

    const top = (minutesPassed / this.TOTAL_MINUTES) * this.CONTAINER_HEIGHT
    return Math.round(top)
  }

  private getHeight(event: CalendarEvent) {
    const eventDuration = this.calendarService.getDiffInMinutes(event.startDate, event.endDate)
    const height = (eventDuration / this.TOTAL_MINUTES) * this.CONTAINER_HEIGHT
    return Math.round(height)
  }

  private getWidthPercentage(eventGroups: EventGroups) {
    const eventCount = eventGroups.events.length
    const widthPercentage = eventCount === 1 ? 1 : 1.7 / eventCount
    return widthPercentage
  }

  // Snaps the event to 30 minute intervals on the screen
  computeDragRenderPos(pos: Point, dragRef: DragRef) {
    const point = { x: pos.x, y: Math.round(pos.y / 16) * 16 }
    return point
  }

  onDragEnded(ev: CdkDragEnd, event: CalendarEvent) {
    const offsetTop = ev.source.element.nativeElement.offsetTop
    const y = ev.distance.y
    const s = event.startDate
    const e = event.endDate
    const diff = this.calendarService.getDiffInMinutes(s, e)
    let minutes
    if (y < 0) {
      minutes = Math.floor(Math.max(offsetTop + 16 + y, 0) / 16) * 30
    } else {
      minutes = Math.floor(Math.min(offsetTop + 16 + y, this.CONTAINER_HEIGHT - 32) / 16) * 30
    }
    const sHours = Math.floor(minutes / 60)

    const newStartDate = new Date(s.getFullYear(), s.getMonth(), s.getDate(), sHours, minutes % 60)
    const newEndDate = new Date(newStartDate)
    newEndDate.setMinutes(newEndDate.getMinutes() + diff)

    const newEvent = {
      ...event,
      startDate: newStartDate,
      endDate: newEndDate
    } as CalendarEvent

    this.store
      .dispatch(new UpdateEvent(newEvent))
      .pipe(
        tap(() =>
          this.snackBar.open('Event saved successfully', undefined, {
            duration: 1000
          })
        )
      )
      .subscribe()
  }

  openDialog(hour: Date) {
    this.matDialog.open(EventFormComponent, {
      data: { hourSlot: hour, edit: false } as CreateEventFormData
    })
  }

  onEdit(event: CalendarEvent) {
    this.matDialog.open(EventFormComponent, {
      data: { event, edit: true } as EditEventFromData
    })
  }

  onDragStarted(event: CdkDragStart) {
    event.source.element.nativeElement.style.zIndex = '300'
  }
}
