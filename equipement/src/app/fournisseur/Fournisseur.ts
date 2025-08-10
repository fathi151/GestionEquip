import { Equip } from "../equipement/equip";
import { Model } from "../model/Model";

export class Fournisseur
{
idFournisseur!:number;
nomFournisseur!:string;
adresseFournisseur!:string;
emailFournisseur!:string;
telephoneFournisseur!:string;
equipements!:Equip[];

}