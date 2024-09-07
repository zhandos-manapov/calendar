import { Injectable } from '@angular/core'
import { Action, Selector, State, StateContext } from '@ngxs/store'

import { EventDB, uuidv4 } from '../../db/eventDB'
import { CreateEvent, DeleteEvent, SetActiveDay, SetEvents, UpdateEvent } from './events.actions'

export interface EventsStateModel {
  eventDb: EventDB
  activeDay: Date
}

const defaultState: EventsStateModel = {
  eventDb: {},
  activeDay: new Date()
}

@State<EventsStateModel>({
  name: 'events',
  defaults: defaultState
})
@Injectable()
export class EventsState {
  private static readonly dataKey = 'eventDB'

  @Selector()
  static state(state: EventsStateModel) {
    return state
  }

  @Selector()
  static events(state: EventsStateModel) {
    return state.eventDb
  }

  @Selector()
  static activeDay(state: EventsStateModel) {
    return state.activeDay
  }

  @Action(SetActiveDay)
  setActiveDay(ctx: StateContext<EventsStateModel>, { activeDay }: SetActiveDay) {
    ctx.patchState({ activeDay })
  }

  @Action(SetEvents)
  setEvents(ctx: StateContext<EventsStateModel>, { events }: SetEvents) {
    ctx.patchState({ eventDb: events })
  }

  @Action(UpdateEvent)
  updateEvent(ctx: StateContext<EventsStateModel>, { eventToUpdate }: UpdateEvent) {
    const dateKey = eventToUpdate.startDate.toLocaleDateString()
    const eventDb = ctx.getState().eventDb
    let calendarEvents = eventDb[dateKey]
    calendarEvents = calendarEvents.filter((event) => event.id !== eventToUpdate.id)
    calendarEvents.push(eventToUpdate)
    eventDb[dateKey] = calendarEvents
    ctx.patchState({ eventDb: { ...eventDb } })
  }

  @Action(CreateEvent)
  createEvent(ctx: StateContext<EventsStateModel>, { event }: CreateEvent) {
    const dateKey = event.startDate.toLocaleDateString()
    event.id = uuidv4()
    const eventDb = ctx.getState().eventDb
    const calendarEvents = eventDb[dateKey] ?? []
    calendarEvents.push(event)
    eventDb[dateKey] = calendarEvents
    ctx.patchState({ eventDb: { ...eventDb } })
  }

  @Action(DeleteEvent)
  deleteEvent(ctx: StateContext<EventsStateModel>, { event }: DeleteEvent) {
    const dateKey = event.startDate.toLocaleDateString()
    const eventDb = ctx.getState().eventDb
    let calendarEvents = eventDb[dateKey]
    calendarEvents = calendarEvents.filter((ev) => ev.id !== event.id)
    eventDb[dateKey] = calendarEvents
    ctx.patchState({ eventDb: { ...eventDb } })
  }
}
