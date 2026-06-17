import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CompetitionService } from './competition.service';
import { Competition } from '../model/competition.model';
import { Resultat } from '../model/resultat.model';

describe('CompetitionService', () => {
  let service: CompetitionService;
  let httpMock: HttpTestingController;
  const apiUrl = 'http://localhost:8080/api/competitions';
  const resultatUrl = 'http://localhost:8080/api/resultats';

  const mockCompetition: Competition = {
    identifiant: 1,
    titre: 'Compétition de danse',
    lieu: 'Salle B',
    niveauCible: 1,
    creneau: { id: 1, duree: 60 },
  };

  const mockResultat: Resultat = {
    identifiant: 1,
    note: 8.5,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CompetitionService],
    });
    service = TestBed.inject(CompetitionService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should get all competitions', () => {
    service.getAll().subscribe((data) => {
      expect(data.length).toBe(1);
      expect(data[0]).toEqual(mockCompetition);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush([mockCompetition]);
  });

  it('should creer competition', () => {
    service.creerCompetition(mockCompetition, 1).subscribe((data) => {
      expect(data).toEqual(mockCompetition);
    });

    const req = httpMock.expectOne(`${apiUrl}?enseignantId=1`);
    expect(req.request.method).toBe('POST');
    req.flush(mockCompetition);
  });

  it('should supprimer competition', () => {
    service.supprimer(1).subscribe(() => {
      expect(true).toBeTrue();
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('should get resultats par competition', () => {
    service.getResultatsParCompetition(1).subscribe((data) => {
      expect(data).toEqual([mockResultat]);
    });

    const req = httpMock.expectOne(`${resultatUrl}/competition/1`);
    expect(req.request.method).toBe('GET');
    req.flush([mockResultat]);
  });

  it('should enregistrer resultat', () => {
    service.enregistrerResultat(mockResultat, 1, 1, 2).subscribe((data) => {
      expect(data).toEqual(mockResultat);
    });

    const req = httpMock.expectOne(`${resultatUrl}?eleveId=1&competitionId=1&enseignantId=2`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResultat);
  });
});
