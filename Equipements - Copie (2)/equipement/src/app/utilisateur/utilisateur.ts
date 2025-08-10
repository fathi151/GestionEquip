// Interfaces pour les utilisateurs et entités liées

export interface Utilisateur {
  id?: number;
  nom?: string;
  prenom?: string;
  email?: string;
  motDePasse?: string;
  role?: string;
  dateCreation?: Date;
  actif?: boolean;
}

export interface Agent {
  id?: number;
  nom?: string;
  prenom?: string;
  email?: string;
  telephone?: string;
  position?: Position;
  job?: Job;
  harbor?: Harbor;
  status?: Status;
  dateEmbauche?: Date;
  salaire?: number;
  actif?: boolean;
}

export interface Position {
  id?: number;
  nom?: string;
  description?: string;
  niveau?: number;
}

export interface Job {
  id?: number;
  titre?: string;
  description?: string;
  departement?: string;
  salaireMini?: number;
  salaireMaxi?: number;
}

export interface Harbor {
  id?: number;
  nom?: string;
  ville?: string;
  pays?: string;
  code?: string;
  actif?: boolean;
}

export interface Status {
  id?: number;
  statut?: string;
  description?: string;
  couleur?: string;
  actif?: boolean;
}
