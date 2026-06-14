import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'membres', pathMatch: 'full' },
  {
    path: 'membres',
    loadComponent: () =>
      import('./features/membres/membres.component').then((m) => m.MembreComponent),
  },
  {
    path: 'cours',
    loadComponent: () => import('./features/cours/cours.component').then((m) => m.CoursComponent),
  },
  {
    path: 'competitions',
    loadComponent: () =>
      import('./features/competitions/competitions.component').then((m) => m.CompetitionsComponent),
  },
  {
    path: 'badges',
    loadComponent: () =>
      import('./features/badges/badges.component').then((m) => m.BadgesComponent),
  },
  {
    path: 'statistiques',
    loadComponent: () =>
      import('./features/statistiques/statistiques.component').then((m) => m.StatistiquesComponent),
  },
];
