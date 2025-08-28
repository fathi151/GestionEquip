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
  // UI label filter: 'all' | 'inprogress' | 'terminated'
  selectedLabel: 'all' | 'inprogress' | 'terminated' = 'all';
  // track updating pannes to disable validate button while request in-flight
  updatingPannes: Set<number> = new Set<number>();
  // track which panne is currently selected in the panel so we can auto-validate when moving
  selectedPanneId: number | null = null;
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

  // Set active label to filter displayed dossiers
  setLabel(label: 'all' | 'inprogress' | 'terminated') {
    this.selectedLabel = label;
  }

  // Returns true when dossier has any in-progress panne
  isDossierInProgress(d: any): boolean {
    return this.countInProgress(d) > 0;
  }

  // Return dossiers filtered by the active label
  getFilteredDossiers(): any[] {
    if (!this.dossiers) return [];
    if (this.selectedLabel === 'all') return this.dossiers;
    if (this.selectedLabel === 'inprogress') return this.dossiers.filter(d => this.isDossierInProgress(d));
    // terminated: those with no in-progress pannes
    return this.dossiers.filter(d => !this.isDossierInProgress(d));
  }

  // Totals for label buttons
  countDossiersInProgress(): number {
    if (!this.dossiers) return 0;
    return this.dossiers.reduce((acc: number, d: any) => acc + (this.countInProgress(d) > 0 ? 1 : 0), 0);
  }

  countDossiersTerminated(): number {
    if (!this.dossiers) return 0;
    return this.dossiers.reduce((acc: number, d: any) => acc + (this.countInProgress(d) === 0 ? 1 : 0), 0);
  }

  // Count pannes not finished (end falsy -> in progress)
  countInProgress(d: any): number {
    if (!d || !d.pannes) return 0;
    return d.pannes.filter((p: any) => !p.end || p.end === 0).length;
  }

  // Count pannes finished (end truthy -> terminated)
  countTerminated(d: any): number {
    if (!d || !d.pannes) return 0;
    return d.pannes.filter((p: any) => !!p.end && p.end !== 0).length;
  }

  // Validate (mark finished) a panne and refresh both the selected dossier and the list
  validatePanne(p: any) {
    if (!p || !p.id) return;
    // optimistic UI update
    const prevEnd = p.end;
    p.end = 1;
    this.updatingPannes.add(p.id);

    // also update the dossier list copy so badges/counts update instantly
    for (const d of this.dossiers) {
      if (!d.pannes) continue;
      const found = d.pannes.find((pp: any) => pp.id === p.id);
      if (found) found.end = 1;
    }

    // also update the currently opened dossier's panne (if any) so the panel updates immediately
    if (this.selectedDossier && this.selectedDossier.pannes) {
      const sel = this.selectedDossier.pannes.find((pp: any) => pp.id === p.id);
      if (sel) sel.end = 1;
      // reassign to trigger change detection
      this.selectedDossier = { ...this.selectedDossier, pannes: [...this.selectedDossier.pannes] };
    }

    // reassign dossiers array to trigger change detection for the list/badges
    this.dossiers = [...this.dossiers];

    // ensure list UI recomputes counts now (still call to refresh from server)
    this.loadDossiers();

    this.typeService.updatePanne(p.id).subscribe({
      next: () => {
        // On success, refresh server state to be sure everything is consistent
        if (this.selectedDossier && this.selectedDossier.id) {
          const optimisticId = p.id;
          this.typeService.getDossier(this.selectedDossier.id).subscribe(res => {
            // merge optimistic state for the updated panne into the fetched result
            if (res && res.pannes) {
              for (const op of res.pannes) {
                if (op.id === optimisticId) {
                  op.end = 1; // ensure UI shows finished
                }
              }
            }
            // assign a fresh object so template picks up changes immediately
            this.selectedDossier = { ...res, pannes: res.pannes ? [...res.pannes] : [] };
            // keep selection on the next unresolved step if any
            const next = this.selectedDossier.pannes?.find((pp: any) => !pp.end || pp.end === 0);
            this.selectedPanneId = next ? next.id : null;
            // refresh list view
            this.loadDossiers();
            this.updatingPannes.delete(p.id);
          }, err => {
            console.error('Erreur rechargement dossier après validation', err);
            this.updatingPannes.delete(p.id);
            this.loadDossiers();
          });
        } else {
          this.loadDossiers();
          this.updatingPannes.delete(p.id);
        }
      },
      error: (err) => {
        console.error('Erreur validation panne', err);
        // revert optimistic update on failure
        p.end = prevEnd;
        for (const d of this.dossiers) {
          if (!d.pannes) continue;
          const found = d.pannes.find((pp: any) => pp.id === p.id);
          if (found) found.end = prevEnd;
        }
        // revert selectedDossier copy if present
        if (this.selectedDossier && this.selectedDossier.pannes) {
          const sel = this.selectedDossier.pannes.find((pp: any) => pp.id === p.id);
          if (sel) sel.end = prevEnd;
          this.selectedDossier = { ...this.selectedDossier, pannes: [...this.selectedDossier.pannes] };
        }
        this.dossiers = [...this.dossiers];
        this.updatingPannes.delete(p.id);
      }
    });
  }

  // select a panne in the panel; when moving from one panne to another we auto-validate the previous in-progress step
  selectPanne(p: any) {
    if (!p || !p.id) return;
    const prevId = this.selectedPanneId;
    if (prevId && prevId !== p.id && this.selectedDossier) {
      const prevP = this.selectedDossier.pannes?.find((pp: any) => pp.id === prevId);
      if (prevP && (!prevP.end || prevP.end === 0)) {
        // automatically validate previous step
        this.validatePanne(prevP);
      }
    }
    this.selectedPanneId = p.id;
  }

  openDossier(d: any) {
    this.selectedDossier = null;
    this.typeService.getDossier(d.id).subscribe(res => {
      this.selectedDossier = res;
      // auto-select the first in-progress panne (if any)
      const firstInProgress = res.pannes?.find((pp: any) => !pp.end || pp.end === 0);
      this.selectedPanneId = firstInProgress ? firstInProgress.id : null;
    }, err => { console.error(err); });
  }

  close() { this.selectedDossier = null; this.selectedPanneId = null; }

}
