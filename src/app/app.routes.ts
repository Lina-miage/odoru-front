import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guards';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./features/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'inscription',
    loadComponent: () =>
      import('./features/inscription/inscription.component').then((m) => m.InscriptionComponent),
  },
  {
    path: 'unauthorized',
    loadComponent: () =>
      import('./features/unauthorized/unauthorized.component').then((m) => m.UnauthorizedComponent),
  },
  {
    path: 'membres',
    loadComponent: () =>
      import('./features/membres/membres.component').then((m) => m.MembreComponent),
    canActivate: [authGuard, roleGuard(['SECRETAIRE', 'PRESIDENT'])],
  },
  {
    path: 'cours',
    loadComponent: () => import('./features/cours/cours.component').then((m) => m.CoursComponent),
    canActivate: [authGuard, roleGuard(['MEMBRE', 'ENSEIGNANT', 'SECRETAIRE', 'PRESIDENT'])],
  },
  {
    path: 'competitions',
    loadComponent: () =>
      import('./features/competitions/competitions.component').then((m) => m.CompetitionsComponent),
    canActivate: [authGuard, roleGuard(['MEMBRE', 'ENSEIGNANT', 'SECRETAIRE', 'PRESIDENT'])],
  },
  {
    path: 'badges',
    loadComponent: () =>
      import('./features/badges/badges.component').then((m) => m.BadgesComponent),
    canActivate: [authGuard, roleGuard(['SECRETAIRE', 'PRESIDENT'])],
  },
  {
    path: 'statistiques',
    loadComponent: () =>
      import('./features/statistiques/statistiques.component').then((m) => m.StatistiquesComponent),
    canActivate: [authGuard, roleGuard(['PRESIDENT'])],
  },
];
