import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TypeService } from '../dashboard/type.service';
import { Utilisateur } from '../utilisateur/Utilisateur';
import { UtilisateurService } from '../utilisateur/utilisateur.service';
import { HttpClientModule } from '@angular/common/http';
import { Equip } from '../equipement/equip';

interface Equipement {
  id: number;
  nom: string;
  type: string;
  marque: string;
  modele: string;
  numeroSerie: string;
  statut: 'Actif' | 'En maintenance' | 'Hors service';
  dateAffectation: Date;
}

interface Utilisateur1 {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  poste: string;
  departement: string;
  photo: string;
  equipements: Equipement[];
}

@Component({
  selector: 'app-utilisateur-equipement',
  templateUrl: './utilisateur-equipement.component.html',
  styleUrls: ['./utilisateur-equipement.component.css']
})
export class UtilisateurEquipementComponent implements OnInit {

  utilisateurs: Utilisateur1[] = [];
   utilisateur1: Utilisateur[] = [];
   equipements:Equip[]=[];
  filteredUtilisateurs: Utilisateur1[] = [];
  searchText = '';
  isAffectationModalOpen = false;
  affectationForm!: FormGroup;
  submitted = false;

  // Notification system
  notification = {
    show: false,
    type: 'success' as 'success' | 'error',
    message: ''
  };

  constructor(private fb: FormBuilder,private authservice:UtilisateurService,private http:HttpClientModule,private typeService:TypeService) {
    this.initializeAffectationForm();
  }

  ngOnInit(): void {
    this.getUsers();
    this.loadUtilisateurs();

  }

  initializeAffectationForm(): void {
    this.affectationForm = this.fb.group({
      userRegistrationNumber: ['', Validators.required],
      equipement: [[], Validators.required],
      dateAffectation: ['', Validators.required],
      commentaire: ['']
    });
  }



  getUsers()
  {
this.authservice.getUtilisateur().subscribe(data => {
  this.utilisateur1 = data;

});}



  loadUtilisateurs(): void {
    this.utilisateurs = [
      {
        id: 1,
        nom: 'Ben Ahmed',
        prenom: 'Mohamed',
        email: 'mohamed.benahmed@esprit.tn',
        telephone: '+216 98 123 456',
        poste: 'Développeur Senior',
        departement: 'IT',
        photo: 'assets/images/logos/human.JPG',
        equipements: [
          {
            id: 101,
            nom: 'Ordinateur Portable',
            type: 'Laptop',
            marque: 'Dell',
            modele: 'Latitude 7420',
            numeroSerie: 'DL7420-001',
            statut: 'Actif',
            dateAffectation: new Date('2023-01-15')
          },
          {
            id: 102,
            nom: 'Écran Externe',
            type: 'Moniteur',
            marque: 'Samsung',
            modele: '27" 4K',
            numeroSerie: 'SM27-4K-002',
            statut: 'Actif',
            dateAffectation: new Date('2023-01-15')
          }
        ]
      },
      {
        id: 2,
        nom: 'Trabelsi',
        prenom: 'Fatma',
        email: 'fatma.trabelsi@esprit.tn',
        telephone: '+216 97 234 567',
        poste: 'Chef de Projet',
        departement: 'Management',
        photo: 'assets/images/logos/human.JPG',
        equipements: [
          {
            id: 201,
            nom: 'MacBook Pro',
            type: 'Laptop',
            marque: 'Apple',
            modele: 'MacBook Pro 16"',
            numeroSerie: 'MBP16-003',
            statut: 'Actif',
            dateAffectation: new Date('2023-02-01')
          },
          {
            id: 202,
            nom: 'iPhone',
            type: 'Téléphone',
            marque: 'Apple',
            modele: 'iPhone 14 Pro',
            numeroSerie: 'IP14P-004',
            statut: 'En maintenance',
            dateAffectation: new Date('2023-02-01')
          },
          {
            id: 203,
            nom: 'Tablette',
            type: 'Tablette',
            marque: 'iPad',
            modele: 'iPad Air',
            numeroSerie: 'IPA-005',
            statut: 'Actif',
            dateAffectation: new Date('2023-02-15')
          }
        ]
      },
      {
        id: 3,
        nom: 'Khelifi',
        prenom: 'Ahmed',
        email: 'ahmed.khelifi@esprit.tn',
        telephone: '+216 96 345 678',
        poste: 'Analyste Système',
        departement: 'IT',
        photo: 'assets/images/logos/human.JPG',
        equipements: [
          {
            id: 301,
            nom: 'PC Desktop',
            type: 'Desktop',
            marque: 'HP',
            modele: 'EliteDesk 800',
            numeroSerie: 'HP800-006',
            statut: 'Actif',
            dateAffectation: new Date('2023-03-01')
          }
        ]
      },
      {
        id: 4,
        nom: 'Mansouri',
        prenom: 'Leila',
        email: 'leila.mansouri@esprit.tn',
        telephone: '+216 95 456 789',
        poste: 'Designer UX/UI',
        departement: 'Design',
        photo: 'assets/images/logos/human.JPG',
        equipements: [
          {
            id: 401,
            nom: 'iMac',
            type: 'Desktop',
            marque: 'Apple',
            modele: 'iMac 27"',
            numeroSerie: 'IMAC27-007',
            statut: 'Actif',
            dateAffectation: new Date('2023-03-15')
          },
          {
            id: 402,
            nom: 'Tablette Graphique',
            type: 'Accessoire',
            marque: 'Wacom',
            modele: 'Intuos Pro',
            numeroSerie: 'WIP-008',
            statut: 'Hors service',
            dateAffectation: new Date('2023-03-15')
          }
        ]
      },
      {
        id: 5,
        nom: 'Bouazizi',
        prenom: 'Karim',
        email: 'karim.bouazizi@esprit.tn',
        telephone: '+216 94 567 890',
        poste: 'Administrateur Réseau',
        departement: 'IT',
        photo: 'assets/images/logos/human.JPG',
        equipements: [
          {
            id: 501,
            nom: 'Serveur',
            type: 'Serveur',
            marque: 'Dell',
            modele: 'PowerEdge R740',
            numeroSerie: 'DPE740-009',
            statut: 'Actif',
            dateAffectation: new Date('2023-04-01')
          },
          {
            id: 502,
            nom: 'Switch Réseau',
            type: 'Réseau',
            marque: 'Cisco',
            modele: 'Catalyst 2960',
            numeroSerie: 'CC2960-010',
            statut: 'Actif',
            dateAffectation: new Date('2023-04-01')
          }
        ]
      }
    ];

    this.filteredUtilisateurs = [...this.utilisateurs];
  }

