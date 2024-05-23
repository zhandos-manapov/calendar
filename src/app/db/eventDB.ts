export interface CalendarEvent {
  startDate: Date;
  endDate: Date;
  title: string;
  id: string;
}

export interface EventGroups {
  events: CalendarEvent[];
}

export interface EventDB {
  [key: string]: CalendarEvent[];
}

export const eventDB: EventDB = {
  '5/22/2024': [
    {
      id: uuidv4(),
      startDate: new Date(2024, 4, 22, 1),
      endDate: new Date(2024, 4, 22, 2, 30),
      title: 'Event 1',
    },
    {
      id: uuidv4(),
      startDate: new Date(2024, 4, 22, 14),
      endDate: new Date(2024, 4, 22, 15),
      title: 'Event 2',
    },
    {
      id: uuidv4(),
      startDate: new Date(2024, 4, 22, 16),
      endDate: new Date(2024, 4, 22, 19),
      title: 'Event 3',
    },
    {
      id: uuidv4(),
      startDate: new Date(2024, 4, 22, 23),
      endDate: new Date(2024, 4, 22, 24),
      title: 'Event 4',
    },
    {
      id: uuidv4(),
      startDate: new Date(2024, 4, 22, 16, 30),
      endDate: new Date(2024, 4, 22, 18),
      title: 'Event 5',
    },
    {
      id: uuidv4(),
      startDate: new Date(2024, 4, 22, 16, 20),
      endDate: new Date(2024, 4, 22, 18, 30),
      title: 'Event 6',
    },
    {
      id: uuidv4(),
      startDate: new Date(2024, 4, 22, 7, 10),
      endDate: new Date(2024, 4, 22, 9),
      title: 'Event 7',
    },
    {
      id: uuidv4(),
      startDate: new Date(2024, 4, 22, 14),
      endDate: new Date(2024, 4, 22, 15),
      title: 'Event 8',
    },
  ],
};

export function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
