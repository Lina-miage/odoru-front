import { Utilisateur } from './utilisateur.model';
import { Creneau } from './creneau.model';

export interface Competition {
  identifiant?: number;
  titre: string;
  lieu: string;
  niveauCible: number;
  creneau?: Creneau;
  enseignant?: Utilisateur;
}