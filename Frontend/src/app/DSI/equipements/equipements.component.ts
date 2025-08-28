
import { Component, OnInit } from '@angular/core';
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

import { debounceTime, distinctUntilChanged, of, switchMap, tap } from 'rxjs';
import { Affectation } from 'src/app/affecta/Affectation';
import { Historique } from 'src/app/equipement/Historique';
import { Panne } from './Panne';
// import { EtatEqui } from './EtatEqui'; // REMOVE this line
import { EtatEqui } from 'src/app/etat/Etat'; // Use the EtatEqui from the source of your data
import { EtatService } from 'src/app/etat/etat.service';
import { Dossier } from 'src/app/dossier/Dossier';
import { DossierComponent } from 'src/app/dossier/dossier.component';
import { ViewChild } from '@angular/core';
@Component({
  selector: 'app-equipements',
  templateUrl: './equipements.component.html',
  styleUrls: ['./equipements.component.css']
})



export class EquipementsComponent implements OnInit {



models:Model[]=[];
equiements:Equip[]=[];
utilisateurs: Utilisateur[] = [];

filteredUtilisateurs: Utilisateur[] = [];
filteredUtilisateursSearch: Utilisateur[] = [];
dossier!:Dossier;

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
pannes:null

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
pannes:null

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
successorStates: { [equipId: number]: any[] } = {};
NameUtilisateur:string[]=[];
idsEqui:number[]=[];
tableAffectation: any = {};

// Propriétés pour les pannes
selectedPanne: Panne = new Panne();
showPanneModal: boolean = false;
panneForm: FormGroup;

// Propriétés pour le formulaire de processus
showProcessModal: boolean = false;
  showDossierModal: boolean = false;
  @ViewChild(DossierComponent) dossierComponent?: DossierComponent;
processForm: FormGroup;
filteredEquipementsDSI: Equip[] = [];
defaultEtats: EtatEqui[] = [];
equipementProcessCtrl = new FormControl();

submitted = false;
fournisseurs:Fournisseur[]=[];
  totalPages: any;
  utilisateurCtrl = new FormControl();
  utilisateurSearchCtrl = new FormControl();
  modelCtrl = new FormControl();
  // Transition modal state for DSI: collect description before passing to next state
  showTransitionModal: boolean = false;
  transitionEquip: Equip | null = null;
  transitionNextState: any = null;
  transitionDescription: string = '';
constructor(
  private authservice:TypeService,
  private http:HttpClient,
  private fb: FormBuilder,
  private utilisateurService: UtilisateurService,
  private etatService: EtatService
) {
  // Initialisation du formulaire de panne
  this.panneForm = this.fb.group({
    titre: ['', [Validators.required, Validators.minLength(3)]],
    description: [''],
   date: [this.formatDateForInput(new Date()), Validators.required]


  });

  // Initialisation du formulaire de processus
  this.processForm = this.fb.group({
    equipement: ['', Validators.required],
    etat: ['', Validators.required],
    commentaire: [''],
    date:[new Date(),Validators.required]
  });
}
  ngOnInit(): void {
      this.currentPage = 0;

    this.GetAllModels();
    this.loadEquipements(this.currentPage);
    this.getFournisseur();
    this.loadDefaultEtats();









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

// Autocomplete pour les équipements DSI dans le formulaire de processus
this.equipementProcessCtrl.valueChanges
  .pipe(
    debounceTime(300),
    distinctUntilChanged(),
    switchMap(value => {
      if (typeof value === 'string') {
        if (value.trim().length > 0) {

          return this.authservice.getDSIEquipements(0, 50);
        } else {
          return of({ content: [] });
        }
      }
      return of({ content: [] });
    })
  )
.subscribe(response => {
  this.filteredEquipementsDSI = response.content.filter((equip: Equip) =>

    (equip.pannes == null|| equip.pannes.length===0 || equip.pannes.every(p=>p.end===1))&&

    (
      equip.numSerie.toLowerCase().includes(this.equipementProcessCtrl.value?.toLowerCase() || '') ||
      equip.model?.nomModel.toLowerCase().includes(this.equipementProcessCtrl.value?.toLowerCase() || '')
    )
  );
});

}






displayUtilisateur(user: any): string {
  return user ? `${user.firstName} ${user.lastName} - ${user.registrationNumber}` : '';
}


displayModel(model: any): string {
  return  model? `${model.nomModel}` : '';
}

displayEquipement(equip: any): string {
  return equip ? `${equip.numSerie} - ${equip.model?.nomModel}` : '';
}

// Méthodes pour le formulaire de processus
loadDefaultEtats() {
  this.etatService.getDefaultEtats().subscribe({
    next: (etats) => {
      this.defaultEtats = etats;

      if (etats.length > 0) {
        this.processForm.patchValue({ etat: etats[0] });
      }
    },
    error: (error) => {
      console.error('Erreur lors du chargement des états par défaut:', error);
    }
  });
}

openProcessModal() {
  this.showProcessModal = true;
  this.processForm.reset();
  this.loadDefaultEtats();
}

closeProcessModal() {
  this.showProcessModal = false;
  this.processForm.reset();
  this.equipementProcessCtrl.setValue('');
}

