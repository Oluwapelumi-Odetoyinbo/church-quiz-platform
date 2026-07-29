import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { StudentSessionService } from '../services/student-session.service';

export const quizSessionGuard: CanActivateFn = () => {
  const session = inject(StudentSessionService);
  const router = inject(Router);

  if (session.isSessionValid()) {
    return true;
  }

  return router.createUrlTree(['/']);
};
