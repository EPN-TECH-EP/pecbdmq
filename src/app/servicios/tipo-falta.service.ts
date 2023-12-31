import { Injectable } from '@angular/core';
import {HttpClient, HttpResponse} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";
import {ITipoFalta} from "../modelo/admin/tipo_falta";
import { FaltaPeriodo } from "../modelo/flujos/formacion/api-bomberos/faltaPeriodo";

@Injectable({
  providedIn: 'root'
})
export class TipoFaltaService {

  private host = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getTiposFalta(): Observable<ITipoFalta[]>{
    return this.http.get<ITipoFalta[]>(`${this.host}/tipoFalta/listar`);
  }

  createTipoFalta(tipoFalta: ITipoFalta): Observable<HttpResponse<ITipoFalta>>{
    return this.http.post<ITipoFalta>(`${this.host}/tipoFalta/crear`, tipoFalta, { observe: 'response' });
  }

  updateTipoFalta(tipoFalta: ITipoFalta, tipoFaltaId: number): Observable<HttpResponse<ITipoFalta>>{
    return this.http.put<ITipoFalta>(`${this.host}/tipoFalta/${tipoFaltaId}`, tipoFalta, { observe: 'response' });
  }

  deleteTipoFalta(cod_tipo_falta: number): Observable<string>{
    return this.http.delete<string>(`${this.host}/tipoFalta/${cod_tipo_falta}`);
  }

  listarTipoFaltaPeriodo(){
    return this.http.get<FaltaPeriodo[]>(`${this.host}/faltaperiodo/listarPA`);
  }

}
