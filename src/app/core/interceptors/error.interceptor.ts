import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error) => {
      console.error(`[HTTP Error] ${req.method} ${req.url}`, {
        status: error.status,
        statusText: error.statusText,
        message: error.message,
        error: error.error
      });

      return throwError(() => error);
    })
  );
};
