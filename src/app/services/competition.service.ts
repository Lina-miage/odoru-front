import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Competition } from '../model/competition.model';
import { Resultat } from '../model/resultat.model';

@Injectable({
  providedIn: 'root',
})
export class CompetitionService {
  private apiUrl = 'http://localhost:8080/api/competitions';
  private resultatUrl = 'http://localhost:8080/api/resultats';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Competition[]> {
    return this.http.get<Competition[]>(this.apiUrl);
  }

  getById(id: number): Observable<Competition> {
    return this.http.get<Competition>(`${this.apiUrl}/${id}`);
  }

  getByNiveau(niveau: number): Observable<Competition[]> {
    return this.http.get<Competition[]>(`${this.apiUrl}/niveau?niveau=${niveau}`);
  }

  getByEnseignant(enseignantId: number): Observable<Competition[]> {
    return this.http.get<Competition[]>(`${this.apiUrl}/enseignant/${enseignantId}`);
  }

  creerCompetition(competition: Competition, enseignantId: number): Observable<Competition> {
    return this.http.post<Competition>(`${this.apiUrl}?enseignantId=${enseignantId}`, competition);
  }

  supprimer(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getResultatsParCompetition(competitionId: number): Observable<Resultat[]> {
    return this.http.get<Resultat[]>(`${this.resultatUrl}/competition/${competitionId}`);
  }

  enregistrerResultat(
    resultat: Resultat,
    eleveId: number,
    competitionId: number,
    enseignantId: number,
  ): Observable<Resultat> {
    return this.http.post<Resultat>(
      `${this.resultatUrl}?eleveId=${eleveId}&competitionId=${competitionId}&enseignantId=${enseignantId}`,
      resultat,
    );
  }
}
