import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth';

  utilisateurConnecte = signal<any>(null);

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {
    const stored = localStorage.getItem('utilisateur');
    if (stored) {
      this.utilisateurConnecte.set(JSON.parse(stored));
    }
  }

  login(nomUtilisateur: string, motDePasse: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { nomUtilisateur, motDePasse }).pipe(
      tap((response) => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('utilisateur', JSON.stringify(response));
        this.utilisateurConnecte.set(response);
      }),
    );
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('utilisateur');
    this.utilisateurConnecte.set(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isConnecte(): boolean {
    return !!this.getToken();
  }

  getRole(): string | null {
    return this.utilisateurConnecte()?.role ?? null;
  }
}
