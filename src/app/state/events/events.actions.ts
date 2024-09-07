import { CalendarEvent, EventDB } from '../../db/eventDB'

export enum EventsActions {
  UpdateEvent = '[Events] Update Event',
  CreateEvent = '[Events] Create Event',
  DeleteEvent = '[Events] Delete Event',
  SetEvents = '[Events] Set Events',
  SetActiveDay = '[Events] Set Active Day'
}

export class UpdateEvent {
  static readonly type = EventsActions.UpdateEvent
  constructor(readonly eventToUpdate: CalendarEvent) {}
}

export class CreateEvent {
  static readonly type = EventsActions.CreateEvent
  constructor(readonly event: CalendarEvent) {}
}

export class DeleteEvent {
  static readonly type = EventsActions.DeleteEvent
  constructor(readonly event: CalendarEvent) {}
}

export class SetEvents {
  static readonly type = EventsActions.SetEvents
  constructor(readonly events: EventDB) {}
}

export class SetActiveDay {
  static readonly type = EventsActions.SetActiveDay
  constructor(readonly activeDay: Date) {}
}
