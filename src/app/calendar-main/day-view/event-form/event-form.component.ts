import { BehaviorSubject, Subject, takeUntil, tap } from 'rxjs'

import { ChangeDetectionStrategy, Component, Inject, OnDestroy, OnInit } from '@angular/core'
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog'
import { MatInputModule } from '@angular/material/input'
import { MatSlideToggleChange, MatSlideToggleModule } from '@angular/material/slide-toggle'
import { MatSnackBar } from '@angular/material/snack-bar'
import { Store } from '@ngxs/store'

import { CalendarEvent } from '../../../db/eventDB'
import { CreateEvent, DeleteEvent, UpdateEvent } from '../../../state/events/events.actions'
import { EventFormDialogData } from '../day-view.component'

@Component({
  selector: 'app-event-form',
  templateUrl: './event-form.component.html',
  styleUrl: './event-form.component.scss',
  standalone: true,
  imports: [MatDialogModule, MatSlideToggleModule, ReactiveFormsModule, MatInputModule, MatButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EventFormComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>()
  private readonly startEdit = new BehaviorSubject(false)

  private readonly formAbility$ = this.startEdit.pipe(
    tap((startEdit) => {
      if (startEdit) {
        this.eventForm.enable()
      } else {
        this.eventForm.disable()
      }
    })
  )

  readonly editMode = this.data.edit
  readonly eventForm: FormGroup

  constructor(
    @Inject(MAT_DIALOG_DATA) private readonly data: EventFormDialogData,
    private readonly dialogRef: MatDialogRef<EventFormComponent>,
    private readonly snackBar: MatSnackBar,
    private readonly fb: FormBuilder,
    private readonly store: Store
  ) {
    let title = '',
      date = '',
      startTime = '',
      endTime = ''

    if (data.edit) {
      const event = data.event
      title = event.title
      date = this.formatDate(event.startDate)
      startTime = this.formatTime(event.startDate)
      endTime = this.formatTime(event.endDate)
    } else {
      this.startEdit.next(true)
      date = this.formatDate(data.hourSlot)
      startTime = this.formatTime(data.hourSlot)

      const end = new Date(data.hourSlot)
      end.setHours(end.getHours() + 1)
      endTime = this.formatTime(end)
    }

    this.eventForm = this.fb.group({
      title: [title, [Validators.required, this.noWhiteSpaceValidator]],
      date: [date, [Validators.required]],
      startTime: [startTime, [Validators.required, this.startTimeValidator]],
      endTime: [endTime, [Validators.required, this.endTimeValidator]]
    })
  }

  ngOnInit(): void {
    this.formAbility$.pipe(takeUntil(this.destroy$)).subscribe()
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

  onSubmit() {
    if (this.eventForm.invalid) return

    const { title, date, startTime, endTime } = this.eventForm.value

    const startDate = new Date(date)
    const endDate = new Date(date)
    const [sh, sm] = startTime.split(':')
    const [eh, em] = endTime.split(':')

    startDate.setHours(+sh, +sm)
    endDate.setHours(+eh, +em)

    const payloadEvent = {
      title: title.trim(),
      startDate,
      endDate
    } as CalendarEvent

    let obs
    if (this.data.edit) {
      payloadEvent.id = this.data.event.id
      obs = this.store.dispatch(new UpdateEvent(payloadEvent))
    } else {
      obs = this.store.dispatch(new CreateEvent(payloadEvent))
    }

    obs
      .pipe(
        tap(() => {
          this.snackBar.open('Event saved successfully', undefined, { duration: 1000 })
          this.dialogRef.close(true)
        })
      )
      .subscribe()
  }

  private formatDate(date: Date) {
    return `${date.getFullYear()}-${this.appendZero(date.getMonth() + 1)}-${this.appendZero(date.getDate())}`
  }

  private appendZero(n: number) {
    const s = n.toString()
    if (s.length == 1) return '0' + s
    return s
  }

  private formatTime(date: Date) {
    return `${this.appendZero(date.getHours())}:${this.appendZero(date.getMinutes())}`
  }

  onDelete() {
    if (this.data.edit)
      this.store
        .dispatch(new DeleteEvent(this.data.event))
        .pipe(
          tap(() => {
            this.snackBar.open('Event deleted successfully', undefined, {
              duration: 1000
            })
            this.dialogRef.close(true)
          })
        )
        .subscribe()
  }

  private noWhiteSpaceValidator(control: AbstractControl<any, any>): ValidationErrors | null {
    if (!control.value || control.value.trim() === '') return { required: true }
    return null
  }

  private startTimeValidator(control: AbstractControl<any, any>): ValidationErrors | null {
    if (!control || !control.value) return null

    const root = control.root
    const endTimeControl = root.get('endTime')
    if (!root || !endTimeControl || !endTimeControl.value) return null

    const offset = new Date()
    offset.setHours(0, 0, 0, 0)

    const startDate = new Date(offset)
    const endDate = new Date(offset)
    const [sh, sm] = control.value.split(':')
    const [eh, em] = endTimeControl?.value.split(':')

    startDate.setHours(+sh, +sm)
    endDate.setHours(+eh, +em)

    if (startDate.getTime() >= endDate.getTime()) {
      return { startTimeValidator: true }
    }

    endTimeControl.setErrors(null)
    return null
  }

  private endTimeValidator(control: AbstractControl<any, any>): ValidationErrors | null {
    if (!control || !control.value) return null

    const root = control.root
    const startTimeControl = root.get('startTime')
    if (!root || !startTimeControl || !startTimeControl.value) return null

    const offset = new Date()
    offset.setHours(0, 0, 0, 0)

    const startDate = new Date(offset)
    const endDate = new Date(offset)
    const [sh, sm] = startTimeControl.value.split(':')
    const [eh, em] = control?.value.split(':')

    startDate.setHours(+sh, +sm)
    endDate.setHours(+eh, +em)

    if (startDate.getTime() >= endDate.getTime()) {
      return { endTimeValidator: true }
    }
    startTimeControl.setErrors(null)
    return null
  }

  toggleEdit(event: MatSlideToggleChange) {
    this.startEdit.next(event.checked)
  }
}
