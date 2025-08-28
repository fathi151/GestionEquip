import { Component, OnInit } from '@angular/core';
import { Equip } from './equip';
import { Model } from '../model/Model';
import { TypeService } from '../dashboard/type.service';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import * as bootstrap from 'bootstrap';
// or for just Modal:
import { Modal } from 'bootstrap';
import { Fournisseur } from '../fournisseur/Fournisseur';
import { Utilisateur } from '../utilisateur/Utilisateur';
import { UtilisateurService } from '../utilisateur/utilisateur.service';
import { AffectationEquipement } from '../affecta/AffectationEquipement';
import { debounceTime, distinctUntilChanged, of, switchMap, tap } from 'rxjs';
import { Affectation } from '../affecta/Affectation';
import { Historique } from './Historique';
@Component({
  selector: 'app-equipement',
  templateUrl: './equipement.component.html',
  styleUrls: ['./equipement.component.css']
})
export class EquipementComponent implements OnInit {
isModalOpen = false;
isEditModalOpen = false;
isAffectationModalOpen = false;
isAffectationEditModalOpen = false;
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
  pannes:null,

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
  pannes:null,

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
) { }
  ngOnInit(): void {
      this.currentPage = 0;

    this.GetAllModels();
    this.loadEquipements(this.currentPage);
    this.getFournisseur();


this.form = this.fb.group({
  model: [null, Validators.required],
  numSerie: ['', [Validators.required, Validators.minLength(4)]],
  description: [''],
  dateAffectation: ['', Validators.required],
  statut: ['DISPONIBLE'],
  image: [null],
  fournisseurs: [null, Validators.required]
});

// FormGroup pour la modification
this.editForm = this.fb.group({
  model: [null, Validators.required],
  numSerie: ['', [Validators.required, Validators.minLength(4)]],
  description: [''], // Description optionnelle - pas de validation
  dateAffectation: ['', Validators.required],
  statut: ['DISPONIBLE'], // Statut par défaut, pas de validation requise
  image: [null], // Image optionnelle - pas de validation
  fournisseurs: [null, Validators.required]
});




this.affectationForm = this.fb.group({
  user: [null, Validators.required],
  equipement: [null],
  commentaire: [''], // No validation - optional
  dateAffectation: [new Date()], // No validation - optional
  verrou: ['']
});



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
this.form.get('model')?.valueChanges
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

// Autocomplete pour le formulaire de modification
this.editForm.get('model')?.valueChanges
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


this.utilisateurCtrl.valueChanges
  .pipe(
    debounceTime(300),
    distinctUntilChanged(),
    switchMap(value => {

      if (typeof value === 'string') {
        if (value.trim().length > 0) {
          return this.authservice.searchUsers(value.trim());
        } else {

          return of([]);
        }
      }
      return of([]);
    })
  )
  .subscribe(users => {
    this.filteredUtilisateurs = users;
  });

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
  return user ? `${user.firstName} ${user.lastName} - ${user.registrationNumber}` : '';
}


displayModel(model: any): string {
  return  model? `${model.nomModel}` : '';
}

onModelSelected(model: any): void {
  this.newEquipement1.model = model;
}

onModelSelectedForAdd(model: any): void {
  this.form.patchValue({ model: model });
}

onModelSelectedForEdit(model: any): void {
  this.editForm.patchValue({ model: model });
}



 getFournisseur()
  {

  this.authservice.getallFournisseur().subscribe(data => {
  this.fournisseurs = data;

});


  }

  onModelInputChange(value: string) {

  if (!value || typeof value === 'string') {
    this.newEquipement1.model = null;
  }
}








  onUserSelected(user: Utilisateur) {

    if (this.isAffectationModalOpen) {

      this.affectationForm.patchValue({
        user: user
      });
    } else if (this.isAffectationEditModalOpen) {

      this.EditedAffectation.user = user;
    }
    console.log('Utilisateur sélectionné:', user);
  }

  onUserSearchSelected(user: Utilisateur) {
    this.loadEquipements(0);

  }

  closeOnOutsideClick(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('modal')) {
      this.closeModal();
    }
  }

