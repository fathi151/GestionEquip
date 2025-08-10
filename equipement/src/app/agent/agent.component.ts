import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UtilisateurService } from '../utilisateur/utilisateur.service';
import { Agent, Utilisateur } from '../utilisateur/Utilisateur';

@Component({
  selector: 'app-agent',
  templateUrl: './agent.component.html',
  styleUrls: ['./agent.component.css']
})
export class AgentComponent implements OnInit {

constructor( private authservice:UtilisateurService,http:HttpClientModule,private fb: FormBuilder) { }

AgentForm!: FormGroup;
isModalOpen = false;
submitted = false;
utilisateur1: Utilisateur[] = [];
agents: Agent[] = [];

// Système de notification
notification = {
  show: false,
  message: ''
};

  ngOnInit(): void {

this.AgentForm=this.fb.group(


  {
    email: ['', [Validators.required, Validators.minLength(3)]],

    gender: ['', [Validators.required]],
    phoneNumber: ['', [Validators.required, Validators.minLength(8)]],
    user: ['', [Validators.required]],
    username: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', [Validators.required, Validators.minLength(3)]],
    role: ['', [Validators.required]],
  })


  this.getUsers();
  this.getAgents();
}

  closeOnOutsideClick(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('modal')) {
      this.closeModal();
    }
  }


  getUsers()
  {
this.authservice.getUtilisateur().subscribe(data => {
  this.utilisateur1 = data;

});}
getAgents()
{
this.authservice.getAgents().subscribe(data => {
  this.agents = data;

  console.log("Agents reçus : ", JSON.stringify(this.agents, null, 2));

});
}


  onSubmit(): void {
  this.submitted = true;


if
 (this.AgentForm.invalid) {

    this.AgentForm.markAllAsTouched(); // 🔥 Triggers all error messages
    return;
  }


  // Préparer les données avec une liste de fournisseurs initialisée


  this.authservice.register(this.AgentForm.value).subscribe({
    next: (response) => {
      console.log('Réponse du serveur:', response);
      console.log('Type de réponse:', typeof response);
      console.log('Données du formulaire:', this.AgentForm.value);

      // Si le serveur retourne l'agent complet, l'utiliser
      // Sinon, utiliser les données du formulaire avec un ID temporaire
      if (response && response.firstName) {
        // Le serveur retourne l'agent complet
        this.agents.push(response);
      } else {
        // Le serveur retourne juste un ID ou message, utiliser les données du formulaire
        const newAgent = {
          ...this.AgentForm.value,
          id: response.id || Date.now() // Utiliser l'ID du serveur ou un ID temporaire
        };
        this.agents.push(newAgent);
      }

      // Afficher la notification de succès
      this.showNotification('Agent ajouté avec succès !');

      this.closeModal();

      // Alternative: recharger la liste depuis le serveur
      // this.loadAgents();
    },
    error: (error) => {
      console.error('Registration failed:', error);
      alert('Échec de l’enregistrement');
    }
  });
}


  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  // Méthodes pour les notifications
  showNotification(message: string) {
    this.notification = {
      show: true,
      message: message
    };

    // Auto-hide après 3 secondes
    setTimeout(() => {
      this.hideNotification();
    }, 3000);
  }

  hideNotification() {
    this.notification.show = false;
  }

}
