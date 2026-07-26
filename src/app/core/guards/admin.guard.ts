import { CanActivateFn } from '@angular/router';

export const adminGuard: CanActivateFn = (route, state) => {
  // TODO: Implement real admin authentication check
  // Stub: always allows access for now
  return true;
};
