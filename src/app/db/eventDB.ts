export interface CalendarEvent {
  startDate: Date
  endDate: Date
  title: string
  id: string
}

export interface EventGroups {
  events: CalendarEvent[]
}

export interface EventDB {
  [date: string]: CalendarEvent[]
}

export const eventDb: EventDB = {
  '5/22/2024': [
    {
      id: '962429b1-e927-46c0-9c34-5094864551ef',
      startDate: new Date('2024-05-21T19:00:00.000Z'),
      endDate: new Date('2024-05-21T20:30:00.000Z'),
      title: 'Event 1'
    },
    {
      id: '29b78f81-8674-4858-80ab-4776a50d0b64',
      startDate: new Date('2024-05-22T01:10:00.000Z'),
      endDate: new Date('2024-05-22T03:00:00.000Z'),
      title: 'Event 7'
    },
    {
      id: '5798e192-5827-4aaf-89bf-6b2830dc56ed',
      startDate: new Date('2024-05-22T08:00:00.000Z'),
      endDate: new Date('2024-05-22T09:00:00.000Z'),
      title: 'Event 2'
    },
    {
      id: 'b6d56023-e833-4147-9e09-7f104961e6df',
      startDate: new Date('2024-05-22T08:00:00.000Z'),
      endDate: new Date('2024-05-22T09:00:00.000Z'),
      title: 'Event 8'
    },
    {
      id: '8f7b6734-1a14-4e35-88c1-58b7a4d43524',
      startDate: new Date('2024-05-22T10:00:00.000Z'),
      endDate: new Date('2024-05-22T13:00:00.000Z'),
      title: 'Event 3'
    },
    {
      id: '560c0a68-1d83-49b6-bbd3-171fe5392847',
      startDate: new Date('2024-05-22T10:20:00.000Z'),
      endDate: new Date('2024-05-22T12:30:00.000Z'),
      title: 'Event 6'
    },
    {
      id: '52f62be4-247b-4c4c-8059-9daaefda84ec',
      startDate: new Date('2024-05-22T10:30:00.000Z'),
      endDate: new Date('2024-05-22T12:00:00.000Z'),
      title: 'Event 5'
    },
    {
      id: '9ee59b83-f375-4b89-a986-5b385b94c376',
      startDate: new Date('2024-05-22T15:00:00.000Z'),
      endDate: new Date('2024-05-22T16:00:00.000Z'),
      title: 'Event 4'
    }
  ],
  '5/23/2024': [
    {
      id: '08bef746-972f-4f77-8b3a-9fea249ade08',
      startDate: new Date('2024-05-22T19:00:00.000Z'),
      endDate: new Date('2024-05-22T20:30:00.000Z'),
      title: 'Event 1'
    },
    {
      id: '5c6f90ac-9d17-449c-aadd-415da46d7052',
      startDate: new Date('2024-05-23T01:10:00.000Z'),
      endDate: new Date('2024-05-23T03:00:00.000Z'),
      title: 'Event 7'
    },
    {
      id: 'd1f95d27-8174-42a6-96d4-4d1d19a96b15',
      startDate: new Date('2024-05-23T08:00:00.000Z'),
      endDate: new Date('2024-05-23T09:00:00.000Z'),
      title: 'Event 2'
    },
    {
      id: '41f826bc-0299-4693-909e-10fd4cec7892',
      startDate: new Date('2024-05-23T08:00:00.000Z'),
      endDate: new Date('2024-05-23T09:00:00.000Z'),
      title: 'Event 8'
    },
    {
      id: '5c5d9aa0-4e71-4cc0-9772-c85a0dd7a4ca',
      startDate: new Date('2024-05-23T10:00:00.000Z'),
      endDate: new Date('2024-05-23T12:00:00.000Z'),
      title: 'Event 3'
    },
    {
      id: 'de233c14-7f91-4736-9986-de4a4c098d50',
      startDate: new Date('2024-05-23T10:20:00.000Z'),
      endDate: new Date('2024-05-23T12:30:00.000Z'),
      title: 'Event 6'
    },
    {
      id: '4ecbc37e-49f8-465d-a3b7-59d0251c9042',
      startDate: new Date('2024-05-23T10:30:00.000Z'),
      endDate: new Date('2024-05-23T12:00:00.000Z'),
      title: 'Event 5'
    },
    {
      id: 'd0d3db4e-5dcb-4a5f-b0fe-b66610e6bd1c',
      startDate: new Date('2024-05-23T14:00:00.000Z'),
      endDate: new Date('2024-05-23T15:00:00.000Z'),
      title: 'Event 4'
    }
  ],
  '5/24/2024': [
    {
      id: 'd1567435-8ac3-4bc6-bc1d-7619ed69c556',
      startDate: new Date('2024-05-22T18:00:00.000Z'),
      endDate: new Date('2024-05-22T19:00:00.000Z'),
      title: 'Event 8'
    },
    {
      id: '0b3c402d-00dc-4ec7-86c0-cc4d434cd45c',
      startDate: new Date('2024-05-22T19:30:00.000Z'),
      endDate: new Date('2024-05-22T22:00:00.000Z'),
      title: 'Event 8'
    },
    {
      id: '66bbaf00-c0cf-4cec-b1ec-4ef595485c6b',
      startDate: new Date('2024-05-22T20:30:00.000Z'),
      endDate: new Date('2024-05-22T22:30:00.000Z'),
      title: 'Event 8'
    },
    {
      title: 'Event 1',
      startDate: new Date('2024-05-24T00:00:00.000Z'),
      endDate: new Date('2024-05-24T01:00:00.000Z'),
      id: 'be690add-521a-4d0d-ab99-f227a99a48d6'
    },
    {
      title: 'Event 2',
      startDate: new Date('2024-05-24T00:30:00.000Z'),
      endDate: new Date('2024-05-24T01:30:00.000Z'),
      id: 'b33faa54-4f37-463f-8abe-da17d73708fe'
    },
    {
      title: 'Event 3',
      startDate: new Date('2024-05-24T08:00:00.000Z'),
      endDate: new Date('2024-05-24T09:00:00.000Z'),
      id: 'e2b0cfbb-7dd9-434f-b900-7e44015e94b8'
    }
  ],
  '5/25/2024': [
    {
      title: 'Event 1',
      startDate: new Date('2024-05-24T21:00:00.000Z'),
      endDate: new Date('2024-05-24T23:00:00.000Z'),
      id: '5ea7a80c-d46e-4acc-b2f6-d55eddf5852e'
    },
    {
      title: 'Event 2',
      startDate: new Date('2024-05-24T22:00:00.000Z'),
      endDate: new Date('2024-05-25T00:00:00.000Z'),
      id: '29e31fb1-90e4-47ec-b00d-c33e8f35577c'
    },
    {
      title: 'Event 3',
      startDate: new Date('2024-05-25T05:00:00.000Z'),
      endDate: new Date('2024-05-25T09:00:00.000Z'),
      id: '438e8998-8716-44bf-8d2b-5940d7e0195c'
    },
    {
      title: 'Event 4',
      startDate: new Date('2024-05-25T06:00:00.000Z'),
      endDate: new Date('2024-05-25T07:00:00.000Z'),
      id: 'd7ec613d-0db5-4ce9-851e-4032aceccee6'
    },
    {
      title: 'Event 5',
      startDate: new Date('2024-05-25T07:00:00.000Z'),
      endDate: new Date('2024-05-25T08:00:00.000Z'),
      id: 'd16bf37a-5fdf-49e1-b1fb-8c8dafc4bc2f'
    }
  ],
  '5/26/2024': [
    {
      title: 'Event 4',
      startDate: new Date('2024-05-25T22:00:00.000Z'),
      endDate: new Date('2024-05-26T02:00:00.000Z'),
      id: '42ea1346-9586-45e1-86bc-92593dca390f'
    },
    {
      title: 'Event 3',
      startDate: new Date('2024-05-25T23:00:00.000Z'),
      endDate: new Date('2024-05-26T01:00:00.000Z'),
      id: '0c5d0554-f303-4ba7-9ff5-378c212a8521'
    },
    {
      title: 'Event 1',
      startDate: new Date('2024-05-26T00:00:00.000Z'),
      endDate: new Date('2024-05-26T02:00:00.000Z'),
      id: '7bce2a60-1b28-4ad3-b814-6e42ee86f23e'
    },
    {
      title: 'Event 5',
      startDate: new Date('2024-05-26T08:00:00.000Z'),
      endDate: new Date('2024-05-26T09:00:00.000Z'),
      id: '8ab5e3ee-4a23-4d22-8e7e-53acd10b067b'
    },
    {
      title: 'Event 2',
      startDate: new Date('2024-05-26T01:00:00.000Z'),
      endDate: new Date('2024-05-26T03:00:00.000Z'),
      id: '4fb20a5d-97ec-4fcf-9711-a38ee18a41b4'
    }
  ]
}

export function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}
