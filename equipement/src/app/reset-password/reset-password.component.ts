import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilisateurService } from '../utilisateur/utilisateur.service';
 // Assuming you have the AuthService to handle password reset

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})

export class ResetPasswordComponent implements OnInit {
  token: string | null = null;
  newPassword: string = '';
  confirmPassword: string = '';
  message: string = '';

  constructor(private route: ActivatedRoute, private authService:UtilisateurService, private router: Router) { }

  ngOnInit(): void {
    // Get the token from the query parameter
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
    });
  }

  // Method to reset the password
  onSubmit() {
    if (!this.token) {
      this.message = 'Invalid reset link!';
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.message = 'Passwords do not match.';
      return;
    }

    this.authService.resetPassword(this.token, this.newPassword).subscribe({
      next: (response) => {
        this.message = "Password has been reset successfully!";
        console.log('Success:', response);
        this.router.navigate(['/login']);  // Redirect to login page after successful reset
      },
      error: (err) => {
        this.message = "Error: " + (err.error?.message || err.message || 'Unknown error');
        console.error('Error:', err);
      }
    });
  }
}
