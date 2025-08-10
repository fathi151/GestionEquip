import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UtilisateurComponent } from './utilisateur/utilisateur.component';
import { MotpasseComponent } from './motpasse/motpasse.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { MarqueComponent } from './marque/marque.component';
import { ModelComponent } from './model/model.component';
import { EquipementComponent } from './equipement/equipement.component';
import { FournisseurComponent } from './fournisseur/fournisseur.component';
import { UtilisateurEquipementComponent } from './utilisateur-equipement/utilisateur-equipement.component';
import { AffectaComponent } from './affecta/affecta.component';
import { AgentComponent } from './agent/agent.component';
import { HistoriqueComponent } from './historique/historique.component';
import { UserRegistrationComponent } from './user-registration/user-registration.component';
import { EquipementsComponent } from './DSI/equipements/equipements.component';
import { EquipDaGComponent } from './DAG/equip-da-g/equip-da-g.component';
import { JuridiqueEquiComponent } from './Juridique/juridique-equi/juridique-equi.component';
import { EtatComponent } from './etat/etat.component';

const routes: Routes = [
  {path:'dashboard',component:DashboardComponent},
  {path:'marque',component:MarqueComponent},
  {path:'model',component:ModelComponent},
  {path:'utilisateur',component:UtilisateurComponent},
  {path:'equipement',component:EquipementComponent},
  {path:'fournisseur',component:FournisseurComponent},
  {path:'utilisateur-equipement',component:UtilisateurEquipementComponent},
  {path:'motpasseoublie',component:MotpasseComponent},
  {path:'affecta',component:AffectaComponent},
  {path:'agent',component:AgentComponent},
  {path:'historique',component:HistoriqueComponent},
  {path:'user-registration',component:UserRegistrationComponent},
  {path:'equipementDSI',component:EquipementsComponent},
  {path:'reset-password', component:ResetPasswordComponent},
    {path:'DAGEquip', component:EquipDaGComponent},
    {path:'juridiqueEquip', component:JuridiqueEquiComponent},
        {path:'etat', component:EtatComponent},

  {path:'', redirectTo:'/dashboard', pathMatch:'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
