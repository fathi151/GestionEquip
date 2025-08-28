import { Panne } from "../DSI/equipements/Panne";

export class Dossier{

id!:number;
dossierNom!:string;
pannes!:Panne[];
dateCreation!:Date;
}