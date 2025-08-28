import { Equip } from "src/app/equipement/equip";
import { EtatEqui } from "./EtatEqui";
import { Dossier } from "src/app/dossier/Dossier";

export class Panne {
id!:number;

description:string="";
date!:Date;
equipement!:Equip;
etatActuel!:EtatEqui|null;
dossier!:Dossier|null;
end!:number;
nomExecuteur!:string;




}
