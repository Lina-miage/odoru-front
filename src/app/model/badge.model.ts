import { Utilisateur } from './utilisateur.model';

export interface Badge {
  identifiant?: number;
  numero?: string;
  porteur?: Utilisateur;
}