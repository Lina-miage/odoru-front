import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CoursService } from './cours.service';
import { Cours } from '../model/cours.model';
import { Creneau } from '../model/creneau.model';

describe('CoursService', () => {
  let service: CoursService;
  let httpMock: HttpTestingController;
  const apiUrl = 'http://localhost:8080/api/cours';
  const creneauUrl = 'http://localhost:8080/api/creneaux';

  const mockCours: Cours = {
    identifiant: 1,
    titre: 'Cours de danse',
    lieu: 'Salle A',
    niveauCible: 1,
    duree: 60,
    creneau: { id: 1 },
  };

  const mockCreneau: Creneau = {
    id: 1,
    jourSemaine: 'Lundi',
    date: '2026-07-01',
    heureDebut: '10:00:00',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CoursService],
    });
    service = TestBed.inject(CoursService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should get all cours', () => {
    service.getAll().subscribe((data) => {
      expect(data.length).toBe(1);
      expect(data[0]).toEqual(mockCours);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush([mockCours]);
  });

  it('should creer cours', () => {
    service.creerCours(mockCours, 1).subscribe((data) => {
      expect(data).toEqual(mockCours);
    });

    const req = httpMock.expectOne(`${apiUrl}?enseignantId=1`);
    expect(req.request.method).toBe('POST');
    req.flush(mockCours);
  });

  it('should supprimer cours', () => {
    service.supprimer(1).subscribe(() => {
      expect(true).toBeTrue();
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('should get all creneaux', () => {
    service.getAllCreneaux().subscribe((data) => {
      expect(data).toEqual([mockCreneau]);
    });

    const req = httpMock.expectOne(creneauUrl);
    expect(req.request.method).toBe('GET');
    req.flush([mockCreneau]);
  });

  it('should creer creneau', () => {
    service.creerCreneau(mockCreneau).subscribe((data) => {
      expect(data).toEqual(mockCreneau);
    });

    const req = httpMock.expectOne(creneauUrl);
    expect(req.request.method).toBe('POST');
    req.flush(mockCreneau);
  });
});
