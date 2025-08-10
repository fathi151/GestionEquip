import { Component } from '@angular/core';
import { Equip } from 'src/app/equipement/equip';
import { Model } from 'src/app/model/Model';
import { TypeService } from 'src/app/dashboard/type.service';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import * as bootstrap from 'bootstrap';
// or for just Modal:
import { Modal } from 'bootstrap';
import { Fournisseur } from 'src/app/fournisseur/Fournisseur';
import { Utilisateur } from 'src/app/utilisateur/Utilisateur';
import { UtilisateurService } from 'src/app/utilisateur/utilisateur.service';

import { debounceTime, distinctUntilChanged, Observable, of, switchMap, tap } from 'rxjs';
import { Affectation } from 'src/app/affecta/Affectation';
import { Historique } from 'src/app/equipement/Historique';
import { Panne } from 'src/app/DSI/equipements/Panne';
@Component({
  selector: 'app-equip-da-g',
  templateUrl: './equip-da-g.component.html',
  styleUrls: ['./equip-da-g.component.css']
})
export class EquipDaGComponent {

models:Model[]=[];
equiements:Equip[]=[];
utilisateurs: Utilisateur[] = [];

filteredUtilisateurs: Utilisateur[] = [];
filteredUtilisateursSearch: Utilisateur[] = [];
modelet: Model[] = [];
  NomEqui:String|null=null;
    NomUser:String|null=null;
notification = {
  show: false,
  type: 'success', // 'success' or 'error'
  message: ''
};
currentPage = 0;
pageSize = 4;
searchTerm: string = '';

// Affectation form
affectationForm!: FormGroup;
selectedEquipement!: Equip
affectationFormSubmitted = false;
editAffectationFormSubmitted = false;

newEquipement:Equip={
idEqui:0,
numSerie:"",
statut:"",
image:"",
model:null,
dateAffectation:new Date,
description:"",
fournisseur:null,
panne:null

};
newEquipement1:Equip={
idEqui:0,
numSerie:"",
statut:"",
image:"",
model:null,
dateAffectation:new Date,
description:"",
fournisseur:null,
panne:null

};
form!: FormGroup;
editForm!: FormGroup;

EditedAffectation:Affectation={
  id:0,
  commentaire:"",
  dateAffectation:new Date(),
  user:new Utilisateur(),
  equipement:new Equip(),
  verrou:""

}
NameUtilisateur:string[]=[];
idsEqui:number[]=[];
tableAffectation: any = {};

// Propriétés pour les pannes
selectedPanne: Panne = new Panne();
showPanneModal: boolean = false;
panneForm: FormGroup;

// Propriétés pour les états successeurs
successorStates: { [equipId: number]: any[] } = {};
// Propriété pour suivre les états validés
etatsValides: { [equipId: number]: boolean } = {};

submitted = false;
fournisseurs:Fournisseur[]=[];
  totalPages: any;
  utilisateurCtrl = new FormControl();
  utilisateurSearchCtrl = new FormControl();
  modelCtrl = new FormControl();
constructor(
  private authservice:TypeService,
  private http:HttpClient,
  private fb: FormBuilder,
  private utilisateurService: UtilisateurService
) {
  // Initialisation du formulaire de panne
  this.panneForm = this.fb.group({
    titre: ['', [Validators.required, Validators.minLength(3)]],
    description: ['', [Validators.required, Validators.minLength(10)]],
    priorite: ['MOYENNE', [Validators.required]],

  });
}
  ngOnInit(): void {
      this.currentPage = 0;

    this.GetAllModels();
    this.loadEquipements(this.currentPage);
    this.getFournisseur();









// Autocomplete pour le modal de modification
this.modelCtrl.valueChanges
  .pipe(
    debounceTime(300),
    distinctUntilChanged(),
    switchMap(value => {
      if (typeof value === 'string') {
        if (value.trim().length > 0) {
          return this.authservice.searchModels(value.trim());
        } else {
          return of([]);
        }
      }
      return of([]);
    })
  )
  .subscribe(models => {
    this.modelet = models;
  });

// Autocomplete pour le formulaire d'ajout



// Autocomplete pour la recherche
this.utilisateurSearchCtrl.valueChanges
  .pipe(
    debounceTime(300),
    distinctUntilChanged(),
    tap((value: any) => {

      if (typeof value === 'string' && value.trim() === '') {
        this.utilisateurSearchCtrl.setValue(null, { emitEvent: false });
        this.loadEquipements(0);
      }
    }),
    switchMap(value => {
      if (typeof value === 'string') {
        if (value.trim().length > 0) {

this.authservice.searchEquipements(this.searchTerm,this.utilisateurSearchCtrl.value,0,this.pageSize).subscribe({
  next: (res) => {
    this.equiements = res.content;
    this.totalPages = res.totalPages;
    this.fetchUtilisateurs(this.equiements);
  },
  error: (err) => console.error(err)
});
this.loadEquipements(0);

          return this.authservice.searchUsers(value.trim());
        } else {
          return of([]);
        }
      }
      return of([]);
    })
  )
  .subscribe(users => {
    this.filteredUtilisateursSearch = users;
  });



}







displayUtilisateur(user: any): string {
  return user ? `${user.firstName} ${user.lastName} - ${user.email}` : '';
}


displayModel(model: any): string {
  return  model? `${model.nomModel}` : '';
}





