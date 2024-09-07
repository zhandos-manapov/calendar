import { map, take, tap } from 'rxjs'

import { CommonModule } from '@angular/common'
import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MatCardModule } from '@angular/material/card'
import { MatIconModule } from '@angular/material/icon'
import { ActivatedRoute, Router } from '@angular/router'
import { Store } from '@ngxs/store'

import { LocalStorageHandler } from '../handlers/localstorage.handler'
import { CalendarService } from '../services/calendar.service'
import { SetActiveDay } from '../state/events/events.actions'
import { EventsState } from '../state/events/events.state'
import { DayViewComponent } from './day-view/day-view.component'

@Component({
  selector: 'app-calendar-main',
  templateUrl: './calendar-main.component.html',
  styleUrl: './calendar-main.component.scss',
  standalone: true,
  imports: [MatCardModule, MatIconModule, CommonModule, DayViewComponent, MatButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CalendarMainComponent {
  readonly today = new Date()
  readonly monthNames = this.calendarService.getMonthNames()
  readonly weekdays = this.calendarService.getWeekDays()

  readonly events$ = this.store.select(EventsState.events)
  readonly activeDay$ = this.store.select(EventsState.activeDay)

  readonly firstDayOfActiveMonth$ = this.activeDay$.pipe(
    map((activeDay) => this.calendarService.getFirstDayOfTheMonth(activeDay))
  )

  readonly daysOfTheMonth$ = this.firstDayOfActiveMonth$.pipe(
    map((firstDay) => this.calendarService.getDaysOfTheMonth(firstDay))
  )

  constructor(
    private readonly calendarService: CalendarService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly store: Store,
    private readonly localStorageHandler: LocalStorageHandler
  ) {
    this.route.paramMap.subscribe((paramMap) => {
      let date = paramMap.get('date')
      if (date) {
        date = decodeURIComponent(date)
        const currDate = new Date(date)
        if (currDate.toString() !== 'Invalid Date') {
          this.store.dispatch(new SetActiveDay(currDate))
        } else {
          this.router.navigate(['/'])
        }
      }
    })
  }

  getMonthName(index?: number) {
    return typeof index === 'number' ? this.monthNames[index] : ''
  }

  goToPrevMonth() {
    this.firstDayOfActiveMonth$
      .pipe(
        tap((firstDay) => {
          const prevMonth = this.calendarService.minusMonth(firstDay)
          const encodedDate = encodeURIComponent(prevMonth.toLocaleDateString())
          this.router.navigate(['/calendar', encodedDate])
        }),
        take(1)
      )
      .subscribe()
  }

  goToNextMonth() {
    this.firstDayOfActiveMonth$
      .pipe(
        tap((firstDay) => {
          const nextMonth = this.calendarService.plusMonth(firstDay)
          const encodedDate = encodeURIComponent(nextMonth.toLocaleDateString())
          this.router.navigate(['/calendar', encodedDate])
        }),
        take(1)
      )
      .subscribe()
  }

  goToToday() {
    const encodedDate = encodeURIComponent(new Date().toLocaleDateString())
    this.router.navigate(['/calendar', encodedDate])
  }

  onActivate(date: Date) {
    const encodedDate = encodeURIComponent(date.toLocaleDateString())
    this.router.navigate(['/calendar', encodedDate])
  }
}
