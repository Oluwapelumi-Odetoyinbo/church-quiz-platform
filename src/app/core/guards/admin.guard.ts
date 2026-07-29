import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthService } from '../services/auth.service';

/**
 * Soft gate: allows entry so the admin page can show its JWT login form.
 * Actual /admin/* API calls still require a valid Supabase staff JWT.
 */
export const adminGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  // Always allow the shell — login UI lives inside AdminComponent.
  // Keep AuthService available for interceptors once a token is stored.
  void auth;
  void router;
  return true;
};
