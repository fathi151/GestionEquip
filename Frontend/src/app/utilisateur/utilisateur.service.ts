import { Injectable } from '@angular/core';
import { HttpClient,HttpClientModule } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import {  Agent, Utilisateur } from './Utilisateur';
import { Router } from '@angular/router';
export interface LoginRequest {
  registrationNumber: string;
  password: string;
}
export interface NavigationItem {
  id: string;
  title: string;
  icon: string;
  route?: string;
  action?: () => void;
  roles: string[];
  children?: NavigationItem[];
}
@Injectable({
  providedIn: 'root'
})
export class UtilisateurService {
   private baseURL="http://localhost:8085/auth";
  private baseURL1="http://localhost:8085/auth";

  constructor(private httpClient:HttpClient,private router: Router) {

this.loadUserFromStorage();

  }


  private isLoggingOut: boolean = false;

user: Utilisateur = new Utilisateur();
  private currentUserSubject = new BehaviorSubject<Utilisateur | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  login(loginRequest: LoginRequest): Observable<any> {
    return this.httpClient.post<any>(`${this.baseURL}/login`, loginRequest)
       .pipe(
        tap(user => {
          if (user && user.token) {
            // Store user data in session storage
            sessionStorage.setItem('token', user.token);
            sessionStorage.setItem('username', user.username);
            sessionStorage.setItem('registrationNumber', user.registrationNumber);
            sessionStorage.setItem('role', user.role);
            sessionStorage.setItem('email', user.email);

            // Update current user subject
            this.currentUserSubject.next(user);
          }
        })
      );
  }


  register(agent: Utilisateur): Observable<any> {
    return this.httpClient.post(`${this.baseURL}/register`, agent, {
      headers: { 'Content-Type': 'application/json' }
    });
  }
    getUtilisateur(): Observable<Utilisateur[]> {
    return this.httpClient.get<Utilisateur[]>(`${this.baseURL}/AllUsers`);
  }
    getAgents(): Observable<Agent[]> {
    return this.httpClient.get<Agent[]>(`${this.baseURL1}/agents`);
  }
  forgotPassword(email: string) {
    return this.httpClient.post(`${this.baseURL}/forgot-password`, { email }, { responseType: 'text' });
  }
  resetPassword(token: string, newPassword: string) {
    return this.httpClient.post(`${this.baseURL}/reset-password?token=${token}`, { password: newPassword }, { responseType: 'text' });
  }

  checkEmailAvailability(email: string): Observable<any> {
    return this.httpClient.get<any>(`${this.baseURL}/check-email?email=${email}`);
  }


  private loadUserFromStorage(): void {
    const token = sessionStorage.getItem('token');
    const username = sessionStorage.getItem('username');
    const registrationNumber = sessionStorage.getItem('registrationNumber');
    const role = sessionStorage.getItem('role');
    const email = sessionStorage.getItem('email');

    // If we have a token and user data, restore the user state
    if (token && username && registrationNumber && role) {
      const user = new Utilisateur();
      user.username = username;
      user.registrationNumber = registrationNumber;
      user.role = role;
      user.email = email || '';


      (user as any).token = token;

      // Restore the current user subject
      this.currentUserSubject.next(user);

      console.log('User restored from storage:', user);
    } else {
      console.log('No valid user data found in storage');
    }
  }




  redirectToDashboard(): void {
    const role = this.getUserRole();
    if (role === 'USER') {
      this.router.navigate(['/equipementDSI']);
    } if(role === 'ADMIN'){
      this.router.navigate(['/dashboard']);
    }
    if(role === 'DAG'){
      this.router.navigate(['/DAGEquip']);
    }
    if(role === 'JURIDIQUE'){
      this.router.navigate(['/juridiqueEquip']);
    }
  }

    getUserRole(): string | null {
    const user = this.getCurrentUser();
    return user ? user.role : null;
  }

  getCurrentUser(): Utilisateur | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    const token = sessionStorage.getItem('token');
    const user = this.getCurrentUser();
    return !!(token && user);
  }

  getToken(): string | null {
    return sessionStorage.getItem('token');
  }




logout(): void {
  if (this.isLoggingOut) return; // ← 🔁 évite double appel
  this.isLoggingOut = true;

  try {
    // Clear session storage
    sessionStorage.clear();
    this.currentUserSubject.next(null);

    // Naviguer vers login
    this.router.navigate(['/utilisateur'], { replaceUrl: true }).finally(() => {
      this.isLoggingOut = false;
    });

  } catch (error) {
    console.error('Logout error:', error);
    this.isLoggingOut = false;
  }
}

 private navigationItems: NavigationItem[] = [
    {
      id: 'dashboard-chef',
      title: 'Tableau de Bord',
      icon: 'ti ti-layout-dashboard',
      route: '/',
      roles: ['ADMIN','USER','DAG','JURIDIQUE']
    },
    {
      id: 'Equipements_DAG',
      title: 'Equipements',
      icon: 'ti ti-layout-dashboard',
      route: '/DAGEquip',
      roles: ['DAG']
    },
        {
      id: 'Equipements_Juridique',
      title: 'Equipements',
      icon: 'ti ti-layout-dashboard',
      route: '/juridiqueEquip',
      roles: ['JURIDIQUE']
    },
       {
      id: 'Types',
      title: 'Type Equipements',
      icon: 'ti ti-layout-dashboard',
      route: '/dashboard',
      roles: ['ADMIN']
    },
    {
      id: 'Marques',
      title: 'Marques',
      icon: 'ti ti-layout-dashboard',
      route: '/marque',
      roles: ['ADMIN']
    },
    {
      id: 'Models',
      title: 'Models',
      icon: 'ti ti-layout-dashboard',
      route: '/model',
      roles: ['ADMIN']
    },
    {
      id: 'Equipement_Admin',
      title: 'Equipements',
      icon: 'ti ti-layout-dashboard',
      route: '/equipement',
      roles: ['ADMIN']
    },
        {
      id: 'Fournisseur',
      title: 'Fournisseurs',
      icon: 'ti ti-layout-dashboard',
      route: '/fournisseur',
      roles: ['ADMIN']
    },
            {
      id: 'EquipementDSI',
      title: 'Equipements',
      icon: 'ti ti-layout-dashboard',
      route: '/equipementDSI',
      roles: ['USER']
    },
        {
      id: 'Etat',
      title: 'Etat',
      icon: 'ti ti-edit-circle',
      route: '/etat',
      roles: ['ADMIN']

    },
    {
      id: 'Historique',
      title: 'Historique',
      icon: 'ti ti-edit-circle',
      route: '/historique',
      roles: ['ADMIN','USER','DAG','JURIDIQUE']

    }
  ];




  getNavigationItems(userRole: string): NavigationItem[] {
    return this.navigationItems.filter(item =>
      item.roles.includes(userRole)
    );
  }



}
