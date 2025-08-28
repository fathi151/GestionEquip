import { Marque } from "../marque/Marque";

export class TypeEqui {
  idType!: number;
  nomType!: string;
  description!: string;

  // Ajout de la liste des marques associées
  marques!: Marque[];

}