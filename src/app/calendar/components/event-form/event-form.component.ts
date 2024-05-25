import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { CalendarEvent } from '../../../db/eventDB';
import { EventFormDialogData } from '../day-view/day-view.component';
import { EventDbService } from '../../../services/event-db.service';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-event-form',
  templateUrl: './event-form.component.html',
  styleUrl: './event-form.component.scss',
})
export class EventFormComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject();
  readonly startEdit = new BehaviorSubject(false);
  editMode = false;
  eventForm: FormGroup;

  constructor(
    private readonly dialogRef: MatDialogRef<EventFormComponent>,
    @Inject(MAT_DIALOG_DATA) private readonly data: EventFormDialogData,
    private readonly snackBar: MatSnackBar,
    private readonly eventDbService: EventDbService,
    private readonly fb: FormBuilder
  ) {
    this.editMode = data.edit;

    let title = '',
      date = '',
      startTime = '',
      endTime = '';

    if (data.edit) {
      const event = data.event;
      title = event.title;
      date = this.formatDate(event.startDate);
      startTime = this.formatTime(event.startDate);
      endTime = this.formatTime(event.endDate);
    } else {
      this.startEdit.next(true);
      date = this.formatDate(data.hourSlot);
      startTime = this.formatTime(data.hourSlot);

      const end = new Date(data.hourSlot);
      end.setHours(end.getHours() + 1);
      endTime = this.formatTime(end);
    }

    this.eventForm = this.fb.group({
      title: [title, [Validators.required, this.noWhiteSpaceValidator]],
      date: [date, [Validators.required]],
      startTime: [startTime, [Validators.required, this.startTimeValidator]],
      endTime: [endTime, [Validators.required, this.endTimeValidator]],
    });
  }

  ngOnInit(): void {
    this.startEdit.pipe(takeUntil(this.destroy$)).subscribe((startEdit) => {
      if (startEdit) {
        this.eventForm.enable();
      } else {
        this.eventForm.disable();
      }
    });

    this.eventForm.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        // testing
        console.log(value);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  onSubmit() {
    if (this.eventForm.invalid) return;

    const { title, date, startTime, endTime } = this.eventForm.value;

    const startDate = new Date(date);
    const endDate = new Date(date);
    const [sh, sm] = startTime.split(':');
    const [eh, em] = endTime.split(':');

    startDate.setHours(+sh, +sm);
    endDate.setHours(+eh, +em);

    const payloadEvent = {
      title: title.trim(),
      startDate,
      endDate,
    } as CalendarEvent;

    let obs;
    if (this.data.edit) {
      payloadEvent.id = this.data.event.id;
      obs = this.eventDbService.updateEvent(payloadEvent);
    } else {
      obs = this.eventDbService.createEvent(payloadEvent);
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

  noWhiteSpaceValidator(
    control: AbstractControl<any, any>
  ): ValidationErrors | null {
    if (!control.value || control.value.trim() === '')
      return { required: true };
    return null;
  }

  startTimeValidator(
    control: AbstractControl<any, any>
  ): ValidationErrors | null {
    if (!control || !control.value) return null;

    const root = control.root;
    const endTimeControl = root.get('endTime');
    if (!root || !endTimeControl || !endTimeControl.value) return null;

    const offset = new Date();
    offset.setHours(0, 0, 0, 0);

    const startDate = new Date(offset);
    const endDate = new Date(offset);
    const [sh, sm] = control.value.split(':');
    const [eh, em] = endTimeControl?.value.split(':');

    startDate.setHours(+sh, +sm);
    endDate.setHours(+eh, +em);

    if (startDate.getTime() >= endDate.getTime()) {
      return { startTimeValidator: true };
    }

    endTimeControl.setErrors(null);
    return null;
  }

  endTimeValidator(
    control: AbstractControl<any, any>
  ): ValidationErrors | null {
    if (!control || !control.value) return null;

    const root = control.root;
    const startTimeControl = root.get('startTime');
    if (!root || !startTimeControl || !startTimeControl.value) return null;

    const offset = new Date();
    offset.setHours(0, 0, 0, 0);

    const startDate = new Date(offset);
    const endDate = new Date(offset);
    const [sh, sm] = startTimeControl.value.split(':');
    const [eh, em] = control?.value.split(':');

    startDate.setHours(+sh, +sm);
    endDate.setHours(+eh, +em);

    if (startDate.getTime() >= endDate.getTime()) {
      return { endTimeValidator: true };
    }
    startTimeControl.setErrors(null);
    return null;
  }

  toggleEdit(event: MatSlideToggleChange) {
    this.startEdit.next(event.checked);
  }
}
