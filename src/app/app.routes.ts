import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/games', pathMatch: 'full' },
  {
    path: 'categories',
    loadComponent: () =>
      import('./category/category-list/category-list.page').then((m) => m.CategoryListPage),
  },
  {
    path: 'authors',
    loadComponent: () =>
      import('./author/author-list/author-list.page').then((m) => m.AuthorListComponent),
  },
  {
    path: 'games',
    loadComponent: () => import('./game/game-list/game-list.page').then((m) => m.GameListComponent),
  },
  {
    path: 'customers',
    loadComponent: () =>
      import('./customer/customer-list/customer-list.page').then((m) => m.CustomerListPage),
  },
  {
    path: 'loans',
    loadComponent: () => import('./loan/loan-list/loan-list.page').then((m) => m.LoanListPage),
  },
];
