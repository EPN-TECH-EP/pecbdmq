import { Injectable } from '@angular/core';
import {HttpClient, HttpResponse} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";
import {ITipoBaja} from "../modelo/tipo_baja";

@Injectable({
  providedIn: 'root'
})
export class TipoBajaService {

  private host = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getTiposBaja(): Observable<ITipoBaja[]>{
    return this.http.get<ITipoBaja[]>(`${this.host}/gen_tipo_baja/listar`);
  }

  createTipoBaja(tipoBaja: ITipoBaja): Observable<HttpResponse<ITipoBaja>>{
    return this.http.post<ITipoBaja>(`${this.host}/gen_tipo_baja/crear`, tipoBaja, { observe: 'response' });
  }

  updateTipoBaja(tipoBaja: ITipoBaja, tipoBajaId: number): Observable<HttpResponse<ITipoBaja>>{
    return this.http.put<ITipoBaja>(`${this.host}/gen_tipo_baja/${tipoBajaId}`, tipoBaja, { observe: 'response' });
  }

  deleteTipoBaja(tipoBajaId: number): Observable<string>{
    return this.http.delete<string>(`${this.host}/gen_tipo_baja/${tipoBajaId}`);
  }

}
