import { Injectable } from '@angular/core';
import {HttpClient, HttpResponse} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";
import {TipoBaja} from "../modelo/tipo_baja";

@Injectable({
  providedIn: 'root'
})
export class TipoBajaService {

  private host = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getTiposBaja(): Observable<TipoBaja[]>{
    return this.http.get<TipoBaja[]>(`${this.host}/gen_tipo_baja/listar`);
  }

  createTipoBaja(tipoBaja: TipoBaja): Observable<HttpResponse<TipoBaja>>{
    return this.http.post<TipoBaja>(`${this.host}/gen_tipo_baja/crear`, tipoBaja, { observe: 'response' });
  }

  updateTipoBaja(tipoBaja: TipoBaja, tipoBajaId: number): Observable<HttpResponse<TipoBaja>>{
    return this.http.put<TipoBaja>(`${this.host}/gen_tipo_baja/${tipoBajaId}`, tipoBaja, { observe: 'response' });
  }

  deleteTipoBaja(tipoBajaId: number): Observable<string>{
    return this.http.delete<string>(`${this.host}/gen_tipo_baja/${tipoBajaId}`);
  }

}
