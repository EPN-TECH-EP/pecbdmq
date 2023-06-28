import { Injectable } from '@angular/core';
import { environment } from "../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { UnidadGestion } from "../modelo/admin/unidad-gestion";

export interface EstacionTrabajo {
  codigo: number;
  nombre: string;
  canton: number;
}


@Injectable({
  providedIn: 'root'
})
export class EstacionTrabajoService {

  private host = environment.apiUrl;

  constructor(private http: HttpClient) {}

  listar(): Observable<EstacionTrabajo[]> {
    return this.http.get<EstacionTrabajo[]>(`${ this.host }/estaciontrabajo/listar`);
  }
}