 getFournisseur()
  {

  this.authservice.getallFournisseur().subscribe(data => {
  this.fournisseurs = data;

});


  }











  onUserSearchSelected(user: Utilisateur) {
    this.loadEquipements(0);

  }





selectedStatut: string = ''; // ou initialisée via formulaire dropdown

loadEquipements(page: number): void {
  this.currentPage = page;

  const keyword = this.searchTerm.trim();
  const statut = this.selectedStatut.trim();

  let username = '';
  const userVal = this.utilisateurSearchCtrl.value;

  if (typeof userVal === 'string') {
    username = userVal.trim();
  } else if (userVal && typeof userVal === 'object' && 'username' in userVal) {
    username = userVal.username.trim();
  }

  // 🔥 PRIORITÉ 1 : Username présent → toujours utiliser le filtre par username
  if (username !== '') {
    this.authservice.searchEquipements(keyword || '', username, page, this.pageSize).subscribe({
      next: (res) => {
        this.equiements = res.content;
        this.totalPages = res.totalPages;
        this.fetchUtilisateurs(this.equiements);
      },
      error: (err) => console.error(err)
    });
    return;
  }

  // Cas 2 : Statut seul (sans username)
  if (keyword === '' && statut !== '') {
    this.authservice.searchEquipements1('', statut, page, this.pageSize).subscribe({
      next: (res) => {
        this.equiements = res.content;
        this.totalPages = res.totalPages;
        this.fetchUtilisateurs(this.equiements);
      },
      error: (err) => console.error(err)
    });
    return;
  }

  // Cas 3 : Keyword seul (sans username ni statut)
  if (keyword !== '' && statut === '') {
    this.authservice.searchEquipements(keyword, '', page, this.pageSize).subscribe({
      next: (res) => {
        this.equiements = res.content;
        this.totalPages = res.totalPages;
        this.fetchUtilisateurs(this.equiements);
      },
      error: (err) => console.error(err)
    });
    return;
  }

  // Cas 4 : Keyword + Statut (sans username)
  if (keyword !== '' && statut !== '') {
    this.authservice.searchEquipements1(keyword, statut, page, this.pageSize).subscribe({
      next: (res) => {
        this.equiements = res.content;
        this.totalPages = res.totalPages;
        this.fetchUtilisateurs(this.equiements);
      },
      error: (err) => console.error(err)
    });
    return;
  }

  // Cas 5 : Aucun filtre → tout afficher
  this.authservice.getDAGEquipements(page, this.pageSize).subscribe({
    next: (res) => {
      this.equiements = res.content;
      this.totalPages = res.totalPages;
      this.fetchUtilisateurs(this.equiements);
    },
    error: (err) => console.error(err)
  });
}


private fetchUtilisateurs(equiements: any[]): void {
  console.log(equiements);
  equiements.forEach(eq => {

    this.idsEqui[eq.idEqui]=eq.idEqui;

    // Charger les états successeurs pour chaque équipement avec une panne
    if (eq.panne && eq.panne.etatActuel) {
      this.loadSuccessors(eq);
    }
     })
     console.log(this.idsEqui);
    this.authservice.getAffectationsByIds(this.idsEqui).subscribe(data => {

      data.forEach(affectation => {
        this.tableAffectation[affectation.equipement.idEqui] = affectation;
        this.NameUtilisateur[affectation.equipement.idEqui] = affectation.user.firstName + " " + affectation.user.lastName;

      });
    });




}


  onSearchChange(): void {

    this.loadEquipements(0);
  }






















onFileSelected(event: any) {
  const file = event.target.files[0];

  if (file) {
    const formData = new FormData();
    formData.append('file', file);

    this.http.post<any>('/api/images', formData).subscribe(
      (response) => {
        if (response && response.imageUrl) {
          const fullUrl = `/api${response.imageUrl}`;
          console.log('Image URL saved: ', fullUrl);


          this.form.patchValue({
            image: fullUrl
          });
        } else {
          console.error('Invalid response from API');
        }
      },
      (error) => {
        console.error('Error during image upload', error);
      }
    );
  }
}



signupErrors: any = {};

  resetErrors() {
    this.signupErrors = {};
  }

