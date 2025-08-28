import { Component, OnInit } from '@angular/core';
import { EtatService } from './etat.service';
import { EtatEqui } from './Etat';

@Component({
  selector: 'app-etat',
  templateUrl: './etat.component.html',
  styleUrls: ['./etat.component.css']
})
export class EtatComponent implements OnInit {
  etats: EtatEqui[] = [];
  currentEtat: EtatEqui = new EtatEqui();
  editingEtat: EtatEqui | null = null;
  isModalOpen: boolean = false;
  searchText: string = '';
  notification = { show: false, message: '', type: '' };
  isLoading: boolean = false;
  userRole: string | null = null;
  // Workflow creation state
  showWorkflowModal: boolean = false;
  workflowSteps: Array<{ titre: string; responsable: string; id?: number }> = [];
  isEditingProcess: boolean = false;
  editingProcessOriginalIds: number[] = [];
  workflowSubmitting: boolean = false;
  editingProcessSubmitting: boolean = false;

  constructor(private etatService: EtatService) {}

  ngOnInit(): void {
    this.loadEtats();
  }

  // Utility sleep
  sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Load all etats
  loadEtats() {
    this.etatService.getEtatList().subscribe((data: EtatEqui[]) => {
      this.etats = data || [];
    }, (err) => {
      console.error('Failed to load etats', err);
    });
  }

  openWorkflowModal() {
    this.showWorkflowModal = true;
    this.workflowSteps = [{ titre: '', responsable: '' }];
    this.isEditingProcess = false;
    this.editingProcessOriginalIds = [];
  }

  closeWorkflowModal() {
    this.showWorkflowModal = false;
    this.workflowSteps = [];
    this.isEditingProcess = false;
    this.editingProcessOriginalIds = [];
    this.workflowSubmitting = false;
    this.editingProcessSubmitting = false;
  }

  openEditProcess(sequence: EtatEqui[]) {
    this.showWorkflowModal = true;
    this.isEditingProcess = true;
    this.workflowSteps = sequence.map(s => ({ titre: s.titre, responsable: s.responsable, id: (s as any).id }));
    this.editingProcessOriginalIds = sequence.map(s => (s as any).id).filter(id => id != null);
  }

  // Destructive replace strategy: delete the old process first, then recreate the edited sequence.
  async submitProcessEdit() {
    if (this.workflowSteps.length === 0) return;

    for (let i = 0; i < this.workflowSteps.length; i++) {
      const s = this.workflowSteps[i] as any;
      if (!s.titre || !s.responsable) {
        this.showNotification('Veuillez remplir tous les champs du processus', 'error');
        return;
      }
    }

    if (!this.editingProcessOriginalIds || this.editingProcessOriginalIds.length === 0) {
      // fallback: if we don't have originals, treat as normal create
      await this.submitWorkflow();
      return;
    }

    this.editingProcessSubmitting = true;
    try {
      // Step A: delete original process states (reverse order)
      const originals = [...this.editingProcessOriginalIds].filter(id => id != null).sort((a, b) => b - a);
      for (const id of originals) {
        let attempts = 0;
        let deleted = false;
        while (attempts < 3 && !deleted) {
          attempts++;
          try {
            await new Promise((resolve, reject) => {
              this.etatService.deleteEtat(id).subscribe({ next: () => resolve(null), error: (e) => reject(e) });
            });
            deleted = true;
            await this.sleep(120);
            this.loadEtats();
            await this.sleep(80);
          } catch (err) {
            await this.sleep(150);
            this.loadEtats();
            await this.sleep(120);
          }
        }
        if (!deleted) {
          this.showNotification('Impossible de supprimer complètement l\'ancien processus. Abandon.', 'error');
          this.editingProcessSubmitting = false;
          return;
        }
      }

      // Step B: create new sequence from workflowSteps sequentially (link precedents)
      let previousCreatedId: number | null = null;
      for (const step of this.workflowSteps as any[]) {
        const payload: any = { titre: step.titre, responsable: step.responsable };
        if (previousCreatedId) payload.precedent = { id: previousCreatedId };

        const created: any = await new Promise((resolve, reject) => {
          this.etatService.createEtat(payload).subscribe({ next: (res: any) => resolve(res), error: (e) => reject(e) });
        });

        const createdId = (created && created.id) ? created.id : (created as any);
        previousCreatedId = createdId;
        // small pause and refresh
        await this.sleep(120);
        this.loadEtats();
        await this.sleep(60);
      }

      this.showNotification('Processus remplacé avec succès', 'success');
      this.closeWorkflowModal();
      this.loadEtats();
    } catch (err: any) {
      console.error('Erreur lors de la substitution du processus:', err);
      this.showNotification('Erreur lors de la substitution du processus', 'error');
    } finally {
      this.editingProcessSubmitting = false;
      this.isEditingProcess = false;
      this.editingProcessOriginalIds = [];
    }
  }

