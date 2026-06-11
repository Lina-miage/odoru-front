import { Utilisateur } from './utilisateur.model';
import { Cours } from './cours.model';

export interface Presence {
  identifiant?: number;
  dateHeure?: string;
  cours?: Cours;
  eleve?: Utilisateur;
}