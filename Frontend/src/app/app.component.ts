import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UtilisateurService } from './utilisateur/utilisateur.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'conseil';

  constructor(
    private utilisateurService: UtilisateurService,
    private router: Router
  ) {}

  ngOnInit() {
    // Simplified: Only redirect to login if not authenticated and trying to access protected routes
    if (!this.utilisateurService.isAuthenticated()) {
      const currentUrl = this.router.url;
      const publicRoutes = ['/utilisateur', '/motpasseoublie', '/reset-password', '/user-registration'];

      // Only redirect to login if not on a public route
      if (!publicRoutes.includes(currentUrl)) {
        console.log('User not authenticated, redirecting to login');
        this.router.navigate(['/utilisateur']);
      }
    } else {
      console.log('User is authenticated, allowing navigation to:', this.router.url);
    }
  }
}
