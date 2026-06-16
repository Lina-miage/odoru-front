import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { BadgeService } from './badge.service';
import { Badge } from '../model/badge.model';
import { Presence } from '../model/presence.model';

describe('BadgeService', () => {
  let service: BadgeService;
  let httpMock: HttpTestingController;
  const badgeUrl = 'http://localhost:8080/api/badges';
  const presenceUrl = 'http://localhost:8080/api/presences';

  const mockBadge: Badge = {
    identifiant: 1,
    numero: 'ABC123',
    porteur: {
      identifiant: 1,
      nom: 'B',
      prenom: 'Salma',
      nomUtilisateur: 'salmab',
      courriel: 'salma@mail.com',
      motDePasse: '123',
      niveauExpertise: 3,
    },
  };

  const mockPresence: Presence = {
    identifiant: 1,
    dateHeure: '2026-06-15T10:00:00',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [BadgeService],
    });
    service = TestBed.inject(BadgeService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should attribuer badge', () => {
    service.attribuerBadge(1, 2).subscribe((data) => {
      expect(data).toEqual(mockBadge);
    });

    const req = httpMock.expectOne(`${badgeUrl}?membreId=1&secretaireId=2`);
    expect(req.request.method).toBe('POST');
    req.flush(mockBadge);
  });

  it('should dissocier badge', () => {
    service.dissocierBadge(1, 2).subscribe(() => {
      expect(true).toBeTrue();
    });

    const req = httpMock.expectOne(`${badgeUrl}/membre/1?secretaireId=2`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('should get badge by membre', () => {
    service.getBadgeByMembre(1).subscribe((data) => {
      expect(data).toEqual(mockBadge);
    });

    const req = httpMock.expectOne(`${badgeUrl}/membre/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockBadge);
  });

  it('should badger', () => {
    service.badger('ABC123', 1).subscribe((data) => {
      expect(data).toEqual(mockPresence);
    });

    const req = httpMock.expectOne(`${presenceUrl}/badger?numeroBadge=ABC123&coursId=1`);
    expect(req.request.method).toBe('POST');
    req.flush(mockPresence);
  });

  it('should get presences by eleve', () => {
    service.getPresencesByEleve(1).subscribe((data) => {
      expect(data).toEqual([mockPresence]);
    });

    const req = httpMock.expectOne(`${presenceUrl}/eleve/1`);
    expect(req.request.method).toBe('GET');
    req.flush([mockPresence]);
  });

  it('should get presences by cours', () => {
    service.getPresencesByCours(1).subscribe((data) => {
      expect(data).toEqual([mockPresence]);
    });

    const req = httpMock.expectOne(`${presenceUrl}/cours/1`);
    expect(req.request.method).toBe('GET');
    req.flush([mockPresence]);
  });
});
