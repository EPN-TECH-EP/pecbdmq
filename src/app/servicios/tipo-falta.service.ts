import { Injectable } from '@angular/core';
import {HttpClient, HttpResponse} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";
import {ITipoFalta} from "../modelo/admin/tipo_falta";

@Injectable({
  providedIn: 'root'
})
export class TipoFaltaService {

  private host = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getTiposFalta(): Observable<ITipoFalta[]>{
    return this.http.get<ITipoFalta[]>(`${this.host}/gen_tipo_falta/listar`);
  }

  createTipoFalta(tipoFalta: ITipoFalta): Observable<HttpResponse<ITipoFalta>>{
    return this.http.post<ITipoFalta>(`${this.host}/gen_tipo_falta/crear`, tipoFalta, { observe: 'response' });
  }

  updateTipoFalta(tipoFalta: ITipoFalta, tipoFaltaId: number): Observable<HttpResponse<ITipoFalta>>{
    return this.http.put<ITipoFalta>(`${this.host}/gen_tipo_falta/${tipoFaltaId}`, tipoFalta, { observe: 'response' });
  }

  deleteTipoFalta(cod_tipo_falta: number): Observable<string>{
    return this.http.delete<string>(`${this.host}/gen_tipo_falta/${cod_tipo_falta}`);
  }

}