  // Submit all steps sequentially; link precedent of step i+1 to created step i
  async submitWorkflow() {
    if (this.workflowSteps.length === 0) return;
    // basic validation
    for (let i = 0; i < this.workflowSteps.length; i++) {
      const s = this.workflowSteps[i];
      if (!s.titre || !s.responsable) {
        this.showNotification('Veuillez remplir tous les champs du workflow', 'error');
        return;
      }
    }

    this.workflowSubmitting = true;
    try {
      let previousCreated: any = null;
      for (const step of this.workflowSteps) {
        const payload: any = {
          titre: step.titre,
          responsable: step.responsable
        };

        if (previousCreated && previousCreated.id) {
          // set precedent as an object with id (backend should accept it)
          payload.precedent = { id: previousCreated.id };
        }

        // create Etat via service and await the response
        // createEtat returns Observable; convert to Promise via toPromise-like via firstValueFrom would be ideal,
        // but to avoid new imports we use subscribe-wrapped Promise
        const created = await new Promise<any>((resolve, reject) => {
          this.etatService.createEtat(payload).subscribe({
            next: (res: any) => resolve(res),
            error: (err: any) => reject(err)
          });
        });

        previousCreated = created;
      }

      this.showNotification('Workflow créé avec succès', 'success');
      this.closeWorkflowModal();
      this.loadEtats();
    } catch (err: any) {
      console.error('Erreur lors de la création du workflow:', err);
      this.showNotification('Erreur lors de la création du workflow', 'error');
    } finally {
      this.workflowSubmitting = false;
    }
  }

  // Delete an entire process (sequence) by deleting each Etat in it sequentially
  async deleteProcess(sequence: EtatEqui[]) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce processus et tous ses états ? Cette action est irréversible.')) return;

    this.isLoading = true;
    // delete from end to start to avoid foreign-key / precedent reference issues
    for (let i = sequence.length - 1; i >= 0; i--) {
      const etat = sequence[i];
      const id = (etat as any).id;
      if (id == null) continue;
      try {
        await new Promise((resolve, reject) => {
          this.etatService.deleteEtat(id).subscribe({ next: () => resolve(null), error: (e) => reject(e) });
        });
      } catch (err: any) {
        console.error('Error deleting etat in process deletion', err);
        let errorMessage = 'Erreur lors de la suppression du processus';
        if (err.status === 403) errorMessage = 'Vous n\'avez pas les permissions pour supprimer cet état';
        this.showNotification(errorMessage, 'error');
        this.isLoading = false;
        return;
      }
    }

