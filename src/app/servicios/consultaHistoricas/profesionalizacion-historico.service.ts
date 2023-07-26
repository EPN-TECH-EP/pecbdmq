import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {ProfesionalizacionEstudiante} from "../../modelo/dto/profesionalizacion-usuario.dto";
import {ProfesionalizacionInstructor} from "../../modelo/dto/profesionalizacion-instructor.dto";

@Injectable({
  providedIn: 'root'
})
export class ProfesionalizacionHistoricoService {

  private host = environment.apiUrl;
  constructor(private http:HttpClient) { }
  public getMateriasProfesionalizacionHistoricos(codUnico:string):Observable<ProfesionalizacionEstudiante[]>{
    const params= new HttpParams()
      .set('codUnico',codUnico);
    return this.http.post<ProfesionalizacionEstudiante[]>(
      `${this.host}/historicoPro/estudiante?`,
      {},
      {params}
    );
  }
  public getMateriasProfesionalizacionHistoricosIn(codInstructor:number):Observable<ProfesionalizacionInstructor[]>{
    const params= new HttpParams()
      .set('codInstructor',codInstructor);
    return this.http.post<ProfesionalizacionInstructor[]>(
      `${this.host}/historicoPro/instructor?`,
      {},
      {params}
    );
  }
}
