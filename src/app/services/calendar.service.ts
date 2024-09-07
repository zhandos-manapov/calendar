import { Injectable } from '@angular/core'
import { CalendarEvent, EventGroups } from '../db/eventDB'

// This is CalendarService. It has everything related to calculations with dates.
@Injectable({
  providedIn: 'root'
})
export class CalendarService {
  private readonly weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  private readonly monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ]
  private readonly monthNamesShort = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'June',
    'July',
    'Aug',
    'Sept',
    'Oct',
    'Nov',
    'Dec'
  ]
  private readonly today = new Date()

  getMonthNames() {
    return this.monthNames
  }

  getWeekDays() {
    return this.weekdays
  }

  // Returns the first day of the month of the provided date.
  getFirstDayOfTheMonth(date: Date) {
    const firstDayOfTheMonth = new Date(date.getFullYear(), date.getMonth(), 1)
    return firstDayOfTheMonth
  }

  // Returns the last day of the month of the provided date.
  getLastDayOfTheMonth(date: Date) {
    const lastDayOfTheMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0)
    return lastDayOfTheMonth
  }

  // Returns the days of the month on the screen.
  getDaysOfActiveMonth() {
    const daysOfActiveMonth = []
    let date = new Date(this.today.getFullYear(), this.today.getMonth(), 1)
    while (date.getMonth() == this.today.getMonth()) {
      daysOfActiveMonth.push(new Date(date))
      date.setDate(date.getDate() + 1)
    }
    return daysOfActiveMonth
  }

  // Returns the Monday of the week of the provided date.
  getMonday(date: Date) {
    const dt = new Date(date)
    const day = dt.getDay()
    const diff = dt.getDate() - day + (day === 0 ? -6 : 1)
    return new Date(dt.setDate(diff))
  }

  // Returns the Sunday of the week of the provided date.
  getSunday(date: Date) {
    const dt = new Date(date)
    const day = dt.getDay()
    const diff = dt.getDate() - (day - 1) + (day === 0 ? -1 : 6)
    return new Date(dt.setDate(diff))
  }

  // Returns the days of the month of the provided date
  getDaysOfTheMonth(date: Date) {
    let startDate = this.getMonday(this.getFirstDayOfTheMonth(date))
    let lastDate = this.getSunday(this.getLastDayOfTheMonth(date))

    const daysOfMonth = []

    let dt = new Date(startDate)
    while (dt.getTime() <= lastDate.getTime()) {
      daysOfMonth.push(new Date(dt))
      dt.setDate(dt.getDate() + 1)
    }
    return daysOfMonth
  }

  minusMonth(date: Date) {
    const dt = new Date(date)
    dt.setMonth(dt.getMonth() - 1)
    return dt
  }

  plusMonth(date: Date) {
    const dt = new Date(date)
    dt.setMonth(dt.getMonth() + 1)
    return dt
  }

  getHoursOfDay(date: Date) {
    const dt = new Date(date.getFullYear(), date.getMonth(), date.getDate())
    const hoursOfDay = []
    while (date.getDate() == dt.getDate()) {
      hoursOfDay.push(new Date(dt))
      dt.setHours(dt.getHours() + 1)
    }
    return hoursOfDay
  }

  getDiffInMinutes(start: Date, end: Date) {
    const startMilliseconds = start.getTime()
    const endMilliseconds = end.getTime()
    const diff = endMilliseconds - startMilliseconds
    const diffMinutes = diff / 1000 / 60
    return diffMinutes
  }

  // Recursive function to group overlapping events to display them next to each other.
  groupEvents(events: CalendarEvent[], eventGroups: EventGroups[]): EventGroups[] {
    if (events.length <= 0) {
      return eventGroups
    }

    const first = events[0]
    const groupArr = [first]
    const rest = []
    for (let i = 1; i < events.length; i++) {
      const curr = events[i]
      if (first.startDate.getTime() <= curr.startDate.getTime() && curr.startDate.getTime() < first.endDate.getTime()) {
        groupArr.push(curr)
      } else {
        rest.push(curr)
      }
    }
    eventGroups.push({ events: groupArr } as EventGroups)
    return this.groupEvents(rest, eventGroups)
  }
}