    this.showNotification('Processus supprimé avec succès', 'success');
    this.loadEtats();
    this.isLoading = false;
  }

  addWorkflowStep() {
    this.workflowSteps.push({ titre: '', responsable: '' });
  }

  removeWorkflowStep(index: number) {
    if (this.workflowSteps.length > 1) this.workflowSteps.splice(index, 1);
  }

  // Insert a new step after the given index (so it appears between steps)
  insertWorkflowStep(index: number) {
    const insertAt = Math.max(0, Math.min(index + 1, this.workflowSteps.length));
    this.workflowSteps.splice(insertAt, 0, { titre: '', responsable: '' });
  }

  closeModal() {
    this.isModalOpen = false;
    this.editingEtat = null;
    this.currentEtat = new EtatEqui();
  }

  openModal() {
    this.editingEtat = null;
    this.currentEtat = new EtatEqui();
    this.isModalOpen = true;
  }

  onSubmit() {
    if (this.editingEtat) {
      this.updateEtat();
    } else {
      this.createEtat();
    }
  }

  createEtat() {
    if (!this.currentEtat.titre || !this.currentEtat.responsable) {
      this.showNotification('Veuillez remplir tous les champs obligatoires', 'error');
      return;
    }

    this.isLoading = true;
    this.etatService.createEtat(this.currentEtat).subscribe(
      () => {
        this.loadEtats();
        this.closeModal();

        this.isLoading = false;
      },
      error => {
        console.error('Error creating etat:', error);

        this.isLoading = false;
      }
    );
  }

  editEtat(etat: EtatEqui) {
    this.editingEtat = { ...etat };
    this.currentEtat = { ...etat };
    this.isModalOpen = true;
  }

  updateEtat() {
    if (!this.currentEtat.titre || !this.currentEtat.responsable) {

      return;
    }

    if (this.editingEtat && this.editingEtat.id) {
      this.isLoading = true;
      this.etatService.updateEtat(this.editingEtat.id, this.currentEtat).subscribe(
        () => {
          this.loadEtats();
          this.closeModal();

          this.isLoading = false;
        },
        error => {
          console.error('Error updating etat:', error);

          this.isLoading = false;
        }
      );
    }
  }

  deleteEtat(id: number) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet état ? Cette action est irréversible.')) {
      this.isLoading = true;
      this.etatService.deleteEtat(id).subscribe(
        (response: any) => {
          this.loadEtats();
          this.showNotification('État supprimé avec succès', 'success');
          this.isLoading = false;
        },
        error => {
          console.error('Error deleting etat:', error);
          let errorMessage = 'Erreur lors de la suppression de l\'état';
          if (error.status === 403) {
            errorMessage = 'Vous n\'avez pas les permissions pour supprimer cet état';
          } else if (error.status === 404) {
            errorMessage = 'État non trouvé';
          } else if (error.status === 409) {
            errorMessage = 'Impossible de supprimer cet état car il est utilisé par d\'autres éléments';
          } else if (error.error && typeof error.error === 'string') {
            errorMessage = error.error;
          }
          this.showNotification(errorMessage, 'error');
          this.isLoading = false;
        }
      );
    }
  }

  showNotification(message: string, type: string) {
    this.notification = {
      show: true,
      message,
      type
    };
    setTimeout(() => {
      this.notification.show = false;
    }, 5000);
  }

  filterEtats() {
    if (!this.searchText) return this.etats;
    return this.etats.filter(etat =>
      etat.titre.toLowerCase().includes(this.searchText.toLowerCase()) ||
      etat.responsable.toLowerCase().includes(this.searchText.toLowerCase()) ||
      (etat.precedent?.titre && etat.precedent.titre.toLowerCase().includes(this.searchText.toLowerCase()))
    );
  }

  // Nouvelle méthode pour regrouper les états par séquences
  getGroupedEtats() {
    const filteredEtats = this.filterEtats();
    const sequences: EtatEqui[][] = [];
    const processedIds = new Set<number>();

    // Fonction pour construire une séquence à partir d'un état de départ
    const buildSequence = (startEtat: EtatEqui): EtatEqui[] => {
      const sequence: EtatEqui[] = [];
      let currentEtat: EtatEqui | null = startEtat;

      // Remonter au début de la séquence
      while (currentEtat && currentEtat.precedent && filteredEtats.find(e => e.id === currentEtat!.precedent?.id)) {
        const precedent = filteredEtats.find(e => e.id === currentEtat!.precedent?.id);
        if (precedent && !processedIds.has(precedent.id)) {
          currentEtat = precedent;
        } else {
          break;
        }
      }

      // Construire la séquence vers l'avant
      while (currentEtat) {
        if (!processedIds.has(currentEtat.id)) {
          sequence.push(currentEtat);
          processedIds.add(currentEtat.id);
        }

        // Trouver le suivant
        const suivant = filteredEtats.find(e => e.precedent?.id === currentEtat!.id);
        currentEtat = suivant || null;
      }

      return sequence;
    };

    // Traiter tous les états
    for (const etat of filteredEtats) {
      if (!processedIds.has(etat.id)) {
        const sequence = buildSequence(etat);
        if (sequence.length > 0) {
          sequences.push(sequence);
        }
      }
    }

    // Trier les séquences : d'abord celles qui commencent sans précédent
    sequences.sort((a, b) => {
      const aStartsWithoutPrecedent = !a[0].precedent;
      const bStartsWithoutPrecedent = !b[0].precedent;

      if (aStartsWithoutPrecedent && !bStartsWithoutPrecedent) return -1;
      if (!aStartsWithoutPrecedent && bStartsWithoutPrecedent) return 1;

      // Ensuite par titre du premier état
      return a[0].titre.localeCompare(b[0].titre);
    });

    return sequences;
  }

  // Validation methods
  isFormValid(): boolean {
    return !!(this.currentEtat.titre && this.currentEtat.responsable);
  }

  getErrorMessage(field: string): string {
    switch (field) {
      case 'titre':
        return !this.currentEtat.titre ? 'Le titre est obligatoire' : '';
      case 'responsable':
        return !this.currentEtat.responsable ? 'Le responsable est obligatoire' : '';
      default:
        return '';
    }
  }
}
