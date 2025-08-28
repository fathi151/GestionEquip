import { Equip } from "../equipement/equip";
import { Utilisateur } from "../utilisateur/Utilisateur";

export class Affectation
{

id!:number;
commentaire?:string;
dateAffectation!:Date;
user!:Utilisateur;
equipement!:Equip;
verrou?:string;




}
