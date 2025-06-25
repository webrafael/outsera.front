import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
    },
    {
        path: 'movies',
        loadComponent: () => import('./features/movies/movies.component').then(m => m.MoviesComponent)
    }
];
