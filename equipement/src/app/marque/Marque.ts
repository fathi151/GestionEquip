import { TypeEqui } from "../dashboard/TypeEqui";
import { Model } from "../model/Model";

export class Marque {
  idMarque!: number;
  nomMarque!: string;
  image!: File | string | null;
types!:TypeEqui[];
models!:Model[];
}
