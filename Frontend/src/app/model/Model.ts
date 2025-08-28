import { Equip } from "../equipement/equip";
import { Fournisseur } from "../fournisseur/Fournisseur";
import { Marque } from "../marque/Marque";

export class Model
{
idModel!:number;
nomModel!:string;
specification!:string;
marque!:Marque|null;
equipements!:Equip[];
typeAssociee!:string;
fournisseur!:Fournisseur|null;
}