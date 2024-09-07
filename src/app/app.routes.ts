import { Routes } from '@angular/router'
import { LocalStorageHandler } from './handlers/localstorage.handler'

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'calendar',
    pathMatch: 'full'
  },
  {
    path: 'calendar',
    providers: [LocalStorageHandler],
    loadChildren: () => import('./calendar-main/calendar-main.routes').then((m) => m.routes)
  }
]
