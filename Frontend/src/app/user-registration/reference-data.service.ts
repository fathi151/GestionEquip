import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Position, Job, Harbor, Status } from '../utilisateur/Utilisateur';

@Injectable({
  providedIn: 'root'
})
export class ReferenceDataService {

  private baseURL = "/api/api/reference";

  constructor(private http: HttpClient) { }

  // Méthodes pour récupérer les données de référence depuis le backend
  // Si le backend n'est pas encore configuré, on retourne des données statiques

  getPositions(): Observable<Position[]> {
    // Remplacez par un appel HTTP réel quand le backend sera prêt
    // return this.http.get<Position[]>(`${this.baseURL}/positions`);

    return of([
      { id: '1', title: 'Manager' },
      { id: '2', title: 'Superviseur' },
      { id: '3', title: 'Employé' },
      { id: '4', title: 'Stagiaire' },
      { id: '5', title: 'Chef d\'équipe' },
      { id: '6', title: 'Consultant' }
    ]);
  }

  getJobs(): Observable<Job[]> {
    // Remplacez par un appel HTTP réel quand le backend sera prêt
    // return this.http.get<Job[]>(`${this.baseURL}/jobs`);

    return of([
      { id: 1, title: 'Développeur' },
      { id: 2, title: 'Analyste' },
      { id: 3, title: 'Chef de projet' },
      { id: 4, title: 'Technicien' },
      { id: 5, title: 'Administrateur système' },
      { id: 6, title: 'Designer' },
      { id: 7, title: 'Testeur' },
      { id: 8, title: 'DevOps' }
    ]);
  }

  getHarbors(): Observable<Harbor[]> {
    // Remplacez par un appel HTTP réel quand le backend sera prêt
    // return this.http.get<Harbor[]>(`${this.baseURL}/harbors`);

    return of([
      { id: 1, name: 'Port Principal', location: 'Casablanca' },
      { id: 2, name: 'Port Secondaire', location: 'Rabat' },
      { id: 3, name: 'Port Auxiliaire', location: 'Tanger' },
      { id: 4, name: 'Port Commercial', location: 'Agadir' },
      { id: 5, name: 'Port Industriel', location: 'Mohammedia' }
    ]);
  }

  getStatuses(): Observable<Status[]> {
    // Remplacez par un appel HTTP réel quand le backend sera prêt
    // return this.http.get<Status[]>(`${this.baseURL}/statuses`);

    return of([
      { id: 1, title: 'Actif' },
      { id: 2, title: 'Inactif' },
      { id: 3, title: 'En congé' },
      { id: 4, title: 'Suspendu' },
      { id: 5, title: 'En formation' },
      { id: 6, title: 'Retraité' }
    ]);
  }

  getRoles(): Observable<string[]> {
    // Remplacez par un appel HTTP réel quand le backend sera prêt
    // return this.http.get<string[]>(`${this.baseURL}/roles`);

    return of(['USER', 'ADMIN', 'DAG', 'JURIDIQUE', 'DSI']);
  }

  // Méthodes pour valider les données
  validateRegistrationNumber(registrationNumber: string): Observable<boolean> {
    // Appel au backend pour vérifier l'unicité du numéro d'enregistrement
    // return this.http.get<boolean>(`${this.baseURL}/validate-registration-number/${registrationNumber}`);

    // Simulation - retourne true si le numéro est disponible
    return of(!this.isRegistrationNumberTaken(registrationNumber));
  }

  validateCIN(cin: string): Observable<boolean> {
    // Appel au backend pour vérifier l'unicité du CIN
    // return this.http.get<boolean>(`${this.baseURL}/validate-cin/${cin}`);

    // Simulation - retourne true si le CIN est disponible
    return of(!this.isCINTaken(cin));
  }

  validateUsername(username: string): Observable<boolean> {
    // Appel au backend pour vérifier l'unicité du nom d'utilisateur
    // return this.http.get<boolean>(`${this.baseURL}/validate-username/${username}`);

    // Simulation - retourne true si le nom d'utilisateur est disponible
    return of(!this.isUsernameTaken(username));
  }

  // Méthodes privées pour simulation (à supprimer quand le backend sera prêt)
  private isRegistrationNumberTaken(registrationNumber: string): boolean {
    // Simulation de numéros déjà pris
    const takenNumbers = ['REG001', 'REG002', 'REG003'];
    return takenNumbers.includes(registrationNumber);
  }

  private isCINTaken(cin: string): boolean {
    // Simulation de CINs déjà pris
    const takenCINs = ['AB123456', 'CD789012', 'EF345678'];
    return takenCINs.includes(cin);
  }

  private isUsernameTaken(username: string): boolean {
    // Simulation de noms d'utilisateur déjà pris
    const takenUsernames = ['admin', 'user', 'test', 'demo'];
    return takenUsernames.includes(username.toLowerCase());
  }

  // Méthode pour générer un numéro d'enregistrement automatique
  generateRegistrationNumber(): Observable<string> {
    // Appel au backend pour générer un numéro unique
    // return this.http.get<string>(`${this.baseURL}/generate-registration-number`);

    // Simulation - génère un numéro basé sur la date
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');

    return of(`REG${year}${month}${day}${random}`);
  }

  // Méthode pour obtenir les grades disponibles
  getGrades(): Observable<string[]> {
    return of([
      'Grade 1',
      'Grade 2',
      'Grade 3',
      'Grade 4',
      'Grade 5',
      'Cadre',
      'Cadre Supérieur',
      'Directeur'
    ]);
  }

  // Méthode pour obtenir les types d'emploi
  getEmploymentTypes(): Observable<string[]> {
    return of([
      'CDI',
      'CDD',
      'Stage',
      'Freelance',
      'Consultant',
      'Intérim'
    ]);
  }

  // Méthode pour obtenir les collèges/départements
  getColleges(): Observable<string[]> {
    return of([
      'Informatique',
      'Ressources Humaines',
      'Finance',
      'Marketing',
      'Operations',
      'Logistique',
      'Qualité',
      'Sécurité'
    ]);
  }
}
