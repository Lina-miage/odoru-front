import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard = (roles: string[]): CanActivateFn => {
  return () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (!authService.isConnecte()) {
      router.navigate(['/login']);
      return false;
    }

    const role = authService.getRole();
    if (role && roles.includes(role)) {
      return true;
    }

    router.navigate(['/unauthorized']);
    return false;
  };
};
