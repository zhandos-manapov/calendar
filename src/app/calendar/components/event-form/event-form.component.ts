import { Component, Inject } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { CalendarEvent } from '../../../db/eventDB';
import { CalendarService } from '../../../services/calendar.service';
import { EventFormDialogData } from '../day-view/day-view.component';
import { EventDbService } from '../../../services/event-db.service';

@Component({
  selector: 'app-event-form',
  templateUrl: './event-form.component.html',
  styleUrl: './event-form.component.scss',
})
export class EventFormComponent {
  startEdit = false;

  eventFormValue = {
    title: '',
    date: '',
    startTime: '',
    endTime: '',
  };

  constructor(
    private readonly dialogRef: MatDialogRef<EventFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: EventFormDialogData,
    private readonly calendarService: CalendarService,
    private readonly snackBar: MatSnackBar,
    private readonly eventDbService: EventDbService
  ) {
    if (!data.edit) {
      this.startEdit = true;
      this.eventFormValue.date = this.formatDate(data.hour);
      const end = new Date(data.hour);
      end.setHours(end.getHours() + 1);
      this.eventFormValue.startTime = this.formatTime(data.hour);
      this.eventFormValue.endTime = this.formatTime(end);
    } else {
      const event = data.event;
      this.eventFormValue.date = this.formatDate(event.startDate);
      this.eventFormValue.startTime = this.formatTime(event.startDate);
      this.eventFormValue.endTime = this.formatTime(event.endDate);
      this.eventFormValue.title = event.title;
    }
  }

  onSubmit(eventForm: NgForm) {
    if (eventForm.invalid) return;

    const startDate = new Date(this.eventFormValue.date);
    const endDate = new Date(this.eventFormValue.date);
    const [sh, sm] = this.eventFormValue.startTime.split(':');
    const [eh, em] = this.eventFormValue.endTime.split(':');

    startDate.setHours(+sh);
    startDate.setMinutes(+sm);
    endDate.setHours(+eh);
    endDate.setMinutes(+em);

    if (startDate.getTime() >= endDate.getTime()) {
      this.snackBar.open(
        'The end time cannot be earlier than the start time',
        undefined,
        { duration: 1000 }
      );
      return;
    }

    const event = {
      title: this.eventFormValue.title,
      startDate,
      endDate,
    } as CalendarEvent;

    let obs;
    if (!this.data.edit) {
      obs = this.eventDbService.createEvent(event);
    } else {
      event.id = this.data.event.id;
      obs = this.eventDbService.updateEvent(event);
    }
    obs.subscribe(() => {
      this.snackBar.open('Event saved successfully', undefined, {
        duration: 1000,
      });
      this.dialogRef.close(true);
    });
  }

  formatDate(date: Date) {
    return `${date.getFullYear()}-${this.appendZero(
      date.getMonth() + 1
    )}-${this.appendZero(date.getDate())}`;
  }

  appendZero(n: number) {
    const s = n.toString();
    if (s.length == 1) return '0' + s;
    return s;
  }

  formatTime(date: Date) {
    return `${this.appendZero(date.getHours())}:${this.appendZero(
      date.getMinutes()
    )}`;
  }

  onDelete() {
    if (this.data.edit)
      this.eventDbService.deleteEvent(this.data.event).subscribe(() => {
        this.snackBar.open('Event deleted successfully', undefined, {
          duration: 1000,
        });
        this.dialogRef.close(true);
      });
  }
}
