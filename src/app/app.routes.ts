import { Routes } from '@angular/router';
import { MapComp } from './map-comp/map-comp';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'map',
    pathMatch: 'full',
  },
  {
    path: 'map',
    component: MapComp,
  },
  {
    path: '**',
    redirectTo: 'map',
  },
];

