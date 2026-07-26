import { Routes } from '@angular/router';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./features/home/routes').then(m => m.HOME_ROUTES)
  },
  {
    path: 'register',
    loadChildren: () => import('./features/student-registration/routes').then(m => m.STUDENT_REGISTRATION_ROUTES)
  },
  {
    path: 'categories',
    loadChildren: () => import('./features/category-selection/routes').then(m => m.CATEGORY_SELECTION_ROUTES)
  },
  {
    path: 'quiz',
    loadChildren: () => import('./features/quiz/routes').then(m => m.QUIZ_ROUTES)
  },
  {
    path: 'result',
    loadChildren: () => import('./features/result/routes').then(m => m.RESULT_ROUTES)
  },
  {
    path: 'leaderboard',
    loadChildren: () => import('./features/leaderboard/routes').then(m => m.LEADERBOARD_ROUTES)
  },
  {
    path: 'admin',
    canActivate: [adminGuard],
    loadChildren: () => import('./features/admin/routes').then(m => m.ADMIN_ROUTES)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
