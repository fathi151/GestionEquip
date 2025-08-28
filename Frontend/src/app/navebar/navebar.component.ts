import { Component, OnInit } from '@angular/core';
import { NavigationItem, UtilisateurService } from '../utilisateur/utilisateur.service';

@Component({
  selector: 'app-navebar',
  templateUrl: './navebar.component.html',
  styleUrls: ['./navebar.component.css']
})
export class NavebarComponent implements OnInit {
  constructor(private utilisateurService: UtilisateurService) { }

  navigationItems: NavigationItem[] = [];


  ngOnInit(): void {
  this.utilisateurService.currentUser$.subscribe(user => {
      if (user) {
        this.navigationItems = this.utilisateurService.getNavigationItems(user.role);
      }
    });
}

  logout(): void {
    console.log('Sidebar logout clicked');
    this.utilisateurService.logout();
  }

}
