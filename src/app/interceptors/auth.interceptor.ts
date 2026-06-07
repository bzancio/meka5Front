import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/Auth/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return next(req).pipe(
    catchError(err => {
      if (err.status === 403) {
        const message: string = err.error?.message ?? 'Tu sesión ha expirado';
        auth.logout();
        auth.sessionExpiredMessage.set(message);
        router.navigate(['/login']);
      }
      return throwError(() => err);
    })
  );
};
