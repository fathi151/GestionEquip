import { Component,OnInit } from '@angular/core';
import { Marque } from '../marque/Marque';
import { TypeService } from '../dashboard/type.service';
import { Model } from './Model';
import * as bootstrap from 'bootstrap';
// or for just Modal:
import { Modal } from 'bootstrap';
import { Fournisseur } from '../fournisseur/Fournisseur';
import { NgForm } from '@angular/forms';
@Component({
  selector: 'app-model',
  templateUrl: './model.component.html',
  styleUrls: ['./model.component.css']
})
export class ModelComponent implements OnInit {
marques:Marque[]=[];
models:Model[]=[];
searchText: string = '';
  isModalOpen = false;
  fournisseurs: Fournisseur[] = [];
  size: number = 3;
  page: number = 0;

// Notification system
notification = {
  show: false,
  type: 'success', // 'success' or 'error'
  message: ''
};
newModal: Model = {
  idModel: 0,
  nomModel: '',
  specification: '',
  marque: null,
  equipements: [],
  fournisseur: null,
  typeAssociee: ''
};


newModal1: Model = {
  idModel: 0,
  nomModel: '',
  specification: '',
  marque: null,
  equipements: [],
  fournisseur: null,
  typeAssociee: ''
}



constructor(private authservice:TypeService) { }
  ngOnInit(): void {

    this.GetAllMarques();
  
    this.GetAllModels(this.page);
    this.GetAllFournisseur();
    }
      closeOnOutsideClick(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('modal')) {
      this.closeModal();
    }
  }
    openModal() {
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
selectedMarqueName: string = ''; // Holds selected marque name (or id)


get filteredModels() {
  return this.models.filter(model => {
    const matchMarque = !this.selectedMarqueName || model.marque?.nomMarque === this.selectedMarqueName;
    const matchSearch = !this.searchText || model.nomModel.toLowerCase().includes(this.searchText.toLowerCase());
    return matchMarque && matchSearch;
  });
}

GetAllFournisseur()
{
  this.authservice.getallFournisseur().subscribe(data => {
  this.fournisseurs =data;
 
});
}


    GetAllMarques()
    {
      this.authservice.getAllMarques().subscribe(data => {
      this.marques = data;
   
    });
    }

  deleteModel(id: number) {
    this.authservice.deleteModel(id).subscribe(() => {
      this.models = this.models.filter(model => model.idModel !== id);
    });
  }
    confirmDelete(ModelId: number): void {
    console.log(ModelId);
       window.scrollTo({ top: 0, behavior: 'smooth' });
    this.showNotification('success', 'Modèle supprimer avec succès');
      this.deleteModel(ModelId);
 
  }

  openModal1(Modal: Model) {
       this.signupErrors.nomModel = '';
             this.signupErrors.marque = '';
    this.newModal1 = { ...Modal };
    const modalElement = document.getElementById('updateModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    } else {
      console.error('La modale avec l\'ID "updateModal" n\'a pas été trouvée.');
    }
  }
  onUpdateClick(form: NgForm) {
  if (form.invalid) {
    form.form.markAllAsTouched(); // pour forcer l'affichage des erreurs
    return;
  }

  this.updateData(); // méthode existante
}


closeModal1() {
  const modalElement = document.getElementById('updateModal');
  if (modalElement) {
    const modal = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
    modal.hide();
  }
}

  updateData() {
    console.log('Données mises à jour:', this.newModal1);
    this.authservice.updateModel(this.newModal1).subscribe(
      (response) => {
        console.log('Update successful:', response);
        this.showNotification('success', 'Modèle modifié avec succès');
        this.closeModal1();
        this.GetAllModels(this.page);

        window.scrollTo({ top: 0, behavior: 'smooth' });

      },
      (error) => {
        console.error('Update failed:', error);
        this.showNotification('error', 'Erreur lors de la modification');
      }
    );
  }

compareMarques(m1: Marque, m2: Marque): boolean {
  return m1 && m2 ? m1.idMarque === m2.idMarque : m1 === m2;
}

compareFournisseurs(m1: Fournisseur, m2: Fournisseur): boolean {
  return m1 && m2 ? m1.idFournisseur === m2.idFournisseur : m1 === m2;
}


currentPage:number=0;
totalPages:number=0;
GetAllModels(page:number)
    {
      this.authservice.GetAllModels1(page,this.size).subscribe({
      next: (res) => {
          console.log('Historiques reçus:', res);
          this.models = res.content;
          this.totalPages = res.totalPages;
         
        },
        error: (err) => {
          console.error('Erreur lors du chargement des historiques:', err);
        }
  });
  }
    
  signupErrors: any = {};
    
  resetErrors() {
    this.signupErrors = {};
  }

  validateSignup(): boolean {
    this.resetErrors();
    let isValid = true;

    // Username
    if (!this.newModal.nomModel || this.newModal.nomModel.trim().length === 0) {
      this.signupErrors.nomModel = 'Le nom de model est requis';
      isValid = false;
    } else if (this.newModal.nomModel.length < 3) {
      this.signupErrors.nomModel = 'Le nom de model doit contenir au moins 3 caractères';
      isValid = false;
    }

if (!this.newModal.specification || this.newModal.specification.trim().length === 0) {
      this.signupErrors.specification = 'La specification de type est requis';
      isValid = false;
    } else if (this.newModal.specification.length < 3) {
      this.signupErrors.specification = 'La specification doit contenir au moins 3 caractères';
      isValid = false;
    }
  
if(this.newModal.marque==null){
      this.signupErrors.marque = 'La marque de type est requis';
      isValid = false;
    }
  
  if(this.newModal.typeAssociee==null){
      this.signupErrors.marque = '  type est requis';
      isValid = false;
    }


    

    return isValid;
  }


  onRegister(): void {
  if (!this.validateSignup()) {
    return; 
  }
  console.log('User Data:', this.newModal);

  this.authservice.addModel(this.newModal).subscribe({

    next: (response) => {
      console.log('User registered successfully', response);
      this.showNotification('success', 'Modèle ajouté avec succès');

      // 🟢 Mettre à jour le tableau local pour affichage immédiat
      this.models.push(response);

      // 🧹 Réinitialiser le formulaire et fermer le modal
     
      this.closeModal();
             window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    error: (error) => {
      console.error('Registration failed:', error);
      this.showNotification('error', 'Erreur lors de l\'ajout');
    }
  });
}

 goToPage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.GetAllModels(page);
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.GetAllModels(this.currentPage + 1);
    }
  }

  previousPage(): void {
    if (this.currentPage > 0) {
      this.GetAllModels(this.currentPage - 1);
    }
  }

  // Méthode pour générer les numéros de pages
  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxPagesToShow = 5; // Afficher maximum 5 numéros de pages

    let startPage = Math.max(0, this.currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(this.totalPages - 1, startPage + maxPagesToShow - 1);

    // Ajuster startPage si on est près de la fin
    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(0, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  }




}
