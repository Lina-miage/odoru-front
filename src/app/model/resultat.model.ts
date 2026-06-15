import { Utilisateur } from './utilisateur.model';
import { Competition } from './competition.model';

export interface Resultat {
  identifiant?: number;
  note: number;
  eleve?: Utilisateur;
  competition?: Competition;
  resultats?: Resultat[];
}
