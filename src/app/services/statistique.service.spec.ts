import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { StatistiqueService } from './statistique.service';

describe('StatistiqueService', () => {
  let service: StatistiqueService;
  let httpMock: HttpTestingController;
  const apiUrl = 'http://localhost:8080/api/statistiques';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [StatistiqueService],
    });
    service = TestBed.inject(StatistiqueService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should get nombre cours', () => {
    service.getNombreCours().subscribe((data) => {
      expect(data).toBe(5);
    });

    const req = httpMock.expectOne(`${apiUrl}/cours/nombre`);
    expect(req.request.method).toBe('GET');
    req.flush(5);
  });

  it('should get moyenne eleves presents', () => {
    service.getMoyenneElevesPresents().subscribe((data) => {
      expect(data).toBe(3.5);
    });

    const req = httpMock.expectOne(`${apiUrl}/presences/moyenne`);
    expect(req.request.method).toBe('GET');
    req.flush(3.5);
  });

  it('should get eleves presents a cours', () => {
    const mockData = { eleves: [{ nom: 'B', prenom: 'Salma' }] };
    service.getElevesPresentsACours(1).subscribe((data) => {
      expect(data).toEqual(mockData);
    });

    const req = httpMock.expectOne(`${apiUrl}/cours/1/presents`);
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('should get cours par eleve without dates', () => {
    const mockData = [{ titre: 'Cours de danse', present: true }];
    service.getCoursParEleve(1).subscribe((data) => {
      expect(data).toEqual(mockData);
    });

    const req = httpMock.expectOne(`${apiUrl}/eleve/1/cours`);
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('should get cours par eleve with dates', () => {
    const mockData = [{ titre: 'Cours de danse', present: true }];
    service.getCoursParEleve(1, '2026-01-01', '2026-12-31').subscribe((data) => {
      expect(data).toEqual(mockData);
    });

    const req = httpMock.expectOne(`${apiUrl}/eleve/1/cours?debut=2026-01-01&fin=2026-12-31`);
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('should get nombre competitions par niveau', () => {
    service.getNombreCompetitionsParNiveau(1).subscribe((data) => {
      expect(data).toBe(3);
    });

    const req = httpMock.expectOne(`${apiUrl}/competitions/niveau?niveau=1`);
    expect(req.request.method).toBe('GET');
    req.flush(3);
  });

  it('should get competitions par eleve without dates', () => {
    const mockData = [{ titre: 'Compétition', note: 8.5 }];
    service.getCompetitionsParEleve(1).subscribe((data) => {
      expect(data).toEqual(mockData);
    });

    const req = httpMock.expectOne(`${apiUrl}/eleve/1/competitions`);
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('should get competitions par eleve with dates', () => {
    const mockData = [{ titre: 'Compétition', note: 8.5 }];
    service.getCompetitionsParEleve(1, '2026-01-01', '2026-12-31').subscribe((data) => {
      expect(data).toEqual(mockData);
    });

    const req = httpMock.expectOne(
      `${apiUrl}/eleve/1/competitions?debut=2026-01-01&fin=2026-12-31`,
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });
});
