import { Routes } from '@angular/router'
import { CalendarMainComponent } from './calendar-main.component'

function formatDate(date: Date) {
  // Need to encode the date to support forward slashes
  return encodeURIComponent(date.toLocaleDateString())
}

export const routes: Routes = [
  // If no date is given, I redirect to today
  { path: '', redirectTo: formatDate(new Date()), pathMatch: 'full' },
  { path: ':date', component: CalendarMainComponent }
]