      GetAllModels()
    {
      this.authservice.getAllModel().subscribe(data => {
      this.models = data;

    });
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

  // Méthode pour réinitialiser le formulaire=









  // Méthode pour formater la date pour les inputs HTML
  formatDateForInput(date: any): string | null {
    if (!date) return null;

    try {
      const dateObj = new Date(date);
      if (isNaN(dateObj.getTime())) return null;

      // Format YYYY-MM-DD pour les inputs de type date
      return dateObj.toISOString().split('T')[0];
    } catch (error) {
      console.error('Erreur lors du formatage de la date:', error);
      return null;
    }
  }

  // Méthodes pour la pagination
  goToPage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.loadEquipements(page);
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.loadEquipements(this.currentPage + 1);
    }
  }

  previousPage(): void {
    if (this.currentPage > 0) {
      this.loadEquipements(this.currentPage - 1);
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


  openPanneModal(equipement: Equip) {
    this.selectedPanne = new Panne();
    this.selectedPanne.equipement = equipement;
    this.panneForm.reset();
    this.panneForm.patchValue({
      priorite: 'MOYENNE'
    });
    this.showPanneModal = true;
  }

  /**
   * Fermer le modal de panne
   */
  closePanneModal() {
    this.showPanneModal = false;
    this.selectedPanne = new Panne();
    this.panneForm.reset();
  }

  /**
   * Fermer le modal en cliquant à l'extérieur
   */
  closeOnOutsideClick(event: any) {
    if (event.target.classList.contains('modal')) {
      this.closePanneModal();
    }
  }

  onSubmitPanne() {


    if (this.panneForm.valid) {
      const etatActuel = {
        titre: 'PANNE',
        responsable: "DAG",
        precedent: null
      };

      const panneData = {
        titre: this.panneForm.get('titre')?.value,
        description: this.panneForm.get('description')?.value,
        date: new Date(),
        equipement: {
          idEqui: this.selectedPanne.equipement.idEqui
        },
        etatActuel: etatActuel,
        end: 0
      };

      this.authservice.declarerPanne(panneData).subscribe({
        next: (response: any) => {
          console.log('Panne déclarée avec succès:', response);
          this.closePanneModal();
          this.loadEquipements(this.currentPage);
        },
        error: (error: any) => {
          console.error('Erreur lors de la déclaration de panne:', error);
        }
      });
    }
  }





  getEquipementEtat(equip: any): string {
    if (!equip.panne) {
      return 'EN MARCHE';
    }
    return equip.panne.etatActuel?.titre || 'INCONNU';
  }

  annulerPanne(equipement: Equip) {
    if (confirm('Êtes-vous sûr de vouloir annuler cette panne ?')) {
      if(equipement.panne==null)return;
      this.authservice.annulerPanne(equipement.idEqui).subscribe({
        next: (response: any) => {
          console.log('Panne annulée avec succès:', response);
          this.showNotification('success', 'Panne annulée avec succès');
          this.loadEquipements(this.currentPage);
        },
        error: (error: any) => {
          console.error('Erreur lors de l\'annulation de la panne:', error);
          this.showNotification('error', 'Erreur lors de l\'annulation de la panne');
        }
      });
    }
  }


// Nouvelle méthode pour passer à l'état suivant automatiquement












RevenirEnPanne(Equipement: Equip)
{


if(!Equipement.panne)return;
this.authservice.updatePanne(Equipement.panne.id).subscribe({

next: (response: any) => {
    console.log('etat mise a joure avec success:', response);

    this.loadEquipements(this.currentPage);
  },
  error: (error: any) => {
    console.error('Erreur lors de l\'annulation de la panne:', error);
    this.showNotification('error', 'Erreur lors de l\'annulation de la panne');
  }





})




}

// Méthode pour obtenir l'état suivant
getNextState(equipement: Equip): string {
  if (!equipement.panne || !equipement.panne.etatActuel) {
    return 'Aucun état suivant';
  }

  const currentStateId = equipement.panne.etatActuel.id;
  const successors = this.successorStates[equipement.idEqui];

  if (successors && successors.length > 0) {
    return successors[0].titre; // Retourne le premier successeur
  }

  return 'Aucun état suivant';
}

// Méthode pour charger les états successeurs
loadSuccessors(equipement: Equip): void {
  if (!equipement.panne || !equipement.panne.etatActuel) {
    return;
  }

  const currentStateId = equipement.panne.etatActuel.id;
  this.authservice.getSuccessorsDAGWithTransitions(currentStateId).subscribe({
    next: (successors) => {
      this.successorStates[equipement.idEqui] = successors;
    },
    error: (error) => {
      console.error('Erreur lors du chargement des états successeurs:', error);
      this.successorStates[equipement.idEqui] = [];
    }
  });
}

// Méthode pour passer à l'état suivant automatiquement
passerEtatSuivant(equipement: Equip): void {
  if (!equipement.panne || !equipement.panne.etatActuel) {
    return;
  }

  const successors = this.successorStates[equipement.idEqui];
  if (successors && successors.length > 0) {
    const nextState = successors[0];
    console.log(nextState)
    this.authservice.changerEtatPanne(equipement.panne.id, nextState.id).subscribe({
      next: (response: any) => {
        console.log('État changé avec succès:', response);
        this.loadEquipements(this.currentPage);
      },
      error: (error: any) => {
        console.error('Erreur lors du changement d\'état:', error);
        this.showNotification('error', 'Erreur lors du changement d\'état');
      }
    });
  }
}


}
