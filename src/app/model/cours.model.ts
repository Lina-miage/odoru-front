import { Creneau } from './creneau.model';
import { Inscription } from './inscription.model';
import { Utilisateur } from './utilisateur.model';

export interface Cours {
  identifiant?: number;
  titre: string;
  lieu: string;
  niveauCible?: number;
  duree?: number;
  creneau?: Creneau;
  enseignant?: Utilisateur;
  inscrits?: Inscription[];
}