  // Méthode de recherche
  onSearch(): void {
    if (!this.searchText.trim()) {
      this.filteredUtilisateurs = [...this.utilisateurs];
      return;
    }

    const searchLower = this.searchText.toLowerCase();
    this.filteredUtilisateurs = this.utilisateurs.filter(utilisateur =>
      utilisateur.nom.toLowerCase().includes(searchLower) ||
      utilisateur.prenom.toLowerCase().includes(searchLower) ||
      utilisateur.email.toLowerCase().includes(searchLower) ||
      utilisateur.departement.toLowerCase().includes(searchLower) ||
      utilisateur.poste.toLowerCase().includes(searchLower) ||
      utilisateur.equipements.some(eq =>
        eq.nom.toLowerCase().includes(searchLower) ||
        eq.marque.toLowerCase().includes(searchLower) ||
        eq.modele.toLowerCase().includes(searchLower)
      )
    );
  }

  // Méthodes utilitaires
  getTotalUtilisateurs(): number {
    return this.utilisateurs.length;
  }

  getTotalEquipements(): number {
    return this.utilisateurs.reduce((total, user) => total + user.equipements.length, 0);
  }

  getUtilisateursAvecEquipements(): number {
    return this.utilisateurs.filter(user => user.equipements.length > 0).length;
  }

  getUtilisateursSansEquipements(): number {
    return this.utilisateurs.filter(user => user.equipements.length === 0).length;
  }

  getEquipementsActifs(): number {
    return this.utilisateurs.reduce((total, user) =>
      total + user.equipements.filter(eq => eq.statut === 'Actif').length, 0
    );
  }

  getEquipementsEnMaintenance(): number {
    return this.utilisateurs.reduce((total, user) =>
      total + user.equipements.filter(eq => eq.statut === 'En maintenance').length, 0
    );
  }

  getEquipementsHorsService(): number {
    return this.utilisateurs.reduce((total, user) =>
      total + user.equipements.filter(eq => eq.statut === 'Hors service').length, 0
    );
  }

  // Méthodes pour les notifications
  showNotification(type: 'success' | 'error', message: string): void {
    this.notification = {
      show: true,
      type: type,
      message: message
    };

    setTimeout(() => {
      this.hideNotification();
    }, 3000);
  }

  hideNotification(): void {
    this.notification.show = false;
  }

  // Méthodes d'action
  voirDetails(utilisateur: Utilisateur1): void {
    this.showNotification('success', `Détails de ${utilisateur.prenom} ${utilisateur.nom} affichés`);
  }

  gererEquipements(utilisateur: Utilisateur1): void {
    this.showNotification('success', `Gestion des équipements de ${utilisateur.prenom} ${utilisateur.nom}`);
  }

  // Méthodes pour gérer le modal d'affectation
  openAffectationModal(): void {
    console.log('Ouverture du modal d\'affectation');
    this.isAffectationModalOpen = true;
  }

  closeAffectationModal(): void {
    this.isAffectationModalOpen = false;
    this.resetAffectationForm();
  }

  closeAffectationOnOutsideClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal')) {
      this.closeAffectationModal();
    }
  }

  resetAffectationForm(): void {
    this.affectationForm.reset();
    this.submitted = false;
  }

  OnRegister(): void {
    this.submitted = true;

    if (this.affectationForm.invalid) {
      this.affectationForm.markAllAsTouched();
      return;
    }

    const formValue = this.affectationForm.value;
    console.log('Nouvelle affectation:', formValue);

    this.showNotification('success', 'Affectation créée avec succès !');
    this.closeAffectationModal();
  }
}
