import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UtilisateurComponent } from './utilisateur/utilisateur.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MotpasseComponent } from './motpasse/motpasse.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { WebcamModule } from 'ngx-webcam';
import { MarqueComponent } from './marque/marque.component';
import { ModelComponent } from './model/model.component';
import { EquipementComponent } from './equipement/equipement.component';
import { FournisseurComponent } from './fournisseur/fournisseur.component';
import { UtilisateurEquipementComponent } from './utilisateur-equipement/utilisateur-equipement.component';
import { AffectaComponent } from './affecta/affecta.component';
import { NavebarComponent } from './navebar/navebar.component';

import { AgentComponent } from './agent/agent.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Angular Material imports
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatOptionModule } from '@angular/material/core';
import { HistoriqueComponent } from './historique/historique.component';
import { UserRegistrationComponent } from './user-registration/user-registration.component';

import { LayoutComponent } from './Shared/layout/layout.component';
import { EquipDaGComponent } from './DAG/equip-da-g/equip-da-g.component';
import { JuridiqueEquiComponent } from './Juridique/juridique-equi/juridique-equi.component';
import { EtatComponent } from './etat/etat.component';
import { EquipementsComponent } from './DSI/equipements/equipements.component';
import { DossierComponent } from './dossier/dossier.component';



@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    UtilisateurComponent,
    MotpasseComponent,
    ResetPasswordComponent,
    MarqueComponent,
    ModelComponent,
    EquipementComponent,
    FournisseurComponent,
    UtilisateurEquipementComponent,
    AffectaComponent,
    NavebarComponent,
    HistoriqueComponent,
    AgentComponent,
    UserRegistrationComponent,
    
    LayoutComponent,
    EquipDaGComponent,
    JuridiqueEquiComponent,
    EtatComponent,

    EquipementsComponent,
  DossierComponent,


  
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    WebcamModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatOptionModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }