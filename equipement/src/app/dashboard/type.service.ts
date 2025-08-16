import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Injectable, Type } from '@angular/core';
import { TypeEqui } from './TypeEqui';
import { Observable, of } from 'rxjs';
import { Marque } from '../marque/Marque';
import { Model } from '../model/Model';
import { Equip } from '../equipement/equip';
import { Fournisseur } from '../fournisseur/Fournisseur';
import { AffectationEquipement } from '../utilisateur-equipement/AffectationEquipement';
import { Affectation } from '../affecta/Affectation';
import { Historique } from '../equipement/Historique';

@Injectable({
  providedIn: 'root'
})
export class TypeService {

private baseURL="http://localhost:8085/equi";

  constructor(private httpClient:HttpClient) { }

  // Helper method to get authentication headers
  private getAuthHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  addType(TypeEqui: TypeEqui): Observable<TypeEqui> {
    return this.httpClient.post<TypeEqui>(
      `${this.baseURL}/addType`,
      TypeEqui,
      { headers: this.getAuthHeaders() }
    );
  }

  getTypes(): Observable<TypeEqui[]> {
    return this.httpClient.get<TypeEqui[]>(
      `${this.baseURL}/getTypes`,
      { headers: this.getAuthHeaders() }
    );
  }

  getAllTypes(): Observable<TypeEqui[]> {
    return this.httpClient.get<TypeEqui[]>(
      `${this.baseURL}/getall`,
      { headers: this.getAuthHeaders() }
    );
  }

  getAllMarques(): Observable<Marque[]> {
    return this.httpClient.get<Marque[]>(
      `${this.baseURL}/getallMarque`,
      { headers: this.getAuthHeaders() }
    );
  }

  getAllModel(): Observable<Model[]> {
    return this.httpClient.get<Model[]>(
      `${this.baseURL}/getModels`,
      { headers: this.getAuthHeaders() }
    );
  }

  addMarque(marque: Marque): Observable<Marque> {
    return this.httpClient.post<Marque>(
      `${this.baseURL}/addMarque`,
      marque,
      { headers: this.getAuthHeaders() }
    );
  }

  deleteType(id: number): Observable<void> {
    return this.httpClient.delete<void>(
      `${this.baseURL}/deleteType/${id}`,
      { headers: this.getAuthHeaders() }
    );
  }

  updateType(typeEqui: TypeEqui): Observable<Object> {
    return this.httpClient.put<Object>(
      `${this.baseURL}/updateType`,
      typeEqui,
      { headers: this.getAuthHeaders() }
    );
  }


deleteMarque(id: number): Observable<void> {
  return this.httpClient.delete<void>(
    `${this.baseURL}/deleteMarque/${id}`,
    { headers: this.getAuthHeaders() }
  );
}

updateMarque(marque: any): Observable<Object> {
  return this.httpClient.put<Object>(
    `${this.baseURL}/updateMarque`,
    marque,
    { headers: this.getAuthHeaders() }
  );
}

deleteAffectation(id: number): Observable<void> {
  return this.httpClient.delete<void>(
    `${this.baseURL}/deleteAffectation/${id}`,
    { headers: this.getAuthHeaders() }
  );
}

getAllAffectation(): Observable<AffectationEquipement[]> {
  return this.httpClient.get<AffectationEquipement[]>(
    `${this.baseURL}/getallAffectation`,
    { headers: this.getAuthHeaders() }
  );
}

addModel(model: Model): Observable<Model> {
  return this.httpClient.post<Model>(
    `${this.baseURL}/addModel`,
    model,
    { headers: this.getAuthHeaders() }
  );
}

deleteModel(id: number): Observable<void> {
  return this.httpClient.delete<void>(
    `${this.baseURL}/deleteModel/${id}`,
    { headers: this.getAuthHeaders() }
  );
}

updateModel(model: any): Observable<Object> {
  return this.httpClient.put<Object>(
    `${this.baseURL}/updateModel`,
    model,
    { headers: this.getAuthHeaders() }
  );
}

deleteEquip(id: number): Observable<void> {
  return this.httpClient.delete<void>(
    `${this.baseURL}/deleteEqui/${id}`,
    { headers: this.getAuthHeaders() }
  );
}

updateEquip(Equip: any): Observable<Object> {
  return this.httpClient.put<Object>(
    `${this.baseURL}/updateEqui`,
    Equip,
    { headers: this.getAuthHeaders() }
  );
}


addEquipement(equip: Equip): Observable<Equip> {
  return this.httpClient.post<Equip>(
    `${this.baseURL}/addEqui`,
    equip,
    { headers: this.getAuthHeaders() }
  );
}

getAllEquipements(page: number, size: number): Observable<any> {
  return this.httpClient.get<any>(
    `${this.baseURL}/getallEqui?page=${page}&size=${size}`,
    { headers: this.getAuthHeaders() }
  );
}
GetAllModels1(page: number, size: number): Observable<any> {
  return this.httpClient.get<any>(
    `${this.baseURL}/getModels1?page=${page}&size=${size}`,
    { headers: this.getAuthHeaders() }
  );
}



updateFournisseur(Fournisseur: any): Observable<Object> {
  return this.httpClient.put<Object>(
    `${this.baseURL}/updateFournisseur`,
    Fournisseur,
    { headers: this.getAuthHeaders() }
  );
}

deleteFournisseur(id: number): Observable<void> {
  return this.httpClient.delete<void>(
    `${this.baseURL}/deleteFournisseur/${id}`,
    { headers: this.getAuthHeaders() }
  );
}

searchEquipements(keyword: string, username: string, page: number, size: number): Observable<any> {
  let params = new HttpParams()
    .set('keyword', keyword)
    .set('username', username)
    .set('page', page)
    .set('size', size);

  return this.httpClient.get<any>(
    `${this.baseURL}/searchedEqui`,
    { params, headers: this.getAuthHeaders() }
  );
}

searchEquipements1(keyword: string, statut: string, page: number, size: number): Observable<any> {
  let params = new HttpParams()
    .set('keyword', keyword)
    .set('statut', statut)
    .set('page', page)
    .set('size', size);

  return this.httpClient.get<any>(
    `${this.baseURL}/searchedEqui1`,
    { params, headers: this.getAuthHeaders() }
  );
}





