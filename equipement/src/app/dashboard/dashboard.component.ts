import { Component,OnInit } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { UtilisateurService } from '../utilisateur/utilisateur.service';
import { Router } from '@angular/router';
import { TypeEqui } from './TypeEqui';
import { TypeService } from './type.service';
import * as bootstrap from 'bootstrap';
// or for just Modal:
import { Modal } from 'bootstrap';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
Types:TypeEqui[]=[];
  searchText: string = '';
isModalOpen = false;
newType: TypeEqui = {
  idType: 0,
  nomType: '',
  description: '',
  marques: []  // ajoute la liste vide par défaut
};

// Notification system
notification = {
  show: false,
  type: 'success', // 'success' or 'error'
  message: ''
};

 
  constructor(private http: HttpClient,private authservice:TypeService,private router: Router) {}

  openModal() {
    this.resetErrors();
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  // Méthodes pour les notifications
  showNotification(type: 'success' | 'error', message: string) {
    this.notification = {
      show: true,
      type: type,
      message: message
    };

    // Auto-hide après 2 secondes
    setTimeout(() => {
      this.hideNotification();
    }, 2000);
  }

  hideNotification() {
    this.notification.show = false;
  }
  updateData() {
  if (!this.validateSignup()) {
    return; // formulaire invalide => on ne continue pas
  }
    this.authservice.updateType(this.newType).subscribe(
      (response) => {
        console.log('Update successful:', response);
        this.showNotification('success', 'Type modifié avec succès');
 ;
        this.GetALLTypes();
           this.closeModal1();
                window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      (error) => {
        console.error('Update failed:', error);
        this.showNotification('error', 'Échec de la modification du type');
      }
    );
  }

  closeOnOutsideClick(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('modal')) {
      this.closeModal();
    }
  }

  signupErrors: any = {};

  resetErrors() {
    this.signupErrors = {};
  }

closeModal1() {
  const modalElement = document.getElementById('updateModal');
  if (modalElement) {
    const modal = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
    modal.hide();
  }
}

  GetALLTypes(){
  this.authservice.getAllTypes().subscribe(data => {
  this.Types = data;
  console.log("Types reçus : ", JSON.stringify(this.Types, null, 2));
});

  }
  onRegister(): void {
  if (!this.validateSignup()) {
    return; // formulaire invalide => on ne continue pas
  }
  console.log('User Data:', this.newType);

  this.authservice.addType(this.newType).subscribe({

    next: (response) => {
      console.log('User registered successfully', response);
      this.showNotification('success', 'Type ajouté avec succès');

      this.Types.push(response);


     
      this.closeModal();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    error: (error) => {
      console.error('Registration failed:', error);
      this.showNotification('error', 'Échec de l\'ajout du type');
    }
  });
}

  filterTypes() {
    return this.Types.filter((r) => r.nomType.toLowerCase().includes(this.searchText.toLowerCase()));
  }
  openModal1(Type: TypeEqui) {
    this.resetErrors
    this.newType = { ...Type };
    console.log('Données mises à jour:', this.newType);
    const modalElement = document.getElementById('updateModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    } else {
      console.error('La modale avec l\'ID "updateModal" n\'a pas été trouvée.');
    }
  }

  deleteType(id: number) {
    this.authservice.deleteType(id).subscribe(() => {
      this.Types = this.Types.filter(Type => Type.idType !== id);
    });
            this.showNotification('success', 'Type supprimé avec succès');
      window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  confirmDelete(TypeId: number): void {
    const isConfirmed = window.confirm('Are you sure you want to delete this item?');
    if (isConfirmed) {
      this.deleteType(TypeId);
    }
  }


  validateSignup(): boolean {
    this.resetErrors();
    let isValid = true;

    // Username
    if (!this.newType.nomType || this.newType.nomType.trim().length === 0) {
      this.signupErrors.nomType = 'Le nom de type est requis';
      isValid = false;
    } else if (this.newType.nomType.length < 3) {
      this.signupErrors.nomType = 'Le nom de type doit contenir au moins 3 caractères';
      isValid = false;
    }


  
  

    

    return isValid;
  }

  submitForm() {
    if (this.validateSignup()) {
      // Ici vous pouvez envoyer newUser au backend ou autre traitement
      console.log('Formulaire valide', this.newType);
    } else {
      console.log('Formulaire invalide', this.signupErrors);
    }
  }
  ngOnInit(): void {
    this.GetALLTypes();
   
  }

  


  

}
