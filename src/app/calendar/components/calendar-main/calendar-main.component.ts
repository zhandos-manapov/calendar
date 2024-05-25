import { Component, OnDestroy, OnInit, Signal, signal } from '@angular/core';
import { CalendarService } from '../../../services/calendar.service';
import { BehaviorSubject, Subscription, switchMap } from 'rxjs';
import { EventDbService } from '../../../services/event-db.service';
import { EventDB } from '../../../db/eventDB';
import { ActivatedRoute, Route, Router } from '@angular/router';

@Component({
  selector: 'app-calendar-main',
  templateUrl: './calendar-main.component.html',
  styleUrl: './calendar-main.component.scss',
})
export class CalendarMainComponent implements OnInit, OnDestroy {
  // Tried to use signals as much as possible
  today = signal(new Date());
  activeDay = signal(new Date());

  // Used BehaviorSubject for the sake of using BehaviorSubject here
  // because the assessment task said to use as many rxjs and
  // angular features/patterns as possible.
  firstDayOfActiveMonth: BehaviorSubject<Date>;
  monthNames = signal([] as string[]);
  weekdays = signal([] as string[]);
  daysOfTheMonth = signal([] as Date[]);
  allEvents = signal({} as EventDB);
  sub1$!: Subscription;

  constructor(
    private readonly calendarService: CalendarService,
    private readonly eventDbService: EventDbService,
    private readonly route: ActivatedRoute,
    private readonly router: Router
  ) {
    this.monthNames.set(this.calendarService.getMonthNames());
    this.weekdays.set(this.calendarService.getWeekDays());
    const firstDay = this.calendarService.getFirstDayOfTheMonth(this.today());
    this.firstDayOfActiveMonth = new BehaviorSubject(firstDay);

    this.route.paramMap.subscribe((paramMap) => {
      let date = paramMap.get('date');
      if (date) {
        date = decodeURIComponent(date);
        const currDate = new Date(date);
        if (currDate.toString() !== 'Invalid Date') {
          this.activeDay.set(currDate);

          const firstDay = this.calendarService.getFirstDayOfTheMonth(
            this.activeDay()
          );
          this.firstDayOfActiveMonth.next(firstDay);
        } else {
          this.router.navigate(['/']);
        }
      }
    });
  }

  ngOnInit(): void {
    this.sub1$ = this.firstDayOfActiveMonth.subscribe((firstDay) => {
      this.daysOfTheMonth.set(this.calendarService.getDaysOfTheMonth(firstDay));
    });

    this.eventDbService.getAllEvents().subscribe((allEvents) => {
      this.allEvents.set(allEvents);
    });
  }

  ngOnDestroy(): void {
    this.sub1$.unsubscribe();
  }

  getMonthName(index: number) {
    return this.monthNames()[index];
  }

  goToPrevMonth() {
    const prevMonth = this.calendarService.minusMonth(
      this.firstDayOfActiveMonth.getValue()
    );
    const encodedDate = encodeURIComponent(prevMonth.toLocaleDateString());
    this.router.navigate(['/calendar', encodedDate]);
  }

  goToNextMonth() {
    const nextMonth = this.calendarService.plusMonth(
      this.firstDayOfActiveMonth.getValue()
    );
    const encodedDate = encodeURIComponent(nextMonth.toLocaleDateString());
    this.router.navigate(['/calendar', encodedDate]);
  }

  goToToday() {
    const encodedDate = encodeURIComponent(new Date().toLocaleDateString());
    this.router.navigate(['/calendar', encodedDate]);
  }

  onActivate(date: Date) {
    const encodedDate = encodeURIComponent(date.toLocaleDateString());
    this.router.navigate(['/calendar', encodedDate]);
  }
}
