import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class EspecializacionHistoricoService {
  private host = environment.apiUrl;
  constructor(private http:HttpClient) { }

  public getMateriasEspecializacionHistoricos(codUnico:string):Observable<EspecializacionEstudiante[]>{
    const params= new HttpParams()
      .set('codUnico',codUnico);
    return this.http.post<EspecializacionEstudiante[]>(
      `${this.host}/historicoEsp/estudiante?`,
      {},
      {params}
    );
  }
  public getMateriasEspecializacionHistoricosIn(codInstructor:number):Observable<EspecializacionInstructor[]>{
    const params= new HttpParams()
      .set('codInstructor',codInstructor);
    return this.http.post<EspecializacionInstructor[]>(
      `${this.host}/historicoEsp/instructor?`,
      {},
      {params}
    );
  }


}