  addFournisseur(fournisseur:Fournisseur ): Observable<Fournisseur> {
    return this.httpClient.post<Fournisseur>(`${this.baseURL}/addFournisseur`, fournisseur, {
      headers: this.getAuthHeaders()
    });
  }

  getallFournisseur(): Observable<Fournisseur[]> {
    return this.httpClient.get<Fournisseur[]>(`${this.baseURL}/getallFournisseur`, {
      headers: this.getAuthHeaders()
    });
  }


addAffectaion(affectationequipement: AffectationEquipement): Observable<AffectationEquipement> {
  return this.httpClient.post<AffectationEquipement>(
    `${this.baseURL}/affToEqui`,
    affectationequipement,
    { headers: this.getAuthHeaders() }
  );
}

updateAffectation(affectation: any): Observable<Object> {
  return this.httpClient.put<Object>(
    `${this.baseURL}/updateAffectation`,
    affectation,
    { headers: this.getAuthHeaders() }
  );
}

updateEtat(idAffectation: number, etat: string): Observable<Object> {
  return this.httpClient.put<Object>(
    `${this.baseURL}/updateCommentaire/${idAffectation}`,
    etat,
    { headers: this.getAuthHeaders() }
  );
}

searchUsers(query: string): Observable<any[]> {
  return this.httpClient.get<any[]>(
    `${this.baseURL}/findedUsers?q=${query}`,
    { headers: this.getAuthHeaders() }
  );
}

getEquiByI(id: number): Observable<Equip> {
  return this.httpClient.get<Equip>(
    `${this.baseURL}/getEquip/${id}`,
    { headers: this.getAuthHeaders() }
  );
}

addAff(affectation: Affectation): Observable<Affectation> {
  return this.httpClient.post<Affectation>(
    `${this.baseURL}/addAff`,
    affectation,
    { headers: this.getAuthHeaders() }
  );
}

addStatutAffecte(id: number): Observable<any> {
  return this.httpClient.put<any>(
    `${this.baseURL}/statutAffecte/${id}`,
    {},
    { headers: this.getAuthHeaders() }
  );
}

addStatutDisponible(id: number): Observable<any> {
  return this.httpClient.put<any>(
    `${this.baseURL}/statutDisponible/${id}`,
    {},
    { headers: this.getAuthHeaders() }
  );
}

updateAff(affectation: any): Observable<Object> {
  return this.httpClient.put<Object>(
    `${this.baseURL}/updateAffect`,
    affectation,
    { headers: this.getAuthHeaders() }
  );
}

getAffectationById(id: number): Observable<Affectation> {
  return this.httpClient.get<Affectation>(
    `${this.baseURL}/getAff/${id}`,
    { headers: this.getAuthHeaders() }
  );
}

deleteAff(id: number): Observable<void> {
  return this.httpClient.delete<void>(
    `${this.baseURL}/deleteAffectation/${id}`,
    { headers: this.getAuthHeaders() }
  );
}


addHistorique(historique: Historique): Observable<Historique> {
  return this.httpClient.post<Historique>(
    `${this.baseURL}/addHistorique`,
    historique,
    { headers: this.getAuthHeaders() }
  );
}

searchModels(query: string): Observable<any[]> {
  return this.httpClient.get<any[]>(
    `${this.baseURL}/getMode?q=${query}`,
    { headers: this.getAuthHeaders() }
  );
}

