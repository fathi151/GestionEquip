import { Component,OnInit, Type } from '@angular/core';
import { TypeService } from '../dashboard/type.service';
import { TypeEqui } from '../dashboard/TypeEqui';
import { HttpClient } from '@angular/common/http';
import { Marque } from './Marque';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import * as bootstrap from 'bootstrap';
// or for just Modal:
import { Modal } from 'bootstrap';

@Component({
  selector: 'app-marque',
  templateUrl: './marque.component.html',
  styleUrls: ['./marque.component.css']
})
export class MarqueComponent implements OnInit {

// Notification system
notification = {
  show: false,
  type: 'success', // 'success' or 'error'
  message: ''
};
  Types:TypeEqui[]=[];
    Marques:Marque[]=[];
  isModalOpen = false;
selectedTypeId: number | null = null;
form!: FormGroup;



constructor(private http: HttpClient,private authservice:TypeService,  private fb: FormBuilder){}
newMarque: Marque = {
  idMarque: 0,
  nomMarque: '',
  image: null,
  types: [] ,
  models: []
};
newMarque1: Marque = {
  idMarque: 0,
  nomMarque: '',
  image: null,
  types: [] ,
  models: []
};
  deleteMarque(id: number) {
    this.authservice.deleteMarque(id).subscribe(() => {
      this.Marques = this.Marques.filter(marque => marque.idMarque !== id);
    });
  }
  confirmDelete(MarqueId: number): void {
    console.log(MarqueId);
   this.showNotification('success', 'Type supprimé avec succès');
    
      this.deleteMarque(MarqueId);
      window.scrollTo({ top: 0, behavior: 'smooth' });
  
  }

ngOnInit(): void {
  this.GetALLTypes();
this.form = this.fb.group({
    nomMarque: ['', [Validators.required, Validators.minLength(2)]],
    types: [[], Validators.required],
    image: [null]
  });
  this.GetAllMarques();


}



  openModal1(Marque: Marque) {
    this.resetErrors();
    this.newMarque1 = { ...Marque };
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
    form.form.markAllAsTouched();
    return;
  }

  this.updateData(); // Appelle ta fonction de mise à jour existante
}
closeModal1() {
  const modalElement = document.getElementById('updateModal');
  if (modalElement) {
    const modal = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
    modal.hide();
  }
}

updateData() {


  // Transformer les types sélectionnés en tableau contenant uniquement les ID
  const dataToSend = {
    ...this.newMarque1,
    types: this.newMarque1.types.map(type => ({ idType: type.idType }))
  };

  console.log('Données mises à jour:', dataToSend);
  
  this.authservice.updateMarque(dataToSend).subscribe(
    (response) => {
      console.log('Update successful:', response);
      this.showNotification('success', 'Marque modifiée avec succès');
      this.closeModal1();
      this.GetAllMarques();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    (error) => {
      console.error('Update failed:', error);
      this.showNotification('error', 'Échec de la modification de la marque');
    }
  );
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

  closeOnOutsideClick(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('modal')) {
      this.closeModal();
    }
  }


  GetALLTypes(){
  this.authservice.getAllTypes().subscribe(data => {
  this.Types = data;
  console.log("Marques reçus : ", JSON.stringify(this.Marques, null, 2));
});

}
  signupErrors: any = {};
  resetErrors() {
    this.signupErrors = {};
  }
GetAllMarques()
{
  this.authservice.getAllMarques().subscribe(data => {
  this.Marques = data;
  console.log("Types reçus : ", JSON.stringify(this.Types, null, 2));
});


}
 validateSignup(): boolean {
    this.resetErrors();
    let isValid = true;


    if (!this.newMarque.nomMarque || this.newMarque.nomMarque.trim().length === 0) {
      this.signupErrors.nomMarque = 'Le nom de Marque est requis';
      isValid = false;
    } else if (this.newMarque.nomMarque.length < 2) {
      this.signupErrors.nomMarque = 'Le nom de marque doit contenir au moins 2 caractères au minimum';
      isValid = false;
    }

  

    

    return isValid;
  }
  onRegister(): void {
if (this.form.invalid) {
    this.form.markAllAsTouched(); // Pour forcer l'affichage des erreurs
    return;
  }



  this.authservice.addMarque(this.form.value).subscribe({
    next: (response) => {
      console.log('User registered successfully', response);
      this.showNotification('success', 'Marque ajoutée avec succès');
      this.Marques.push(response);
      this.closeModal();
    },
    error: (error) => {
      console.error('Registration failed:', error);
      alert('Échec de l’enregistrement');
    }
  });
}


onFileSelected(event: any) {
  const file = event.target.files[0];

  if (file) {
    const formData = new FormData();
    formData.append('file', file);

    this.http.post<any>('http://localhost:8085/images', formData).subscribe(
      (response) => {
        if (response && response.imageUrl) {
          const fullUrl = `http://localhost:8085${response.imageUrl}`;
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


}
