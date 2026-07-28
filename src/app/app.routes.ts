import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./pages/landing/landing.component').then(m => m.LandingPageComponent)
  },
  {
    path: 'details',
    loadComponent: () => import('./pages/details/details.component').then(m => m.DetailsPageComponent)
  },
  {
    path: 'age-group',
    loadComponent: () => import('./pages/age-group/age-group.component').then(m => m.AgeGroupPageComponent)
  },
  {
    path: 'instructions/:ageGroup',
    loadComponent: () => import('./pages/instructions/instructions.component').then(m => m.InstructionsPageComponent)
  },
  {
    path: 'quiz/:ageGroup',
    loadComponent: () => import('./pages/quiz/quiz.component').then(m => m.QuizPageComponent)
  },
  {
    path: 'quiz',
    pathMatch: 'full',
    redirectTo: 'age-group'
  },
  {
    path: 'results/:ageGroup',
    loadComponent: () => import('./pages/results/results.component').then(m => m.ResultsPageComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
