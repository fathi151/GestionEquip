import { Component,OnInit } from '@angular/core';
import { UtilisateurService } from '../utilisateur/utilisateur.service';

@Component({
  selector: 'app-motpasse',
  templateUrl: './motpasse.component.html',
  styleUrls: ['./motpasse.component.css']
})
export class MotpasseComponent implements OnInit {
email: string = '';
message:string='';

constructor(private authService:UtilisateurService){}
  ngOnInit(): void {
    





  }


    onForgotPassword() {
    console.log('Reset email:', this.email);

    this.authService.forgotPassword(this.email).subscribe({
      next: (response) => {
        console.log('Response received:', response);
        this.message = "Email de réinitialisation envoyé !";
      },
      error: (err) => {
        console.error('Error received:', err);
        this.message = "Erreur : " + (err.error?.message || err.message || 'Unknown error');
      }
    });
  }

}
