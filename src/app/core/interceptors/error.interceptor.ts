import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

import { StudentSessionService } from '../services/student-session.service';

export function getHttpErrorMessage(error: HttpErrorResponse): string {
  const body = error.error;

  if (typeof body === 'string' && body.trim()) {
    return body;
  }

  if (body && typeof body === 'object') {
    if (typeof body.message === 'string') {
      return body.message;
    }

    if (body.message && typeof body.message === 'object' && typeof body.message.message === 'string') {
      return body.message.message;
    }

    if (Array.isArray(body.message)) {
      return body.message.join(', ');
    }
  }

  switch (error.status) {
    case 400:
      return 'Something went wrong with your request. Please check and try again.';
    case 401:
      return 'Invalid username or password, or your session has expired.';
    case 403:
      return 'You do not have access to this quiz.';
    case 404:
      return 'Quiz not found.';
    case 409:
      return 'Username is already taken.';
    case 503:
      return 'Questions are not ready yet. Please ask your teacher to set up the question bank.';
    default:
      return error.message || 'An unexpected error occurred.';
  }
}

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const session = inject(StudentSessionService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      console.error(`[HTTP Error] ${req.method} ${req.url}`, {
        status: error.status,
        statusText: error.statusText,
        message: error.message,
        error: error.error
      });

      if (error.status === 401 && (req.url.includes('/quiz/') || req.url.includes('/students/') || req.url.includes('/anti-cheat/'))) {
        session.clear();
        void router.navigate(['/login'], { queryParams: { sessionExpired: '1' } });
      }

      return throwError(() => error);
    })
  );
};