  getHistoriques(page: number, size: number): Observable<any> {
  return this.httpClient.get<any>(`${this.baseURL}/allHistorique?page=${page}&size=${size}`, {
    headers: this.getAuthHeaders()
  });
}

 searchHistorique(query:string,page:number,size:number): Observable<any> {
let params=new HttpParams()
.set('keyword',query)
.set('page',page)
.set('size',size)
  return this.httpClient.get<any>(`${this.baseURL}/getSearchedHistorique`,{params});
  }


getAffectationsByIds(ids: number[]): Observable<Affectation[]> {
  if (!ids || ids.length === 0)
  {
     console.log('⛔ Aucune ID envoyée à la requête');
    return of([]); // ← évite les requêtes vides
  }
  const params = ids.map(id => `ids=${id}`).join('&'); // "ids=1&ids=2&ids=3"
  return this.httpClient.get<Affectation[]>(`${this.baseURL}/getAffectationsByEquipments?${params}`, {
    headers: this.getAuthHeaders()
  });
}

getDSIEquipements(page: number, size: number): Observable<any> {
  return this.httpClient.get<any>(`${this.baseURL}/DSIEquip?page=${page}&size=${size}`, {
    headers: this.getAuthHeaders()
  });
}
getDAGEquipements(page: number, size: number): Observable<any> {
  return this.httpClient.get<any>(`${this.baseURL}/DAGEquip?page=${page}&size=${size}`, {
    headers: this.getAuthHeaders()
  });
}
getJuridiqueEquipements(page: number, size: number): Observable<any> {
  return this.httpClient.get<any>(`${this.baseURL}/JuridiqueEquip?page=${page}&size=${size}`, {
    headers: this.getAuthHeaders()
  });
}


declarerPanne(panneData: any): Observable<any> {
  return this.httpClient.post<any>(`${this.baseURL}/AjoutPanne`, panneData, {
    headers: this.getAuthHeaders()
  });
}

declarerPanneSimple(titre: string, description: string, equipementId: number, etatTitre?: string, responsable?: string): Observable<any> {
  const params = new URLSearchParams();
  params.append('titre', titre);
  params.append('description', description);
  params.append('equipementId', equipementId.toString());
  if (etatTitre) params.append('etatTitre', etatTitre);
  if (responsable) params.append('responsable', responsable);

  return this.httpClient.post<any>(`${this.baseURL}/AjoutPanneSimple?${params.toString()}`, {}, {
    headers: this.getAuthHeaders()
  });
}

annulerPanne(equipementId: number): Observable<any> {
  return this.httpClient.delete(`${this.baseURL}/annulerPanne/${equipementId}`, {
    headers: this.getAuthHeaders(),
    responseType: 'text'
  });
}


changerEtatPanne(id: number, idE:number): Observable<any> {
 return this.httpClient.put<any>(
  `${this.baseURL}/changerEtatPanne/${id}/${idE}`,
  {},
  {
    headers: this.getAuthHeaders()
  }
);
}

updatePanne(idPanne: number): Observable<any> {
 return this.httpClient.put<any>(`${this.baseURL}/updatePanne/${idPanne}`, null, {
  headers: this.getAuthHeaders()
});
}

getSuccessors(etatId: number): Observable<any[]> {
  return this.httpClient.get<any[]>(`${this.baseURL}/etats/${etatId}/successors`, {
    headers: this.getAuthHeaders()
  });
}

// Methods with inter-department transitions
getSuccessorsDSIWithTransitions(etatId: number): Observable<any[]> {
  return this.httpClient.get<any[]>(`${this.baseURL}/etats/${etatId}/successors/dsi`, {
    headers: this.getAuthHeaders()
  });
}

getSuccessorsDAGWithTransitions(etatId: number): Observable<any[]> {
  return this.httpClient.get<any[]>(`${this.baseURL}/etats/${etatId}/successors/dag`, {
    headers: this.getAuthHeaders()
  });
}

getSuccessorsJuridiqueWithTransitions(etatId: number): Observable<any[]> {
  return this.httpClient.get<any[]>(`${this.baseURL}/etats/${etatId}/successors/juridique`, {
    headers: this.getAuthHeaders()
  });
}


getSuccessorsDSI(etatId: number): Observable<any[]> {
  return this.httpClient.get<any[]>(`${this.baseURL}/etats/${etatId}/successorsDSI`, {
    headers: this.getAuthHeaders()
  });
}




}
