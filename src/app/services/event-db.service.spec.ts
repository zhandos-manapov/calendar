import { TestBed } from '@angular/core/testing';

import { EventDbService } from './event-db.service';

describe('EventDbService', () => {
  let service: EventDbService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EventDbService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
