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
  workflowSteps: Array<{ titre: string; responsable: string }> = [];
  workflowSubmitting: boolean = false;

  constructor(private etatService: EtatService) { }

  ngOnInit(): void {
    this.loadEtats();
    this.userRole = sessionStorage.getItem('role');
  }

  loadEtats() {
    this.isLoading = true;
    this.etatService.getEtatList().subscribe(
      data => {
        this.etats = data;
        this.isLoading = false;
      },
      error => {
        console.error('Error loading etats:', error);
        this.showNotification('Erreur lors du chargement des états', 'error');
        this.isLoading = false;
      }
    );
  }

  openModal() {
    this.isModalOpen = true;
    this.currentEtat = new EtatEqui();
    this.editingEtat = null;
  }

  // Workflow modal helpers
  openWorkflowModal() {
    this.showWorkflowModal = true;
    this.workflowSteps = [ { titre: '', responsable: '' } ];
  }

  closeWorkflowModal() {
    this.showWorkflowModal = false;
    this.workflowSteps = [];
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

  closeModal() {
    this.isModalOpen = false;
    this.editingEtat = null;
    this.currentEtat = new EtatEqui();
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
