import { Equip } from "../equipement/equip";

export class AffectationEquipement {
  id!: number;
  userRegistrationNumber!:string;
  dateAffectation!:Date;
  commentaire!: string;
equipement!:Equip[];
historiqueCommentaires!: string[];
}