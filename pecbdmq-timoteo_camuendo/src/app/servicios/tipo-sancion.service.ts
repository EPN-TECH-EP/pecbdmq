import { Injectable } from '@angular/core';
import {HttpClient, HttpResponse} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";
import {ITipoSancion} from "../modelo/admin/tipo_sancion";

@Injectable({
  providedIn: 'root'
})
export class TipoSancionService {

  private host = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getTiposSancion(): Observable<ITipoSancion[]>{
    return this.http.get<ITipoSancion[]>(`${this.host}/gen_tipo_sancion/listar`);
  }

  createTipoSancion(tipoSancion: ITipoSancion): Observable<HttpResponse<ITipoSancion>>{
    return this.http.post<ITipoSancion>(`${this.host}/gen_tipo_sancion/crear`, tipoSancion, { observe: 'response' });
  }

  updateTipoSancion(tipoSancion: ITipoSancion, tipoSancionId: number): Observable<HttpResponse<ITipoSancion>>{
    return this.http.put<ITipoSancion>(`${this.host}/gen_tipo_sancion/${tipoSancionId}`, tipoSancion, { observe: 'response' });
  }

  deleteTipoSancion(cod_tipo_sancion: number): Observable<string>{
    return this.http.delete<string>(`${this.host}/gen_tipo_sancion/${cod_tipo_sancion}`);
  }

}
