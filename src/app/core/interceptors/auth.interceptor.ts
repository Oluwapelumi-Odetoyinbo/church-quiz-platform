import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

const STUDENT_AUTH_PATHS = ['/quiz/', '/anti-cheat/', '/leaderboard', '/students/'];

const ADMIN_PUBLIC_AUTH_PATHS = ['/admin/auth/'];

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Student session interceptor owns quiz / anti-cheat auth.
  if (STUDENT_AUTH_PATHS.some((path) => req.url.includes(path))) {
    return next(req);
  }

  // Login / setup / status must not send a Bearer token.
  if (ADMIN_PUBLIC_AUTH_PATHS.some((path) => req.url.includes(path))) {
    return next(req);
  }

  const authService = inject(AuthService);
  const token = authService.getToken();

  if (token) {
    return next(
      req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      })
    );
  }

  return next(req);
};
