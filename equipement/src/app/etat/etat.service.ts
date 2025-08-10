import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EtatEqui } from './Etat';

@Injectable({
  providedIn: 'root'
})
export class EtatService {
  private baseURL = "/api/equi";

  constructor(private httpClient: HttpClient) { }

  private getAuthHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  getEtatList(): Observable<EtatEqui[]> {
    return this.httpClient.get<EtatEqui[]>(`${this.baseURL}/etats`, {
      headers: this.getAuthHeaders()
    });
  }

  createEtat(etat: EtatEqui): Observable<Object> {
    return this.httpClient.post(`${this.baseURL}/etatsAjou` ,etat, {
      headers: this.getAuthHeaders()
    });
  }

  getEtatById(id: number): Observable<EtatEqui> {
    return this.httpClient.get<EtatEqui>(`${this.baseURL}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  updateEtat(id: number, etat: EtatEqui): Observable<Object> {
    return this.httpClient.put(`${this.baseURL}/etatUpdate/${id}`, etat, {
      headers: this.getAuthHeaders()
    });
  }

  deleteEtat(id: number): Observable<Object> {
    return this.httpClient.delete(`${this.baseURL}/deleteetats/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  getDefaultEtats(): Observable<EtatEqui[]> {
    return this.httpClient.get<EtatEqui[]>(`${this.baseURL}/default`, {
      headers: this.getAuthHeaders()
    });
  }

  getSuccessors(etatId: number): Observable<EtatEqui[]> {
    return this.httpClient.get<EtatEqui[]>(`${this.baseURL}/etats/${etatId}/successors`, {
      headers: this.getAuthHeaders()
    });
  }
}
