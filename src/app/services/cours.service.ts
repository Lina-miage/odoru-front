import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cours } from '../model/cours.model';
import { Creneau } from '../model/creneau.model';

@Injectable({
  providedIn: 'root',
})
export class CoursService {
  private apiUrl = 'http://localhost:8080/api/cours';
  private creneauUrl = 'http://localhost:8080/api/creneaux';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Cours[]> {
    return this.http.get<Cours[]>(this.apiUrl);
  }

  getById(id: number): Observable<Cours> {
    return this.http.get<Cours>(`${this.apiUrl}/${id}`);
  }

  getByNiveau(niveau: number): Observable<Cours[]> {
    return this.http.get<Cours[]>(`${this.apiUrl}/niveau?niveau=${niveau}`);
  }

  getByEnseignant(enseignantId: number): Observable<Cours[]> {
    return this.http.get<Cours[]>(`${this.apiUrl}/enseignant/${enseignantId}`);
  }

  creerCours(cours: Cours, enseignantId: number): Observable<Cours> {
    return this.http.post<Cours>(`${this.apiUrl}?enseignantId=${enseignantId}`, cours);
  }

  supprimer(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Créneaux
  getAllCreneaux(): Observable<Creneau[]> {
    return this.http.get<Creneau[]>(this.creneauUrl);
  }

  creerCreneau(creneau: Creneau): Observable<Creneau> {
    return this.http.post<Creneau>(this.creneauUrl, creneau);
  }

  supprimerCreneau(id: number): Observable<void> {
    return this.http.delete<void>(`${this.creneauUrl}/${id}`);
  }
}
