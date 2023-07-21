import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {FormacionInstructor} from "../../modelo/dto/formacion-instructor.dto";
import {Aula} from "../../modelo/admin/aula";
import { FormacionEstudiante } from "../../modelo/dto/formacion-usuario.dto";

@Injectable({
  providedIn: 'root'
})
export class FormacionHistoricoService {

  private host = environment.apiUrl;
  constructor(private http:HttpClient) {
  }
  public getMateriasFormacionHistoricos(codUnico:string):Observable<FormacionEstudiante[]>{
    const params= new HttpParams()
      .set('codUnico',codUnico);
    return this.http.post<FormacionEstudiante[]>(
      `${this.host}/historicoFor/estudiante?`,
      {},
      {params}
    );
  }

  public getMateriasFormacionHistoricosIn(codInstructor:number):Observable<FormacionInstructor[]>{
    const params= new HttpParams()
      .set('codInstructor',codInstructor);
    return this.http.post<FormacionInstructor[]>(
      `${this.host}/historicoFor/instructor?`,
      {},
      {params}
    );
  }

  public getMateriasGeneral():Observable<Array<unknown>>{
    return this.http.get<Array<unknown>>(`${this.host}/historicoFor/materias`);
  }
}
