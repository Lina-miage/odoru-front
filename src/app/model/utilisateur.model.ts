export interface Utilisateur {
  identifiant?: number;
  nom: string;
  prenom: string;
  courriel: string;
  nomUtilisateur: string;
  motDePasse?: string;
  niveauExpertise: number;
  role?: string;
  adresse?: Adresse;
  profilEnseignant?: ProfilEnseignant;
}

export interface Adresse {
  ville: string;
  pays: string;
}

export interface ProfilEnseignant {
  id?: number;
  niveauApte: number;
}