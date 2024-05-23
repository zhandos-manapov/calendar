import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarMainComponent } from './components/calendar-main/calendar-main.component';
import { DayViewComponent } from './components/day-view/day-view.component';
import { EventFormComponent } from './components/event-form/event-form.component';
import { MatRippleModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { RouterModule, Routes } from '@angular/router';

function formatDate(date: Date) {
  // Need to encode the date to support forward slashes
  return encodeURIComponent(date.toLocaleDateString());
}

const routes: Routes = [
  // If no date is given, I redirect to today
  { path: '', redirectTo: formatDate(new Date()), pathMatch: 'full' },
  { path: ':date', component: CalendarMainComponent },
];

@NgModule({
  declarations: [CalendarMainComponent, DayViewComponent, EventFormComponent],
  imports: [
    CommonModule,
    MatRippleModule,
    MatDialogModule,
    DragDropModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatDatepickerModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatSlideToggleModule,
    RouterModule.forChild(routes),
  ],
})
export class CalendarModule {}
