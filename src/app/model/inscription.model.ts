import { Utilisateur } from './utilisateur.model';
import { Cours } from './cours.model';

export interface Inscription {
  id?: number;
  eleve?: Utilisateur;
  cours?: Cours;
}
