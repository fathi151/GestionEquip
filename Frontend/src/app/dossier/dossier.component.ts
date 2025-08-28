import { Component } from '@angular/core';
import { TypeService } from '../dashboard/type.service';
import { OnInit } from '@angular/core';

@Component({
  selector: 'app-dossier',
  templateUrl: './dossier.component.html',
  styleUrls: ['./dossier.component.css']
})
export class DossierComponent implements OnInit {
  dossiers: any[] = [];
  selectedDossier: any = null;
  loading = false;
  constructor(private typeService: TypeService) {}

  ngOnInit(): void {
    this.loadDossiers();
  }

  /**
   * Charge la liste des dossiers depuis le service.
   * Peut être appelée depuis un parent via ViewChild pour forcer le rafraîchissement.
   */
  loadDossiers() {
    this.loading = true;
    this.typeService.getDossiers().subscribe(res => { this.dossiers = res; this.loading = false; }, err => { this.loading = false; });
  }

  /** Méthode publique utilisable par les composants parents */
  refresh() {
    this.loadDossiers();
  }

  openDossier(d: any) {
    this.selectedDossier = null;
    this.typeService.getDossier(d.id).subscribe(res => { this.selectedDossier = res; }, err => { console.error(err); });
  }

  close() { this.selectedDossier = null; }

}
