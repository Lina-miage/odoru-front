import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService, { provide: Router, useValue: spy }],
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should return null token when not logged in', () => {
    expect(service.getToken()).toBeNull();
  });

  it('should return false when not connected', () => {
    expect(service.isConnecte()).toBeFalse();
  });

  it('should return null role when not connected', () => {
    expect(service.getRole()).toBeNull();
  });

  it('should login and store token', () => {
    const mockResponse = {
      token: 'fake-token',
      role: 'MEMBRE',
      identifiant: 1,
      nomUtilisateur: 'testuser',
      prenom: 'Test',
      nom: 'User',
    };

    service.login('testuser', '123').subscribe((response) => {
      expect(response).toEqual(mockResponse);
      expect(localStorage.getItem('token')).toBe('fake-token');
      expect(service.isConnecte()).toBeTrue();
      expect(service.getRole()).toBe('MEMBRE');
    });

    const req = httpMock.expectOne('http://localhost:8080/api/auth/login');
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should logout and clear localStorage', () => {
    localStorage.setItem('token', 'fake-token');
    localStorage.setItem('utilisateur', JSON.stringify({ role: 'MEMBRE' }));

    service.logout();

    expect(localStorage.getItem('token')).toBeNull();
    expect(localStorage.getItem('utilisateur')).toBeNull();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });
});