openModal1(equipement: Equip) {
  const matchedModel = this.models.find(m => m.idModel === equipement.model?.idModel);

  // Trouver le fournisseur correspondant dans la liste des fournisseurs
  const matchedFournisseur = this.fournisseurs.find(f => f.idFournisseur === equipement.fournisseur?.idFournisseur);

  this.newEquipement1 = {
    ...equipement,
    model: matchedModel ?? null
  };

  // Initialiser le formulaire de modification avec les données de l'équipement
  this.editForm.patchValue({
    model: this.newEquipement1.model,
    numSerie: this.newEquipement1.numSerie,
    description: this.newEquipement1.description,
    dateAffectation: this.formatDateForInput(this.newEquipement1.dateAffectation),
    statut: this.newEquipement1.statut,
    image: null,
    fournisseurs: matchedFournisseur || null
  });

  console.log('Données équipement:', this.newEquipement1);
  console.log('Fournisseur original:', this.newEquipement1.fournisseur);
  console.log('Fournisseur trouvé dans la liste:', matchedFournisseur);
  console.log('Date:', this.newEquipement1.dateAffectation);

  this.modelCtrl.setValue(this.newEquipement1.model);

  // Affiche la modale
  this.isEditModalOpen = true;
}

onEditSubmit(): void {
  this.submitted = true;

  if (this.editForm.invalid) {
    this.editForm.markAllAsTouched();
    return;
  }

  const equipementData = {
    ...this.editForm.value,
    idEqui: this.newEquipement1.idEqui, // Garder l'ID original
    statut: this.newEquipement1.statut, // Préserver le statut original
    fournisseur: this.editForm.value.fournisseurs || null // S'assurer que fournisseur n'est jamais undefined
  };

  this.authservice.updateEquip(equipementData).subscribe({
    next: (response) => {
      console.log('Update successful:', response);
      this.showNotification('success', 'Équipement modifié avec succès');
      this.closeEditModal();
      this.loadEquipements(this.currentPage); // Refresh the equipment list
      // Enregistrer dans l'historique
      const historique = new Historique();
      historique.date = new Date();
      historique.commentaire = `Modification de l'équipement: ${equipementData.model?.nomModel} (N° Série: ${equipementData.numSerie})`;
      this.authservice.addHistorique(historique).subscribe({
        next: (response) => {
          console.log('Historique enregistré:', response);
        },
        error: (error) => {
          console.error('Erreur lors de l\'enregistrement de l\'historique:', error);
        }
      });
    },
    error: (error) => {
      console.error('Update failed:', error);
      this.showNotification('error', 'Échec de la modification de l\'équipement');
    }
  });
}

