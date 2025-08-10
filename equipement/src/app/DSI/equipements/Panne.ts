import { Equip } from "src/app/equipement/equip";
import { EtatEqui } from "./EtatEqui";

export class Panne {
id!:number;

description:string="";
date!:Date;
equipement!:Equip;
etatActuel!:EtatEqui|null;






}
