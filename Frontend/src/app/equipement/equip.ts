import { EtatEqui } from "../DSI/equipements/EtatEqui";
import { Panne } from "../DSI/equipements/Panne";
import { Fournisseur } from "../fournisseur/Fournisseur";
import { Model } from "../model/Model";

export class Equip {
  idEqui!: number;
  numSerie!: string;
  statut!: string;
  image!: string;
  model!: Model | null;
  dateAffectation!: Date;
  description!: string;
  fournisseur!: Fournisseur | null;
  pannes!: Panne[]|null; 
}
