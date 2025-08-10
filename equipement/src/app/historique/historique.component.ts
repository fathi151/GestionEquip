import { Component, OnInit } from '@angular/core';
import { Historique } from '../equipement/Historique';
import { TypeService } from '../dashboard/type.service';
import { Affectation } from '../affecta/Affectation';

@Component({
  selector: 'app-historique',
  templateUrl: './historique.component.html',
  styleUrls: ['./historique.component.css']
})
export class HistoriqueComponent implements OnInit {
  constructor(private authservice:TypeService) { }

 size:number=10;
currentPage:number=0;
totalPages:number=0;
searchTerm:string='';

historiques:Affectation[]=[];

  ngOnInit(): void {
    this.loadHistoriques(0);
  }



  loadHistoriques(page: number): void {
    this.currentPage = page;
    console.log('Chargement des historiques...');
    console.log('Terme de recherche:', this.searchTerm);

    if(this.searchTerm === '' || this.searchTerm.trim() === '') {
      this.authservice.getHistoriques(page, this.size).subscribe({
        next: (res) => {
          console.log('Historiques reçus:', res);
          this.historiques = res.content;
          this.totalPages = res.totalPages;
          console.log('Nombre d\'historiques:', this.historiques.length);
        },
        error: (err) => {
          console.error('Erreur lors du chargement des historiques:', err);
        }
      });
    } else {
      console.log('Recherche avec le terme:', this.searchTerm);
      this.authservice.searchHistorique(this.searchTerm.trim(), page, this.size).subscribe({
        next: (res: any) => {
          console.log('Historiques de recherche reçus:', res);
          this.historiques = res.content;
          this.totalPages = res.totalPages;
          console.log('Nombre d\'historiques trouvés:', this.historiques.length);
        },
        error: (err) => {
          console.error('Erreur lors de la recherche des historiques:', err);
        }
      });
    }
  }

  onSearch(): void {
    console.log('Recherche déclenchée avec:', this.searchTerm);
    this.loadHistoriques(0);
  }

  // Méthodes pour la pagination
  goToPage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.loadHistoriques(page);
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.loadHistoriques(this.currentPage + 1);
    }
  }

  previousPage(): void {
    if (this.currentPage > 0) {
      this.loadHistoriques(this.currentPage - 1);
    }
  }

  // Méthode pour générer les numéros de pages
  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxPagesToShow = 5; // Afficher maximum 5 numéros de pages

    let startPage = Math.max(0, this.currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(this.totalPages - 1, startPage + maxPagesToShow - 1);

    // Ajuster startPage si on est près de la fin
    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(0, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  }

}
