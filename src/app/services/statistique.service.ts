import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StatistiqueService {
  private apiUrl = 'http://localhost:8080/api/statistiques';

  constructor(private http: HttpClient) {}

  getNombreCours(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/cours/nombre`);
  }

  getMoyenneElevesPresents(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/presences/moyenne`);
  }

  getElevesPresentsACours(coursId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/cours/${coursId}/presents`);
  }

  getCoursParEleve(eleveId: number, debut?: string, fin?: string): Observable<any[]> {
    let url = `${this.apiUrl}/eleve/${eleveId}/cours`;
    const params = [];
    if (debut) params.push(`debut=${debut}`);
    if (fin) params.push(`fin=${fin}`);
    if (params.length) url += `?${params.join('&')}`;
    return this.http.get<any[]>(url);
  }

  getNombreCompetitionsParNiveau(niveau: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/competitions/niveau?niveau=${niveau}`);
  }

  getCompetitionsParEleve(eleveId: number, debut?: string, fin?: string): Observable<any[]> {
    let url = `${this.apiUrl}/eleve/${eleveId}/competitions`;
    const params = [];
    if (debut) params.push(`debut=${debut}`);
    if (fin) params.push(`fin=${fin}`);
    if (params.length) url += `?${params.join('&')}`;
    return this.http.get<any[]>(url);
  }
}