updateData() {
  console.log('Payload envoyé:', this.newEquipement1);
  this.authservice.updateEquip(this.newEquipement1).subscribe(
    (response) => {
      console.log('Update successful:', response);
      this.showNotification('success', 'Équipement modifié avec succès');
      this.closeModal();
      this.loadEquipements(this.currentPage); // Refresh the equipment list
      // Enregistrer dans l'historique

    },
    (error) => {
      console.error('Update failed:', error);
      this.showNotification('error', 'Échec de la modification de l\'équipement');
    }
  );
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
  this.authservice.getAllEquipements(page, this.pageSize).subscribe({
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


   deleteEquip(id: number) {
    this.authservice.deleteEquip(id).subscribe(() => {
      this.showNotification('success', 'Équipement supprimé avec succès');
      this.loadEquipements(this.currentPage);


    });
  }




  private enregistrerHistorique(messaege: string, idEquipement: number) {
    this.authservice.getAffectationById(idEquipement).subscribe(data => {
    this.NomEqui = data.equipement.model?.nomModel
  ? `${data.equipement.model.nomModel} (N° Série:${data.equipement.numSerie})`
  : null;

      this.NomUser = data.user.firstName + " " + data.user.lastName;

      const historique = new Historique();
      historique.date = data.dateAffectation;
      const dateFormatted = data.dateAffectation ? new Date(data.dateAffectation).toLocaleDateString('fr-FR') : new Date().toLocaleDateString('fr-FR');
      historique.commentaire = `${this.NomEqui} ${messaege} ${this.NomUser} le ${dateFormatted}`;

      this.authservice.addHistorique(historique).subscribe({
        next: (response) => {
          console.log('Historique enregistré:', response);
        },
        error: (error) => {
          console.error('Erreur lors de l\'enregistrement de l\'historique:', error);
        }
      });
    });
  }

  desaffecterEquipement(equip: Equip) {
    const isConfirmed = window.confirm('Êtes-vous sûr de vouloir désaffecter cet équipement ?');
    if (isConfirmed) {
      // Enregistrer l'historique AVANT de supprimer l'affectation
      this.enregistrerHistorique(`A ete desaffecte de `, equip.idEqui);

      this.authservice.deleteAff(this.tableAffectation[equip.idEqui].id).subscribe({
        next: () => {
          this.authservice.addStatutDisponible(equip.idEqui).subscribe({
            next: () => {
              this.showNotification('success', 'Équipement désaffecté avec succès');
              this.loadEquipements(this.currentPage);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            },
            error: (error) => {
              console.error('Erreur lors du changement de statut:', error);
              this.showNotification('error', 'Erreur lors du changement de statut');
            }
          });
        },
        error: (error) => {
          console.error('Erreur lors de la suppression de l\'affectation:', error);
          this.showNotification('error', 'Échec de la désaffectation');
        }
      });
    }
  }


   confirmDelete(ModelId: number): void {
    console.log(ModelId);
    const isConfirmed = window.confirm('Are you sure you want to delete this item?');
    if (isConfirmed) {
      this.deleteEquip(ModelId);
    }
  }
onAffectationSubmit() {

  if (this.isAffectationModalOpen) {

    this.handleNewAffectation();
  } else if (this.isAffectationEditModalOpen) {

    this.handleEditAffectation();
  }
}

private handleNewAffectation() {
  this.affectationFormSubmitted = true;

  if (!this.affectationForm.get('user')?.value) {
    console.log('Form validation failed: User is required');
    return;
  }

  if (!this.selectedEquipement) {
    console.error('Aucun équipement sélectionné');
    return;
  }

  // S'assurer que l'équipement a le statut DISPONIBLE par défaut
  this.selectedEquipement.statut = 'DISPONIBLE';
  this.affectationForm.patchValue({ equipement: this.selectedEquipement });
  this.affectationForm.patchValue({ verrou:'affecter' });

  console.log('Form Value:', this.affectationForm.value);
  this.authservice.addStatutAffecte(this.selectedEquipement.idEqui).subscribe({
    next: (response) => {
      console.log('Statut mis à jour avec succès:', response);
    },
    error: (error) => {
      console.error('Erreur lors de la mise à jour du statut:', error);
    }
  });
  this.authservice.addAff(this.affectationForm.value).subscribe({
    next: (response: any) => {
      this.showNotification('success', 'Affectation créée avec succès !');
      this.closeAffectationModal();
      this.loadEquipements(this.currentPage); // Refresh the equipment list
      // Enregistrer dans l'historique
      const utilisateur = this.affectationForm.get('user')?.value;
      const equipementNom = this.selectedEquipement?.model?.nomModel || 'Équipement inconnu';
      const numSerie = this.selectedEquipement?.numSerie || 'N/A';
      const utilisateurNom = utilisateur ? `${utilisateur.firstName || ''} ${utilisateur.lastName || ''}`.trim() : 'Utilisateur inconnu';
      this.enregistrerHistorique(`est affecté à `, this.selectedEquipement.idEqui);
    },
    error: (error) => {
      this.showNotification('error', 'Échec de la création de l\'affectation');
    }
  });
}

private handleEditAffectation() {
  // Validate the edit form - only user is required
  if (!this.EditedAffectation.user) {
    console.log('Form validation failed: User is required');
    return;
  }


  const affectationData = {
    ...this.EditedAffectation,
    dateAffectation: this.EditedAffectation.dateAffectation ? new Date(this.EditedAffectation.dateAffectation) : new Date()
  };

  console.log('Updating affectation:', affectationData);

  this.authservice.updateAff(affectationData).subscribe({
    next: (response: any) => {
      this.showNotification('success', 'Affectation modifiée avec succès !');
      this.closeAffectationEditModal();
      this.loadEquipements(this.currentPage); // Refresh the equipment list

      // Enregistrer dans l'historique manuellement
      const historique = new Historique();
      historique.date = new Date();

      const equipementNom = this.selectedEquipement.model?.nomModel
        ? `${this.selectedEquipement.model.nomModel} (N° Série: ${this.selectedEquipement.numSerie})`
        : 'Équipement inconnu';

      const utilisateurNom = this.EditedAffectation.user
        ? `${this.EditedAffectation.user.firstName || ''} ${this.EditedAffectation.user.lastName || ''}`.trim()
        : 'Utilisateur inconnu';

      const dateFormatted = new Date().toLocaleDateString('fr-FR');
      historique.commentaire = `${equipementNom} a été réaffecté à ${utilisateurNom} le ${dateFormatted}`;

      this.authservice.addHistorique(historique).subscribe({
        next: (response) => {
          console.log('Historique de réaffectation enregistré:', response);
        },
        error: (error) => {
          console.error('Erreur lors de l\'enregistrement de l\'historique de réaffectation:', error);
        }
      });
    },
    error: (error) => {
      console.error('Error updating affectation:', error);
      this.showNotification('error', 'Échec de la modification de l\'affectation');
    }
  });
}





  onRegister(): void {
  this.submitted = true;

console.log(this.form.value.model);
if (this.form.invalid) {
    this.form.markAllAsTouched(); // 🔥 Triggers all error messages
    return;
  }
const historique = new Historique();

  const equipementData = {
    ...this.form.value,
    statut: 'DISPONIBLE',
    fournisseur: this.form.value.fournisseurs || null
  };
console.log(equipementData);
  this.authservice.addEquipement(equipementData).subscribe({
    next: (response) => {
      historique.date = new Date();
      historique.commentaire = `Ajout d'un nouvel équipement: ${equipementData.model?.nomModel} (N° Série: ${equipementData.numSerie})`;
this.authservice.addHistorique(historique).subscribe({
        next: (response) => {
          console.log('Historique enregistré:', response);
        },
        error: (error) => {
          console.error('Erreur lors de l\'enregistrement de l\'historique:', error);
        }
      });
      console.log('User registered successfully', response);
      this.showNotification('success', 'Équipement ajouté avec succès');
      this.closeModal();
      this.loadEquipements(this.currentPage); // Refresh the equipment list
      //this.enregistrerHistorique(`Ajout d'un nouvel équipement: ${equipementData.model?.nomModel} (N° Série: ${equipementData.numSerie})`);
    },
    error: (error) => {
      console.error('Registration failed:', error);
      alert('Échec de l’enregistrement');
    }
  });
}


  imagePreview: string | ArrayBuffer | null = null;
selectedImage: File | null = null;

onImageSelected(event: Event): void {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file) {
    this.form.patchValue({ image: file });
    this.form.get('image')?.updateValueAndValidity();

    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
    };
    reader.readAsDataURL(file);
  }
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




  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.resetForm();
  }

  closeEditModal() {
    this.isEditModalOpen = false;
    this.editForm.reset();
    this.submitted = false;
  }

  closeOnOutsideClickEdit(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('modal')) {
      this.closeEditModal();
    }
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

  // Méthode pour réinitialiser le formulaire
  resetForm(): void {
    this.form.reset();
    // Réinitialiser avec le statut par défaut
    this.form.patchValue({
      statut: 'DISPONIBLE'
    });
    this.submitted = false;
    this.newEquipement = {
      idEqui: 0,
      numSerie: "",
      statut: "DISPONIBLE",
      image: "",
      model: null,
      dateAffectation: new Date(),
      description: "",
  fournisseur:null,
  pannes:null
    };
    this.newEquipement1 = {
      idEqui: 0,
      numSerie: "",
      statut: "DISPONIBLE",
      image: "",
      model: null,
      dateAffectation: new Date(),
      description: "",
  fournisseur:null,
  pannes:null
    };
  }

  // Méthodes pour l'affectation
  openAffectationModal(equipement: Equip) {
    this.selectedEquipement = equipement;
    // Définir automatiquement le statut comme DISPONIBLE
    this.selectedEquipement.statut = 'DISPONIBLE';
    this.isAffectationModalOpen = true;
    this.affectationFormSubmitted = false; // Reset submission state

    // Réinitialiser le formulaire d'affectation
    this.affectationForm.patchValue({
      utilisateur: null,
      equipement: this.selectedEquipement, // Définir l'équipement avec le statut DISPONIBLE
      commentaire: '',
      dateAffectation: new Date().toISOString().split('T')[0]
    });
  }


openEditedModal(equipement: Equip) {

  // Set the selected equipment for the modal
  this.selectedEquipement = equipement;
  this.editAffectationFormSubmitted = false; // Reset submission state

    this.isAffectationEditModalOpen = true;

}


  closeAffectationModal() {
    this.isAffectationModalOpen = false;

    this.affectationForm.reset();
  }


updateReaffication(equip: Equip) {
  this.editAffectationFormSubmitted = true;

  // Check if user is required and missing
  if (!this.EditedAffectation.user) {
    console.log('Form validation failed: User is required');
    return;
  }

  this.EditedAffectation.equipement = equip;
  this.EditedAffectation.verrou = 'affecter';

  this.authservice.updateAff(this.EditedAffectation)
    .subscribe({
      next: (data) => {
        console.log("Affectation mise à jour avec succès", data);
        this.showNotification('success', 'Affectation modifiée avec succès !');
        this.closeAffectationEditModal();
        this.loadEquipements(this.currentPage); // Refresh the equipment list
      },
      error: (error) => {
        console.error("Erreur lors de la mise à jour de l'affectation", error);
        this.showNotification('error', 'Échec de la modification de l\'affectation');
      }
    });
}


  closeAffectationEditModal() {
    this.isAffectationEditModalOpen = false;

    this.utilisateurCtrl.setValue(null);

    this.EditedAffectation = {
      id: 0,
      commentaire: "",
      dateAffectation: new Date(),
      user: new Utilisateur(),
      equipement: new Equip()
    };
  }

  closeOnOutsideClickAffectation(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('modal')) {
      this.closeAffectationModal();
    }
  }

  closeOnOutsideClickAffectationEdit(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('modal')) {
      this.closeAffectationEditModal();
    }
  }

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

}


