import { Panne } from "../DSI/equipements/Panne";

export class EtatEqui {
    id!: number;
    titre!: string;
    responsable!: string;
    precedent?: EtatEqui;
    pannes?:Panne[];
}