  // Toggle dossier modal and refresh child list when opening
  toggleDossier() {
    this.showDossierModal = !this.showDossierModal;
    if (this.showDossierModal) {
      // If the child component is available, call its refresh method
      try {
        this.dossierComponent?.refresh();
      } catch (e) {
        console.warn('Dossier component not available to refresh', e);
      }
    }
  }

onSubmitProcess() {
  if (this.processForm.valid) {
const processData = {
  equipement: this.processForm.get('equipement')?.value.idEqui ,
  etatActuel: this.processForm.get('etat')?.value.id ,
  date: this.processForm.get('date')?.value,
  description: this.processForm.get('commentaire')?.value
};

console.log('Process data:', processData);
       this.authservice.declarerPanne(processData).subscribe({
        next: (response: any) => {
          console.log('Panne déclarée avec succès:', response);
          this.closeProcessModal();
          this.loadEquipements(this.currentPage);
        },
        error: (error: any) => {
          console.error('Erreur lors de la déclaration de panne:', error);
        }
      });
    }
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
  this.authservice.getDSIEquipements(page, this.pageSize).subscribe({
    next: (res) => {
      this.equiements = res.content;
      this.totalPages = res.totalPages;
      console.log('Équipements DSI chargés:', this.equiements);

      // Log pour vérifier les données de panne
      this.equiements.forEach((equip, index) => {
        console.log(`Équipement ${index}:`, {
   

     
      
        });
      });
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
    const last = this.getLastPanne(eq);
    if (last && last.etatActuel) {
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
    const currentDate = this.formatDateForInput(new Date());
    this.panneForm.patchValue({
      date: currentDate
    });
    console.log('Date initialisée:', currentDate);
    console.log('Valeur du formulaire:', this.panneForm.value);
    this.showPanneModal = true;
  }

  /**
   * Fermer le modal de panne
   */
  closePanneModal() {
    this.showProcessModal = false;
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
      const Etat = {
        titre: 'PANNE',
        responsable: "DSI",
        precedent: null
      };

      const panneData = {

        description: this.panneForm.get('description')?.value,
        date: this.panneForm.get('date')?.value,
        equipement: this.selectedPanne.equipement,
        etatActuel: Etat,
        etat:0
      };

      console.log('Données de panne envoyées:', panneData);

      this.authservice.declarerPanne(panneData).subscribe({
        next: (response: any) => {
          console.log('Panne déclarée avec succès:', response);
          this.closePanneModal();
          this.loadEquipements(this.currentPage);
          this.showNotification('success', 'Panne déclarée avec succès');
        },
        error: (error: any) => {
          console.error('Erreur lors de la déclaration de panne:', error);
          this.showNotification('error', 'Erreur lors de la déclaration de panne');
        }
      });
    }
  }




  getEquipementEtat(equip: any): string {
    const last = this.getLastPanne(equip);
    if (!last) {
      return 'EN MARCHE';
    }
    return last.etatActuel?.titre || 'INCONNU';
  }

  annulerPanne(equipement: Equip) {
    if (confirm('Êtes-vous sûr de vouloir annuler cette panne ?')) {
      if(equipement.pannes==null)return;
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

getNextState(equipement: Equip): string {
  if (!equipement.pannes || equipement.pannes.length === 0) {
    return 'Aucun état suivant';
  }
  const currentPanne = equipement.pannes.find(p => p.end === 0) 
                    || equipement.pannes[equipement.pannes.length - 1];

  if (!currentPanne || !currentPanne.etatActuel) {
    return 'Aucun état suivant';
  }

  const currentStateId = currentPanne.etatActuel.id;
  const successors = this.successorStates[equipement.idEqui];

  if (successors && successors.length > 0) {
    return successors[0].titre; // Retourne le premier successeur possible
  }

  return 'Aucun état suivant';
}

  // Return the last (most recent) panne for an equipment, or null if none.
  getLastPanne(equipement: any) {
    if (!equipement || !equipement.pannes || equipement.pannes.length === 0) {
      return null;
    }
    return equipement.pannes[equipement.pannes.length - 1];
  }


// Méthode pour charger les états successeurs
loadSuccessors(equipement: Equip): void {
  if (!equipement.pannes || equipement.pannes.length === 0) {
    return;
  }

  // ✅ On cherche d'abord une panne active (end = 0), sinon on prend la dernière
  const currentPanne = equipement.pannes.find(p => p.end === 0) 
                    || equipement.pannes[equipement.pannes.length - 1];

  if (!currentPanne || !currentPanne.etatActuel) {
    return;
  }

  const currentStateId = currentPanne.etatActuel.id;

  this.authservice.getSuccessorsDSIWithTransitions(currentStateId).subscribe({
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
  if (!equipement.pannes || equipement.pannes.length === 0) {
    return;
  }

  // ✅ On récupère la panne active ou sinon la dernière
  const currentPanne = equipement.pannes.find(p => p.end === 0) 
                    || equipement.pannes[equipement.pannes.length - 1];

  if (!currentPanne || !currentPanne.etatActuel) {
    return;
  }

  const successors = this.successorStates[equipement.idEqui];
  if (successors && successors.length > 0) {
    const nextState = successors[0];
    // Ouvrir la modale pour confirmation
    this.openTransitionModal(equipement, nextState);
  }
}


  // Open modal to ask for a description before transitioning state
openTransitionModal(equipement: Equip ,nextState: any) {
  this.transitionEquip = equipement;

  this.transitionNextState = nextState;
  this.transitionDescription = '';
  this.showTransitionModal = true;
}

  // Confirm transition: call service with description
confirmTransition() {
  if (!this.transitionEquip || !this.transitionNextState || !this.transitionEquip.pannes) return;

  const currentPanne = this.transitionEquip.pannes.find(p => p.end === 0) 
                      || this.transitionEquip.pannes[this.transitionEquip.pannes.length - 1];

  if (!currentPanne) return;

  currentPanne.etatActuel = this.transitionNextState;
  currentPanne.description = this.transitionDescription;

  const panneRequest: any = {
    equipement: this.transitionEquip.idEqui,
    etatActuel: this.transitionNextState.id,
    description: this.transitionDescription,
    idDossier: currentPanne.dossier?.id
  };

  this.authservice.declarerPanne(panneRequest).subscribe({
    next: () => {
      this.showNotification('success', 'État changé avec succès');
      this.cancelTransition();
      this.loadEquipements(this.currentPage);
    },
    error: (error: any) => {
      console.error('Erreur lors du changement d\'état:', error);
      this.showNotification('error', 'Erreur lors du changement d\'état');
    }
  });
}


  cancelTransition() {
    this.showTransitionModal = false;
    this.transitionEquip = null;
    this.transitionNextState = null;
    this.transitionDescription = '';
  }






}





