import { Injectable } from '@angular/core';
import { Creneau } from '../model/creneau.model';

@Injectable({
  providedIn: 'root',
})
export class CreneauService {
  private jours = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

  formaterCreneau(nouveauCreneau: any): Creneau {
    const date = nouveauCreneau.date as Date;
    const heure = nouveauCreneau.heureDebut as Date;

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return {
      jourSemaine: this.jours[date.getDay()],
      date: `${year}-${month}-${day}`,
      heureDebut: `${String(heure.getHours()).padStart(2, '0')}:${String(heure.getMinutes()).padStart(2, '0')}:00`,
    };
  }

  calculerHeureFin(heureDebut: string, duree: number): string {
    if (!heureDebut || !duree) return '';
    const [heures, minutes] = heureDebut.split(':').map(Number);
    const totalMinutes = heures * 60 + minutes + duree;
    const heureFin = Math.floor(totalMinutes / 60) % 24;
    const minutesFin = totalMinutes % 60;
    return `${String(heureFin).padStart(2, '0')}:${String(minutesFin).padStart(2, '0')}`;
  }
}
