import { Routes } from '@angular/router';
import { adminGuard } from './core/guards/admin.guard';
import { quizSessionGuard } from './core/guards/quiz-session.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./pages/landing/landing.component').then(m => m.LandingPageComponent)
  },
  {
    path: 'age-group',
    loadComponent: () => import('./pages/age-group/age-group.component').then(m => m.AgeGroupPageComponent)
  },
  {
    path: 'category/:ageGroupId',
    loadComponent: () => import('./pages/category/category.component').then(m => m.CategoryPageComponent)
  },
  {
    path: 'quiz/:attemptId',
    loadComponent: () => import('./pages/quiz/quiz.component').then(m => m.QuizPageComponent),
    canActivate: [quizSessionGuard]
  },
  {
    path: 'results/:attemptId',
    loadComponent: () => import('./pages/results/results.component').then(m => m.ResultsPageComponent)
  },
  {
    path: 'leaderboard',
    loadComponent: () => import('./pages/leaderboard/leaderboard.component').then(m => m.LeaderboardComponent)
  },
  {
    path: 'admin',
    loadChildren: () => import('./features/admin/routes').then(m => m.ADMIN_ROUTES),
    canActivate: [adminGuard]
  },
  // Legacy redirects
  { path: 'details', redirectTo: '' },
  { path: 'instructions/:ageGroup', redirectTo: 'age-group' },
  { path: 'quiz', pathMatch: 'full', redirectTo: 'age-group' },
  {
    path: '**',
    redirectTo: ''
  }
];
