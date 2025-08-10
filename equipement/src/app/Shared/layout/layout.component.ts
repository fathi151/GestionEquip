import { Component, OnInit } from '@angular/core';
import { UtilisateurService } from 'src/app/utilisateur/utilisateur.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {
  navbarVisible: boolean = true;

  constructor(private utilisateurService: UtilisateurService) { }

  ngOnInit(): void {


  this.utilisateurService.currentUser$.subscribe(user => {
      if (!user) {
        this.utilisateurService.logout();
      }
    });
  }



}


