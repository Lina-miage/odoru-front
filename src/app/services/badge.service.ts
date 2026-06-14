import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Badge } from '../model/badge.model';
import { Presence } from '../model/presence.model';

@Injectable({
  providedIn: 'root',
})
export class BadgeService {
  private badgeUrl = 'http://localhost:8080/api/badges';
  private presenceUrl = 'http://localhost:8080/api/presences';

  constructor(private http: HttpClient) {}

  attribuerBadge(membreId: number, secretaireId: number): Observable<Badge> {
    return this.http.post<Badge>(
      `${this.badgeUrl}?membreId=${membreId}&secretaireId=${secretaireId}`,
      {},
    );
  }

  dissocierBadge(membreId: number, secretaireId: number): Observable<void> {
    return this.http.delete<void>(
      `${this.badgeUrl}/membre/${membreId}?secretaireId=${secretaireId}`,
    );
  }

  getBadgeByMembre(membreId: number): Observable<Badge> {
    return this.http.get<Badge>(`${this.badgeUrl}/membre/${membreId}`);
  }

  badger(numeroBadge: string, coursId: number): Observable<Presence> {
    return this.http.post<Presence>(
      `${this.presenceUrl}/badger?numeroBadge=${numeroBadge}&coursId=${coursId}`,
      {},
    );
  }

  getPresencesByEleve(eleveId: number): Observable<Presence[]> {
    return this.http.get<Presence[]>(`${this.presenceUrl}/eleve/${eleveId}`);
  }

  getPresencesByCours(coursId: number): Observable<Presence[]> {
    return this.http.get<Presence[]>(`${this.presenceUrl}/cours/${coursId}`);
  }
}
