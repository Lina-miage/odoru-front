import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UtilisateurService } from './utilisateur.service';
import { Utilisateur } from '../model/utilisateur.model';

describe('UtilisateurService', () => {
  let service: UtilisateurService;
  let httpMock: HttpTestingController;
  const apiUrl = 'http://localhost:8080/api/utilisateurs';

  const mockUtilisateur: Utilisateur = {
    identifiant: 1,
    nom: 'B',
    prenom: 'Salma',
    nomUtilisateur: 'salmab',
    courriel: 'salma@mail.com',
    motDePasse: '123',
    niveauExpertise: 3,
    role: 'MEMBRE',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UtilisateurService],
    });
    service = TestBed.inject(UtilisateurService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should get all utilisateurs', () => {
    service.getAll().subscribe((data) => {
      expect(data.length).toBe(1);
      expect(data[0]).toEqual(mockUtilisateur);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush([mockUtilisateur]);
  });

  it('should get enseignants', () => {
    service.getEnseignants().subscribe((data) => {
      expect(data).toEqual([mockUtilisateur]);
    });

    const req = httpMock.expectOne(`${apiUrl}/enseignants`);
    expect(req.request.method).toBe('GET');
    req.flush([mockUtilisateur]);
  });

  it('should get membres', () => {
    service.getMembres().subscribe((data) => {
      expect(data).toEqual([mockUtilisateur]);
    });

    const req = httpMock.expectOne(`${apiUrl}/membres`);
    expect(req.request.method).toBe('GET');
    req.flush([mockUtilisateur]);
  });

  it('should inscrire utilisateur', () => {
    service.inscrire(mockUtilisateur).subscribe((data) => {
      expect(data).toEqual(mockUtilisateur);
    });

    const req = httpMock.expectOne(`${apiUrl}/inscription`);
    expect(req.request.method).toBe('POST');
    req.flush(mockUtilisateur);
  });

  it('should mettre a jour niveau', () => {
    service.mettreAJourNiveau(1, 3).subscribe((data) => {
      expect(data).toEqual(mockUtilisateur);
    });

    const req = httpMock.expectOne(`${apiUrl}/1/niveau?niveau=3`);
    expect(req.request.method).toBe('PATCH');
    req.flush(mockUtilisateur);
  });

  it('should designer enseignant', () => {
    service.designerEnseignant(1).subscribe((data) => {
      expect(data).toEqual(mockUtilisateur);
    });

    const req = httpMock.expectOne(`${apiUrl}/1/enseignant`);
    expect(req.request.method).toBe('PATCH');
    req.flush(mockUtilisateur);
  });

  it('should supprimer utilisateur', () => {
    service.supprimer(1).subscribe(() => {
      expect(true).toBeTrue();
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
