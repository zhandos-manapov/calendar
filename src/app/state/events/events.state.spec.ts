import { TestBed } from '@angular/core/testing'
import { provideStore, Store } from '@ngxs/store'
import { EventsState, EventsStateModel } from './events.state'

describe('Events store', () => {
  let store: Store
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideStore([EventsState])]
    })

    store = TestBed.inject(Store)
  })
})
