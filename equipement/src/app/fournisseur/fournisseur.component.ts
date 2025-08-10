import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { TypeService } from '../dashboard/type.service';
import { Fournisseur } from './Fournisseur';
import { Observable } from 'rxjs';
import { FormBuilder, FormGroup,Validators } from '@angular/forms';

@Component({
  selector: 'app-fournisseur',
  templateUrl: './fournisseur.component.html',
  styleUrls: ['./fournisseur.component.css']
})
export class FournisseurComponent implements OnInit {



constructor(private http: HttpClient,private authservice:TypeService,  private fb: FormBuilder) { }

fournisseurs:Fournisseur[]=[];
isModalOpen = false;
fournisseurForm!:FormGroup
submitted = false;
fournisseur1:Fournisseur={
  idFournisseur: 0,
  nomFournisseur: '',
  adresseFournisseur: '',
  emailFournisseur: '',
  telephoneFournisseur: '',
  equipements:[]
}

// Notification system
notification = {
  show: false,
  type: 'success', // 'success' or 'error'
  message: ''
};
ngOnInit(): void {
  
this.fournisseurForm = this.fb.group({
  nomFournisseur: ['', [Validators.required, Validators.minLength(3)]],
  adresseFournisseur: ['', [Validators.required, Validators.minLength(4)]],
  emailFournisseur: ['', [Validators.required, Validators.email]],
  telephoneFournisseur: ['', [Validators.required, Validators.minLength(8)]],
});

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
    this.resetForm();
  }

  showNotification(type: 'success' | 'error', message: string) {
    this.notification = {
      show: true,
      type: type,
      message: message
    };

    setTimeout(() => {
      this.hideNotification();
    }, 2000);
  }

  hideNotification() {
    this.notification.show = false;
  }



  onRegister(): void {
  this.submitted = true;
  
  if (this.fournisseurForm.invalid) {
    this.fournisseurForm.markAllAsTouched(); // pour afficher les erreurs
    return; // empêche la soumission si formulaire invalide
  }

 
  this.authservice.addFournisseur(this.fournisseurForm.value).subscribe({
    next: (response) => {
      console.log('User registered successfully', response);
      this.showNotification('success', 'Fournisseur ajouté avec succès !');
      this.fournisseurs.push(response);
      this.closeModal();
      this.fournisseurForm.reset();
      this.submitted = false;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    error: (error) => {
      console.error('Registration failed:', error);
      alert('Échec de l’enregistrement');
    }
  });
}



GetAllFournisseur() {


  return this.authservice.getallFournisseur().subscribe(data => {
    this.fournisseurs = data;
    console.log("Types reçus : ", JSON.stringify(this.fournisseurs, null, 2));

  });

}

// Méthode pour supprimer un fournisseur
deleteFournisseur(id: number) {
  if (confirm('Êtes-vous sûr de vouloir supprimer ce fournisseur ?')) {
    // Supposons que le service a une méthode deleteFournisseur
    // Si elle n'existe pas, vous devrez l'ajouter au service
    this.authservice.deleteFournisseur(id).subscribe({
      next: () => {
        this.showNotification('success', 'Fournisseur supprimé avec succès !');
        this.fournisseurs = this.fournisseurs.filter(f => f.idFournisseur !== id);
      },
      error: (error: any) => {
        console.error('Delete failed:', error);
        this.showNotification('error', 'Échec de la suppression du fournisseur.');
      }
    });
  }
}


updateFournisseur(fournisseur: Fournisseur) {

  this.fournisseur1 = { ...fournisseur };

  this.fournisseurForm.patchValue({
    nomFournisseur: fournisseur.nomFournisseur,
    adresseFournisseur: fournisseur.adresseFournisseur,
    emailFournisseur: fournisseur.emailFournisseur,
    telephoneFournisseur: fournisseur.telephoneFournisseur
  });

  this.openModal();
}

// Method for handling template-driven form update
onUpdateClick(form: any) {
  if (form.valid) {
    const updatedFournisseur = {
      ...this.fournisseur1
    };

    this.authservice.updateFournisseur(updatedFournisseur).subscribe({
      next: (response: any) => {
        console.log('Fournisseur updated successfully', response);
        this.showNotification('success', 'Fournisseur modifié avec succès !');


        const index = this.fournisseurs.findIndex(f => f.idFournisseur === this.fournisseur1.idFournisseur);
        if (index !== -1) {
          this.fournisseurs[index] = response;
        }

        // Close the update modal (you might need to add a separate flag for this)
        this.closeModal();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      error: (error) => {
        console.error('Update failed:', error);
        this.showNotification('error', 'Échec de la modification du fournisseur.');
      }
    });
  } else {
    console.log('Form is invalid');
  }
}

// Method to handle form submission for both add and update
onSubmit(): void {
  this.submitted = true;

  if (this.fournisseurForm.invalid) {
    this.fournisseurForm.markAllAsTouched();
    return;
  }

  if (this.fournisseur1.idFournisseur === 0) {
    // Add new fournisseur
    this.onRegister();
  } else {
    // Update existing fournisseur
    const updatedFournisseur = {
      ...this.fournisseur1,
      ...this.fournisseurForm.value
    };

    this.authservice.updateFournisseur(updatedFournisseur).subscribe({
      next: (response: any) => {
        console.log('Fournisseur updated successfully', response);
        this.showNotification('success', 'Fournisseur modifié avec succès !');

        // Update the fournisseur in the local array
        const index = this.fournisseurs.findIndex(f => f.idFournisseur === this.fournisseur1.idFournisseur);
        if (index !== -1) {
          this.fournisseurs[index] = response;
        }

        this.closeModal();
        this.resetForm();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      error: (error) => {
        console.error('Update failed:', error);
        this.showNotification('error', 'Échec de la modification du fournisseur.');
      }
    });
  }
}

// Reset form and fournisseur1 object
resetForm(): void {
  this.fournisseurForm.reset();
  this.submitted = false;
  this.fournisseur1 = {
    idFournisseur: 0,
    nomFournisseur: '',
    adresseFournisseur: '',
    emailFournisseur: '',
    telephoneFournisseur: '',
    equipements: []
  };
}

}