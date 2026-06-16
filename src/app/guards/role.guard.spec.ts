import { TestBed } from '@angular/core/testing';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { roleGuard } from './role.guards';
import { AuthService } from '../services/auth.service';

describe('roleGuard', () => {
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    authService = jasmine.createSpyObj('AuthService', ['isConnecte', 'getRole']);
    router = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: Router, useValue: router },
      ],
    });
  });

  it('should allow access when role matches', () => {
    authService.isConnecte.and.returnValue(true);
    authService.getRole.and.returnValue('SECRETAIRE');

    const result = TestBed.runInInjectionContext(() =>
      roleGuard(['SECRETAIRE', 'PRESIDENT'])(
        {} as ActivatedRouteSnapshot,
        {} as RouterStateSnapshot,
      ),
    );

    expect(result).toBeTrue();
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should redirect to unauthorized when role does not match', () => {
    authService.isConnecte.and.returnValue(true);
    authService.getRole.and.returnValue('MEMBRE');

    const result = TestBed.runInInjectionContext(() =>
      roleGuard(['SECRETAIRE', 'PRESIDENT'])(
        {} as ActivatedRouteSnapshot,
        {} as RouterStateSnapshot,
      ),
    );

    expect(result).toBeFalse();
    expect(router.navigate).toHaveBeenCalledWith(['/unauthorized']);
  });

  it('should redirect to login when not connected', () => {
    authService.isConnecte.and.returnValue(false);
    authService.getRole.and.returnValue(null);

    const result = TestBed.runInInjectionContext(() =>
      roleGuard(['SECRETAIRE'])({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot),
    );

    expect(result).toBeFalse();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should allow PRESIDENT access to all routes', () => {
    authService.isConnecte.and.returnValue(true);
    authService.getRole.and.returnValue('PRESIDENT');

    const result = TestBed.runInInjectionContext(() =>
      roleGuard(['SECRETAIRE', 'PRESIDENT'])(
        {} as ActivatedRouteSnapshot,
        {} as RouterStateSnapshot,
      ),
    );

    expect(result).toBeTrue();
  });
});
