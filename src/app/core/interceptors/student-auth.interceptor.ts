import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

import { StudentSessionService } from '../services/student-session.service';
import { AuthService } from '../services/auth.service';

const STUDENT_AUTH_PATHS = ['/quiz/', '/anti-cheat/', '/leaderboard', '/students/'];

export const studentAuthInterceptor: HttpInterceptorFn = (req, next) => {
  const needsStudentAuth = STUDENT_AUTH_PATHS.some((path) => req.url.includes(path));

  if (!needsStudentAuth) {
    return next(req);
  }

  const session = inject(StudentSessionService);
  const auth = inject(AuthService);
  const token = session.getToken() || auth.getToken();

  if (!token) {
    return next(req);
  }

  return next(
    req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    })
  );
};

